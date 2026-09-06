"use client";

import React from "react";
import Link from "next/link";
import {
  WalletCards,
  Scale,
  UserCheck,
  PackageCheck,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";

export default function OperationalActionCenter({ payoutStats, disputeStats }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const pendingPayout = payoutStats?.totalPendingAmount || 0;
  const readyHosts = payoutStats?.readyHostsCount || 0;
  const openDisputes = (disputeStats?.openCount || 0) + (disputeStats?.investigatingCount || 0);
  const urgentDisputes = disputeStats?.urgentCount || 0;

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-neutral-900">
          Operational Command Center
        </h3>
        <p className="text-xs text-neutral-500 mt-0.5">
          High-priority administrative workflows requiring operator review
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Action 1: Host Settlements */}
        <Link
          href="/payouts"
          className="p-4 rounded-xl border border-neutral-200 hover:border-[#FF6900]/50 bg-neutral-50/50 hover:bg-[#FFF1E6]/20 transition-all flex items-start justify-between group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#FFF1E6] text-[#FF6900] group-hover:scale-105 transition-transform shrink-0">
              <WalletCards className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-neutral-900">
                  RazorpayX Host Payouts
                </span>
                {readyHosts > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FF6900] text-white">
                    {readyHosts} Ready
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Disburse pending host balances via IMPS / NEFT directly into verified bank accounts.
              </p>
              <div className="mt-2 text-xs font-semibold text-neutral-700">
                Pending Settlement:{" "}
                <span className="text-[#FF6900]">{formatCurrency(pendingPayout)}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#FF6900] group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </Link>

        {/* Action 2: Disputes & Claims */}
        <Link
          href="/disputes"
          className="p-4 rounded-xl border border-neutral-200 hover:border-rose-300 bg-neutral-50/50 hover:bg-rose-50/20 transition-all flex items-start justify-between group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-rose-50 text-rose-600 group-hover:scale-105 transition-transform shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-neutral-900">
                  Dispute Resolution Hub
                </span>
                {urgentDisputes > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white animate-pulse">
                    {urgentDisputes} Urgent
                  </span>
                ) : openDisputes > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                    {openDisputes} Active
                  </span>
                ) : null}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Review guest and host claims, inspect photographic evidence, and issue 1-click settlements.
              </p>
              <div className="mt-2 text-xs font-semibold text-neutral-700">
                Active Cases:{" "}
                <span className={openDisputes > 0 ? "text-rose-600" : "text-emerald-600"}>
                  {openDisputes} case{openDisputes === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </Link>

        {/* Action 3: Owner Verification */}
        <Link
          href="/property-owner"
          className="p-4 rounded-xl border border-neutral-200 hover:border-blue-300 bg-neutral-50/50 hover:bg-blue-50/20 transition-all flex items-start justify-between group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-105 transition-transform shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-neutral-900">
                Host Onboarding & KYC
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                Review uploaded KYC documents (Aadhaar, PAN, GST) and verify host bank accounts.
              </p>
              <div className="mt-2 text-xs font-semibold text-blue-600">
                View Verification Pipeline
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </Link>

        {/* Action 4: All Bookings */}
        <Link
          href="/booking"
          className="p-4 rounded-xl border border-neutral-200 hover:border-emerald-300 bg-neutral-50/50 hover:bg-emerald-50/20 transition-all flex items-start justify-between group"
        >
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform shrink-0">
              <PackageCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm text-neutral-900">
                All Reservations & Check-ins
              </span>
              <p className="text-xs text-neutral-500 mt-1">
                Monitor incoming check-ins, guest arrival schedules, and booking fulfillment across all properties.
              </p>
              <div className="mt-2 text-xs font-semibold text-emerald-600">
                Inspect Booking Ledger
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
        </Link>
      </div>
    </div>
  );
}
