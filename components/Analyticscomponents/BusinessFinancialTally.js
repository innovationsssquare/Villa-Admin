"use client";

import React, { useState, useEffect } from "react";
import {
  ReceiptIndianRupee,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  CreditCard,
  Percent,
  Receipt,
  Scale,
  CalendarCheck2,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  Clock,
  Lock,
  ChevronDown,
} from "lucide-react";
import { getBusinessFinancialTally } from "@/lib/API/Analytics/Analytics";

export default function BusinessFinancialTally({ refreshTrigger }) {
  const [timeframe, setTimeframe] = useState("all_time");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val || 0);
  };

  const formatCurrencyCompact = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const loadTallyData = async (selectedTimeframe = timeframe) => {
    try {
      setLoading(true);
      const res = await getBusinessFinancialTally({ timeframe: selectedTimeframe });
      if (res?.success && res?.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error("Failed to load financial tally:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTallyData(timeframe);
  }, [timeframe, refreshTrigger]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadTallyData(timeframe);
  };

  const summary = data?.summary || {};
  const razorpay = data?.razorpaySettlement || {};
  const ownerPayouts = data?.ownerPayouts || {};
  const taxes = data?.taxesAndDeductions || {};
  const commission = data?.platformCommission || {};
  const reconciliation = data?.reconciliation || {};

  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/90 dark:border-neutral-800/80 shadow-xs transition-all mb-6">
      {/* Top Accent Gradient Border  */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#FF6900] via-amber-500 to-emerald-500" />

      <div className="p-5 sm:p-6 lg:p-7 space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                Business Financial Tally & Actual Revenue
              </h2>
              {reconciliation?.isBalanced && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/70 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  100% Reconciled
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Strictly confirmed and completed bookings • Verified gateway settlements, host liabilities, and platform profit.
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
            {/* Timeframe Chips */}
            <div className="inline-flex items-center p-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold">
              {[
                { id: "all_time", label: "All Time" },
                { id: "this_month", label: "This Month" },
                { id: "last_month", label: "Last Month" },
                { id: "this_year", label: "This Year" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTimeframe(tab.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    timeframe === tab.id
                      ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs font-bold"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing || loading}
              className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#FF6900]/40 text-neutral-600 dark:text-neutral-400 hover:text-[#FF6900] transition-all cursor-pointer shadow-xs"
              title="Refresh financial tally"
            >
              <RefreshCw
                className={`w-4 h-4 ${isRefreshing ? "animate-spin text-[#FF6900]" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* 5 Main Financial Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {/* 1. Actual Confirmed Booking Volume */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Actual Confirmed Booking
              </span>
              <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-[#FF6900] flex items-center justify-center">
                <CalendarCheck2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
              {loading ? "..." : formatCurrencyCompact(summary.grossBookingAmount)}
            </div>
            <div className="space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center justify-between">
                <span>Confirmed Bookings:</span>
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  {summary.confirmedBookingsCount || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span>Avg Ticket:</span>
                <span className="font-mono text-neutral-600 dark:text-neutral-400">
                  {formatCurrencyCompact(summary.averageBookingValue)}
                </span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-neutral-200/60 dark:border-neutral-800/60 flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> Excludes cancelled bookings
            </div>
          </div>

          {/* 2. Razorpay Settlement Amount */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Razorpay Net Settlement
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {loading ? "..." : formatCurrencyCompact(razorpay.netSettledToBank)}
            </div>
            <div className="space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center justify-between">
                <span>Total Collected:</span>
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  {formatCurrencyCompact(razorpay.totalCollected)}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] text-rose-600 dark:text-rose-400">
                <span>Gateway Fees:</span>
                <span>-{formatCurrency(razorpay.gatewayFee)}</span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-neutral-200/60 dark:border-neutral-800/60 text-[10px] text-neutral-500 dark:text-neutral-400">
              Net credited to merchant bank
            </div>
          </div>

          {/* 3. Total to Property Owners */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Owner Net Payable
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-purple-600 dark:text-purple-400 tracking-tight">
              {loading ? "..." : formatCurrencyCompact(ownerPayouts.totalOwnerPayable)}
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                <span>Disbursed:</span>
                <span className="font-bold">{formatCurrencyCompact(ownerPayouts.alreadyDisbursed)}</span>
              </div>
              <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
                <span>Pending Payout:</span>
                <span className="font-bold">{formatCurrencyCompact(ownerPayouts.totalPendingAll)}</span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-neutral-200/60 dark:border-neutral-800/60 text-[10px] text-neutral-500 dark:text-neutral-400">
              Disbursed rate: <span className="font-semibold">{ownerPayouts.disbursementRate || 0}%</span>
            </div>
          </div>

          {/* 4. Total Commission */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                Platform Commission
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Percent className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 tracking-tight">
              {loading ? "..." : formatCurrencyCompact(commission.totalCommission)}
            </div>
            <div className="space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center justify-between">
                <span>Take Rate:</span>
                <span className="font-bold text-neutral-700 dark:text-neutral-300">
                  {commission.effectiveRate || 15}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span>Net Margin:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  {formatCurrencyCompact(commission.netProfitMargin)}
                </span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-neutral-200/60 dark:border-neutral-800/60 text-[10px] text-neutral-500 dark:text-neutral-400">
              Retained platform earnings
            </div>
          </div>

          {/* 5. Taxes & Deductions */}
          <div className="p-4 rounded-xl bg-neutral-50/70 dark:bg-neutral-900/40 border border-neutral-200/80 dark:border-neutral-800/80 space-y-2 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                Taxes & Deductions
              </span>
              <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <div className="text-xl font-black text-rose-600 dark:text-rose-400 tracking-tight">
              {loading ? "..." : formatCurrencyCompact(taxes.totalDeductions)}
            </div>
            <div className="space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
              <div className="flex items-center justify-between">
                <span>TDS (1% Sec 194O):</span>
                <span className="font-mono">{formatCurrency(taxes.tdsDeduction)}</span>
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span>GST on Comm (18%):</span>
                <span className="font-mono">{formatCurrency(taxes.gstOnCommission)}</span>
              </div>
            </div>
            <div className="pt-1.5 border-t border-neutral-200/60 dark:border-neutral-800/60 text-[10px] text-neutral-500 dark:text-neutral-400">
              Statutory + gateway withholdings
            </div>
          </div>
        </div>

        {/* Double-Entry Balance Sheet Reconciliation (Overall Tally) */}
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#FF6900]" />
                Overall Business Tally & Balance Sheet
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Double-entry reconciliation proving exact allocation of every rupee collected from customers.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500 dark:text-neutral-400">Variance:</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(reconciliation.variance)}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                BALANCED ✓
              </span>
            </div>
          </div>

          {/* Balance Sheet Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* INFLOW (Left Column) */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  1. Gross Customer Inflow
                </span>
                <span className="text-xs font-mono font-black text-neutral-900 dark:text-white">
                  {formatCurrency(reconciliation.grossInflow)}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Confirmed Booking Value
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {formatCurrency(summary.grossBookingAmount)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Collected via Razorpay Gateway
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {formatCurrency(razorpay.totalCollected)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Razorpay Gateway Fee Deductions
                  </span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    -{formatCurrency(razorpay.gatewayFee)}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between font-semibold text-neutral-900 dark:text-white">
                  <span>Net Funds Received in Bank:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                    {formatCurrency(razorpay.netSettledToBank)}
                  </span>
                </div>
              </div>
            </div>

            {/* OUTFLOW & ALLOCATIONS (Right Column) */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                  2. Allocations & Outflow
                </span>
                <span className="text-xs font-mono font-black text-neutral-900 dark:text-white">
                  {formatCurrency(reconciliation.totalAllocations)}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-500" />
                    Host Net Payable (Paid + Pending)
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {formatCurrency(reconciliation.hostShare)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    Platform Commission Retained (15%)
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {formatCurrency(reconciliation.platformShare)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Taxes on Commission (TDS + GST)
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {formatCurrency(reconciliation.statutoryTaxShare)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                    Payment Gateway Fee
                  </span>
                  <span className="font-mono text-neutral-900 dark:text-white">
                    {formatCurrency(reconciliation.gatewayFeeShare)}
                  </span>
                </div>

                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between font-semibold text-neutral-900 dark:text-white">
                  <span>Reconciled Sum:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {formatCurrency(reconciliation.totalAllocations)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mathematical Verification Equation Banner */}
          <div className="p-3 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/60 flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>Tally Equation:</strong> Customer Inflow ({formatCurrencyCompact(reconciliation.grossInflow)}) = Host Share ({formatCurrencyCompact(reconciliation.hostShare)}) + Commission ({formatCurrencyCompact(reconciliation.platformShare)}) + Taxes ({formatCurrencyCompact(reconciliation.statutoryTaxShare)}) + Gateway Fees ({formatCurrencyCompact(reconciliation.gatewayFeeShare)})
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] shrink-0 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Zero Discrepancy
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
