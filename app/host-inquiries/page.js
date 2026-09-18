"use client";

import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  RefreshCw,
  Clock,
  CheckCircle2,
  AlertCircle,
  Home,
  MapPin,
  Bed,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Trash2,
  Edit3,
  UserCheck,
  Send,
  PhoneCall,
  Flame,
  Sparkles,
  Check,
  X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/toast-provider";
import {
  getAllHostInquiries,
  updateHostInquiryStatus,
  deleteHostInquiry,
} from "@/lib/API/HostInquiry/HostInquiry";
import { subscribeAdminEvents } from "@/lib/Socket/socketClient";

const STATUS_CONFIG = {
  new: {
    label: "New Lead",
    badgeClass:
      "bg-orange-500/15 dark:bg-orange-500/20 text-[#FF6900] dark:text-orange-400 border-orange-500/30 dark:border-orange-500/40",
    dotClass: "bg-[#FF6900] animate-pulse",
  },
  contacted: {
    label: "Contacted",
    badgeClass:
      "bg-blue-500/15 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30 dark:border-blue-500/40",
    dotClass: "bg-blue-500",
  },
  in_discussion: {
    label: "In Discussion",
    badgeClass:
      "bg-amber-500/15 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 dark:border-amber-500/40",
    dotClass: "bg-amber-500",
  },
  onboarded: {
    label: "Onboarded",
    badgeClass:
      "bg-emerald-500/15 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-500/40",
    dotClass: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    badgeClass:
      "bg-neutral-500/15 dark:bg-neutral-500/20 text-neutral-700 dark:text-neutral-300 border-neutral-500/30 dark:border-neutral-500/40",
    dotClass: "bg-neutral-400",
  },
};

export default function HostInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    newCount: 0,
    contactedCount: 0,
    inDiscussionCount: 0,
    onboardedCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, search, propertyTypeFilter]);

  // Notes Modal state
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [updatingNotes, setUpdatingNotes] = useState(false);

  const { addToast } = useToast();

  const loadInquiries = async () => {
    try {
      setLoading(true);
      const res = await getAllHostInquiries({
        status: statusFilter,
        search,
        propertyType: propertyTypeFilter,
      });

      if (res?.success) {
        setInquiries(res.data || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load host inquiries:", err);
      addToast({
        title: "Error",
        description: "Failed to load host inquiries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadInquiries();

    // Listen for live new inquiry via socket
    const unsubscribe = subscribeAdminEvents((event, data) => {
      if (event === "new_host_inquiry") {
        addToast({
          title: "New Host Inquiry!",
          description: `${data?.fullName || "A host"} submitted an inquiry for ${data?.propertyType || "Property"}.`,
          variant: "success",
        });
        loadInquiries();
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [statusFilter, search, propertyTypeFilter]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateHostInquiryStatus(id, { status: newStatus });
      if (res?.success) {
        addToast({
          title: "Status Updated",
          description: `Inquiry marked as ${STATUS_CONFIG[newStatus]?.label || newStatus}.`,
          variant: "success",
        });
        // Optimistic update
        setInquiries((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus } : item
          )
        );
        // Refresh stats
        loadInquiries();
      }
    } catch (err) {
      addToast({
        title: "Update Failed",
        description: err.message || "Could not update status.",
        variant: "destructive",
      });
    }
  };

  const openNotesModal = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAdminNotes(inquiry.adminNotes || "");
    setIsNotesModalOpen(true);
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setUpdatingNotes(true);
    try {
      const res = await updateHostInquiryStatus(selectedInquiry._id, {
        adminNotes: adminNotes.trim(),
      });
      if (res?.success) {
        addToast({
          title: "Notes Saved",
          description: "Internal notes updated successfully.",
          variant: "success",
        });
        setInquiries((prev) =>
          prev.map((item) =>
            item._id === selectedInquiry._id
              ? { ...item, adminNotes: adminNotes.trim() }
              : item
          )
        );
        setIsNotesModalOpen(false);
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message || "Failed to save notes.",
        variant: "destructive",
      });
    } finally {
      setUpdatingNotes(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete inquiry from ${name}?`)) {
      return;
    }
    try {
      const res = await deleteHostInquiry(id);
      if (res?.success) {
        addToast({
          title: "Deleted",
          description: "Inquiry removed successfully.",
          variant: "default",
        });
        setInquiries((prev) => prev.filter((item) => item._id !== id));
        loadInquiries();
      }
    } catch (err) {
      addToast({
        title: "Delete Failed",
        description: err.message || "Could not delete inquiry.",
        variant: "destructive",
      });
    }
  };

  const formatCleanPhone = (phone) => {
    if (!phone) return "";
    return phone.replace(/[^0-9]/g, "");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.max(1, Math.ceil(inquiries.length / itemsPerPage));
  const paginatedInquiries = inquiries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <ScrollArea className="bg-gray-50/60 dark:bg-[#09090B] h-[calc(100vh-64px)] pb-14 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                Host Inquiries & Leads
              </h1>
              {stats.newCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-[#FF6900] text-white text-xs font-bold animate-pulse shadow-sm shadow-orange-500/30">
                  {stats.newCount} New
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Prospective property owners who submitted their villa, campsite, or cottage via the Become a Host page.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => {
                setIsRefreshing(true);
                loadInquiries();
              }}
              disabled={isRefreshing}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#FF6900]/40 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-2 shadow-xs hover:text-[#FF6900] dark:hover:text-[#FF6900] transition-all cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#FF6900]" : ""}`}
              />
              {isRefreshing ? "Refreshing..." : "Refresh Leads"}
            </button>
          </div>
        </div>

        {/* 4 Top KPI Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/90 dark:border-neutral-800/80 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Total Leads</span>
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
                <Home className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-neutral-900 dark:text-white mt-2">
              {stats.total}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">All prospective hosts</p>
          </div>

          <div className="p-4 rounded-2xl bg-orange-50/70 dark:bg-orange-950/20 border border-orange-200/80 dark:border-orange-900/40 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#FF6900] dark:text-orange-400">New Uncontacted</span>
              <div className="w-8 h-8 rounded-xl bg-[#FF6900]/15 dark:bg-[#FF6900]/25 flex items-center justify-center text-[#FF6900] dark:text-orange-400">
                <Flame className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            <p className="text-2xl font-black text-[#FF6900] dark:text-orange-400 mt-2">
              {stats.newCount}
            </p>
            <p className="text-[11px] text-orange-700/80 dark:text-orange-400/70 mt-0.5">Needs manager callback</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/90 dark:border-neutral-800/80 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">In Discussion</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <PhoneCall className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-2">
              {(stats.contactedCount || 0) + (stats.inDiscussionCount || 0)}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Pipeline active leads</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/90 dark:border-neutral-800/80 shadow-xs transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Onboarded</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
              {stats.onboardedCount || 0}
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Successfully registered</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200/90 dark:border-neutral-800/80 shadow-xs space-y-3 transition-all">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: "all", label: "All Leads", count: stats.total },
              { id: "new", label: "New", count: stats.newCount },
              { id: "contacted", label: "Contacted", count: stats.contactedCount },
              { id: "in_discussion", label: "In Discussion", count: stats.inDiscussionCount },
              { id: "onboarded", label: "Onboarded", count: stats.onboardedCount },
              { id: "rejected", label: "Rejected", count: stats.rejectedCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                  statusFilter === tab.id
                    ? "bg-[#FF6900] text-white shadow-xs"
                    : "bg-neutral-100 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700/60"
                }`}
              >
                <span>{tab.label}</span>
                {typeof tab.count === "number" && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      statusFilter === tab.id
                        ? "bg-white/20 text-white font-bold"
                        : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search and Property Type Filter */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
            <div className="sm:col-span-8 relative">
              <Search className="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by owner name, phone number, or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:bg-white dark:focus:bg-[#121215] focus:outline-none focus:ring-2 focus:ring-[#FF6900]/30 focus:border-[#FF6900] transition-all"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="sm:col-span-4">
              <select
                value={propertyTypeFilter}
                onChange={(e) => setPropertyTypeFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-[#FF6900]/30 cursor-pointer transition-colors"
              >
                <option value="all" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  All Stay Types
                </option>
                <option value="Luxury Villa" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  Luxury Villa
                </option>
                <option value="Glamping Tent" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  Glamping Tent
                </option>
                <option value="Cottage" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                  Cottage
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Inquiries Table Container */}
        <div className="rounded-2xl overflow-hidden border border-neutral-200/90 dark:border-neutral-800/80 bg-white dark:bg-[#121215] shadow-xs transition-all">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-6 h-6 text-[#FF6900] animate-spin mx-auto" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Loading inquiries...</p>
            </div>
          ) : inquiries.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400 dark:text-neutral-500">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No inquiries found
              </h3>
              <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto">
                {statusFilter !== "all" || search
                  ? "Try adjusting your search query or filter tab."
                  : "When property owners submit the Become a Host form, their submissions will appear here."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50/90 dark:bg-neutral-900/90 border-b border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Host Details</th>
                    <th className="py-3.5 px-4">Stay Type & Config</th>
                    <th className="py-3.5 px-4">Location</th>
                    <th className="py-3.5 px-4">Date Submitted</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {paginatedInquiries.map((item) => {
                    const statusCfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                    const cleanPhone = formatCleanPhone(item.phone);

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40 border-b border-neutral-100 dark:border-neutral-800/60 transition-colors"
                      >
                        {/* Host Details & Quick Contact */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <p className="font-bold text-sm text-neutral-900 dark:text-white">
                              {item.fullName}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                                {item.phone}
                              </span>
                              {/* 1-Click WhatsApp */}
                              <a
                                href={`https://wa.me/${cleanPhone.startsWith("91") ? cleanPhone : "91" + cleanPhone}?text=${encodeURIComponent(
                                  `Hello ${item.fullName}, thank you for your hosting inquiry for ${item.propertyType} on ThevillaCamp. How can we assist you with onboarding?`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                title="Chat on WhatsApp"
                                className="px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-950/40 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold inline-flex items-center gap-1 transition-all border border-emerald-500/20 dark:border-emerald-800/50"
                              >
                                <MessageSquare className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                              {/* 1-Click Call */}
                              <a
                                href={`tel:${item.phone}`}
                                title="Call Number"
                                className="px-2 py-0.5 rounded-md bg-blue-500/10 dark:bg-blue-950/40 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-[11px] font-semibold inline-flex items-center gap-1 transition-all border border-blue-500/20 dark:border-blue-800/50"
                              >
                                <Phone className="w-3 h-3" />
                                <span>Call</span>
                              </a>
                            </div>
                            {item.adminNotes && (
                              <p className="text-[11px] text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800/80 px-2 py-1 rounded-md mt-1 inline-block max-w-xs truncate border border-neutral-200/60 dark:border-neutral-700/60">
                                <strong>Note:</strong> {item.adminNotes}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Stay Type & Configuration */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200/60 dark:border-neutral-700/50">
                              <Home className="w-3 h-3 text-[#FF6900]" />
                              <span>{item.propertyType}</span>
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                              <Bed className="w-3 h-3" />
                              <span>{item.bedrooms}</span>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#FF6900] shrink-0" />
                            <span>{item.location}</span>
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-xs text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                          {formatDate(item.createdAt)}
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4">
                          <select
                            value={item.status}
                            onChange={(e) => handleStatusChange(item._id, e.target.value)}
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#FF6900]/30 cursor-pointer transition-all ${statusCfg.badgeClass}`}
                          >
                            <option value="new" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                              New Lead
                            </option>
                            <option value="contacted" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                              Contacted
                            </option>
                            <option value="in_discussion" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                              In Discussion
                            </option>
                            <option value="onboarded" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                              Onboarded
                            </option>
                            <option value="rejected" className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
                              Rejected
                            </option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Notes button */}
                            <button
                              onClick={() => openNotesModal(item)}
                              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-[#FF6900] dark:hover:text-[#FF6900] transition-all cursor-pointer"
                              title="Add / View Notes"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={() => handleDelete(item._id, item.fullName)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-neutral-400 hover:text-red-600 dark:hover:text-red-400 transition-all cursor-pointer"
                              title="Delete Inquiry"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {inquiries.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Showing <span className="font-semibold text-neutral-700 dark:text-neutral-300">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{Math.min(currentPage * itemsPerPage, inquiries.length)}</span> of{" "}
                  <span className="font-semibold text-neutral-700 dark:text-neutral-300">{inquiries.length}</span> leads
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage <= 1}
                      className="h-8 text-xs border-neutral-200 dark:border-neutral-800 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                    </Button>
                    <span className="text-xs font-semibold px-2 text-neutral-600 dark:text-neutral-300">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage >= totalPages}
                      className="h-8 text-xs border-neutral-200 dark:border-neutral-800 cursor-pointer"
                    >
                      Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </div>
                )}
              </div>
            )}
            </>
          )}
        </div>
      </div>

      {/* Internal Admin Notes Dialog */}
      <Dialog open={isNotesModalOpen} onOpenChange={setIsNotesModalOpen}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900 dark:text-white">
              Host Notes: {selectedInquiry?.fullName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Record details from your call or WhatsApp discussion with this host (e.g. expected pricing, property amenities, onboarding progress).
            </p>
            <Textarea
              placeholder="e.g. Host is ready for photoshoot on Saturday; requested commission details..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={4}
              className="text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:bg-white dark:focus:bg-[#121215] focus:outline-none focus:ring-2 focus:ring-[#FF6900]/30"
            />
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsNotesModalOpen(false)}
              className="text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={updatingNotes}
              onClick={handleSaveNotes}
              className="text-xs font-bold rounded-xl bg-[#FF6900] hover:bg-[#e05d00] text-white cursor-pointer shadow-sm shadow-orange-500/25"
            >
              {updatingNotes ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}
