"use client";

import React from "react";
import {
  TrendingUp,
  ReceiptIndianRupee,
  CalendarCheck,
  WalletCards,
  Scale,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

export default function ExecutiveKpiGrid({ summary, bookingStatus, payoutStats, disputeStats, loading }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-36 rounded-2xl bg-white/80 border border-neutral-200/80 p-5 animate-pulse shadow-sm"
          >
            <div className="h-4 w-24 bg-neutral-200 rounded-md mb-3" />
            <div className="h-8 w-36 bg-neutral-200 rounded-md mb-2" />
            <div className="h-3 w-44 bg-neutral-100 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  const totalRev = summary?.totalRevenue || 0;
  const paidRev = summary?.totalPaidAmount || 0;
  const pendingRev = summary?.totalPendingAmount || 0;
  const collectionRate = totalRev > 0 ? Math.round((paidRev / totalRev) * 100) : 100;

  const totalBookings = summary?.totalBookings || 0;
  const confirmedCount = (bookingStatus?.confirmed || 0) + (bookingStatus?.completed || 0);
  const cancelledCount = bookingStatus?.cancelled || 0;

  const totalPendingPayout = payoutStats?.totalPendingAmount || 0;
  const readyHosts = payoutStats?.readyHostsCount || 0;

  const openDisputes = (disputeStats?.openCount || 0) + (disputeStats?.investigatingCount || 0);
  const urgentDisputes = disputeStats?.urgentCount || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* 1. Gross Revenue Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Gross Platform Volume
          </span>
          <div className="p-2 rounded-xl bg-[#FFF1E6] dark:bg-orange-950/50 text-[#FF6900] group-hover:scale-110 transition-transform">
            <ReceiptIndianRupee className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
          {formatCurrency(totalRev)}
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
            {collectionRate}% Collected
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="text-neutral-500 dark:text-neutral-400 truncate">
            {formatCurrency(pendingRev)} pending
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6900] to-amber-400" />
      </div>

      {/* 2. Bookings Card */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md transition-all group">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
            Total Reservations
          </span>
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            <CalendarCheck className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
          {totalBookings}{" "}
          <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">stays</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {confirmedCount} Confirmed
          </span>
          {cancelledCount > 0 && (
            <>
              <span className="text-neutral-300 dark:text-neutral-700">•</span>
              <span className="text-rose-500 dark:text-rose-400 font-medium">
                {cancelledCount} Cancelled
              </span>
            </>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
      </div>

      {/* 3. Host Payouts Card */}
      <Link
        href="/payouts"
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md hover:border-[#FF6900]/40 transition-all group block"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1">
            Host Settlements
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-[#FF6900] transition-colors" />
          </span>
          <div className="p-2 rounded-xl bg-[#FFF1E6] dark:bg-orange-950/50 text-[#FF6900] group-hover:scale-110 transition-transform">
            <WalletCards className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
          {formatCurrency(totalPendingPayout)}
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-[#FF6900]">
            {readyHosts} Hosts Ready
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">•</span>
          <span className="text-neutral-500 dark:text-neutral-400">1-Click RazorpayX</span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6900] to-emerald-500" />
      </Link>

      {/* 4. Disputes & Resolution Card */}
      <Link
        href="/disputes"
        className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md hover:border-rose-400 transition-all group block"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1">
            Dispute Resolution
            <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-rose-500 transition-colors" />
          </span>
          <div
            className={`p-2 rounded-xl transition-transform group-hover:scale-110 ${
              urgentDisputes > 0
                ? "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 animate-pulse"
                : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            }`}
          >
            <Scale className="w-5 h-5" />
          </div>
        </div>
        <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1 flex items-center gap-2">
          <span>{openDisputes}</span>
          <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">active cases</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          {urgentDisputes > 0 ? (
            <span className="font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {urgentDisputes} Urgent Action Needed
            </span>
          ) : (
            <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Platform in Good Health
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 to-amber-500" />
      </Link>
    </div>
  );
}
