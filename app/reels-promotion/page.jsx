"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  Film,
  Sparkles,
  Flame,
  Pin,
  ArrowUp,
  ArrowDown,
  Play,
  RotateCcw,
  Save,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Calendar,
  Eye,
  SlidersHorizontal,
  ExternalLink,
  Zap,
} from "lucide-react";
import {
  FetchAdminReels,
  ReorderAdminReels,
  BoostVacantWeekendReels,
} from "@/lib/API/Reels/Reels";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ReelsYieldEnginePage() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [boosting, setBoosting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [weekendRange, setWeekendRange] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // "all", "vacant", "booked", "pinned", "promoted"

  // Video preview modal
  const [previewVideo, setPreviewVideo] = useState(null);

  // Boost confirmation dialog
  const [boostDialogOpen, setBoostDialogOpen] = useState(false);
  const [boostPriority, setBoostPriority] = useState(50);
  const [boostBadge, setBoostBadge] = useState("Weekend Deal");

  // Load all reels from Admin API
  const loadReels = async () => {
    setLoading(true);
    try {
      const res = await FetchAdminReels();
      if (res && res.success) {
        setReels(res.data || []);
        if (res.weekendRange) {
          setWeekendRange(res.weekendRange);
        }
        setHasUnsavedChanges(false);
      }
    } catch (err) {
      console.error("Failed to load reels:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReels();
  }, []);

  // Compute live stats
  const stats = useMemo(() => {
    const total = reels.length;
    const vacant = reels.filter((r) => r.isWeekendVacant).length;
    const booked = reels.filter((r) => !r.isWeekendVacant).length;
    const pinned = reels.filter((r) => r.isReelPinned).length;
    const promoted = reels.filter((r) => r.isPromoted).length;
    return { total, vacant, booked, pinned, promoted };
  }, [reels]);

  // Handle reordering up/down
  const handleMove = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= reels.length) return;

    const newReels = [...reels];
    const [movedItem] = newReels.splice(index, 1);
    newReels.splice(targetIndex, 0, movedItem);

    // Reassign priority scores dynamically so the order is maintained
    const highestScore = (newReels.length + 10) * 10;
    const updated = newReels.map((item, idx) => ({
      ...item,
      reelPriority: item.isReelPinned ? item.reelPriority : highestScore - idx * 10,
    }));

    setReels(updated);
    setHasUnsavedChanges(true);
  };

  const handleMoveToTop = (index) => {
    if (index === 0) return;
    const newReels = [...reels];
    const [movedItem] = newReels.splice(index, 1);
    newReels.unshift(movedItem);

    const highestScore = (newReels.length + 20) * 10;
    const updated = newReels.map((item, idx) => ({
      ...item,
      reelPriority: item.isReelPinned ? item.reelPriority : highestScore - idx * 10,
    }));

    setReels(updated);
    setHasUnsavedChanges(true);
  };

  // Toggle pin
  const handleTogglePin = (id) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isReelPinned: !r.isReelPinned } : r))
    );
    setHasUnsavedChanges(true);
  };

  // Update priority number
  const handlePriorityChange = (id, value) => {
    const num = Number(value) || 0;
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reelPriority: num } : r))
    );
    setHasUnsavedChanges(true);
  };

  // Update badge text
  const handleBadgeChange = (id, badge) => {
    setReels((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reelBadge: badge } : r))
    );
    setHasUnsavedChanges(true);
  };

  // Save changes to backend
  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const payload = reels.map((r, index) => ({
        id: r.id,
        propertyType: r.propertyType,
        reelPriority: r.reelPriority,
        isReelPinned: r.isReelPinned,
        reelBadge: r.reelBadge || "",
      }));

      const res = await ReorderAdminReels(payload);
      if (res && res.success) {
        setHasUnsavedChanges(false);
        await loadReels();
      } else {
        alert(res?.message || "Failed to update reel rankings");
      }
    } catch (err) {
      console.error("Save reels error:", err);
      alert("Error saving reel rankings");
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Boost Vacant Weekends Action
  const handleExecuteBoost = async () => {
    setBoosting(true);
    try {
      const res = await BoostVacantWeekendReels({
        boostPriority: Number(boostPriority) || 50,
        customBadge: boostBadge,
      });
      if (res && res.success) {
        setBoostDialogOpen(false);
        await loadReels();
        alert(res.message);
      } else {
        alert(res?.message || "Failed to apply weekend vacancy boost");
      }
    } catch (err) {
      console.error("Boost error:", err);
      alert("Failed to apply weekend boost");
    } finally {
      setBoosting(false);
    }
  };

  // Filtered reels for presentation
  const filteredReels = useMemo(() => {
    return reels.filter((r) => {
      // Search
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        r.name?.toLowerCase().includes(query) ||
        r.location?.toLowerCase().includes(query) ||
        r.propertyType?.toLowerCase().includes(query);

      if (!matchesSearch) return false;

      // Status tab
      if (statusFilter === "vacant") return r.isWeekendVacant;
      if (statusFilter === "booked") return !r.isWeekendVacant;
      if (statusFilter === "pinned") return r.isReelPinned;
      if (statusFilter === "promoted") return r.isPromoted;

      return true;
    });
  }, [reels, searchQuery, statusFilter]);

  const formattedWeekendDates = useMemo(() => {
    if (!weekendRange || !weekendRange.start || !weekendRange.end) {
      return "Upcoming Weekend (Fri – Sun)";
    }
    const s = new Date(weekendRange.start).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
    });
    const e = new Date(weekendRange.end).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return `${s} – ${e}`;
  }, [weekendRange]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto min-h-screen text-neutral-900 dark:text-neutral-100">
      {/* 1. Header & Yield Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-[#ff6900]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                Reels & Yield Engine
                <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-semibold px-2 py-0.5">
                  Airbnb & Booking.com Algorithmic Yield
                </Badge>
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Unified Property & Reel Promotion with Weekend Vacancy Intelligence. Unsold inventory is automatically boosted to maximize revenue.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setBoostDialogOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>1-Click Weekend Boost</span>
          </button>

          <button
            type="button"
            onClick={loadReels}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-850 text-xs font-semibold transition-all cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={handleSaveChanges}
            disabled={saving || !hasUnsavedChanges}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              hasUnsavedChanges
                ? "bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-orange-500/25 animate-pulse"
                : "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : hasUnsavedChanges ? "Save Reel Order*" : "Order Saved"}</span>
          </button>
        </div>
      </div>

      {/* 2. Yield KPI Analytics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Active Reels</span>
            <Film className="w-4 h-4 text-neutral-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-neutral-900 dark:text-white">
              {stats.total}
            </span>
            <span className="text-[11px] text-neutral-400">stays with video</span>
          </div>
        </div>

        {/* Weekend Vacant (The Yield Opportunity) */}
        <div className="p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/20 border border-red-200/60 dark:border-red-900/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              Vacant This Weekend
            </span>
            <Calendar className="w-4 h-4 text-red-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-red-600 dark:text-red-400">
              {stats.vacant}
            </span>
            <span className="text-[10px] text-red-500/80 font-medium">unreserved stays</span>
          </div>
          <div className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400 truncate">
            {formattedWeekendDates}
          </div>
        </div>

        {/* Weekend Booked */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              Booked This Weekend
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.booked}
            </span>
            <span className="text-[10px] text-emerald-500/80 font-medium">sold out</span>
          </div>
          <div className="mt-1 text-[10px] text-neutral-500 dark:text-neutral-400">
            High occupancy verified
          </div>
        </div>

        {/* Pinned Overrides */}
        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500">Pinned to Top</span>
            <Pin className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-neutral-900 dark:text-white">
              {stats.pinned}
            </span>
            <span className="text-[11px] text-neutral-400">top override</span>
          </div>
          <div className="mt-1 text-[10px] text-neutral-400">Guaranteed #1 slots</div>
        </div>

        {/* Promoted Stays */}
        <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              Property Spotlight
            </span>
            <Sparkles className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
              {stats.promoted}
            </span>
            <span className="text-[11px] text-amber-500/80 font-medium">promoted stays</span>
          </div>
          <div className="mt-1 text-[10px] text-neutral-400">Inherited into reels</div>
        </div>
      </div>

      {/* 3. Search and Status Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: `All (${reels.length})` },
            { id: "vacant", label: `🔴 Vacant Weekend (${stats.vacant})` },
            { id: "booked", label: `🟢 Booked Weekend (${stats.booked})` },
            { id: "pinned", label: `📌 Pinned (${stats.pinned})` },
            { id: "promoted", label: `⭐ Promoted (${stats.promoted})` },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#ff6900] text-white shadow-xs"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stay by name, location, or type..."
            className="pl-8 text-xs rounded-xl border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
          />
        </div>
      </div>

      {/* 4. Main Interactive Reel Ranking Table */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-[#ff6900] animate-spin" />
            <span className="text-xs text-neutral-500 font-medium">
              Loading dynamic reels & weekend yield occupancy...
            </span>
          </div>
        ) : filteredReels.length === 0 ? (
          <div className="p-16 text-center text-neutral-500">
            <Film className="w-10 h-10 mx-auto text-neutral-300 dark:text-neutral-700 mb-2" />
            <p className="text-sm font-semibold">No reels matched your filters</p>
            <p className="text-xs text-neutral-400 mt-1">
              Try searching a different keyword or resetting your filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 dark:bg-neutral-850/50 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">Rank</th>
                  <th className="py-3 px-4 w-16">Preview</th>
                  <th className="py-3 px-4">Stay & Category</th>
                  <th className="py-3 px-4">Upcoming Weekend Status</th>
                  <th className="py-3 px-4">Bookings Performance</th>
                  <th className="py-3 px-4">Yield Score</th>
                  <th className="py-3 px-4 w-28">Pin to Top</th>
                  <th className="py-3 px-4 w-32">Priority Pts</th>
                  <th className="py-3 px-4 w-36">Display Badge</th>
                  <th className="py-3 px-4 w-24 text-right">Reorder</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150 dark:divide-neutral-800">
                {filteredReels.map((reel, index) => {
                  const isTopRanked = index === 0;

                  return (
                    <tr
                      key={reel.id}
                      className={`hover:bg-neutral-50/80 dark:hover:bg-neutral-850/50 transition-colors ${
                        reel.isReelPinned
                          ? "bg-blue-50/30 dark:bg-blue-950/15"
                          : reel.isWeekendVacant
                          ? "bg-orange-50/20 dark:bg-orange-950/10"
                          : ""
                      }`}
                    >
                      {/* Rank Position */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center justify-center w-7 h-7 rounded-xl font-black text-xs ${
                            reel.isReelPinned
                              ? "bg-blue-600 text-white shadow-xs"
                              : isTopRanked
                              ? "bg-gradient-to-tr from-amber-500 to-[#ff6900] text-white shadow-xs"
                              : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          {reel.isReelPinned ? <Pin className="w-3.5 h-3.5 fill-white" /> : index + 1}
                        </span>
                      </td>

                      {/* Video Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div
                          onClick={() => setPreviewVideo(reel)}
                          className="relative w-11 h-16 rounded-lg overflow-hidden bg-neutral-900 border border-neutral-200 dark:border-neutral-700 cursor-pointer group shadow-2xs"
                        >
                          {reel.thumbnail ? (
                            <Image
                              src={reel.thumbnail}
                              alt={reel.name}
                              fill
                              unoptimized
                              className="object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-neutral-600">
                              <Film className="w-4 h-4" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                            <div className="w-5 h-5 rounded-full bg-white/90 flex items-center justify-center shadow-xs">
                              <Play className="w-2.5 h-2.5 fill-neutral-900 text-neutral-900 translate-x-0.5" />
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Stay & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1 max-w-[240px]">
                          <span className="font-bold text-neutral-900 dark:text-white line-clamp-1 leading-tight text-xs hover:text-[#ff6900] transition-colors">
                            {reel.name}
                          </span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Badge className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.2 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                              {reel.propertyType}
                            </Badge>
                            <span className="text-[10px] text-neutral-500 truncate">
                              {reel.location}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Weekend Status (Yield Management) */}
                      <td className="py-3.5 px-4">
                        {reel.isWeekendVacant ? (
                          <div className="flex flex-col gap-1">
                            <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 text-[10px] font-bold px-2 py-0.5 w-fit flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                              Vacant Next Weekend
                            </Badge>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              +50 pts automatic yield boost
                            </span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-0.5">
                            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 w-fit flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              Booked for Weekend
                            </Badge>
                            <span className="text-[10px] text-neutral-400">
                              Reserved by guest
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Bookings & Popularity */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1">
                            <span className="font-bold text-neutral-900 dark:text-white">
                              {reel.totalBookingsCount} bookings
                            </span>
                            {reel.totalBookingsCount >= 3 && (
                              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400">
                            {reel.recentBookings30Days} in last 30 days · {reel.averageRating || 4.5} ⭐ ({reel.totalReviews || 0})
                          </span>
                        </div>
                      </td>

                      {/* Yield Score */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <Badge className="bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-mono font-bold text-xs px-2 py-0.5 w-fit shadow-2xs">
                            {reel.effectiveScore} pts
                          </Badge>
                          <span className="text-[9px] text-neutral-400">
                            {reel.isReelPinned
                              ? "Pinned (10,000)"
                              : `${reel.reelPriority || 0} prio + ${reel.isPromoted ? 100 : 0} promo + ${reel.isWeekendVacant ? 50 : 0} yield`}
                          </span>
                        </div>
                      </td>

                      {/* Pin to Top Switch */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={Boolean(reel.isReelPinned)}
                            onCheckedChange={() => handleTogglePin(reel.id)}
                            className="scale-90"
                          />
                          <span className="text-[10px] font-semibold text-neutral-500">
                            {reel.isReelPinned ? "Pinned" : "Normal"}
                          </span>
                        </div>
                      </td>

                      {/* Priority Pts Input */}
                      <td className="py-3.5 px-4">
                        <Input
                          type="number"
                          value={reel.reelPriority ?? 0}
                          onChange={(e) => handlePriorityChange(reel.id, e.target.value)}
                          className="w-20 h-7 text-xs font-mono font-bold rounded-lg border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                        />
                      </td>

                      {/* Display Badge Input */}
                      <td className="py-3.5 px-4">
                        <Input
                          type="text"
                          value={reel.reelBadge ?? reel.customBadge ?? ""}
                          onChange={(e) => handleBadgeChange(reel.id, e.target.value)}
                          placeholder="e.g. Weekend Open"
                          className="w-28 h-7 text-[11px] rounded-lg border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
                        />
                      </td>

                      {/* Reorder Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleMoveToTop(index)}
                            disabled={index === 0}
                            title="Move to top"
                            className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <TrendingUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            title="Move up"
                            className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMove(index, 1)}
                            disabled={index === reels.length - 1}
                            title="Move down"
                            className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 hover:text-neutral-900 disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. 1-Click Boost Confirmation Dialog */}
      <Dialog open={boostDialogOpen} onOpenChange={setBoostDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold text-neutral-900 dark:text-white">
              <Zap className="w-5 h-5 text-orange-500 fill-orange-500" />
              1-Click Weekend Vacancy Boost
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500">
              Apply a dynamic priority surge to all properties with reels that currently have zero confirmed reservations for the upcoming weekend ({formattedWeekendDates}).
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="p-3 rounded-xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/60 dark:border-orange-900/40 text-orange-800 dark:text-orange-300">
              <span className="font-bold">Yield Management Principle:</span> Every unsold weekend night is perishable revenue. Boosting vacant stays ensures potential travelers scrolling reels discover and book them first.
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                Priority Boost Points
              </label>
              <Input
                type="number"
                value={boostPriority}
                onChange={(e) => setBoostPriority(e.target.value)}
                placeholder="50"
                className="text-xs rounded-xl"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">
                Display Badge on Reel
              </label>
              <Input
                type="text"
                value={boostBadge}
                onChange={(e) => setBoostBadge(e.target.value)}
                placeholder="Weekend Deal"
                className="text-xs rounded-xl"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <button
              type="button"
              onClick={() => setBoostDialogOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleExecuteBoost}
              disabled={boosting}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-[#ff6900] hover:bg-[#e05d00] text-white shadow-md shadow-orange-500/20 flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{boosting ? "Applying Boost..." : "Apply Boost to Vacant Stays"}</span>
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 6. Video Preview Dialog */}
      <Dialog open={Boolean(previewVideo)} onOpenChange={() => setPreviewVideo(null)}>
        <DialogContent className="sm:max-w-sm bg-neutral-950 border border-neutral-800 text-white rounded-3xl p-4 overflow-hidden">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-white truncate">
              {previewVideo?.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-400">
              {previewVideo?.location} · {previewVideo?.propertyType}
            </DialogDescription>
          </DialogHeader>

          {previewVideo && (
            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black mt-2">
              <video
                src={previewVideo.reelVideo}
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

