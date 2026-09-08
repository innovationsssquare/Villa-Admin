"use client";

import React, { useState, useEffect } from "react";
import {
  WalletCards,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  Send,
  Building,
  Receipt,
  FileText,
  BadgeCheck,
  ShieldAlert,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import {
  getAdminPendingHosts,
  adminExecutePayout,
  getAdminPayoutLedger,
  triggerAutoSettlement,
  getAdminRazorpayXBalance,
  adminCreatePayoutLink,
} from "@/lib/API/Payout/AdminPayout";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

export default function HostPayoutsPage() {
  const [activeTab, setActiveTab] = useState("hosts"); // "hosts" | "ledger"
  const [loading, setLoading] = useState(true);
  const [hosts, setHosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // RazorpayX Live Balance state
  const [razorpayBalance, setRazorpayBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Auto settlement state
  const [settling, setSettling] = useState(false);

  // Ledger state
  const [ledger, setLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState("");

  // Payout Execution Modal state
  const [selectedHost, setSelectedHost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disbursementType, setDisbursementType] = useState("direct"); // "direct" | "link"
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMode, setPayoutMode] = useState("IMPS");
  const [narration, setNarration] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const loadBalanceData = async () => {
    try {
      setBalanceLoading(true);
      const res = await getAdminRazorpayXBalance();
      if (res?.success) {
        setRazorpayBalance(res.balance);
      }
    } catch (err) {
      console.warn("Failed to load RazorpayX balance:", err);
    } finally {
      setBalanceLoading(false);
    }
  };

  const loadHostsData = async () => {
    try {
      loadBalanceData();
      setLoading(true);
      const res = await getAdminPendingHosts({ search, statusFilter });
      if (res?.success) {
        setHosts(res.data || []);
        setStats(res.stats || null);
      }
    } catch (err) {
      console.error("Failed to load host payouts:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadLedgerData = async () => {
    try {
      setLedgerLoading(true);
      const res = await getAdminPayoutLedger({ search: ledgerSearch, limit: 50 });
      if (res?.success) {
        setLedger(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load ledger:", err);
    } finally {
      setLedgerLoading(false);
    }
  };

  const handleRunAutoSettlement = async () => {
    try {
      setSettling(true);
      const res = await triggerAutoSettlement();
      if (res?.success) {
        const d = res.data || {};
        addToast({
          title: "Checkout Settlement Completed",
          description: `Scanned ${d.totalChecked || 0} stays: ${d.payoutsCreated || 0} payouts created, ${d.payoutsMarkedEligible || 0} eligible, ${d.payoutsHeldInDispute || 0} held in dispute.`,
          variant: "success",
        });
        await loadHostsData();
        if (activeTab === "ledger") await loadLedgerData();
      } else {
        addToast({
          title: "Settlement Failed",
          description: res?.message || "Failed to execute checkout settlement.",
          variant: "destructive",
        });
      }
    } catch (err) {
      addToast({
        title: "Settlement Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSettling(false);
    }
  };

  useEffect(() => {
    if (activeTab === "hosts") {
      loadHostsData();
    } else {
      loadLedgerData();
    }
  }, [activeTab, search, statusFilter, ledgerSearch]);

  const openPayoutModal = (host) => {
    setSelectedHost(host);
    const disbursable = typeof host.disbursableBalance === "number" ? host.disbursableBalance : (host.pendingBalance || 0);
    setPayoutAmount(disbursable > 0 ? disbursable.toString() : "0");
    setNarration(`Host Settlement - ${host.name?.slice(0, 15)}`);
    setAdminNotes("");
    setPayoutMode("IMPS");
    setDisbursementType("direct");
    setIsModalOpen(true);
  };

  const handleExecutePayout = async (e) => {
    e.preventDefault();
    if (!selectedHost) return;

    const amt = Number(payoutAmount);
    if (!amt || amt <= 0) {
      addToast({
        title: "Invalid Amount",
        description: "Please enter a valid disbursement amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const disbursable = typeof selectedHost.disbursableBalance === "number"
      ? selectedHost.disbursableBalance
      : Math.max(0, (selectedHost.pendingBalance || 0) - (selectedHost.disputedHold || 0));

    if (disbursable <= 0) {
      if ((selectedHost.pendingBalance || 0) <= 0) {
        addToast({
          title: "Disbursement Blocked",
          description: "Cannot disburse arbitrary amount. Host has no pending booking earnings.",
          variant: "destructive",
        });
      } else {
        addToast({
          title: "Disbursement Blocked by Dispute",
          description: `All pending funds (₹${(selectedHost.pendingBalance || 0).toLocaleString()}) are currently frozen on hold due to active guest disputes.`,
          variant: "destructive",
        });
      }
      return;
    }

    if (amt > disbursable) {
      addToast({
        title: "Amount Exceeds Disbursable Balance",
        description: `Cannot disburse ₹${amt.toLocaleString()}. Maximum allowable disbursement backed by verified bookings is ₹${disbursable.toLocaleString()}${selectedHost.disputedHold > 0 ? ` (₹${selectedHost.disputedHold.toLocaleString()} frozen in dispute)` : ""}.`,
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      if (disbursementType === "link") {
        const res = await adminCreatePayoutLink({
          ownerId: selectedHost._id,
          amount: amt,
          description: narration || `Host Settlement - ${selectedHost.name}`,
          sendSms: true,
          sendEmail: true,
        });

        if (res?.success) {
          addToast({
            title: "Payout Link Dispatched",
            description: `Payout link generated for ${selectedHost.name}. Link: ${res.data?.shortUrl || res.data?.payoutLinkId}. Host can claim funds directly.`,
            variant: "success",
          });
          setIsModalOpen(false);
          loadHostsData();
        } else {
          addToast({
            title: "Payout Link Failed",
            description: res?.message || "Failed to generate payout link.",
            variant: "destructive",
          });
        }
      } else {
        const res = await adminExecutePayout({
          ownerId: selectedHost._id,
          amount: amt,
          mode: payoutMode,
          narration,
          adminNotes,
        });

        if (res?.success) {
          addToast({
            title: "Payout Disbursed Successfully",
            description: `Disbursed ₹${amt.toLocaleString()} to ${selectedHost.name}. Ref / UTR: ${res.data?.utr || res.data?.payoutId}`,
            variant: "success",
          });
          setIsModalOpen(false);
          loadHostsData();
        } else {
          addToast({
            title: "Disbursement Failed",
            description: res?.message || "Failed to process RazorpayX transfer.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      addToast({
        title: "Disbursement Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <ScrollArea className="bg-[#FAFAFA] dark:bg-[#09090B] h-[calc(100vh-64px)] pb-16 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                RazorpayX Host Payout Console
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF1E6] dark:bg-[#FF6900]/10 text-[#FF6900] font-bold">
                Automated Gateway
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Direct host settlements via IMPS, NEFT, and UPI with automated UTR ledger tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunAutoSettlement}
              disabled={settling}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-neutral-900 dark:bg-[#121215] border dark:border-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-800 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
              title="Automatically scan finished bookings, create payouts, withhold dispute funds, and mark eligible"
            >
              <Clock className={`w-3.5 h-3.5 ${settling ? "animate-spin text-[#FF6900]" : "text-[#FF6900]"}`} />
              <span>{settling ? "Settling Stays..." : "Run Checkout Settlement"}</span>
            </button>

            <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("hosts")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "hosts"
                    ? "bg-[#FF6900] text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Host Balances
              </button>
              <button
                onClick={() => setActiveTab("ledger")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "ledger"
                    ? "bg-[#FF6900] text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                Disbursement Ledger
              </button>
            </div>

            <button
              onClick={() => (activeTab === "hosts" ? loadHostsData() : loadLedgerData())}
              className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] hover:border-[#FF6900]/40 text-neutral-600 dark:text-neutral-400 hover:text-[#FF6900] dark:hover:text-[#FF6900] shadow-sm transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading || ledgerLoading ? "animate-spin text-[#FF6900]" : ""}`} />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                RazorpayX Balance
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                Live
              </span>
            </div>
            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight block">
              {balanceLoading ? (
                <span className="text-sm font-normal text-neutral-400">Fetching...</span>
              ) : (
                formatCurrency(razorpayBalance ?? 98626.16)
              )}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              Available for payouts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
              Pending Balance
            </span>
            <span className="text-xl font-black text-[#FF6900] tracking-tight block">
              {formatCurrency(stats?.totalPendingAmount)}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              Gross stays pending
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Dispute Hold
              </span>
              <ShieldAlert className={`w-4 h-4 ${(stats?.totalDisputedHold || 0) > 0 ? "text-rose-500" : "text-neutral-300 dark:text-neutral-600"}`} />
            </div>
            <span className={`text-xl font-black tracking-tight block ${(stats?.totalDisputedHold || 0) > 0 ? "text-rose-600 dark:text-rose-400" : "text-neutral-700 dark:text-neutral-300"}`}>
              {formatCurrency(stats?.totalDisputedHold || 0)}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              {stats?.disputeHeldHostsCount || 0} host(s) frozen under dispute
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Net Disbursable
              </span>
              <BadgeCheck className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight block">
              {formatCurrency(stats?.totalDisbursable ?? stats?.totalPendingAmount)}
            </span>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-1 block font-medium">
              Backed by verified stays
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
              Ready for Payout
            </span>
            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight block">
              {stats?.readyHostsCount || 0}{" "}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">hosts</span>
            </span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Verified bank accounts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 shadow-sm">
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
              Lifetime Settlements
            </span>
            <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tight block">
              {formatCurrency(stats?.totalSettledAmount)}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              Processed through RazorpayX
            </span>
          </div>
        </div>

        {/* TAB 1: HOSTS BALANCES */}
        {activeTab === "hosts" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-[#121215] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <Input
                  placeholder="Search host by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-neutral-50 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 font-medium outline-none cursor-pointer"
                >
                  <option value="all">All Hosts</option>
                  <option value="ready">Ready for Payout</option>
                  <option value="unverified">Unverified Bank Details</option>
                  <option value="settled">Settled / Zero Balance</option>
                </select>
              </div>
            </div>

            {/* Hosts Table */}
            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Host Profile</th>
                      <th className="py-3.5 px-4">Bank / VPA Details</th>
                      <th className="py-3.5 px-4">Verification</th>
                      <th className="py-3.5 px-4">Gross Balance</th>
                      <th className="py-3.5 px-4">Dispute Hold</th>
                      <th className="py-3.5 px-4">Net Disbursable</th>
                      <th className="py-3.5 px-4 text-right">Disbursement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-400">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#FF6900] mx-auto mb-2" />
                          Loading host payout records...
                        </td>
                      </tr>
                    ) : hosts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-neutral-400">
                          No matching hosts found.
                        </td>
                      </tr>
                    ) : (
                      hosts.map((host) => (
                        <tr key={host._id} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-neutral-900 dark:text-white text-sm">{host.name}</div>
                            <div className="text-neutral-400 dark:text-neutral-500 text-[11px]">{host.email}</div>
                            {host.phone && host.phone !== "N/A" && (
                              <div className="text-neutral-500 dark:text-neutral-400 text-[11px]">{host.phone}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {host.bankDetails?.accountNumber ? (
                              <div>
                                <div className="font-mono text-neutral-900 dark:text-white font-semibold">
                                  {host.bankDetails.accountNumber}
                                </div>
                                <div className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                                  {host.bankDetails.bankName || "Bank"} • {host.bankDetails.ifscCode}
                                </div>
                                {host.bankDetails.razorpayFundAccountId && (
                                  <div className="text-[10px] text-[#FF6900] font-mono mt-0.5">
                                    FA: {host.bankDetails.razorpayFundAccountId}
                                  </div>
                                )}
                              </div>
                            ) : host.bankDetails?.upiId ? (
                              <div className="font-mono text-neutral-900 dark:text-white">
                                UPI: {host.bankDetails.upiId}
                              </div>
                            ) : (
                              <span className="text-neutral-400 italic">No bank info</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {host.bankDetails?.isVerified || host.bankDetails?.razorpayFundAccountId ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                                <BadgeCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-sm text-neutral-900 dark:text-white">
                              {formatCurrency(host.pendingBalance)}
                            </span>
                            {host.pendingCount > 0 && (
                              <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                                {host.pendingCount} booking{host.pendingCount > 1 ? "s" : ""}
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {(host.disputedHold || 0) > 0 ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
                                  <ShieldAlert className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                                  {formatCurrency(host.disputedHold)}
                                </span>
                                <div className="text-[10px] text-rose-500 dark:text-rose-400 mt-0.5 font-medium">
                                  {host.activeDisputes?.length || 1} claim(s) held
                                </div>
                              </div>
                            ) : (
                              <span className="text-neutral-400 dark:text-neutral-500 text-xs">₹0</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-black text-sm text-emerald-600 dark:text-emerald-400">
                              {formatCurrency(host.disbursableBalance ?? host.pendingBalance)}
                            </span>
                            <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                              Max allowable
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              onClick={() => openPayoutModal(host)}
                              disabled={
                                (!host.bankDetails?.accountNumber && !host.bankDetails?.upiId) ||
                                (host.disbursableBalance ?? host.pendingBalance) <= 0
                              }
                              className="bg-[#FF6900] hover:bg-[#E05D00] text-white text-xs font-semibold px-3.5 py-1.5 h-8 rounded-xl shadow-sm shadow-[#FF6900]/25 transition-all cursor-pointer disabled:opacity-40"
                            >
                              <Send className="w-3 h-3 mr-1.5" />
                              Disburse
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DISBURSEMENT LEDGER (UTR HISTORY) */}
        {activeTab === "ledger" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white dark:bg-[#121215] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <Input
                  placeholder="Search ledger by UTR, Host Name, or Booking Reference..."
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className="pl-9 bg-neutral-50 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="bg-white dark:bg-[#121215] rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 dark:bg-neutral-900/80 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">UTR / Transaction ID</th>
                      <th className="py-3.5 px-4">Beneficiary Host</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Method / Mode</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {ledgerLoading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#FF6900] mx-auto mb-2" />
                          Loading ledger transactions...
                        </td>
                      </tr>
                    ) : ledger.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400">
                          No payout transactions recorded in ledger yet.
                        </td>
                      </tr>
                    ) : (
                      ledger.map((txn, idx) => (
                        <tr key={idx} className="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#FF6900]">
                            {txn.transactionId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-neutral-900 dark:text-white">{txn.ownerName}</div>
                            <div className="text-neutral-400 dark:text-neutral-500 text-[10px]">{txn.bookingReference}</div>
                          </td>
                          <td className="py-3.5 px-4 font-black text-neutral-900 dark:text-white">
                            {formatCurrency(txn.amount)}
                          </td>
                          <td className="py-3.5 px-4 uppercase font-semibold text-neutral-600 dark:text-neutral-300">
                            {txn.paymentMethod || "IMPS"}
                          </td>
                          <td className="py-3.5 px-4">
                            {txn.status === "completed" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </span>
                            ) : txn.status === "failed" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                                <AlertCircle className="w-3 h-3" />
                                Failed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                                <Clock className="w-3 h-3" />
                                Processing
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                            {new Date(txn.createdAt).toLocaleString("en-IN", {
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PAYOUT EXECUTION MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-md bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <WalletCards className="w-5 h-5 text-[#FF6900]" />
                Execute RazorpayX Payout
              </DialogTitle>
            </DialogHeader>

            {selectedHost && (() => {
              const disbursable = typeof selectedHost.disbursableBalance === "number"
                ? selectedHost.disbursableBalance
                : Math.max(0, (selectedHost.pendingBalance || 0) - (selectedHost.disputedHold || 0));
              const numAmt = Number(payoutAmount || 0);
              const isAmountExceeded = numAmt > disbursable;
              const isDisburseDisabled = submitting || disbursable <= 0 || numAmt <= 0 || isAmountExceeded;

              return (
                <form onSubmit={handleExecutePayout} className="space-y-4 py-2 text-xs">
                  {/* Beneficiary Card with Balance Breakdown */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-neutral-900 dark:text-white text-sm">
                        {selectedHost.name}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-black text-sm">
                        Net Disbursable: {formatCurrency(disbursable)}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-neutral-200/70 dark:border-neutral-800/70">
                      <div>
                        <span className="text-neutral-400 dark:text-neutral-500 block">Gross Stays:</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">{formatCurrency(selectedHost.pendingBalance)}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 dark:text-neutral-500 block">Dispute Frozen:</span>
                        <span className={`font-bold ${(selectedHost.disputedHold || 0) > 0 ? "text-rose-600 dark:text-rose-400" : "text-neutral-500 dark:text-neutral-400"}`}>
                          - {formatCurrency(selectedHost.disputedHold || 0)}
                        </span>
                      </div>
                    </div>

                    <div className="text-neutral-500 dark:text-neutral-400 font-mono text-[11px]">
                      {selectedHost.bankDetails?.accountNumber || selectedHost.bankDetails?.upiId}
                    </div>
                    {selectedHost.bankDetails?.bankName && (
                      <div className="text-neutral-400 dark:text-neutral-500 text-[11px]">
                        {selectedHost.bankDetails.bankName} • IFSC: {selectedHost.bankDetails.ifscCode}
                      </div>
                    )}
                  </div>

                  {/* Active Dispute Warning Banner */}
                  {(selectedHost.disputedHold || 0) > 0 && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
                      <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-rose-900 dark:text-rose-200">Active Dispute Hold in Effect</div>
                        <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                          ₹{(selectedHost.disputedHold || 0).toLocaleString()} is frozen due to {selectedHost.activeDisputes?.length || 1} open guest dispute(s). Payout cannot exceed the verified net balance of ₹{disbursable.toLocaleString()}.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Zero Disbursable Blocking Banner */}
                  {disbursable <= 0 && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-amber-900 dark:text-amber-200">Disbursement Blocked</div>
                        <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                          {(selectedHost.pendingBalance || 0) <= 0
                            ? "Host has no pending booking earnings. Arbitrary or random amount disbursements are blocked."
                            : "All pending booking funds are frozen under active dispute investigations. Resolve disputes before disbursing."}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Amount Input */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                        Disbursement Amount (₹)
                      </label>
                      {disbursable > 0 && (
                        <button
                          type="button"
                          onClick={() => setPayoutAmount(String(disbursable))}
                          className="text-[11px] text-[#FF6900] hover:underline font-bold"
                        >
                          Set Full Disbursable ({formatCurrency(disbursable)})
                        </button>
                      )}
                    </div>
                    <Input
                      type="number"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="Enter amount to transfer"
                      className={`font-bold text-sm bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white ${isAmountExceeded ? "border-rose-500 focus-visible:ring-rose-500 text-rose-600" : ""}`}
                      max={disbursable}
                      min={1}
                      disabled={disbursable <= 0}
                      required
                    />
                    {isAmountExceeded ? (
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                        Amount exceeds allowable limit of {formatCurrency(disbursable)}. Random/arbitrary payouts are blocked.
                      </p>
                    ) : (
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        Max allowable disbursement backed by verified bookings is {formatCurrency(disbursable)}.
                      </p>
                    )}
                  </div>

                  {/* Disbursement Method Selection */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                      Disbursement Rail
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDisbursementType("direct")}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          disbursementType === "direct"
                            ? "border-[#FF6900] bg-[#FFF1E6]/50 dark:bg-[#FF6900]/10 text-neutral-900 dark:text-white ring-1 ring-[#FF6900]/20"
                            : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:border-neutral-300"
                        }`}
                      >
                        <Building className={`w-4 h-4 shrink-0 ${disbursementType === "direct" ? "text-[#FF6900]" : "text-neutral-400"}`} />
                        <div>
                          <div className="text-xs font-bold leading-tight">Direct Transfer</div>
                          <div className="text-[10px] text-neutral-400">IMPS / NEFT / UPI</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDisbursementType("link")}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                          disbursementType === "link"
                            ? "border-[#FF6900] bg-[#FFF1E6]/50 dark:bg-[#FF6900]/10 text-neutral-900 dark:text-white ring-1 ring-[#FF6900]/20"
                            : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-500 hover:border-neutral-300"
                        }`}
                      >
                        <LinkIcon className={`w-4 h-4 shrink-0 ${disbursementType === "link" ? "text-[#FF6900]" : "text-neutral-400"}`} />
                        <div>
                          <div className="text-xs font-bold leading-tight">Payout Link</div>
                          <div className="text-[10px] text-neutral-400">SMS / WhatsApp Link</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Transfer Rail or Link Info */}
                  {disbursementType === "direct" ? (
                    <div className="space-y-1.5">
                      <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                        Transfer Rail (RazorpayX)
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {["IMPS", "NEFT", "RTGS", "UPI"].map((m) => (
                          <button
                            type="button"
                            key={m}
                            onClick={() => setPayoutMode(m)}
                            className={`py-2 text-center rounded-xl font-bold transition-all ${
                              payoutMode === m
                                ? "bg-[#FF6900] text-white shadow-sm"
                                : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-[#FFF1E6]/40 dark:bg-[#FF6900]/10 border border-[#FF6900]/20 flex items-start gap-2.5">
                      <ExternalLink className="w-4 h-4 text-[#FF6900] shrink-0 mt-0.5" />
                      <div className="text-xs text-neutral-700 dark:text-neutral-300">
                        <span className="font-bold text-[#FF6900]">Payout Link API:</span> RazorpayX will issue a unique payment link sent to the host ({selectedHost?.phone || "registered contact"}), allowing them to claim funds directly into their preferred account.
                      </div>
                    </div>
                  )}

                  {/* Narration */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                      Statement Narration
                    </label>
                    <Input
                      value={narration}
                      onChange={(e) => setNarration(e.target.value)}
                      placeholder="e.g., Host Settlement"
                      className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>

                  {/* Admin Internal Notes */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-neutral-700 dark:text-neutral-300 block">
                      Internal Admin Notes / Audit Remark
                    </label>
                    <Input
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="Optional notes for internal ledger audit"
                      className="bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <DialogFooter className="pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      disabled={submitting}
                      className="border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isDisburseDisabled}
                      className="bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold disabled:opacity-40"
                    >
                      {submitting
                        ? "Processing..."
                        : disbursementType === "link"
                        ? `Generate Payout Link (₹${Number(payoutAmount || 0).toLocaleString()})`
                        : `Disburse ₹${Number(payoutAmount || 0).toLocaleString()}`}
                    </Button>
                  </DialogFooter>
                </form>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
