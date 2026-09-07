"use client";

import React from "react";
import { Home, Tent, Building2, Trees, ArrowRight } from "lucide-react";
import Link from "next/link";

const categoryIcons = {
  Villa: Home,
  Camping: Tent,
  Cottages: Trees,
  Hotels: Building2,
};

const categoryColors = {
  Villa: "bg-[#FF6900]",
  Camping: "bg-emerald-500",
  Cottages: "bg-amber-500",
  Hotels: "bg-blue-500",
};

export default function CategoryBreakdownCard({ data = [], loading = false }) {
  const safeData = Array.isArray(data) ? data : [];
  const totalRevAll = safeData.reduce((acc, c) => acc + (c?.totalRevenue || 0), 0);
  const totalBookingsAll = safeData.reduce((acc, c) => acc + (c?.totalBookings || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-6 shadow-sm animate-pulse">
        <div className="flex items-center justify-between mb-5">
          <div className="space-y-2">
            <div className="h-5 w-44 bg-neutral-200 dark:bg-neutral-800 rounded-md" />
            <div className="h-3.5 w-60 bg-neutral-100 dark:bg-neutral-800/60 rounded-md" />
          </div>
          <div className="h-4 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-neutral-200 dark:bg-neutral-800" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
                    <div className="h-2.5 w-20 bg-neutral-100 dark:bg-neutral-800/60 rounded" />
                  </div>
                </div>
                <div className="h-4 w-8 bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              </div>
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between">
                  <div className="h-3 w-12 bg-neutral-100 dark:bg-neutral-800/60 rounded" />
                  <div className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800 rounded" />
                </div>
                <div className="h-1.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="h-4 w-36 bg-neutral-100 dark:bg-neutral-800/60 rounded" />
          <div className="h-5 w-28 bg-neutral-200 dark:bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Category Distribution
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Portfolio split and performance across property verticals
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-[#FF6900] hover:text-[#E05D00] flex items-center gap-1 transition-colors"
          >
            Manage Categories
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {safeData.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500">
            No category distribution metrics recorded yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-2">
            {safeData.map((cat, idx) => {
              const catName = cat?._id || `Category-${idx + 1}`;
              const IconComponent = categoryIcons[catName] || Home;
              const colorClass = categoryColors[catName] || "bg-[#FF6900]";
              const bookingsCount = cat?.totalBookings || 0;
              const rev = cat?.totalRevenue || 0;
              const pct =
                totalRevAll > 0
                  ? Math.round((rev / totalRevAll) * 100)
                  : 0;

              return (
                <div
                  key={cat?._id || idx}
                  className="p-4 rounded-xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/50 dark:bg-neutral-900/30 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`p-2 rounded-lg ${colorClass} text-white shadow-xs`}>
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-neutral-900 dark:text-white block">
                          {catName}
                        </span>
                        <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          {bookingsCount} booking{bookingsCount === 1 ? "" : "s"}
                        </span>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 shadow-2xs">
                      {pct}%
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-neutral-400 dark:text-neutral-500 font-medium">
                        GMV
                      </span>
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {formatCurrency(rev)}
                      </span>
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-neutral-200/70 dark:bg-neutral-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1.5">
          Combined Portfolio GMV:
          <span className="font-medium text-neutral-700 dark:text-neutral-300">
            ({totalBookingsAll} total bookings)
          </span>
        </span>
        <span className="font-bold text-neutral-900 dark:text-white text-base">
          {formatCurrency(totalRevAll)}
        </span>
      </div>
    </div>
  );
}
