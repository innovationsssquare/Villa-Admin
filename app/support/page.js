"use client";

import React, { useState, useEffect } from "react";
import {
  LifeBuoy,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
  Send,
  Building,
  Smartphone,
  Globe,
  User,
  Mail,
  Phone,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Tag,
  Flame,
  Check,
  X,
  FileText,
} from "lucide-react";
import {
  getAllSupportTickets,
  getSupportTicketById,
  updateSupportTicketStatus,
  postTicketReply,
} from "@/lib/API/Support/AdminSupport";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { useToast } from "@/components/ui/toast-provider";

export default function SupportHelpdeskPage() {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [sourceTab, setSourceTab] = useState("all"); // "all" | "owner_app" | "villa_web"
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");

  // Modal / Drawer state
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const [submittingReply, setSubmittingReply] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const { addToast } = useToast();

  const loadTickets = async () => {
    try {
      setLoading(true);
      const res = await getAllSupportTickets({
        source: sourceTab,
        status: statusFilter,
        priority: priorityFilter,
        category: categoryFilter,
        search,
      });

      if (res?.status === "success") {
        setTickets(res.data || []);
        if (res.stats) setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load support tickets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, [sourceTab, statusFilter, priorityFilter, categoryFilter, search]);

  const openTicketDrawer = async (ticket) => {
    setSelectedTicket(ticket);
    setReplyMessage("");
    setResolutionNotes(ticket.resolutionNotes || "");
    setIsModalOpen(true);

    // Fetch freshest details
    try {
      const detailRes = await getSupportTicketById(ticket._id);
      if (detailRes?.status === "success" && detailRes.data) {
        setSelectedTicket(detailRes.data);
      }
    } catch (e) {
      console.warn("Could not refresh ticket detail:", e);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!selectedTicket || !replyMessage.trim()) return;

    try {
      setSubmittingReply(true);
      const adminName = localStorage.getItem("fullName") || "Support Team";

      const res = await postTicketReply(selectedTicket._id, {
        message: replyMessage.trim(),
        senderName: adminName,
        status: selectedTicket.status === "open" ? "in_progress" : undefined,
      });

      if (res?.status === "success") {
        addToast({
          title: "Reply Dispatched",
          description: `Reply successfully logged and notified to the ticket creator.`,
          variant: "success",
        });
        setReplyMessage("");
        if (res.data) setSelectedTicket(res.data);
        loadTickets();
      } else {
        addToast({
          title: "Reply Failed",
          description: res?.message || "Failed to post reply.",
          variant: "destructive",
        });
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedTicket) return;

    try {
      setUpdatingStatus(true);
      const res = await updateSupportTicketStatus(selectedTicket._id, {
        status: newStatus,
        resolutionNotes: resolutionNotes.trim() || undefined,
      });

      if (res?.status === "success") {
        addToast({
          title: "Status Updated",
          description: `Ticket ${selectedTicket.ticketId || ""} moved to ${newStatus.toUpperCase()}.`,
          variant: "success",
        });
        if (res.data) setSelectedTicket(res.data);
        loadTickets();
      } else {
        addToast({
          title: "Update Failed",
          description: res?.message || "Failed to change status.",
          variant: "destructive",
        });
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case "urgent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200">
            <Flame className="w-3 h-3 text-rose-600 animate-pulse" />
            URGENT
          </span>
        );
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF1E6] text-[#FF6900] border border-[#FF6900]/30">
            HIGH
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            MEDIUM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600">
            LOW
          </span>
        );
    }
  };

  const getStatusBadge = (s) => {
    switch (s) {
      case "open":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            Open
          </span>
        );
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            In Progress
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Resolved
          </span>
        );
      case "closed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200">
            Closed
          </span>
        );
      default:
        return <span className="text-xs text-neutral-500">{s}</span>;
    }
  };

  const getSourceBadge = (source) => {
    if (source === "owner_app") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
          <Smartphone className="w-3 h-3 text-purple-600" />
          Owner App (Host)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
        <Globe className="w-3 h-3 text-teal-600" />
        Villa Web (Guest)
      </span>
    );
  };

  return (
    <ScrollArea className="bg-[#FAFAFA] dark:bg-[#09090B] h-[calc(100vh-64px)] pb-16 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                Support & Helpdesk Console
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#FFF1E6] dark:bg-orange-950/60 text-[#FF6900] font-bold border border-[#FF6900]/20">
                Host & Guest Inquiries
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Centralized issue tracking and live customer service for Owner App and Villa Web.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadTickets}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-[#FF6900]/40 text-neutral-700 dark:text-neutral-300 hover:text-[#FF6900] shadow-sm transition-all text-xs font-semibold cursor-pointer"
              title="Refresh Tickets"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FF6900]" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Open */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Open Tickets
              </span>
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 tracking-tight block">
              {stats?.open || 0}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              Awaiting admin reply
            </span>
          </div>

          {/* Owner App Issues */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Host Issues
              </span>
              <Smartphone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-2xl font-black text-purple-700 dark:text-purple-400 tracking-tight block">
              {stats?.ownerAppCount || 0}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              From Owner App
            </span>
          </div>

          {/* Website Inquiries */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Web Inquiries
              </span>
              <Globe className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            </div>
            <span className="text-2xl font-black text-teal-700 dark:text-teal-400 tracking-tight block">
              {stats?.websiteCount || 0}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              From Villa-Web Guest Form
            </span>
          </div>

          {/* In Progress */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                In Progress
              </span>
              <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            </div>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 tracking-tight block">
              {stats?.inProgress || 0}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              Under investigation
            </span>
          </div>

          {/* Resolved */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                Resolved
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
            </div>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight block">
              {stats?.resolved || 0}
            </span>
            <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 block">
              Closed & satisfied
            </span>
          </div>
        </div>

        {/* Source Navigation Tabs & Filter Bar */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            {/* Origin Tabs */}
            <div className="flex bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl text-xs font-semibold w-full sm:w-auto">
              <button
                onClick={() => setSourceTab("all")}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  sourceTab === "all"
                    ? "bg-[#FF6900] text-white shadow-sm font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                All Tickets ({stats?.total || 0})
              </button>
              <button
                onClick={() => setSourceTab("owner_app")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  sourceTab === "owner_app"
                    ? "bg-[#FF6900] text-white shadow-sm font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                Owner App ({stats?.ownerAppCount || 0})
              </button>
              <button
                onClick={() => setSourceTab("villa_web")}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  sourceTab === "villa_web"
                    ? "bg-[#FF6900] text-white shadow-sm font-bold"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Globe className="w-3.5 h-3.5" />
                Villa Web ({stats?.websiteCount || 0})
              </button>
            </div>

            {/* Status & Priority Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium outline-none cursor-pointer shadow-sm"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium outline-none cursor-pointer shadow-sm"
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium outline-none cursor-pointer shadow-sm"
              >
                <option value="all">All Categories</option>
                <option value="payment">Payment & Payouts</option>
                <option value="booking">Bookings</option>
                <option value="property">Property Listing</option>
                <option value="cancellation">Cancellation & Refunds</option>
                <option value="account">Account & KYC</option>
                <option value="technical">Technical Glitch</option>
                <option value="general">General Inquiry</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
            <Input
              placeholder="Search by Ticket ID, Subject, Name, Email, or Issue description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 rounded-xl h-10 shadow-sm"
            />
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white dark:bg-[#121215] rounded-2xl border border-neutral-200 dark:border-neutral-800/80 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 dark:bg-neutral-900/60 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Origin / Channel</th>
                  <th className="py-3.5 px-4">Sender Details</th>
                  <th className="py-3.5 px-4">Subject & Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Created</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#FF6900] mx-auto mb-2" />
                      Loading support tickets...
                    </td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-neutral-400">
                      <LifeBuoy className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                      No matching support tickets found.
                    </td>
                  </tr>
                ) : (
                  tickets.map((ticket) => {
                    const senderName =
                      ticket.owner?.name ||
                      ticket.user?.name ||
                      ticket.guestDetails?.name ||
                      "Anonymous User";
                    const senderEmail =
                      ticket.owner?.email ||
                      ticket.user?.email ||
                      ticket.guestDetails?.email ||
                      "N/A";
                    const senderPhone =
                      ticket.owner?.phone ||
                      ticket.user?.phone ||
                      ticket.guestDetails?.phone ||
                      null;

                    return (
                      <tr
                        key={ticket._id}
                        className="hover:bg-neutral-50/60 transition-colors"
                      >
                        {/* Ticket ID */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-neutral-900 text-xs">
                            {ticket.ticketId || ticket._id.slice(-8).toUpperCase()}
                          </div>
                          {ticket.replies?.length > 0 && (
                            <div className="text-[10px] text-[#FF6900] font-semibold flex items-center gap-1 mt-0.5">
                              <MessageSquare className="w-2.5 h-2.5" />
                              {ticket.replies.length} repl{ticket.replies.length > 1 ? "ies" : "y"}
                            </div>
                          )}
                        </td>

                        {/* Origin Channel */}
                        <td className="py-3.5 px-4">
                          {getSourceBadge(ticket.source)}
                        </td>

                        {/* Sender */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-neutral-900">{senderName}</div>
                          <div className="text-neutral-400 text-[11px]">{senderEmail}</div>
                          {senderPhone && senderPhone !== "N/A" && (
                            <div className="text-neutral-500 text-[11px] font-mono">{senderPhone}</div>
                          )}
                        </td>

                        {/* Subject & Category */}
                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="font-bold text-neutral-900 text-xs truncate">
                            {ticket.subject}
                          </div>
                          <div className="inline-flex items-center gap-1 text-[10px] uppercase font-semibold text-neutral-500 mt-0.5">
                            <Tag className="w-2.5 h-2.5" />
                            {ticket.category}
                          </div>
                        </td>

                        {/* Priority */}
                        <td className="py-3.5 px-4">
                          {getPriorityBadge(ticket.priority)}
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          {getStatusBadge(ticket.status)}
                        </td>

                        {/* Created At */}
                        <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                          {new Date(ticket.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                          })}
                          <div className="text-[10px] text-neutral-400">
                            {new Date(ticket.createdAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </td>

                        {/* Action */}
                        <td className="py-3.5 px-4 text-right">
                          <Button
                            onClick={() => openTicketDrawer(ticket)}
                            className="bg-neutral-900 hover:bg-[#FF6900] text-white text-xs font-semibold px-3 py-1.5 h-8 rounded-xl shadow-sm transition-all cursor-pointer"
                          >
                            Review & Reply
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* TICKET DETAIL & REPLY DIALOG */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-2xl bg-white dark:bg-[#0E0E11] border border-neutral-200 dark:border-neutral-800 max-h-[90vh] flex flex-col p-0 overflow-hidden text-neutral-900 dark:text-neutral-100">
            {selectedTicket && (
              <>
                <DialogHeader className="p-5 pb-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-base font-bold text-neutral-900 dark:text-white">
                        Ticket #{selectedTicket.ticketId || selectedTicket._id}
                      </DialogTitle>
                      {getSourceBadge(selectedTicket.source)}
                    </div>
                    <div>{getStatusBadge(selectedTicket.status)}</div>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1">
                    {selectedTicket.subject}
                  </p>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
                  {/* Sender Profile Bar */}
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center font-black text-[#FF6900] text-sm">
                        {(
                          selectedTicket.owner?.name?.[0] ||
                          selectedTicket.user?.name?.[0] ||
                          selectedTicket.guestDetails?.name?.[0] ||
                          "U"
                        ).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-bold text-neutral-900 dark:text-white text-sm flex items-center gap-2">
                          {selectedTicket.owner?.name ||
                            selectedTicket.user?.name ||
                            selectedTicket.guestDetails?.name ||
                            "Guest User"}
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                            {selectedTicket.senderType === "host" ? "Host / Owner" : "Customer"}
                          </span>
                        </div>
                        <div className="text-neutral-500 dark:text-neutral-400 text-[11px] flex items-center gap-3 mt-0.5">
                          <span>{selectedTicket.owner?.email || selectedTicket.user?.email || selectedTicket.guestDetails?.email || "No Email"}</span>
                          {(selectedTicket.owner?.phone || selectedTicket.guestDetails?.phone) && (
                            <span className="font-mono">{selectedTicket.owner?.phone || selectedTicket.guestDetails?.phone}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedTicket.owner?.email && (
                        <a
                          href={`mailto:${selectedTicket.owner.email}?subject=Regarding Ticket #${selectedTicket.ticketId}`}
                          className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-[#FF6900] text-neutral-700 dark:text-neutral-300 hover:text-[#FF6900] font-semibold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <Mail className="w-3 h-3" />
                          Email
                        </a>
                      )}
                      {(selectedTicket.owner?.phone || selectedTicket.guestDetails?.phone) && (
                        <a
                          href={`tel:${selectedTicket.owner?.phone || selectedTicket.guestDetails?.phone}`}
                          className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-[#FF6900] text-neutral-700 dark:text-neutral-300 hover:text-[#FF6900] font-semibold text-[11px] flex items-center gap-1 transition-all"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Original Description */}
                  <div className="space-y-1.5">
                    <span className="font-bold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider text-[10px] block">
                      Issue Description
                    </span>
                    <div className="p-3.5 rounded-xl bg-white dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 leading-relaxed text-xs">
                      {selectedTicket.description}
                    </div>
                  </div>

                  {/* Status & Resolution Controls */}
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 text-[11px] block">
                      Quick Status Lifecycle
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus("open")}
                        disabled={updatingStatus || selectedTicket.status === "open"}
                        className={`text-xs h-7 px-3 rounded-lg cursor-pointer ${
                          selectedTicket.status === "open"
                            ? "bg-amber-600 text-white font-bold"
                            : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                        }`}
                      >
                        Open
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus("in_progress")}
                        disabled={updatingStatus || selectedTicket.status === "in_progress"}
                        className={`text-xs h-7 px-3 rounded-lg cursor-pointer ${
                          selectedTicket.status === "in_progress"
                            ? "bg-blue-600 text-white font-bold"
                            : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                        }`}
                      >
                        In Progress
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus("resolved")}
                        disabled={updatingStatus || selectedTicket.status === "resolved"}
                        className={`text-xs h-7 px-3 rounded-lg cursor-pointer ${
                          selectedTicket.status === "resolved"
                            ? "bg-emerald-600 text-white font-bold"
                            : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                        }`}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Mark Resolved
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleUpdateStatus("closed")}
                        disabled={updatingStatus || selectedTicket.status === "closed"}
                        className={`text-xs h-7 px-3 rounded-lg cursor-pointer ${
                          selectedTicket.status === "closed"
                            ? "bg-neutral-800 text-white font-bold"
                            : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                        }`}
                      >
                        Close Ticket
                      </Button>
                    </div>

                    {/* Resolution Remark Input */}
                    <div className="pt-1">
                      <Input
                        placeholder="Internal resolution note / audit remark..."
                        value={resolutionNotes}
                        onChange={(e) => setResolutionNotes(e.target.value)}
                        className="text-xs bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 h-8"
                      />
                    </div>
                  </div>

                  {/* Conversation Thread */}
                  <div className="space-y-2 pt-2">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider text-[10px] block">
                      Conversation Thread ({selectedTicket.replies?.length || 0})
                    </span>

                    {(!selectedTicket.replies || selectedTicket.replies.length === 0) ? (
                      <div className="p-4 text-center text-neutral-400 dark:text-neutral-500 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
                        No responses logged yet. Be the first to answer this inquiry below.
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {selectedTicket.replies.map((reply, idx) => (
                          <div
                            key={idx}
                            className={`p-3 rounded-xl border text-xs leading-relaxed ${
                              reply.senderRole === "admin"
                                ? "bg-[#FFF9F5] dark:bg-orange-950/20 border-[#FF6900]/20 dark:border-[#FF6900]/30 ml-6"
                                : "bg-neutral-50 dark:bg-neutral-900/60 border-neutral-200 dark:border-neutral-800 mr-6"
                            }`}
                          >
                            <div className="flex items-center justify-between font-semibold text-[11px] mb-1">
                              <span className={reply.senderRole === "admin" ? "text-[#FF6900] font-black" : "text-neutral-900 dark:text-white"}>
                                {reply.senderName || (reply.senderRole === "admin" ? "Support Admin" : "User")}
                              </span>
                              <span className="text-neutral-400 dark:text-neutral-500 font-normal text-[10px]">
                                {new Date(reply.repliedAt).toLocaleString("en-IN", {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                              </span>
                            </div>
                            <p className="text-neutral-800 dark:text-neutral-200">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reply Composer Bar */}
                <form
                  onSubmit={handleSendReply}
                  className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#0E0E11] flex items-center gap-2"
                >
                  <Textarea
                    placeholder="Type your official reply to host / guest..."
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    className="min-h-[44px] max-h-[100px] text-xs resize-none bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500"
                    rows={1}
                    required
                  />
                  <Button
                    type="submit"
                    disabled={submittingReply || !replyMessage.trim()}
                    className="bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold h-11 px-4 rounded-xl cursor-pointer disabled:opacity-40 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5 mr-1" />
                    {submittingReply ? "Sending..." : "Reply"}
                  </Button>
                </form>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
