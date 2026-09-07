"use client";

import React, { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ExecutiveKpiGrid from "@/components/Analyticscomponents/ExecutiveKpiGrid";
import RevenueVelocityChart from "@/components/Analyticscomponents/RevenueVelocityChart";
import CategoryBreakdownCard from "@/components/Analyticscomponents/CategoryBreakdownCard";
import OperationalActionCenter from "@/components/Analyticscomponents/OperationalActionCenter";
import {
  getAnalyticsSummary,
  getRevenueTrends,
  getPropertyTypeAnalytics,
  getBookingStatusAnalytics,
} from "@/lib/API/Analytics/Analytics";
import { getAdminPendingHosts } from "@/lib/API/Payout/AdminPayout";
import { getAllDisputes } from "@/lib/API/Dispute/Dispute";
import { subscribeAdminEvents } from "@/lib/Socket/socketClient";
import { RefreshCw, Radio } from "lucide-react";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [revenueTrends, setRevenueTrends] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [payoutStats, setPayoutStats] = useState(null);
  const [disputeStats, setDisputeStats] = useState(null);
  const [period, setPeriod] = useState("month");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAllAnalytics = async (selectedPeriod = period) => {
    try {
      const [
        summaryRes,
        bookingStatusRes,
        trendsRes,
        categoriesRes,
        payoutRes,
        disputeRes,
      ] = await Promise.all([
        getAnalyticsSummary(),
        getBookingStatusAnalytics(),
        getRevenueTrends(selectedPeriod),
        getPropertyTypeAnalytics(),
        getAdminPendingHosts(),
        getAllDisputes({ limit: 1 }),
      ]);

      if (summaryRes?.success && summaryRes?.data) {
        setSummary(summaryRes.data);
      }
      if (bookingStatusRes?.success && bookingStatusRes?.data) {
        setBookingStatus(bookingStatusRes.data);
      }
      if (trendsRes?.success && Array.isArray(trendsRes?.data)) {
        setRevenueTrends(trendsRes.data);
      }
      if (categoriesRes?.success && Array.isArray(categoriesRes?.data)) {
        setCategoryData(categoriesRes.data);
      }
      if (payoutRes?.success && payoutRes?.stats) {
        setPayoutStats(payoutRes.stats);
      }
      if (disputeRes?.success && disputeRes?.stats) {
        setDisputeStats(disputeRes.stats);
      }
    } catch (err) {
      console.warn("Failed to load dashboard metrics:", err?.message || err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAllAnalytics(period);

    // Real-time socket event subscription for live updates
    const unsubscribe = subscribeAdminEvents(() => {
      // Re-fetch metrics silently when an administrative event arrives
      loadAllAnalytics(period);
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [period]);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    loadAllAnalytics(period);
  };

  return (
    <ScrollArea className="bg-[#FAFAFA] dark:bg-[#09090B] h-[calc(100vh-64px)] pb-4 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Executive Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                Executive Command Console
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                Live Node
              </div>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Real-time portfolio revenue, guest disputes, host settlements, and booking velocity.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#FF6900]/40 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-2 shadow-sm hover:text-[#FF6900] transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#FF6900]" : ""}`}
              />
              {isRefreshing ? "Syncing..." : "Sync Live Metrics"}
            </button>
          </div>
        </div>

        {/* 1. Top Executive KPIs */}
        <ExecutiveKpiGrid
          summary={summary}
          bookingStatus={bookingStatus}
          payoutStats={payoutStats}
          disputeStats={disputeStats}
          loading={loading}
        />

        {/* 2. Revenue & Velocity Trajectory (Full-Width Row) */}
        <RevenueVelocityChart
          data={revenueTrends}
          period={period}
          onPeriodChange={(newPeriod) => {
            setPeriod(newPeriod);
          }}
          loading={loading}
        />

        {/* 3. Category Distribution (Full-Width Row) */}
        <CategoryBreakdownCard
          data={categoryData}
          loading={loading}
        />

        {/* 4. Operational Command Hub */}
        <OperationalActionCenter
          payoutStats={payoutStats}
          disputeStats={disputeStats}
        />
      </div>
    </ScrollArea>
  );
}
