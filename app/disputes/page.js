"use client";

import React, { useState, useEffect } from "react";
import {
  Scale,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MessageSquare,
  FileText,
  DollarSign,
  User,
  Building,
  RefreshCw,
  Plus,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
  X,
  Radio,
} from "lucide-react";
import {
  getAllDisputes,
  getDisputeById,
  updateDisputeStatus,
  addAdminNote,
  resolveDispute,
  createDispute,
} from "@/lib/API/Dispute/Dispute";
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
import { subscribeAdminEvents } from "@/lib/Socket/socketClient";

export default function DisputesPage() {
  const [loading, setLoading] = useState(true);
  const [disputes, setDisputes] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");

  // Drawer / Detail Modal
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  // Resolution Form
  const [resolutionAction, setResolutionAction] = useState("REFUNDED");
  const [amountRefunded, setAmountRefunded] = useState("");
  const [amountPaidToOwner, setAmountPaidToOwner] = useState("");
  const [resolutionSummary, setResolutionSummary] = useState("");
  const [resolving, setResolving] = useState(false);

  // New Note State
  const [newNote, setNewNote] = useState("");
  const [addingNote, setAddingNote] = useState(false);

  // Status Change
  const [newStatus, setNewStatus] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Create Dispute Modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newDisputeForm, setNewDisputeForm] = useState({
    bookingId: "",
    raisedBy: "customer",
    raisedByName: "",
    raisedByEmail: "",
    raisedByPhone: "",
    title: "",
    category: "cleanliness",
    description: "",
    disputedAmount: "",
    priority: "MEDIUM",
  });
  const [creating, setCreating] = useState(false);

  const { addToast } = useToast();

  const loadDisputes = async () => {
    try {
      setLoading(true);
      const res = await getAllDisputes({
        search,
        status: statusFilter,
        priority: priorityFilter,
        limit: 50,
      });

      if (res?.success) {
        setDisputes(res.data || []);
        setStats(res.stats || null);
      }
    } catch (err) {
      console.error("Failed to fetch disputes:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisputes();

    const unsubscribe = subscribeAdminEvents(({ event }) => {
      if (
        event === "admin_new_dispute" ||
        event === "admin_dispute_resolved" ||
        event === "admin_dispute_status_changed"
      ) {
        loadDisputes();
      }
    });

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, [search, statusFilter, priorityFilter]);

  const openDisputeDetails = async (dispute) => {
    setSelectedDispute(dispute);
    setDetailModalOpen(true);
    setResolutionAction("REFUNDED");
    setAmountRefunded((dispute.disputedAmount || 0).toString());
    setAmountPaidToOwner("0");
    setResolutionSummary("");
    setNewNote("");
    setNewStatus(dispute.status);

    // Fetch fresh detailed record
    try {
      setDetailLoading(true);
      const res = await getDisputeById(dispute._id);
      if (res?.success && res.data) {
        setSelectedDispute(res.data);
        setNewStatus(res.data.status);
      }
    } catch (err) {
      console.error("Failed to load dispute details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedDispute) return;

    try {
      setAddingNote(true);
      const res = await addAdminNote(selectedDispute._id, {
        note: newNote.trim(),
        isInternal: true,
      });

      if (res?.success) {
        addToast({
          title: "Note Added",
          description: "Internal administrative note recorded.",
          variant: "success",
        });
        setNewNote("");
        setSelectedDispute(res.data);
        loadDisputes();
      }
    } catch (err) {
      addToast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setAddingNote(false);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selectedDispute || status === selectedDispute.status) return;

    try {
      setUpdatingStatus(true);
      const res = await updateDisputeStatus(selectedDispute._id, {
        status,
        note: `Status updated to ${status} by administrator.`,
      });

      if (res?.success) {
        addToast({
          title: "Status Updated",
          description: `Dispute is now ${status}.`,
          variant: "success",
        });
        setSelectedDispute(res.data);
        setNewStatus(status);
        loadDisputes();
      }
    } catch (err) {
      addToast({
        title: "Status Update Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleResolveDispute = async (e) => {
    e.preventDefault();
    if (!selectedDispute) return;

    try {
      setResolving(true);
      const res = await resolveDispute(selectedDispute._id, {
        action: resolutionAction,
        amountRefunded: Number(amountRefunded) || 0,
        amountPaidToOwner: Number(amountPaidToOwner) || 0,
        summary: resolutionSummary.trim() || `Resolved as ${resolutionAction}`,
      });

      if (res?.success) {
        addToast({
          title: "Dispute Resolved",
          description: `Case ${selectedDispute.disputeId} closed as ${resolutionAction}.`,
          variant: "success",
        });
        setSelectedDispute(res.data);
        loadDisputes();
      } else {
        addToast({
          title: "Resolution Failed",
          description: res?.message || "Failed to resolve dispute.",
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
      setResolving(false);
    }
  };

  const handleCreateDispute = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      const res = await createDispute(newDisputeForm);
      if (res?.success) {
        addToast({
          title: "Dispute Created",
          description: `Case ${res.data?.disputeId} logged successfully.`,
          variant: "success",
        });
        setCreateModalOpen(false);
        setNewDisputeForm({
          bookingId: "",
          raisedBy: "customer",
          raisedByName: "",
          raisedByEmail: "",
          raisedByPhone: "",
          title: "",
          category: "cleanliness",
          description: "",
          disputedAmount: "",
          priority: "MEDIUM",
        });
        loadDisputes();
      } else {
        addToast({
          title: "Creation Failed",
          description: res?.message || "Could not log dispute.",
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
      setCreating(false);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <ScrollArea className="bg-[#FAFAFA] h-[calc(100vh-64px)] pb-16">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">
                Dispute Resolution Center
              </h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 font-bold border border-rose-200">
                Arbitration Console
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">
              Arbitrate guest & host claims, inspect photographic evidence, and execute 1-click settlements.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-[#FF6900] hover:bg-[#E05D00] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm shadow-[#FF6900]/25 transition-all"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Log Incident / Claim
            </Button>
            <button
              onClick={loadDisputes}
              className="p-2 rounded-xl border border-neutral-200 bg-white hover:border-[#FF6900]/40 text-neutral-600 hover:text-[#FF6900] shadow-sm transition-all"
              title="Refresh Disputes"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#FF6900]" : ""}`} />
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Total Disputes
            </span>
            <span className="text-2xl font-black text-neutral-900 block">
              {stats?.totalDisputes || 0}
            </span>
            <span className="text-[11px] text-neutral-400 mt-1 block">Lifetime cases</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Open & New
            </span>
            <span className="text-2xl font-black text-amber-500 block">
              {stats?.openCount || 0}
            </span>
            <span className="text-[11px] text-amber-600 mt-1 block font-medium">
              Awaiting review
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Under Investigation
            </span>
            <span className="text-2xl font-black text-blue-600 block">
              {stats?.investigatingCount || 0}
            </span>
            <span className="text-[11px] text-blue-600 mt-1 block font-medium">
              Evidence in review
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Urgent Escalations
            </span>
            <span className="text-2xl font-black text-rose-600 block">
              {stats?.urgentCount || 0}
            </span>
            <span className="text-[11px] text-rose-600 mt-1 block font-medium flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Immediate action
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-200 shadow-sm">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block mb-1">
              Disputed Volume
            </span>
            <span className="text-2xl font-black text-[#FF6900] block truncate">
              {formatCurrency(stats?.totalDisputedAmount)}
            </span>
            <span className="text-[11px] text-neutral-400 mt-1 block">Value under arbitration</span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-neutral-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            <Input
              placeholder="Search by Dispute ID, User, or Property..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-neutral-50 border-neutral-200 text-xs rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-neutral-500 font-medium">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700 font-medium outline-none cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
                <option value="REJECTED">Dismissed</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-neutral-500 font-medium">Priority:</span>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs text-neutral-700 font-medium outline-none cursor-pointer"
              >
                <option value="ALL">All Priorities</option>
                <option value="URGENT">Urgent</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Dispute ID & Case</th>
                  <th className="py-3.5 px-4">Raised By</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Claimed Amount</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Arbitration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#FF6900] mx-auto mb-2" />
                      Loading dispute claims...
                    </td>
                  </tr>
                ) : disputes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-neutral-400">
                      No dispute claims found matching your filters.
                    </td>
                  </tr>
                ) : (
                  disputes.map((dsp) => (
                    <tr key={dsp._id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#FF6900] text-xs">
                          {dsp.disputeId}
                        </div>
                        <div className="font-semibold text-neutral-900 text-sm mt-0.5 line-clamp-1">
                          {dsp.title}
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {dsp.propertyName || "Property"} • Ref: {dsp.bookingId ? dsp.bookingId.toString().slice(-6) : "N/A"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900">{dsp.raisedByName}</div>
                        <div className="text-[11px] text-neutral-500 capitalize">
                          Role: {dsp.raisedBy}
                        </div>
                        <div className="text-[10px] text-neutral-400">{dsp.raisedByEmail}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="capitalize font-medium text-neutral-700">
                          {dsp.category?.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-black text-sm text-neutral-900">
                        {formatCurrency(dsp.disputedAmount)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            dsp.priority === "URGENT"
                              ? "bg-rose-100 text-rose-700 border border-rose-300 animate-pulse"
                              : dsp.priority === "HIGH"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {dsp.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            dsp.status === "OPEN"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : dsp.status === "INVESTIGATING"
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : dsp.status === "ESCALATED"
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {dsp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          onClick={() => openDisputeDetails(dsp)}
                          className="bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold px-3 py-1.5 h-8 rounded-xl transition-all cursor-pointer"
                        >
                          Review & Resolve
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* DISPUTE INVESTIGATION & RESOLUTION MODAL */}
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-white border border-neutral-200">
            <DialogHeader className="border-b border-neutral-100 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-[#FF6900]">
                    {selectedDispute?.disputeId}
                  </span>
                  <DialogTitle className="text-lg font-bold text-neutral-900 mt-0.5">
                    {selectedDispute?.title}
                  </DialogTitle>
                </div>
                {selectedDispute && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      selectedDispute.status === "OPEN"
                        ? "bg-amber-100 text-amber-800"
                        : selectedDispute.status === "INVESTIGATING"
                        ? "bg-blue-100 text-blue-800"
                        : selectedDispute.status === "ESCALATED"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {selectedDispute.status}
                  </span>
                )}
              </div>
            </DialogHeader>

            {selectedDispute && (
              <div className="space-y-5 py-2 text-xs">
                {/* Meta Overview Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Disputed Value
                    </span>
                    <span className="text-base font-black text-[#FF6900] block mt-0.5">
                      {formatCurrency(selectedDispute.disputedAmount)}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Priority Level
                    </span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1">
                      {selectedDispute.priority}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Raised By
                    </span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1 capitalize truncate">
                      {selectedDispute.raisedByName} ({selectedDispute.raisedBy})
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                    <span className="text-[10px] uppercase font-semibold text-neutral-400 block">
                      Category
                    </span>
                    <span className="text-xs font-bold text-neutral-900 block mt-1 capitalize truncate">
                      {selectedDispute.category?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {/* Complaint Description */}
                <div className="p-4 rounded-xl bg-neutral-50/80 border border-neutral-200 space-y-1">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">
                    Claim Description & Details
                  </span>
                  <p className="text-neutral-800 text-xs leading-relaxed whitespace-pre-wrap">
                    {selectedDispute.description}
                  </p>
                </div>

                {/* Evidence Gallery if present */}
                {selectedDispute.evidence && selectedDispute.evidence.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">
                      Attached Evidence Gallery ({selectedDispute.evidence.length})
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {selectedDispute.evidence.map((ev, idx) => (
                        <a
                          key={idx}
                          href={ev.url}
                          target="_blank"
                          rel="noreferrer"
                          className="group relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 aspect-video block"
                        >
                          <img
                            src={ev.url}
                            alt={ev.caption || "Evidence"}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-semibold">
                            Inspect
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Quick Updater */}
                {!["RESOLVED_REFUND_CUSTOMER", "RESOLVED_PAYOUT_OWNER", "RESOLVED_SPLIT", "DISMISSED"].includes(selectedDispute.status) && (
                    <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between">
                      <span className="font-semibold text-neutral-700">
                        Investigation Status:
                      </span>
                      <div className="flex gap-2">
                        {["OPEN", "UNDER_INVESTIGATION", "AWAITING_EVIDENCE"].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(st)}
                            disabled={updatingStatus || selectedDispute.status === st}
                            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                              selectedDispute.status === st
                                ? "bg-neutral-900 text-white"
                                : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-400"
                            }`}
                          >
                            {st.replace(/_/g, " ")}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Internal Admin Notes */}
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">
                    Internal Operator Notes & Audit Trail
                  </span>
                  <div className="max-h-36 overflow-y-auto space-y-2 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                    {selectedDispute.adminNotes?.length === 0 ? (
                      <p className="text-neutral-400 italic">No notes added yet.</p>
                    ) : (
                      selectedDispute.adminNotes?.map((n, i) => (
                        <div key={i} className="text-neutral-700 border-b border-neutral-200/60 pb-1.5 last:border-0">
                          <p className="font-medium">{n.note}</p>
                          <span className="text-[10px] text-neutral-400">
                            {n.addedBy || n.authorName || "Administrator"} •{" "}
                            {new Date(n.timestamp || n.createdAt || Date.now()).toLocaleString("en-IN")}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <Input
                      placeholder="Add an internal note or investigator observation..."
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      className="bg-white text-xs"
                    />
                    <Button
                      type="submit"
                      disabled={addingNote || !newNote.trim()}
                      className="bg-neutral-900 text-white text-xs font-semibold px-4"
                    >
                      {addingNote ? "Adding..." : "Add Note"}
                    </Button>
                  </form>
                </div>

                {/* 1-Click Resolution Form */}
                {!["RESOLVED_REFUND_CUSTOMER", "RESOLVED_PAYOUT_OWNER", "RESOLVED_SPLIT", "DISMISSED"].includes(selectedDispute.status) ? (
                  <form
                    onSubmit={handleResolveDispute}
                    className="p-4 rounded-xl border-2 border-[#FF6900]/30 bg-[#FFF1E6]/20 space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#FF6900]" />
                      <span className="font-bold text-neutral-900 text-sm">
                        Execute 1-Click Resolution
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { id: "RESOLVED_REFUND_CUSTOMER", label: "Full Refund Guest" },
                        { id: "RESOLVED_PAYOUT_OWNER", label: "Disburse to Host" },
                        { id: "RESOLVED_SPLIT", label: "Split Settlement" },
                        { id: "DISMISSED", label: "Dismiss Claim" },
                      ].map((act) => (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => {
                            setResolutionAction(act.id);
                            if (act.id === "RESOLVED_REFUND_CUSTOMER") {
                              setAmountRefunded(selectedDispute.disputedAmount.toString());
                              setAmountPaidToOwner("0");
                            } else if (act.id === "RESOLVED_PAYOUT_OWNER") {
                              setAmountRefunded("0");
                              setAmountPaidToOwner(selectedDispute.disputedAmount.toString());
                            } else if (act.id === "DISMISSED") {
                              setAmountRefunded("0");
                              setAmountPaidToOwner("0");
                            }
                          }}
                          className={`p-2.5 rounded-xl font-bold text-center text-xs transition-all cursor-pointer ${
                            resolutionAction === act.id
                              ? "bg-[#FF6900] text-white shadow-sm"
                              : "bg-white border border-neutral-200 text-neutral-700 hover:border-[#FF6900]/40"
                          }`}
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>

                    {resolutionAction === "RESOLVED_SPLIT" && (
                      <div className="grid grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">
                            Refund to Guest (₹)
                          </label>
                          <Input
                            type="number"
                            value={amountRefunded}
                            onChange={(e) => setAmountRefunded(e.target.value)}
                            placeholder="Amount"
                            className="bg-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="font-semibold text-neutral-700 block mb-1">
                            Disburse to Host (₹)
                          </label>
                          <Input
                            type="number"
                            value={amountPaidToOwner}
                            onChange={(e) => setAmountPaidToOwner(e.target.value)}
                            placeholder="Amount"
                            className="bg-white"
                            required
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="font-semibold text-neutral-700 block mb-1">
                        Arbitration Ruling & Summary (Visible to Parties)
                      </label>
                      <Textarea
                        value={resolutionSummary}
                        onChange={(e) => setResolutionSummary(e.target.value)}
                        placeholder="Detail the basis for this resolution decision..."
                        className="bg-white text-xs min-h-[60px]"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={resolving}
                      className="w-full bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold h-10 shadow-sm"
                    >
                      {resolving ? "Executing Ruling..." : `Confirm Settlement Ruling [${resolutionAction}]`}
                    </Button>
                  </form>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <span className="font-bold text-emerald-800 text-xs flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Resolution Applied: {selectedDispute.resolution?.action}
                    </span>
                    <p className="text-emerald-700 text-xs">
                      {selectedDispute.resolution?.summary}
                    </p>
                    <div className="text-[10px] text-emerald-600 font-mono mt-1">
                      Refunded: {formatCurrency(selectedDispute.resolution?.amountRefunded)} | Host
                      Paid: {formatCurrency(selectedDispute.resolution?.amountPaidToOwner)}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* CREATE DISPUTE MODAL */}
        <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
          <DialogContent className="sm:max-w-lg bg-white border border-neutral-200">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#FF6900]" />
                Log Dispute / Platform Incident
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreateDispute} className="space-y-3.5 py-2 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Booking ID / MongoDB ObjectId *
                </label>
                <Input
                  value={newDisputeForm.bookingId}
                  onChange={(e) =>
                    setNewDisputeForm({ ...newDisputeForm, bookingId: e.target.value })
                  }
                  placeholder="Paste Booking ObjectId"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Raised By Role
                  </label>
                  <select
                    value={newDisputeForm.raisedBy}
                    onChange={(e) =>
                      setNewDisputeForm({ ...newDisputeForm, raisedBy: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="customer">Customer / Guest</option>
                    <option value="owner">Host / Property Owner</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Priority</label>
                  <select
                    value={newDisputeForm.priority}
                    onChange={(e) =>
                      setNewDisputeForm({ ...newDisputeForm, priority: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Complainant Name *
                  </label>
                  <Input
                    value={newDisputeForm.raisedByName}
                    onChange={(e) =>
                      setNewDisputeForm({ ...newDisputeForm, raisedByName: e.target.value })
                    }
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Complainant Email *
                  </label>
                  <Input
                    type="email"
                    value={newDisputeForm.raisedByEmail}
                    onChange={(e) =>
                      setNewDisputeForm({ ...newDisputeForm, raisedByEmail: e.target.value })
                    }
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">Category</label>
                  <select
                    value={newDisputeForm.category}
                    onChange={(e) =>
                      setNewDisputeForm({ ...newDisputeForm, category: e.target.value })
                    }
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="cleanliness">Cleanliness</option>
                    <option value="amenities_missing">Amenities Missing</option>
                    <option value="cancellation_refund">Cancellation / Refund</option>
                    <option value="property_damage">Property Damage</option>
                    <option value="host_unreachable">Host Unreachable</option>
                    <option value="guest_misconduct">Guest Misconduct</option>
                    <option value="billing_issue">Billing Issue</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-neutral-700 block mb-1">
                    Disputed Amount (₹)
                  </label>
                  <Input
                    type="number"
                    value={newDisputeForm.disputedAmount}
                    onChange={(e) =>
                      setNewDisputeForm({ ...newDisputeForm, disputedAmount: e.target.value })
                    }
                    placeholder="Amount in INR"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Issue Title *</label>
                <Input
                  value={newDisputeForm.title}
                  onChange={(e) =>
                    setNewDisputeForm({ ...newDisputeForm, title: e.target.value })
                  }
                  placeholder="e.g. Swimming pool uncleaned on arrival"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Incident Description *
                </label>
                <Textarea
                  value={newDisputeForm.description}
                  onChange={(e) =>
                    setNewDisputeForm({ ...newDisputeForm, description: e.target.value })
                  }
                  placeholder="Provide complete breakdown of the situation..."
                  rows={3}
                  required
                />
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateModalOpen(false)}
                  disabled={creating}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={creating}
                  className="bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold"
                >
                  {creating ? "Submitting..." : "Log Dispute"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
