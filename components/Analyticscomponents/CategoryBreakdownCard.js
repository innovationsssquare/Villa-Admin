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

export default function CategoryBreakdownCard({ data = [] }) {
  const totalRevAll = data.reduce((acc, c) => acc + (c.totalRevenue || 0), 0);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div className="rounded-2xl bg-white border border-neutral-200 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-neutral-900">
              Category Distribution
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Portfolio split across property verticals
            </p>
          </div>
          <Link
            href="/categories"
            className="text-xs font-semibold text-[#FF6900] hover:text-[#E05D00] flex items-center gap-1 transition-colors"
          >
            Manage
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-4 my-2">
          {data.map((cat) => {
            const IconComponent = categoryIcons[cat._id] || Home;
            const colorClass = categoryColors[cat._id] || "bg-[#FF6900]";
            const pct = totalRevAll > 0 ? Math.round(((cat.totalRevenue || 0) / totalRevAll) * 100) : 0;

            return (
              <div key={cat._id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-neutral-800">
                    <div className={`w-2 h-2 rounded-full ${colorClass}`} />
                    <span>{cat._id}</span>
                    <span className="text-neutral-400 font-normal">
                      ({cat.totalBookings} bookings)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-neutral-900">
                      {formatCurrency(cat.totalRevenue)}
                    </span>
                    <span className="text-neutral-400 font-medium min-w-[32px] text-right">
                      {pct}%
                    </span>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-neutral-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
        <span>Combined Portfolio GMV:</span>
        <span className="font-bold text-neutral-900 text-sm">
          {formatCurrency(totalRevAll)}
        </span>
      </div>
    </div>
  );
}
