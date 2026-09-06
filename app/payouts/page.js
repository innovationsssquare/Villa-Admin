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
} from "lucide-react";
import {
  getAdminPendingHosts,
  adminExecutePayout,
  getAdminPayoutLedger,
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

  // Ledger state
  const [ledger, setLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [ledgerSearch, setLedgerSearch] = useState("");

  // Payout Execution Modal state
  const [selectedHost, setSelectedHost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutMode, setPayoutMode] = useState("IMPS");
  const [narration, setNarration] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { addToast } = useToast();

  const loadHostsData = async () => {
    try {
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

  useEffect(() => {
    if (activeTab === "hosts") {
      loadHostsData();
    } else {
      loadLedgerData();
    }
  }, [activeTab, search, statusFilter, ledgerSearch]);

  const openPayoutModal = (host) => {
    setSelectedHost(host);
    setPayoutAmount(host.pendingBalance > 0 ? host.pendingBalance.toString() : "1000");
    setNarration(`Host Settlement - ${host.name?.slice(0, 15)}`);
    setAdminNotes("");
    setPayoutMode("IMPS");
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

    try {
      setSubmitting(true);
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
    <ScrollArea className="bg-[#FAFAFA] h-[calc(100vh-64px)] pb-16">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                RazorpayX Host Payout Console
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF1E6] text-[#FF6900] font-bold">
                Automated Gateway
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Direct host settlements via IMPS, NEFT, and UPI with automated UTR ledger tracking.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-neutral-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab("hosts")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "hosts"
                    ? "bg-[#FF6900] text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Host Balances
              </button>
              <button
                onClick={() => setActiveTab("ledger")}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeTab === "ledger"
                    ? "bg-[#FF6900] text-white shadow-sm"
                    : "text-neutral-600 hover:text-neutral-900"
                }`}
              >
                Disbursement Ledger
              </button>
            </div>

            <button
              onClick={() => (activeTab === "hosts" ? loadHostsData() : loadLedgerData())}
              className="p-2 rounded-xl border border-neutral-200 bg-white hover:border-[#FF6900]/40 text-neutral-600 hover:text-[#FF6900] shadow-sm transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading || ledgerLoading ? "animate-spin text-[#FF6900]" : ""}`} />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Pending Disbursements
            </span>
            <span className="text-2xl font-black text-[#FF6900] tracking-tight block">
              {formatCurrency(stats?.totalPendingAmount)}
            </span>
            <span className="text-xs text-neutral-400 mt-1 block">
              Pending host withdrawal queue
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Ready for Instant Payout
            </span>
            <span className="text-2xl font-black text-emerald-600 tracking-tight block">
              {stats?.readyHostsCount || 0}{" "}
              <span className="text-xs font-normal text-neutral-500">hosts</span>
            </span>
            <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Verified bank accounts attached
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Action Required
            </span>
            <span className="text-2xl font-black text-amber-500 tracking-tight block">
              {stats?.unverifiedHostsCount || 0}{" "}
              <span className="text-xs font-normal text-neutral-500">hosts</span>
            </span>
            <span className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              Pending KYC / Penny drop validation
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Lifetime Settlements
            </span>
            <span className="text-2xl font-black text-neutral-900 tracking-tight block">
              {formatCurrency(stats?.totalSettledAmount)}
            </span>
            <span className="text-xs text-neutral-400 mt-1 block">
              Processed through RazorpayX
            </span>
          </div>
        </div>

        {/* TAB 1: HOSTS BALANCES */}
        {activeTab === "hosts" && (
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-neutral-200">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <Input
                  placeholder="Search host by name, email, or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-neutral-50 border-neutral-200 text-xs rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs text-neutral-500 font-medium">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700 font-medium outline-none cursor-pointer"
                >
                  <option value="all">All Hosts</option>
                  <option value="ready">Ready for Payout</option>
                  <option value="unverified">Unverified Bank Details</option>
                  <option value="settled">Settled / Zero Balance</option>
                </select>
              </div>
            </div>

            {/* Hosts Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Host Profile</th>
                      <th className="py-3.5 px-4">Bank / VPA Details</th>
                      <th className="py-3.5 px-4">Verification</th>
                      <th className="py-3.5 px-4">Pending Balance</th>
                      <th className="py-3.5 px-4">Lifetime Settled</th>
                      <th className="py-3.5 px-4 text-right">Disbursement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400">
                          <RefreshCw className="w-6 h-6 animate-spin text-[#FF6900] mx-auto mb-2" />
                          Loading host payout records...
                        </td>
                      </tr>
                    ) : hosts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-neutral-400">
                          No matching hosts found.
                        </td>
                      </tr>
                    ) : (
                      hosts.map((host) => (
                        <tr key={host._id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-neutral-900 text-sm">{host.name}</div>
                            <div className="text-neutral-400 text-[11px]">{host.email}</div>
                            {host.phone && host.phone !== "N/A" && (
                              <div className="text-neutral-500 text-[11px]">{host.phone}</div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {host.bankDetails?.accountNumber ? (
                              <div>
                                <div className="font-mono text-neutral-900 font-semibold">
                                  {host.bankDetails.accountNumber}
                                </div>
                                <div className="text-neutral-500 text-[11px]">
                                  {host.bankDetails.bankName || "Bank"} • {host.bankDetails.ifscCode}
                                </div>
                                {host.bankDetails.razorpayFundAccountId && (
                                  <div className="text-[10px] text-[#FF6900] font-mono mt-0.5">
                                    FA: {host.bankDetails.razorpayFundAccountId}
                                  </div>
                                )}
                              </div>
                            ) : host.bankDetails?.upiId ? (
                              <div className="font-mono text-neutral-900">
                                UPI: {host.bankDetails.upiId}
                              </div>
                            ) : (
                              <span className="text-neutral-400 italic">No bank info</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {host.bankDetails?.isVerified || host.bankDetails?.razorpayFundAccountId ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <BadgeCheck className="w-3 h-3 text-emerald-600" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                                <AlertCircle className="w-3 h-3 text-amber-600" />
                                Unverified
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-black text-sm text-[#FF6900]">
                              {formatCurrency(host.pendingBalance)}
                            </span>
                            {host.pendingCount > 0 && (
                              <div className="text-[10px] text-neutral-400">
                                {host.pendingCount} booking{host.pendingCount > 1 ? "s" : ""} pending
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-semibold text-neutral-800">
                              {formatCurrency(host.completedAmount)}
                            </span>
                            {host.completedCount > 0 && (
                              <div className="text-[10px] text-neutral-400">
                                {host.completedCount} payouts
                              </div>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <Button
                              onClick={() => openPayoutModal(host)}
                              disabled={
                                !host.bankDetails?.accountNumber && !host.bankDetails?.upiId
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
            <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-neutral-200">
              <div className="relative w-full sm:w-96">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <Input
                  placeholder="Search ledger by UTR, Host Name, or Booking Reference..."
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className="pl-9 bg-neutral-50 border-neutral-200 text-xs rounded-xl"
                />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">UTR / Transaction ID</th>
                      <th className="py-3.5 px-4">Beneficiary Host</th>
                      <th className="py-3.5 px-4">Amount</th>
                      <th className="py-3.5 px-4">Method / Mode</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
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
                        <tr key={idx} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-[#FF6900]">
                            {txn.transactionId}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-neutral-900">{txn.ownerName}</div>
                            <div className="text-neutral-400 text-[10px]">{txn.bookingReference}</div>
                          </td>
                          <td className="py-3.5 px-4 font-black text-neutral-900">
                            {formatCurrency(txn.amount)}
                          </td>
                          <td className="py-3.5 px-4 uppercase font-semibold text-neutral-600">
                            {txn.paymentMethod || "IMPS"}
                          </td>
                          <td className="py-3.5 px-4">
                            {txn.status === "completed" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3" />
                                Completed
                              </span>
                            ) : txn.status === "failed" ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                                <AlertCircle className="w-3 h-3" />
                                Failed
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                                <Clock className="w-3 h-3" />
                                Processing
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-neutral-500">
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
          <DialogContent className="sm:max-w-md bg-white border border-neutral-200">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <WalletCards className="w-5 h-5 text-[#FF6900]" />
                Execute RazorpayX Payout
              </DialogTitle>
            </DialogHeader>

            {selectedHost && (
              <form onSubmit={handleExecutePayout} className="space-y-4 py-2 text-xs">
                {/* Beneficiary Card */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-neutral-900 text-sm">
                      {selectedHost.name}
                    </span>
                    <span className="text-[#FF6900] font-black text-sm">
                      Pending: {formatCurrency(selectedHost.pendingBalance)}
                    </span>
                  </div>
                  <div className="text-neutral-500 font-mono">
                    {selectedHost.bankDetails?.accountNumber || selectedHost.bankDetails?.upiId}
                  </div>
                  {selectedHost.bankDetails?.bankName && (
                    <div className="text-neutral-400 text-[11px]">
                      {selectedHost.bankDetails.bankName} • IFSC: {selectedHost.bankDetails.ifscCode}
                    </div>
                  )}
                </div>

                {/* Amount Input */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">
                    Disbursement Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    placeholder="Enter amount to transfer"
                    className="font-bold text-sm bg-white"
                    required
                  />
                  <p className="text-[11px] text-neutral-400">
                    Host total pending eligible balance is {formatCurrency(selectedHost.pendingBalance)}.
                  </p>
                </div>

                {/* Transfer Mode */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">
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
                            : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Narration */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">
                    Statement Narration
                  </label>
                  <Input
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    placeholder="e.g., Host Settlement"
                    className="bg-white"
                  />
                </div>

                {/* Admin Internal Notes */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-700 block">
                    Internal Admin Notes / Audit Remark
                  </label>
                  <Input
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Optional notes for internal ledger audit"
                    className="bg-white"
                  />
                </div>

                <DialogFooter className="pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsModalOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold"
                  >
                    {submitting ? "Processing..." : `Disburse ₹${Number(payoutAmount || 0).toLocaleString()}`}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
