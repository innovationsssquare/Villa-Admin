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
  Tag,
  Gift,
  Flame,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Layers,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import {
  broadcastAnnouncementToHosts,
  fetchAnnouncementHistory,
} from "@/lib/API/Notification/Notification";
import {
  fetchAllOfferEvents,
  createOfferEventApi,
  updateOfferEventApi,
  deleteOfferEventApi,
} from "@/lib/API/OfferEvent/OfferEvent";
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
  // Tabs: "offers" (Website Offers & Property Events) or "broadcasts" (Host Notifications)
  const [activeTab, setActiveTab] = useState("offers");

  // Offers & Events state
  const [offerEvents, setOfferEvents] = useState([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [offerFormSubmitting, setOfferFormSubmitting] = useState(false);
  const [offerForm, setOfferForm] = useState({
    title: "",
    type: "offer",
    description: "",
    bannerImage: "",
    couponCode: "",
    discountBadge: "",
    propertyType: "All",
    propertyName: "",
    isPopup: false,
    showInCarousel: true,
    ctaText: "Book Now",
    ctaLink: "/category/all",
  });

  // Broadcasts state
  const [announcements, setAnnouncements] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);
  const [successToast, setSuccessToast] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    category: "system",
    priority: "high",
    targetAudience: "owners",
  });

  // Load Website Offers & Events
  const loadOfferEvents = async () => {
    try {
      setLoadingOffers(true);
      const res = await fetchAllOfferEvents();
      if (res && res.success && Array.isArray(res.data)) {
        setOfferEvents(res.data);
      }
    } catch (e) {
      console.error("Failed to load offer events:", e);
    } finally {
      setLoadingOffers(false);
    }
  };

  // Load Host Broadcast History
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
    loadOfferEvents();
    loadHistory();
  }, []);

  // Handle Offer/Event Creation
  const handleCreateOfferEvent = async (e) => {
    e.preventDefault();
    if (!offerForm.title.trim() || !offerForm.bannerImage.trim()) {
      setErrorMessage("Please enter both Title and Banner Image URL");
      return;
    }

    try {
      setOfferFormSubmitting(true);
      setErrorMessage("");
      const res = await createOfferEventApi(offerForm);
      if (res && res.success) {
        setSuccessToast({
          title: "Offer / Event Created Successfully!",
          message: "The new promotion has been saved and published to the website.",
        });
        setShowCreateModal(false);
        setOfferForm({
          title: "",
          type: "offer",
          description: "",
          bannerImage: "",
          couponCode: "",
          discountBadge: "",
          propertyType: "All",
          propertyName: "",
          isPopup: false,
          showInCarousel: true,
          ctaText: "Book Now",
          ctaLink: "/category/all",
        });
        loadOfferEvents();
        setTimeout(() => setSuccessToast(null), 5000);
      } else {
        setErrorMessage(res?.message || "Failed to create offer/event.");
      }
    } catch (err) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setOfferFormSubmitting(false);
    }
  };

  // Toggle Popup or Active status for an Offer
  const handleToggleOfferField = async (item, field) => {
    try {
      const updatedValue = !item[field];
      const res = await updateOfferEventApi(item._id, { [field]: updatedValue });
      if (res && res.success) {
        loadOfferEvents();
        setSuccessToast({
          title: "Updated Successfully",
          message: `${item.title}: ${field} is now ${updatedValue ? "enabled" : "disabled"}.`,
        });
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      setErrorMessage("Failed to update status.");
    }
  };

  // Delete Offer/Event
  const handleDeleteOffer = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await deleteOfferEventApi(id);
      if (res && res.success) {
        setOfferEvents((prev) => prev.filter((o) => o._id !== id));
        setSuccessToast({
          title: "Deleted",
          message: "Offer / Event removed from the platform.",
        });
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      setErrorMessage("Failed to delete offer.");
    }
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

  const activePopupCount = offerEvents.filter((o) => o.isPopup && o.isActive).length;
  const activeCarouselCount = offerEvents.filter((o) => o.showInCarousel && o.isActive).length;

  return (
    <ScrollArea className="bg-[#FAFAFA] dark:bg-neutral-950 h-[calc(100vh-64px)] pb-16">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 text-neutral-900 dark:text-neutral-100">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-xl text-[#ff6900]">
                <Megaphone className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  Marketing, Offers &amp; Announcements Hub
                </h1>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Manage consumer homepage offers, property events, promotional popups, and host advisories.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === "offers" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-sm font-semibold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Offer / Event</span>
              </button>
            )}
            <button
              onClick={activeTab === "offers" ? loadOfferEvents : loadHistory}
              disabled={loadingOffers || loadingHistory}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-sm font-medium text-neutral-700 dark:text-neutral-300 shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${(loadingOffers || loadingHistory) ? "animate-spin text-[#ff6900]" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2">
          <button
            onClick={() => setActiveTab("offers")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "offers"
                ? "bg-[#ff6900] text-white shadow-sm"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Website Offers &amp; Events</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
              {offerEvents.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("broadcasts")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "broadcasts"
                ? "bg-[#ff6900] text-white shadow-sm"
                : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Host Broadcasts</span>
            <span className="ml-1 text-xs px-2 py-0.5 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              {announcements.length}
            </span>
          </button>
        </div>

        {/* Notifications & Toasts */}
        {successToast && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-800 dark:text-emerald-200 flex items-start justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-100">{successToast.title}</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300/80 mt-0.5">{successToast.message}</p>
              </div>
            </div>
            <button onClick={() => setSuccessToast(null)} className="text-emerald-700 text-sm font-bold">
              ✕
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-500/40 text-rose-800 dark:text-rose-200 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <p className="text-sm">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage("")} className="text-rose-700 text-sm font-bold">
              ✕
            </button>
          </div>
        )}

        {/* TAB 1: WEBSITE OFFERS & PROPERTY EVENTS */}
        {activeTab === "offers" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Total Promotions
                  </span>
                  <Gift className="w-4 h-4 text-[#ff6900]" />
                </div>
                <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
                  {offerEvents.length}
                </p>
                <span className="text-xs text-neutral-400 mt-1 inline-block">Active &amp; scheduled items</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Homepage Carousel Items
                  </span>
                  <Flame className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
                  {activeCarouselCount}
                </p>
                <span className="text-xs text-neutral-400 mt-1 inline-block">Featured in homepage slider</span>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800/80 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Active Visitor Popup
                  </span>
                  <Sparkles className="w-4 h-4 text-emerald-500" />
                </div>
                <p className="text-2xl font-extrabold text-neutral-900 dark:text-white mt-2">
                  {activePopupCount > 0 ? "Enabled" : "None"}
                </p>
                <span className="text-xs text-neutral-400 mt-1 inline-block">Modal shown on visit</span>
              </div>
            </div>

            {/* List of Offers and Events */}
            <div className="bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                  Live Offers, Events &amp; Popup Announcements
                </h2>
                <span className="text-xs text-neutral-400">
                  Changes reflect in under 2 seconds on the consumer website
                </span>
              </div>

              {loadingOffers ? (
                <div className="py-12 text-center text-sm text-neutral-400">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#ff6900]" />
                  Loading offers and events...
                </div>
              ) : offerEvents.length === 0 ? (
                <div className="py-12 text-center text-sm text-neutral-400 space-y-3">
                  <Tag className="w-8 h-8 mx-auto text-neutral-300" />
                  <p>No offers or events created yet.</p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 rounded-xl bg-[#ff6900] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    + Create Your First Offer
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offerEvents.map((item) => (
                    <div
                      key={item._id}
                      className="group relative rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40 overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                    >
                      {/* Image Header */}
                      <div className="relative h-44 w-full bg-neutral-900 overflow-hidden">
                        <img
                          src={item.bannerImage}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 text-neutral-900 shadow-xs">
                            {item.type}
                          </span>
                          {item.discountBadge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ff6900] text-white shadow-xs">
                              {item.discountBadge}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          {item.isPopup && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-600 text-white shadow-xs flex items-center gap-1">
                              <Sparkles className="w-3 h-3" /> Popup
                            </span>
                          )}
                          <button
                            onClick={() => handleDeleteOffer(item._id, item.title)}
                            className="w-7 h-7 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center transition-colors cursor-pointer"
                            title="Delete offer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          {item.propertyName && (
                            <span className="text-[11px] text-orange-300 font-medium block">
                              📍 {item.propertyName}
                            </span>
                          )}
                          <h3 className="text-sm font-bold leading-snug line-clamp-1">{item.title}</h3>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                        <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                          {item.description || "No description provided."}
                        </p>

                        {item.couponCode && (
                          <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between text-xs">
                            <span className="font-bold text-[#ff6900] tracking-wider font-mono">
                              {item.couponCode}
                            </span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.couponCode);
                                setCopiedCode(item.couponCode);
                                setTimeout(() => setCopiedCode(null), 2000);
                              }}
                              className="text-[11px] text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center gap-1 cursor-pointer"
                            >
                              {copiedCode === item.couponCode ? (
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                              <span>{copiedCode === item.couponCode ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                        )}

                        {/* Controls */}
                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
                          <button
                            onClick={() => handleToggleOfferField(item, "isPopup")}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                              item.isPopup
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 font-bold"
                                : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>{item.isPopup ? "Popup: ON" : "Popup: OFF"}</span>
                          </button>

                          <button
                            onClick={() => handleToggleOfferField(item, "showInCarousel")}
                            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                              item.showInCarousel
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold"
                                : "text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                          >
                            <Flame className="w-3.5 h-3.5" />
                            <span>{item.showInCarousel ? "Carousel: ON" : "Carousel: OFF"}</span>
                          </button>

                          <button
                            onClick={() => handleToggleOfferField(item, "isActive")}
                            className={`px-2 py-1 rounded-lg font-bold text-[11px] cursor-pointer ${
                              item.isActive
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
                            }`}
                          >
                            {item.isActive ? "Active" : "Paused"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: HOST BROADCASTS (Existing feature) */}
        {activeTab === "broadcasts" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Broadcast Form */}
              <div className="lg:col-span-7 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-neutral-900 dark:text-white">
                    Compose Broadcast to Hosts
                  </h2>
                  <span className="text-xs text-orange-500 font-semibold bg-orange-50 dark:bg-orange-950/60 px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800/50">
                    Real-Time Dispatch
                  </span>
                </div>

                <form onSubmit={handleBroadcast} className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                      Announcement Title
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Monsoon Pool Care Guidelines & Checklist"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                        Category
                      </label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
                      >
                        <option value="system">System &amp; Policies</option>
                        <option value="booking">Booking Surge</option>
                        <option value="payout">Payouts &amp; Finance</option>
                        <option value="promotional">Festive &amp; Marketing</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                        Priority Level
                      </label>
                      <select
                        value={form.priority}
                        onChange={(e) => setForm({ ...form, priority: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200"
                      >
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                        <option value="medium">Medium</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 block mb-1">
                      Announcement Content
                    </label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Write the message that will pop up on property owners' mobile apps..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={broadcasting}
                    className="w-full h-11 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className={`w-4 h-4 ${broadcasting ? "animate-pulse" : ""}`} />
                    <span>{broadcasting ? "Broadcasting in Real-time..." : "Broadcast to All Hosts"}</span>
                  </button>
                </form>
              </div>

              {/* Templates */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-xs space-y-3">
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#ff6900]" />
                    <span>Quick Advisory Templates</span>
                  </h3>
                  <div className="space-y-2">
                    {QUICK_TEMPLATES.map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setForm({
                            ...form,
                            title: tpl.title,
                            message: tpl.message,
                            category: tpl.category,
                            priority: tpl.priority,
                          });
                        }}
                        className="w-full text-left p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/60 hover:border-[#ff6900] hover:bg-orange-50/20 transition-all cursor-pointer space-y-1"
                      >
                        <div className="text-xs font-bold text-neutral-900 dark:text-white">
                          {tpl.label}
                        </div>
                        <div className="text-[11px] text-neutral-500 line-clamp-1">
                          {tpl.title}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CREATE OFFER / EVENT MODAL */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 max-w-xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#ff6900] flex items-center justify-center">
                    <Gift className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    Create New Offer / Event / Popup
                  </h3>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateOfferEvent} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monsoon Villa Sale: 25% Off Private Pool Stays"
                    value={offerForm.title}
                    onChange={(e) => setOfferForm({ ...offerForm, title: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#ff6900]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Type
                    </label>
                    <select
                      value={offerForm.type}
                      onChange={(e) => setOfferForm({ ...offerForm, type: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                    >
                      <option value="offer">Special Offer / Discount</option>
                      <option value="event">Property Event (Party/Campfire)</option>
                      <option value="announcement">Important Notice / Announcement</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Property Category
                    </label>
                    <select
                      value={offerForm.propertyType}
                      onChange={(e) => setOfferForm({ ...offerForm, propertyType: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                    >
                      <option value="All">All Categories (Global)</option>
                      <option value="Villa">Villa Only</option>
                      <option value="Camping">Camping Only</option>
                      <option value="Cottage">Cottage Only</option>
                      <option value="Hotel">Hotel Only</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Coupon Code (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. MONSOON25"
                      value={offerForm.couponCode}
                      onChange={(e) => setOfferForm({ ...offerForm, couponCode: e.target.value.toUpperCase() })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 uppercase font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Discount Badge Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. FLAT 25% OFF or Free BBQ"
                      value={offerForm.discountBadge}
                      onChange={(e) => setOfferForm({ ...offerForm, discountBadge: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Banner Image URL *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://images.unsplash.com/... or /Homeasset/..."
                    value={offerForm.bannerImage}
                    onChange={(e) => setOfferForm({ ...offerForm, bannerImage: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Property / Venue Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Villa Euphoria, Lonavala or Pawna Glamping Campsite"
                    value={offerForm.propertyName}
                    onChange={(e) => setOfferForm({ ...offerForm, propertyName: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the promotion perks, dates, musical artists, or barbecue dinner inclusions..."
                    value={offerForm.description}
                    onChange={(e) => setOfferForm({ ...offerForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Button CTA Text
                    </label>
                    <input
                      type="text"
                      placeholder="Book Now"
                      value={offerForm.ctaText}
                      onChange={(e) => setOfferForm({ ...offerForm, ctaText: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                      Button Action Link
                    </label>
                    <input
                      type="text"
                      placeholder="/category/villa"
                      value={offerForm.ctaLink}
                      onChange={(e) => setOfferForm({ ...offerForm, ctaLink: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
                    />
                  </div>
                </div>

                {/* Toggles */}
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offerForm.isPopup}
                      onChange={(e) => setOfferForm({ ...offerForm, isPopup: e.target.checked })}
                      className="w-4 h-4 text-[#ff6900] rounded"
                    />
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      Show as Homepage Popup Modal (Visitor Announcement)
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={offerForm.showInCarousel}
                      onChange={(e) => setOfferForm({ ...offerForm, showInCarousel: e.target.checked })}
                      className="w-4 h-4 text-[#ff6900] rounded"
                    />
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      Show in Homepage Offers &amp; Events Carousel
                    </span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={offerFormSubmitting}
                    className="px-6 py-2 rounded-xl bg-[#ff6900] hover:bg-[#e05d00] text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {offerFormSubmitting ? "Creating..." : "Publish Offer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
