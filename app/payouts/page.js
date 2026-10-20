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
  ChevronLeft,
  ChevronRight,
  X,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { toast } from "sonner";

export default function HostPayoutsPage() {
  const [activeTab, setActiveTab] = useState("hosts"); // "hosts" | "ledger"
  const [loading, setLoading] = useState(true);
  const [hosts, setHosts] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [hostPage, setHostPage] = useState(1);
  const hostLimit = 20;

  // RazorpayX Live Balance state
  const [razorpayBalance, setRazorpayBalance] = useState(null);
  const [balanceLoading, setBalanceLoading] = useState(false);

  // Auto settlement state
  const [settling, setSettling] = useState(false);

  // Ledger state
  const [ledger, setLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [debouncedLedgerSearch, setDebouncedLedgerSearch] = useState("");
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState("all");
  const [ledgerPage, setLedgerPage] = useState(1);
  const ledgerLimit = 20;

  // Debounce search inputs by 400ms to avoid firing requests on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedLedgerSearch(ledgerSearch), 400);
    return () => clearTimeout(timer);
  }, [ledgerSearch]);

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
      const res = await getAdminPendingHosts({ search: debouncedSearch, statusFilter });
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
      const res = await getAdminPayoutLedger({
        search: debouncedLedgerSearch,
        status: ledgerStatusFilter,
        limit: 100,
      });
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
    setHostPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    setLedgerPage(1);
  }, [debouncedLedgerSearch, ledgerStatusFilter]);

  useEffect(() => {
    if (activeTab === "hosts") {
      loadHostsData();
    } else {
      loadLedgerData();
    }
  }, [activeTab, debouncedSearch, statusFilter, debouncedLedgerSearch, ledgerStatusFilter]);

  const paginatedHosts = hosts.slice((hostPage - 1) * hostLimit, hostPage * hostLimit);
  const totalHostPages = Math.max(1, Math.ceil(hosts.length / hostLimit));

  const paginatedLedger = ledger.slice((ledgerPage - 1) * ledgerLimit, ledgerPage * ledgerLimit);
  const totalLedgerPages = Math.max(1, Math.ceil(ledger.length / ledgerLimit));

  const openPayoutModal = (host) => {
    setSelectedHost(host);
    const rawDisbursable = typeof host.disbursableBalance === "number" ? host.disbursableBalance : (host.pendingBalance || 0);
    const disbursable = Math.round(rawDisbursable);
    setPayoutAmount(disbursable > 0 ? disbursable.toString() : "0");
    setNarration(`Host Settlement - ${host.name?.slice(0, 15) || "Host"}`);
    setAdminNotes("");
    setPayoutMode("IMPS");
    setDisbursementType("direct");
    setIsModalOpen(true);
  };

  const handleExecutePayout = async (e) => {
    e.preventDefault();
    if (!selectedHost) return;

    const amt = Math.round(Number(payoutAmount));
    if (!amt || amt <= 0) {
      addToast({
        title: "Invalid Amount",
        description: "Please enter a valid disbursement amount greater than 0.",
        variant: "destructive",
      });
      return;
    }

    const rawDisbursable = typeof selectedHost.disbursableBalance === "number"
      ? selectedHost.disbursableBalance
      : Math.max(0, (selectedHost.pendingBalance || 0) - (selectedHost.disputedHold || 0));
    const disbursable = Math.round(rawDisbursable);

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
          description: `All pending funds (₹${Math.round(selectedHost.pendingBalance || 0).toLocaleString()}) are currently frozen on hold due to active guest disputes.`,
          variant: "destructive",
        });
      }
      return;
    }

    if (amt > disbursable) {
      addToast({
        title: "Amount Exceeds Disbursable Balance",
        description: `Cannot disburse ₹${amt.toLocaleString()}. Maximum allowable disbursement backed by verified bookings is ₹${disbursable.toLocaleString()}${selectedHost.disputedHold > 0 ? ` (₹${Math.round(selectedHost.disputedHold).toLocaleString()} frozen in dispute)` : ""}.`,
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
        const toastId = toast.loading(`Processing transfer of ₹${amt.toLocaleString()}...`, {
          description: `Disbursing to ${selectedHost.name} via RazorpayX...`,
        });

        const res = await adminExecutePayout({
          ownerId: selectedHost._id,
          amount: amt,
          mode: payoutMode,
          narration,
          adminNotes,
        });

        if (res?.success) {
          const utr = res.data?.utr || res.data?.payoutId;
          toast.success("Payout Disbursed Successfully! 🎉", {
            id: toastId,
            description: `₹${amt.toLocaleString()} transferred to ${selectedHost.name} (UTR: ${utr})`,
            duration: 6000,
          });
          addToast({
            title: "Payout Disbursed Successfully",
            description: `Disbursed ₹${amt.toLocaleString()} to ${selectedHost.name}. Ref / UTR: ${utr}`,
            variant: "success",
          });
          setIsModalOpen(false);
          loadHostsData();
        } else {
          toast.error(res?.message || "Failed to process RazorpayX transfer.", {
            id: toastId,
          });
          addToast({
            title: "Disbursement Failed",
            description: res?.message || "Failed to process RazorpayX transfer.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast.error(err.message || "Disbursement Error");
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
                      paginatedHosts.map((host) => (
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

              {/* Hosts Pagination */}
              {hosts.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#121215] border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Showing {(hostPage - 1) * hostLimit + 1} to{" "}
                    {Math.min(hostPage * hostLimit, hosts.length)} of {hosts.length} hosts
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setHostPage((p) => Math.max(1, p - 1))}
                      disabled={hostPage === 1}
                      className="h-8 px-2.5 text-xs text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                      Previous
                    </Button>
                    <span className="px-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {hostPage} / {totalHostPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setHostPage((p) => Math.min(totalHostPages, p + 1))
                      }
                      disabled={hostPage >= totalHostPages}
                      className="h-8 px-2.5 text-xs text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DISBURSEMENT LEDGER (UTR HISTORY) */}
        {activeTab === "ledger" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-[#121215] p-3 rounded-2xl border border-neutral-200 dark:border-neutral-800">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  placeholder="Search ledger by UTR, Host Name, or Booking Reference..."
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className="pl-9 pr-8 bg-neutral-50 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white text-xs rounded-xl"
                />
                {ledgerSearch && (
                  <button
                    type="button"
                    onClick={() => setLedgerSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400">Status:</label>
                <select
                  value={ledgerStatusFilter}
                  onChange={(e) => setLedgerStatusFilter(e.target.value)}
                  className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs text-neutral-700 dark:text-neutral-200 font-medium outline-none cursor-pointer"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed / Disbursed</option>
                  <option value="processing">Processing</option>
                  <option value="failed">Failed</option>
                </select>
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
                      paginatedLedger.map((txn, idx) => (
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

              {/* Ledger Pagination */}
              {ledger.length > 0 && (
                <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-[#121215] border-t border-neutral-200 dark:border-neutral-800">
                  <span className="text-xs text-neutral-500 dark:text-neutral-400">
                    Showing {(ledgerPage - 1) * ledgerLimit + 1} to{" "}
                    {Math.min(ledgerPage * ledgerLimit, ledger.length)} of {ledger.length} records
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setLedgerPage((p) => Math.max(1, p - 1))}
                      disabled={ledgerPage === 1}
                      className="h-8 px-2.5 text-xs text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" />
                      Previous
                    </Button>
                    <span className="px-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {ledgerPage} / {totalLedgerPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setLedgerPage((p) => Math.min(totalLedgerPages, p + 1))
                      }
                      disabled={ledgerPage >= totalLedgerPages}
                      className="h-8 px-2.5 text-xs text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Next
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PAYOUT EXECUTION MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-[96vw] sm:max-w-3xl md:max-w-4xl lg:max-w-5xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-2xl rounded-2xl">
            {/* Header */}
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0 bg-neutral-50/70 dark:bg-neutral-900/40 pr-12">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-[#FF6900]/15 flex items-center justify-center text-[#FF6900] border border-orange-200 dark:border-[#FF6900]/30 shrink-0">
                  <WalletCards className="w-5 h-5" />
                </div>
                <div>
                  <DialogTitle className="text-base sm:text-lg font-bold text-neutral-900 dark:text-white leading-tight">
                    Execute Host Payout
                  </DialogTitle>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Automated RazorpayX settlement backed by verified completed stays
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5" /> RazorpayX Live
                </span>
              </div>
            </div>

            {selectedHost && (() => {
              const rawDisbursable = typeof selectedHost.disbursableBalance === "number"
                ? selectedHost.disbursableBalance
                : Math.max(0, (selectedHost.pendingBalance || 0) - (selectedHost.disputedHold || 0));
              const disbursable = Math.round(rawDisbursable);
              const numAmt = Math.round(Number(payoutAmount || 0));
              const isAmountExceeded = numAmt > disbursable;
              const isDisburseDisabled = submitting || disbursable <= 0 || numAmt <= 0 || isAmountExceeded;

              return (
                <form onSubmit={handleExecutePayout} className="flex flex-col flex-1 overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-5 sm:p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                      {/* LEFT COLUMN: Host & Financial Breakdown (5 cols) */}
                      <div className="lg:col-span-5 space-y-4">
                        {/* Host Identity Card */}
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-full bg-[#FF6900]/10 border border-[#FF6900]/20 flex items-center justify-center text-[#FF6900] font-black text-sm shrink-0">
                              {selectedHost.name ? selectedHost.name.slice(0, 2).toUpperCase() : "HO"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
                                {selectedHost.name}
                              </h4>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                                {selectedHost.email || "No email"}
                              </p>
                              {selectedHost.phone && (
                                <p className="text-[11px] text-neutral-400 font-mono">
                                  {selectedHost.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Prominent Disbursable Box */}
                          <div className="p-3.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                                Net Disbursable Balance
                              </span>
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200">
                                Verified
                              </span>
                            </div>
                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                              {formatCurrency(disbursable)}
                            </div>
                            <p className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 mt-0.5">
                              Available for immediate on-demand settlement
                            </p>
                          </div>

                          {/* Financial Breakdown Table */}
                          <div className="space-y-1.5 pt-1 text-xs">
                            <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                              <span>Gross Completed Stays:</span>
                              <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                                {formatCurrency(Math.round(selectedHost.pendingBalance || 0))}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                              <span>Dispute Frozen Hold:</span>
                              <span className={`font-semibold ${(selectedHost.disputedHold || 0) > 0 ? "text-rose-600 dark:text-rose-400" : "text-neutral-500"}`}>
                                - {formatCurrency(Math.round(selectedHost.disputedHold || 0))}
                              </span>
                            </div>
                            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-1.5 flex justify-between items-center font-bold text-neutral-900 dark:text-white">
                              <span>Net Allowable Payout:</span>
                              <span className="text-emerald-600 dark:text-emerald-400 font-black">
                                {formatCurrency(disbursable)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Settlement Destination Bank / UPI Details */}
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                              <Building className="w-3.5 h-3.5 text-neutral-500" />
                              Settlement Destination
                            </span>
                            {selectedHost.bankDetails?.isVerified && (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Bank Verified
                              </span>
                            )}
                          </div>
                          
                          <div className="space-y-1 text-xs">
                            {selectedHost.bankDetails?.accountNumber ? (
                              <>
                                <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                  {selectedHost.bankDetails.accountNumber}
                                </div>
                                <div className="text-neutral-500 dark:text-neutral-400 text-xs">
                                  {selectedHost.bankDetails.bankName || "Bank Account"} • IFSC: {selectedHost.bankDetails.ifscCode || "N/A"}
                                </div>
                                <div className="text-[11px] text-neutral-400">
                                  Beneficiary: {selectedHost.bankDetails.accountHolderName || selectedHost.name}
                                </div>
                              </>
                            ) : selectedHost.bankDetails?.upiId ? (
                              <>
                                <div className="font-mono text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                                  {selectedHost.bankDetails.upiId}
                                </div>
                                <div className="text-neutral-500 dark:text-neutral-400 text-xs">
                                  UPI Virtual Payment Address (VPA)
                                </div>
                              </>
                            ) : (
                              <div className="text-amber-600 dark:text-amber-400 text-xs font-medium">
                                No bank account or UPI ID registered. Direct transfer will require host bank details.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dispute Warning Banner (if any) */}
                        {(selectedHost.disputedHold || 0) > 0 && (
                          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-300 text-xs flex items-start gap-2.5">
                            <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-rose-900 dark:text-rose-200">Active Dispute Hold</div>
                              <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5 leading-relaxed">
                                ₹{Math.round(selectedHost.disputedHold || 0).toLocaleString()} is frozen under active dispute investigations. Payout cannot exceed verified net balance of ₹{disbursable.toLocaleString()}.
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Disbursable Zero Warning */}
                        {disbursable <= 0 && (
                          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-300 text-xs flex items-start gap-2.5">
                            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                            <div>
                              <div className="font-bold text-amber-900 dark:text-amber-200">Disbursement Blocked</div>
                              <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5 leading-relaxed">
                                {(selectedHost.pendingBalance || 0) <= 0
                                  ? "Host has no pending booking earnings. Arbitrary or random disbursements are strictly blocked."
                                  : "All pending booking funds are frozen under active dispute investigations. Resolve disputes before disbursing."}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* RIGHT COLUMN: Payout Configuration & Controls (7 cols) */}
                      <div className="lg:col-span-7 space-y-4">
                        {/* Amount Input Card */}
                        <div className="p-4 rounded-xl bg-neutral-50/60 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 space-y-2.5">
                          <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                              Disbursement Amount (₹ - Round Figure)
                            </label>
                            {disbursable > 0 && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setPayoutAmount(String(disbursable))}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#FF6900]/10 text-[#FF6900] hover:bg-[#FF6900]/20 transition-colors cursor-pointer"
                                >
                                  Full (₹{disbursable.toLocaleString()})
                                </button>
                                {disbursable >= 200 && (
                                  <button
                                    type="button"
                                    onClick={() => setPayoutAmount(String(Math.round(disbursable / 2)))}
                                    className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                                  >
                                    50% (₹{Math.round(disbursable / 2).toLocaleString()})
                                  </button>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-bold text-neutral-400">
                              ₹
                            </span>
                            <Input
                              type="number"
                              step="1"
                              value={payoutAmount}
                              onChange={(e) => {
                                const val = e.target.value;
                                setPayoutAmount(val);
                              }}
                              onBlur={() => {
                                if (payoutAmount && !isNaN(Number(payoutAmount))) {
                                  setPayoutAmount(String(Math.round(Number(payoutAmount))));
                                }
                              }}
                              placeholder="Enter rounded whole rupee amount"
                              className={`pl-8 h-11 font-bold text-base bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white ${
                                isAmountExceeded ? "border-rose-500 focus-visible:ring-rose-500 text-rose-600" : ""
                              }`}
                              max={disbursable}
                              min={1}
                              disabled={disbursable <= 0}
                              required
                            />
                          </div>

                          {isAmountExceeded ? (
                            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                              Amount exceeds allowable limit of {formatCurrency(disbursable)}. Random/arbitrary payouts are blocked.
                            </p>
                          ) : (
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                              Maximum allowable round-figure disbursement backed by verified bookings is <strong className="text-neutral-800 dark:text-neutral-200">{formatCurrency(disbursable)}</strong>.
                            </p>
                          )}
                        </div>

                        {/* Transfer Rail Selection */}
                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                            Disbursement Method
                          </label>
                          <div className="grid grid-cols-2 gap-2.5">
                            <button
                              type="button"
                              onClick={() => setDisbursementType("direct")}
                              className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                disbursementType === "direct"
                                  ? "border-[#FF6900] bg-[#FFF1E6]/60 dark:bg-[#FF6900]/15 text-neutral-900 dark:text-white ring-1 ring-[#FF6900]/30 shadow-sm"
                                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${disbursementType === "direct" ? "bg-[#FF6900] text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"}`}>
                                <Building className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold">Direct Transfer</div>
                                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Instant transfer via IMPS/NEFT/UPI</div>
                              </div>
                            </button>

                            <button
                              type="button"
                              onClick={() => setDisbursementType("link")}
                              className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                                disbursementType === "link"
                                  ? "border-[#FF6900] bg-[#FFF1E6]/60 dark:bg-[#FF6900]/15 text-neutral-900 dark:text-white ring-1 ring-[#FF6900]/30 shadow-sm"
                                  : "border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                              }`}
                            >
                              <div className={`p-2 rounded-lg shrink-0 ${disbursementType === "link" ? "bg-[#FF6900] text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"}`}>
                                <LinkIcon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-bold">Payout Link</div>
                                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Send link via SMS & WhatsApp</div>
                              </div>
                            </button>
                          </div>
                        </div>

                        {/* Transfer Rail options or Link details */}
                        {disbursementType === "direct" ? (
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                              Transfer Rail (RazorpayX)
                            </label>
                            <div className="grid grid-cols-4 gap-2">
                              {["IMPS", "NEFT", "RTGS", "UPI"].map((m) => (
                                <button
                                  type="button"
                                  key={m}
                                  onClick={() => setPayoutMode(m)}
                                  className={`py-2 text-center rounded-xl font-bold text-xs transition-all cursor-pointer ${
                                    payoutMode === m
                                      ? "bg-[#FF6900] text-white shadow-sm ring-2 ring-[#FF6900]/30"
                                      : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200/60 dark:border-neutral-800"
                                  }`}
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 flex items-start gap-2.5">
                            <ExternalLink className="w-4 h-4 text-[#FF6900] shrink-0 mt-0.5" />
                            <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
                              <span className="font-bold text-[#FF6900]">Payout Link Dispatch:</span> A secure claiming link will be dispatched to host contact (<span className="font-mono">{selectedHost?.phone || selectedHost?.email || "on file"}</span>). The host selects their preferred bank or UPI ID to receive funds.
                            </div>
                          </div>
                        )}

                        {/* Narration & Admin Audit Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                              Statement Narration
                            </label>
                            <Input
                              value={narration}
                              onChange={(e) => setNarration(e.target.value)}
                              placeholder="e.g., Host Settlement"
                              className="h-9 text-xs bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                              Audit Remark / Ledger Note
                            </label>
                            <Input
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              placeholder="Optional notes for internal ledger"
                              className="h-9 text-xs bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* MODAL FOOTER */}
                  <div className="px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      Disbursing <strong className="text-neutral-900 dark:text-white font-bold">₹{Math.round(numAmt).toLocaleString()}</strong> to <strong className="text-neutral-900 dark:text-white font-bold">{selectedHost.name}</strong> via <strong className="text-[#FF6900]">{disbursementType === "link" ? "Payout Link" : payoutMode}</strong>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsModalOpen(false)}
                        disabled={submitting}
                        className="h-9 px-4 text-xs font-semibold border-neutral-200 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 cursor-pointer"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isDisburseDisabled}
                        className="h-9 px-5 text-xs font-bold bg-[#FF6900] hover:bg-[#E05D00] text-white shadow-sm disabled:opacity-40 cursor-pointer"
                      >
                        {submitting
                          ? "Processing..."
                          : disbursementType === "link"
                          ? `Dispatch Link (₹${Math.round(numAmt).toLocaleString()})`
                          : `Disburse ₹${Math.round(numAmt).toLocaleString()}`}
                      </Button>
                    </div>
                  </div>
                </form>
              );
            })()}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
