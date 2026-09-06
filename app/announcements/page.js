"use client";

import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Send,
  Radio,
  Users,
  BellRing,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Clock,
  ShieldAlert,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  Smartphone,
  Info,
} from "lucide-react";
import {
  broadcastAnnouncementToHosts,
  fetchAnnouncementHistory,
} from "@/lib/API/Notification/Notification";
import { ScrollArea } from "@/components/ui/scroll-area";

const QUICK_TEMPLATES = [
  {
    label: "Monsoon Pool & Villa Advisory",
    category: "system",
    priority: "high",
    title: "Monsoon Advisory: Pool Care & Guest Check-in Protocols",
    message:
      "Dear Hosts, heavy rainfall is forecast across major villa regions. Please inspect drainage, secure poolside furniture, and ensure backup power generators are fueled for arriving guests.",
  },
  {
    label: "Holiday Peak Inflow Notice",
    category: "booking",
    priority: "high",
    title: "High Demand Season: Keep Your Calendars & Rates Updated",
    message:
      "A surge in villa bookings is expected for the upcoming long weekend. Please review your pricing, minimum stay settings, and ensure your on-site caretakers are prepared.",
  },
  {
    label: "Scheduled Bank Maintenance & Payouts",
    category: "payout",
    priority: "medium",
    title: "Scheduled Banking Maintenance & Settlement Timeline",
    message:
      "Due to scheduled partner banking maintenance this Sunday between 01:00 AM - 06:00 AM, automated check-out disbursements will be queued and cleared by 08:00 AM.",
  },
  {
    label: "Festive Holiday Greetings",
    category: "promotional",
    priority: "normal",
    title: "Season's Greetings from The Villa Camp Team! 🎉",
    message:
      "Wishing all our partner hosts a joyful festive season! Thank you for delivering world-class hospitality to our guests. Wishing you full bookings and high earnings!",
  },
];

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "system",
    priority: "high",
    targetAudience: "owners",
  });

  const loadHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await fetchAnnouncementHistory();
      if (res.success && Array.isArray(res.data)) {
        setAnnouncements(res.data);
      }
    } catch (e) {
      console.error("Failed to load announcements:", e);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleApplyTemplate = (tpl) => {
    setForm({
      ...form,
      title: tpl.title,
      message: tpl.message,
      category: tpl.category,
      priority: tpl.priority,
    });
  };

  const handleBroadcast = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) {
      setErrorMessage("Please fill in both announcement title and message");
      return;
    }

    try {
      setBroadcasting(true);
      setErrorMessage("");
      const res = await broadcastAnnouncementToHosts(form);

      if (res && res.success) {
        setSuccessToast({
          title: "Announcement Broadcasted!",
          message: res.message || "Sent in real-time to all connected property owners.",
          count: res.data?.count || 0,
        });

        setForm({
          title: "",
          message: "",
          category: "system",
          priority: "high",
          targetAudience: "owners",
        });

        loadHistory();
        setTimeout(() => setSuccessToast(null), 6000);
      } else {
        setErrorMessage(res?.message || "Failed to broadcast announcement.");
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setBroadcasting(false);
    }
  };

  const totalBroadcasts = announcements.length;
  const totalReceptions = announcements.reduce((acc, curr) => acc + (curr.recipientsCount || 0), 0);
  const urgentCount = announcements.filter((a) => a.priority === "urgent" || a.priority === "high").length;

  return (
    <ScrollArea className="bg-[#FAFAFA] dark:bg-neutral-950 h-[calc(100vh-64px)] pb-16">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-neutral-900 dark:text-neutral-100">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-600 dark:text-orange-400">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Host Announcements & Broadcasts
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Send instant real-time alerts, maintenance notices, and advisories to all property owners.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadHistory}
              disabled={loadingHistory}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-sm transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loadingHistory ? "animate-spin text-orange-500" : ""}`} />
              Refresh History
            </button>
          </div>
        </div>

        {/* Success Notification Banner */}
        {successToast && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-start justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">{successToast.title}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">{successToast.message}</p>
              </div>
            </div>
            <button
              onClick={() => setSuccessToast(null)}
              className="text-emerald-700 dark:text-emerald-400 hover:opacity-80 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button
              onClick={() => setErrorMessage("")}
              className="text-rose-700 dark:text-rose-400 hover:opacity-80 text-sm font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Total Broadcasts
              </span>
              <Radio className="w-4 h-4 text-orange-500 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">{totalBroadcasts}</p>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 inline-block">Platform announcements issued</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Host Notifications Created
              </span>
              <Users className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">{totalReceptions}</p>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 inline-block">In-app notifications delivered</span>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                High / Urgent Alerts
              </span>
              <ShieldAlert className="w-4 h-4 text-rose-500 dark:text-rose-400" />
            </div>
            <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">{urgentCount}</p>
            <span className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 inline-block">Priority operational notices</span>
          </div>
        </div>

        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Form (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              Compose Broadcast
            </h2>
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 font-medium">
              Target: All Property Owners
            </span>
          </div>

          {/* Quick Template Selector */}
          <div className="mb-5">
            <label className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 block mb-2">
              Quick Templates (Click to fill)
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-xs px-3 py-1.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/60 transition-colors cursor-pointer"
                >
                  {tpl.label}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleBroadcast} className="space-y-4">
            {/* Category & Priority Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="system">System Announcement</option>
                  <option value="booking">Booking Advisory</option>
                  <option value="payout">Payout / Banking Notice</option>
                  <option value="promotional">Festive / Community</option>
                  <option value="property">Property Policy</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                  Priority Level
                </label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-3 py-2.5 text-sm text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-orange-500 transition-colors"
                >
                  <option value="normal">Normal (Standard Alert)</option>
                  <option value="medium">Medium (Informative)</option>
                  <option value="high">High (Recommended Action)</option>
                  <option value="urgent">Urgent (Red Alert Banner)</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300 block mb-1.5">
                Announcement Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Monsoon Weather Alert: Pool & Lawn Protocols"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Detailed Message *
                </label>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500">
                  {form.message.length} characters
                </span>
              </div>
              <textarea
                rows={5}
                placeholder="Write the detailed message that will appear on all property owners' notification screens and push notifications..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-900 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:border-orange-500 resize-none transition-colors"
              />
            </div>

            {/* Delivery Note */}
            <div className="p-3 bg-neutral-50 dark:bg-neutral-950/70 border border-neutral-200 dark:border-neutral-800 rounded-xl flex items-center gap-3 text-xs text-neutral-600 dark:text-neutral-400">
              <Radio className="w-4 h-4 text-orange-500 dark:text-orange-400 shrink-0 animate-pulse" />
              <span>
                Broadcasting will instantly emit <code className="text-orange-600 dark:text-orange-300 font-semibold">notification_new</code> across WebSockets and insert an alert in every host's notification box.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={broadcasting || !form.title.trim() || !form.message.trim()}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-sm shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              {broadcasting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Broadcasting to All Hosts...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Broadcast to All Property Owners Now
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Mobile Preview Mockup (5 cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 flex flex-col items-center shadow-sm">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              Host Mobile App Preview
            </h3>
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400">Live Simulation</span>
          </div>

          {/* Phone Frame */}
          <div className="w-full max-w-[320px] bg-neutral-950 border-4 border-neutral-800 rounded-[36px] p-4 shadow-2xl relative overflow-hidden">
            {/* Phone Notch */}
            <div className="w-28 h-4 bg-neutral-800 rounded-full mx-auto mb-4" />

            {/* In-App Header Preview */}
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500 animate-ping" />
                <span className="text-xs font-bold text-white">Notifications</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-bold">
                1 New
              </span>
            </div>

            {/* Notification Card Preview */}
            <div className="bg-white rounded-2xl p-3.5 shadow-sm border border-neutral-200 relative">
              {form.priority === "urgent" || form.priority === "high" ? (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg rounded-tr-xl">
                  {form.priority.toUpperCase()}
                </div>
              ) : null}

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
                  <Megaphone className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-extrabold text-neutral-900 leading-snug line-clamp-2">
                    {form.title || "Announcement Title Preview"}
                  </p>
                  <p className="text-[11px] text-neutral-600 mt-1 leading-relaxed line-clamp-4">
                    {form.message ||
                      "This is how your message will appear in real-time on every property host's screen when you broadcast it."}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[9px] text-neutral-400">
                    <span className="font-semibold text-orange-600">The Villa Camp Admin</span>
                    <span>Just now</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Push Notification Banner Preview */}
            <div className="mt-6 pt-4 border-t border-neutral-800/80">
              <span className="text-[10px] text-neutral-400 font-medium block mb-2">
                Lock Screen Push Banner Preview:
              </span>
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-2.5 text-left">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-[10px] font-bold text-orange-400">The Villa Camp</span>
                  <span className="text-[9px] text-neutral-500">• now</span>
                </div>
                <p className="text-[11px] font-semibold text-neutral-200 truncate">
                  📢 {form.title || "Announcement Title"}
                </p>
                <p className="text-[10px] text-neutral-400 line-clamp-2 mt-0.5">
                  {form.message || "Message summary preview"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Broadcast History */}
      <div className="mt-6 bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              Broadcast History Log
            </h2>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Previous announcements broadcasted to property owners
            </p>
          </div>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">{announcements.length} broadcasts recorded</span>
        </div>

        {loadingHistory ? (
          <div className="py-12 text-center text-neutral-400 text-sm flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-orange-500" />
            Loading history...
          </div>
        ) : announcements.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <Megaphone className="w-10 h-10 mx-auto text-neutral-400 dark:text-neutral-600 mb-2" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">No broadcasts sent yet</p>
            <p className="text-xs text-neutral-500 dark:text-neutral-600 mt-1">
              Use the compose form above to send your first broadcast announcement.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Announcement</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Delivered</th>
                  <th className="py-3 px-4">Read Count</th>
                  <th className="py-3 px-4">Broadcast Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800/60 text-neutral-700 dark:text-neutral-300">
                {announcements.map((item, index) => (
                  <tr key={index} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <p className="font-semibold text-neutral-900 dark:text-white truncate">{item.title}</p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mt-0.5">{item.message}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase ${
                          item.priority === "urgent" || item.priority === "high"
                            ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {item.priority || "Normal"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 capitalize">
                        {item.category || "System"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-orange-600 dark:text-orange-400 font-semibold">
                      {item.recipientsCount} hosts
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      {item.readCount || 0} opened
                    </td>
                    <td className="py-3.5 px-4 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  </ScrollArea>
  );
}
