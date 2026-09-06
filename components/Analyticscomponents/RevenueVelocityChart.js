"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, Calendar, Layers } from "lucide-react";

export default function RevenueVelocityChart({ data = [], onPeriodChange, period = "month" }) {
  const [activeMetric, setActiveMetric] = useState("revenue"); // "revenue" | "bookings"

  const formatCurrency = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(0)}k`;
    return `₹${val}`;
  };

  const chartData = data.map((item) => ({
    name: item._id,
    revenue: item.revenue || 0,
    bookings: item.bookings || 0,
    formattedRevenue: `₹${(item.revenue || 0).toLocaleString()}`,
  }));

  const totalRev = chartData.reduce((acc, curr) => acc + curr.revenue, 0);
  const totalBk = chartData.reduce((acc, curr) => acc + curr.bookings, 0);
  const avgOrderValue = totalBk > 0 ? Math.round(totalRev / totalBk) : 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="rounded-xl bg-[#171717] p-3 text-white shadow-xl border border-neutral-800 text-xs min-w-[140px]">
          <p className="font-semibold text-neutral-300 mb-1 border-b border-neutral-800 pb-1">
            {d.name}
          </p>
          <div className="flex items-center justify-between gap-3 my-1">
            <span className="text-[#FF6900] font-medium">Revenue:</span>
            <span className="font-bold">{d.formattedRevenue}</span>
          </div>
          <div className="flex items-center justify-between gap-3 text-neutral-400">
            <span>Bookings:</span>
            <span className="font-semibold text-white">{d.bookings}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-6 shadow-sm">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
              Revenue & Velocity Trajectory
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
              Live Stream
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Gross transaction volume aggregated across verified properties
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric Selector */}
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => setActiveMetric("revenue")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === "revenue"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Revenue (₹)
            </button>
            <button
              onClick={() => setActiveMetric("bookings")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeMetric === "bookings"
                  ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Bookings
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl text-xs font-medium">
            <button
              onClick={() => onPeriodChange && onPeriodChange("month")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === "month"
                  ? "bg-[#FF6900] text-white shadow-sm font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => onPeriodChange && onPeriodChange("daily")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                period === "daily"
                  ? "bg-[#FF6900] text-white shadow-sm font-semibold"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Daily
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[300px] w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-neutral-400 text-sm">
            No trajectory data found for selected period
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FF6900" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#FF6900" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#9CA3AF" }}
                tickFormatter={activeMetric === "revenue" ? formatCurrency : (val) => val}
              />
              <Tooltip content={<CustomTooltip />} />
              {activeMetric === "revenue" ? (
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FF6900"
                  strokeWidth={2.5}
                  fill="url(#revenueGrad)"
                />
              ) : (
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fill="url(#bookingGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Trajectory Highlights Footer */}
      <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 grid grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            Selected Horizon Total
          </span>
          <span className="text-base font-bold text-neutral-900 dark:text-white">
            ₹{totalRev.toLocaleString()}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            Completed Reservations
          </span>
          <span className="text-base font-bold text-neutral-900 dark:text-white">
            {totalBk}
          </span>
        </div>
        <div>
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
            Average Booking Value (ABV)
          </span>
          <span className="text-base font-bold text-[#FF6900]">
            ₹{avgOrderValue.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
