"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Eye,
  RefreshCw,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  Flame,
  ArrowRight,
  ChevronRight,
  Calendar,
  Layers,
  ExternalLink,
  Sliders,
  Check,
} from "lucide-react";
import {
  fetchAllHeroBanners,
  createHeroBannerApi,
  updateHeroBannerApi,
  deleteHeroBannerApi,
  toggleHeroBannerApi,
} from "@/lib/API/HeroBanner/HeroBanner";
import Image from "next/image";

const THEME_PRESETS = [
  {
    theme: "Diwali",
    title: "Script Your Diwali Getaway",
    tagline: "Festive Escape",
    badge: "Diwali Special",
    description: "Celebrate the festival of lights in exclusive private pool villas & festive lakeside estates.",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80",
  },
  {
    theme: "Monsoon",
    title: "Embrace the Lush Monsoon Magic",
    tagline: "Misty Valleys",
    badge: "Monsoon Retreat",
    description: "Cloud-kissed mountain villas with private heated pools, waterfalls, and panoramic forest views.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80",
  },
  {
    theme: "New Year",
    title: "Welcome 2027 in Grand Luxury",
    tagline: "Grand Countdown",
    badge: "New Year Celebration",
    description: "Epic estate villas with DJ setups, bonfires, and private party lawns for your reunion.",
    image: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=2000&q=80",
  },
  {
    theme: "Summer",
    title: "Cool Off with Private Pool Stays",
    tagline: "Summer Sunshine",
    badge: "Pool Villas",
    description: "Beat the heat with infinity pools, air-conditioned chalets, and private orchards in Lonavala.",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=80",
  },
];

export default function HeroBannerPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const [form, setForm] = useState({
    title: "Script Your Diwali Getaway",
    tagline: "Festive Escape",
    description: "Celebrate the festival of lights in exclusive private pool villas & luxury estates.",
    bannerImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80",
    seasonTheme: "Diwali",
    categorySlug: "villa",
    ctaText: "Explore Festive Stays",
    ctaLink: "/category/all",
    badgeText: "Diwali Special",
    order: 0,
    isActive: true,
  });

  const loadBanners = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await fetchAllHeroBanners();
      if (res && res.success && Array.isArray(res.data)) {
        setBanners(res.data);
      } else {
        setBanners([]);
      }
    } catch (err) {
      console.error("Failed to load hero banners:", err);
      setErrorMsg("Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const showToastMsg = (title, message) => {
    setToast({ title, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      title: "Script Your Diwali Getaway",
      tagline: "Festive Escape",
      description: "Celebrate the festival of lights in exclusive private pool villas & luxury estates.",
      bannerImage: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=2000&q=80",
      seasonTheme: "Diwali",
      categorySlug: "villa",
      ctaText: "Explore Festive Stays",
      ctaLink: "/category/all",
      badgeText: "Diwali Special",
      order: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (b) => {
    setEditingId(b._id);
    setForm({
      title: b.title || "",
      tagline: b.tagline || "",
      description: b.description || "",
      bannerImage: b.bannerImage || "",
      seasonTheme: b.seasonTheme || "Diwali",
      categorySlug: b.categorySlug || "villa",
      ctaText: b.ctaText || "Explore Festive Stays",
      ctaLink: b.ctaLink || "/category/all",
      badgeText: b.badgeText || "",
      order: b.order || 0,
      isActive: b.isActive !== undefined ? b.isActive : true,
    });
    setShowModal(true);
  };

  const handleApplyPreset = (preset) => {
    setForm((prev) => ({
      ...prev,
      seasonTheme: preset.theme,
      title: preset.title,
      tagline: preset.tagline,
      badgeText: preset.badge,
      description: preset.description,
      bannerImage: preset.image,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.bannerImage.trim()) {
      setErrorMsg("Title and Banner Image URL are required");
      return;
    }

    try {
      setSubmitting(true);
      setErrorMsg("");

      let res;
      if (editingId) {
        res = await updateHeroBannerApi(editingId, form);
      } else {
        res = await createHeroBannerApi(form);
      }

      if (res && res.success) {
        showToastMsg(
          editingId ? "Theme Updated!" : "Theme Published!",
          `Hero theme "${form.title}" is now saved to the platform.`
        );
        setShowModal(false);
        loadBanners();
      } else {
        setErrorMsg(res?.message || "Operation failed. Please try again.");
      }
    } catch (err) {
      setErrorMsg(err.message || "Failed to save hero theme");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (id, currentTitle) => {
    try {
      const res = await toggleHeroBannerApi(id);
      if (res && res.success) {
        showToastMsg(
          "Status Updated",
          res.message || `Banner status updated successfully.`
        );
        loadBanners();
      }
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hero theme?")) return;
    try {
      const res = await deleteHeroBannerApi(id);
      if (res && res.success) {
        showToastMsg("Theme Removed", "The banner theme has been deleted.");
        loadBanners();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 p-6 md:p-8">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <div>
            <div className="font-bold text-sm">{toast.title}</div>
            <div className="text-xs text-white/90">{toast.message}</div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[#ff6900] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Seasonal & Festive Marketing Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Dynamic Hero Banner & Festival Themes
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Control the live homepage hero background photo, centered typography (e.g., StayVista Diwali theme), festive tags, and seasonal campaigns directly from your admin dashboard.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadBanners}
            disabled={loading}
            className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-300 hover:text-white transition-all cursor-pointer"
            title="Refresh Banners"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#ff6900] to-[#ea580c] hover:from-[#f97316] hover:to-[#c2410c] text-white font-bold text-sm shadow-[0_4px_16px_rgba(255,105,0,0.35)] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Festival Theme</span>
          </button>
        </div>
      </div>

      {/* Quick Theme Presets */}
      <div className="mt-6">
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Flame className="w-3.5 h-3.5 text-[#ff6900]" />
          <span>Quick 1-Click Festival Presets</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {THEME_PRESETS.map((p) => (
            <div
              key={p.theme}
              onClick={() => {
                handleApplyPreset(p);
                setShowModal(true);
              }}
              className="group p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800/80 hover:border-orange-500/50 hover:bg-neutral-850 cursor-pointer transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-orange-400">
                  {p.theme}
                </span>
                <span className="text-[10px] text-neutral-500 bg-neutral-800 px-2 py-0.5 rounded-full">
                  Use Preset
                </span>
              </div>
              <div className="text-sm font-semibold text-white group-hover:text-orange-100 truncate">
                {p.title}
              </div>
              <div className="text-xs text-neutral-400 truncate mt-0.5">
                Tag: [{p.tagline}]
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active & Configured Banners List */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#ff6900]" />
            <span>Configured Hero Campaigns ({banners.length})</span>
          </h2>
          <span className="text-xs text-neutral-500">
            Active banners display in real-time on website & mobile app
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-neutral-900/50 rounded-3xl border border-neutral-800">
            <RefreshCw className="w-8 h-8 text-[#ff6900] animate-spin mb-3" />
            <span className="text-sm text-neutral-400">Loading festival themes...</span>
          </div>
        ) : banners.length === 0 ? (
          <div className="text-center p-12 bg-neutral-900/40 rounded-3xl border border-dashed border-neutral-800">
            <Sparkles className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white">No custom hero banners yet</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto mt-1 mb-5">
              The website is currently using the high-aesthetic default Diwali & Luxury slides. Add a custom banner above to override or customize them dynamically!
            </p>
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Add Your First Theme
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {banners.map((b) => (
              <div
                key={b._id}
                className="bg-neutral-900 rounded-3xl border border-neutral-800 overflow-hidden flex flex-col justify-between shadow-xl hover:border-neutral-700 transition-all"
              >
                {/* Banner Thumbnail with StayVista Style Center Typography Mockup */}
                <div className="relative h-48 w-full bg-neutral-950 overflow-hidden flex items-center justify-center">
                  {b.bannerImage && (
                    <img
                      src={b.bannerImage}
                      alt={b.title}
                      className="absolute inset-0 w-full h-full object-cover brightness-[0.82]"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-orange-400 border border-orange-500/30">
                      {b.seasonTheme || "Seasonal"}
                    </span>
                    {b.isActive ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Live on Web
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-[10px]">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Centered Typography Live Simulation */}
                  <div className="relative z-10 text-center px-4">
                    <div className="text-lg font-black text-white drop-shadow-md leading-tight line-clamp-2">
                      {b.title}
                    </div>
                    {b.tagline && (
                      <div className="inline-block mt-2 px-3 py-0.5 rounded-full border border-white/60 bg-black/30 backdrop-blur-md text-white text-[10px] font-medium tracking-wide">
                        {b.tagline}
                      </div>
                    )}
                  </div>
                </div>

                {/* Banner Details & Controls */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs text-neutral-400 line-clamp-2 mb-3">
                      {b.description || "No description provided."}
                    </p>
                    <div className="text-[11px] text-neutral-500 flex items-center gap-2">
                      <span>CTA: <strong className="text-neutral-300">{b.ctaText || "Book Now"}</strong></span>
                      <span>•</span>
                      <span>Link: <strong className="text-neutral-300">{b.ctaLink || "/category/all"}</strong></span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleToggle(b._id, b.title)}
                      className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                        b.isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-neutral-800 text-neutral-400 hover:bg-neutral-750"
                      }`}
                    >
                      {b.isActive ? (
                        <>
                          <ToggleRight className="w-4 h-4 text-emerald-400" />
                          <span>Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 text-neutral-500" />
                          <span>Inactive</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(b)}
                        className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors cursor-pointer"
                        title="Edit Theme"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(b._id)}
                        className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                        title="Delete Theme"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh] no-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#ff6900]" />
                <h3 className="text-lg font-bold text-white">
                  {editingId ? "Edit Festival Hero Theme" : "Create New Festival Hero Theme"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-full cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mt-4 p-3 bg-red-500/15 border border-red-500/30 rounded-2xl text-xs text-red-400">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {/* Season / Festival Theme Selector */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                  Season / Festival Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["Diwali", "Monsoon", "New Year", "Summer", "Christmas", "Weekend", "General"].map(
                    (th) => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, seasonTheme: th }))}
                        className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          form.seasonTheme === th
                            ? "bg-[#ff6900] text-white shadow-md shadow-orange-500/20"
                            : "bg-neutral-800 text-neutral-400 hover:bg-neutral-750"
                        }`}
                      >
                        {th}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Title (e.g., StayVista centered title) */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                  Center Headline (StayVista Style) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Script Your Diwali Getaway"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6900]"
                />
              </div>

              {/* Tagline / Pill Badge Text */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                    Festive Pill Tag (Under Headline)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Festive Escape"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6900]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                    Corner Badge Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Diwali Special"
                    value={form.badgeText}
                    onChange={(e) => setForm({ ...form, badgeText: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6900]"
                  />
                </div>
              </div>

              {/* Banner Image URL */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                  High-Resolution Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={form.bannerImage}
                  onChange={(e) => setForm({ ...form, bannerImage: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6900]"
                />
              </div>

              {/* Live Preview Box */}
              {form.bannerImage && (
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-neutral-700 shadow-inner flex items-center justify-center">
                  <img
                    src={form.bannerImage}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover brightness-[0.85]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50" />
                  <div className="relative z-10 text-center px-4">
                    <span className="text-[10px] uppercase font-bold text-orange-400 bg-black/60 px-2 py-0.5 rounded-full border border-orange-500/30">
                      LIVE PREVIEW
                    </span>
                    <h4 className="text-xl font-black text-white mt-2 leading-tight drop-shadow-md">
                      {form.title || "Headline preview"}
                    </h4>
                    {form.tagline && (
                      <span className="inline-block mt-2 px-3 py-0.5 rounded-full border border-white/70 bg-black/30 backdrop-blur-md text-white text-xs font-medium">
                        {form.tagline}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                  Sub-description / Supporting Text
                </label>
                <textarea
                  rows={2}
                  placeholder="Celebrate the festival of lights in exclusive private pool villas..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6900]"
                />
              </div>

              {/* CTA & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={form.ctaText}
                    onChange={(e) => setForm({ ...form, ctaText: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6900]"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-300 mb-1.5 block">
                    Target Route / URL
                  </label>
                  <input
                    type="text"
                    value={form.ctaLink}
                    onChange={(e) => setForm({ ...form, ctaLink: e.target.value })}
                    className="w-full bg-neutral-800 border border-neutral-700/80 rounded-2xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ff6900]"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-neutral-800/60 rounded-2xl border border-neutral-750">
                <div>
                  <div className="text-xs font-bold text-white">Publish Immediately</div>
                  <div className="text-[11px] text-neutral-400">
                    If enabled, this theme will go live right away on the homepage hero.
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))}
                  className="cursor-pointer"
                >
                  {form.isActive ? (
                    <ToggleRight className="w-7 h-7 text-[#ff6900]" />
                  ) : (
                    <ToggleLeft className="w-7 h-7 text-neutral-500" />
                  )}
                </button>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#ff6900] hover:bg-orange-600 text-white text-xs font-bold shadow-lg shadow-orange-500/25 transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingId ? "Update Theme" : "Publish Theme"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
