"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  Users,
  Search,
  RefreshCw,
  Copy,
  Building2,
  Home,
  Hotel,
  Tent,
  CheckCircle2,
  Eye,
  Megaphone,
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  X,
  Radio,
  ExternalLink,
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/Bookingcomponents/StatusBadge";
import {
  GetOfflineBookingsAdmin,
  GetOfflinePromotionalUsers,
} from "@/lib/API/Booking/Booking";

const propertyIcons = {
  Villa: <Home className="h-4 w-4" />,
  Hotels: <Hotel className="h-4 w-4" />,
  Cottages: <Building2 className="h-4 w-4" />,
  Camping: <Tent className="h-4 w-4" />,
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
};

export default function OfflineBookingsPage() {
  const [activeTab, setActiveTab] = useState("bookings"); // "bookings" | "audience"
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
  const [promotionalAudience, setPromotionalAudience] = useState([]);
  const [stats, setStats] = useState({
    totalOfflineBookings: 0,
    uniqueAudienceCount: 0,
    totalDirectAmount: 0,
    fullyPaidCount: 0,
    partiallyPaidCount: 0,
    unpaidCount: 0,
  });

  const [search, setSearch] = useState("");
  const [propertyTypeFilter, setPropertyTypeFilter] = useState("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState("");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [bookingsRes, audienceRes] = await Promise.all([
        GetOfflineBookingsAdmin({
          propertyType: propertyTypeFilter !== "all" ? propertyTypeFilter : undefined,
          paymentStatus: paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
          search: search || undefined,
        }),
        GetOfflinePromotionalUsers(),
      ]);

      if (bookingsRes?.success) {
        setBookings(bookingsRes.data || []);
        if (bookingsRes.stats) {
          setStats((prev) => ({
            ...prev,
            ...bookingsRes.stats,
          }));
        }
      }

      if (audienceRes?.success) {
        setPromotionalAudience(audienceRes.data || []);
        setStats((prev) => ({
          ...prev,
          uniqueAudienceCount: audienceRes.totalCount || audienceRes.data?.length || 0,
        }));
      }
    } catch (err) {
      console.warn("Failed to load offline bookings:", err?.message || err);
    } finally {
      setLoading(false);
    }
  }, [propertyTypeFilter, paymentStatusFilter, statusFilter, search]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filtered lists for client-side search reactivity
  const filteredBookings = useMemo(() => {
    if (!search.trim()) return bookings;
    const q = search.toLowerCase().trim();
    return bookings.filter((b) => {
      const guest = b.customerDetails || {};
      const fullName = `${guest.firstName || ""} ${guest.lastName || ""}`.toLowerCase();
      const mobile = (guest.mobile || "").toLowerCase();
      const email = (guest.email || "").toLowerCase();
      const city = (guest.city || "").toLowerCase();
      const propertyName = (b.propertySnapshot?.name || "").toLowerCase();
      const bookingId = (b._id || "").toLowerCase();
      return (
        fullName.includes(q) ||
        mobile.includes(q) ||
        email.includes(q) ||
        city.includes(q) ||
        propertyName.includes(q) ||
        bookingId.includes(q)
      );
    });
  }, [bookings, search]);

  const filteredAudience = useMemo(() => {
    if (!search.trim()) return promotionalAudience;
    const q = search.toLowerCase().trim();
    return promotionalAudience.filter((user) => {
      const fullName = `${user.firstName || ""} ${user.lastName || ""}`.toLowerCase();
      const mobile = (user.mobile || "").toLowerCase();
      const email = (user.email || "").toLowerCase();
      const city = (user.city || "").toLowerCase();
      return (
        fullName.includes(q) ||
        mobile.includes(q) ||
        email.includes(q) ||
        city.includes(q)
      );
    });
  }, [promotionalAudience, search]);

  const handleResetFilters = () => {
    setSearch("");
    setPropertyTypeFilter("all");
    setPaymentStatusFilter("all");
    setStatusFilter("all");
  };

  const handleCopyPhoneNumbers = () => {
    const numbers = (activeTab === "bookings" ? filteredBookings : filteredAudience)
      .map((item) => (activeTab === "bookings" ? item.customerDetails?.mobile : item.mobile))
      .filter(Boolean);
    const unique = Array.from(new Set(numbers));
    if (unique.length > 0) {
      navigator.clipboard.writeText(unique.join(", "));
      setCopiedNotification(`Copied ${unique.length} phone numbers to clipboard!`);
      setTimeout(() => setCopiedNotification(""), 3500);
    }
  };

  const handleExportCSV = () => {
    const list = activeTab === "bookings" ? filteredBookings : filteredAudience;
    if (list.length === 0) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === "bookings") {
      csvContent += "Booking ID,Guest Name,Mobile,Email,City,Property,Property Type,Check-In,Check-Out,Total Amount,Payment Status,Status\n";
      list.forEach((b) => {
        const guest = b.customerDetails || {};
        const row = [
          b._id,
          `"${guest.firstName || ""} ${guest.lastName || ""}"`,
          `"${guest.mobile || ""}"`,
          `"${guest.email || ""}"`,
          `"${guest.city || ""}"`,
          `"${b.propertySnapshot?.name || "Direct Host"}"`,
          b.propertyType || "Villa",
          b.checkIn ? new Date(b.checkIn).toLocaleDateString("en-IN") : "",
          b.checkOut ? new Date(b.checkOut).toLocaleDateString("en-IN") : "",
          b.pricing?.totalAmount || 0,
          b.paymentStatus || "fully_paid",
          b.status || "confirmed",
        ].join(",");
        csvContent += row + "\n";
      });
    } else {
      csvContent += "First Name,Last Name,Mobile,Email,City,Total Visits,Last Booking Date\n";
      list.forEach((u) => {
        const row = [
          `"${u.firstName || ""}"`,
          `"${u.lastName || ""}"`,
          `"${u.mobile || ""}"`,
          `"${u.email || ""}"`,
          `"${u.city || ""}"`,
          u.bookingCount || 1,
          u.lastBookingDate ? new Date(u.lastBookingDate).toLocaleDateString("en-IN") : "",
        ].join(",");
        csvContent += row + "\n";
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `offline_${activeTab}_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenBookingDetails = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <ScrollArea className="bg-[#FAFAFA] dark:bg-[#09090B] h-[calc(100vh-64px)] pb-4 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Executive Header Banner matching Dashboard Command Console */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200/80 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
                Offline Bookings
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-[#FF6900] text-xs font-semibold">
                <Megaphone className="w-3 h-3 text-[#FF6900]" />
                Promotional Engine
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
                <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                Live Host Sync
              </div>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
              Direct walk-in bookings registered by property owners. Contacts are gathered here for marketing outreach (SMS, WhatsApp, and promotional discount campaigns) without affecting platform online revenue.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={handleCopyPhoneNumbers}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#FF6900]/40 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-2 shadow-sm hover:text-[#FF6900] transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              Copy Contacts ({promotionalAudience.length})
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#FF6900]/40 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-2 shadow-sm hover:text-[#FF6900] transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              Export CSV
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-[#FF6900]/40 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-2 shadow-sm hover:text-[#FF6900] transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#FF6900]" : ""}`} />
              {loading ? "Syncing..." : "Sync"}
            </button>
          </div>
        </div>

        {copiedNotification && (
          <div className="px-3.5 py-2.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            {copiedNotification}
          </div>
        )}

        {/* Executive KPI Deck Matching Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Offline Bookings Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Total Offline Stays
              </span>
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <CalendarDays className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
              {stats.totalOfflineBookings}{" "}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">reservations</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-purple-600 dark:text-purple-400 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                Direct Host Walk-ins
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          </div>

          {/* 2. Promotional Audience Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Promotional Audience
              </span>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
              {stats.uniqueAudienceCount}{" "}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">verified contacts</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center">
                <Sparkles className="w-3.5 h-3.5 mr-0.5" />
                100% Marketing Targetable
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-400" />
          </div>

          {/* 3. Host Direct Volume Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Direct Host Volume
              </span>
              <div className="p-2 rounded-xl bg-[#FFF1E6] dark:bg-orange-950/50 text-[#FF6900] group-hover:scale-110 transition-transform">
                <IndianRupee className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
              {formatCurrency(stats.totalDirectAmount)}
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-amber-600 dark:text-amber-400">
                Isolated from Online Revenue
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF6900] to-amber-400" />
          </div>

          {/* 4. Payment Settlement Card */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800/80 p-5 shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Host Direct Settlement
              </span>
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight mb-1">
              {stats.fullyPaidCount}{" "}
              <span className="text-xs font-normal text-neutral-500 dark:text-neutral-400">fully paid</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                {stats.partiallyPaidCount} partial • {stats.unpaidCount} unpaid
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
          </div>
        </div>

        {/* Business Rule / Revenue Isolation Banner matching BusinessFinancialTally */}
        <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Offline Direct Reservations & Strict Revenue Isolation
                </h4>
                <Badge variant="outline" className="text-[10px] bg-white dark:bg-neutral-900 text-amber-700 dark:text-amber-400 border-amber-300">
                  Zero Platform Commission
                </Badge>
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5">
                These reservations are entered directly by property owners. Dates are strictly blocked from online guests on the customer app, while financial figures are isolated from platform online revenue. All guest contacts are aggregated below for targeted promotional discounts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyPhoneNumbers}
              className="text-xs bg-white dark:bg-neutral-900 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 hover:bg-amber-100"
            >
              <Copy className="w-3.5 h-3.5 mr-1" />
              Copy Direct Contacts
            </Button>
          </div>
        </div>

        {/* Navigation Tabs & Filter Bar matching BookingsFilters.js */}
        <div className="bg-white dark:bg-[#121215] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-5 shadow-sm space-y-4">
          {/* Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl w-fit">
              <button
                onClick={() => setActiveTab("bookings")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === "bookings"
                    ? "bg-white dark:bg-[#121215] text-neutral-900 dark:text-white shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                All Offline Bookings ({bookings.length})
              </button>
              <button
                onClick={() => setActiveTab("audience")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "audience"
                    ? "bg-white dark:bg-[#121215] text-[#FF6900] shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Targetable Guests ({promotionalAudience.length})
              </button>
            </div>

            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              Showing {activeTab === "bookings" ? filteredBookings.length : filteredAudience.length} records
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Guest, mobile, email, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 h-10 text-sm bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Property Type Select */}
            <Select
              value={propertyTypeFilter}
              onValueChange={(val) => setPropertyTypeFilter(val)}
            >
              <SelectTrigger className="h-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm">
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Property Types</SelectItem>
                <SelectItem value="Villa">Villa</SelectItem>
                <SelectItem value="Camping">Camping</SelectItem>
                <SelectItem value="Cottages">Cottages</SelectItem>
                <SelectItem value="Hotels">Hotels</SelectItem>
              </SelectContent>
            </Select>

            {/* Payment Status Select */}
            <Select
              value={paymentStatusFilter}
              onValueChange={(val) => setPaymentStatusFilter(val)}
            >
              <SelectTrigger className="h-10 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm">
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payment Statuses</SelectItem>
                <SelectItem value="fully_paid">Fully Paid</SelectItem>
                <SelectItem value="partially_paid">Partially Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid Direct</SelectItem>
              </SelectContent>
            </Select>

            {/* Booking Status Select */}
            <div className="flex items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(val) => setStatusFilter(val)}
              >
                <SelectTrigger className="h-10 flex-1 bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-sm">
                  <SelectValue placeholder="Booking Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              {(search || propertyTypeFilter !== "all" || paymentStatusFilter !== "all" || statusFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                  className="h-10 px-3 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tables Section matching BookingsTable.js */}
        {activeTab === "bookings" ? (
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50/70 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800">
                    <TableHead className="font-semibold text-xs">Ref ID</TableHead>
                    <TableHead className="font-semibold text-xs">Guest Information (Promotion)</TableHead>
                    <TableHead className="font-semibold text-xs">Property</TableHead>
                    <TableHead className="font-semibold text-xs">Stay Dates</TableHead>
                    <TableHead className="font-semibold text-xs">Direct Collection</TableHead>
                    <TableHead className="font-semibold text-xs">Payment</TableHead>
                    <TableHead className="font-semibold text-xs">Status</TableHead>
                    <TableHead className="font-semibold text-xs text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-[#FF6900]" />
                        Loading offline bookings...
                      </TableCell>
                    </TableRow>
                  ) : filteredBookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                        <Megaphone className="h-8 w-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                        No offline bookings found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBookings.map((b) => {
                      const guest = b.customerDetails || {};
                      const checkIn = b.checkIn ? new Date(b.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";
                      const checkOut = b.checkOut ? new Date(b.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-";
                      const idStr = b._id ? String(b._id).slice(-8).toUpperCase() : "N/A";

                      return (
                        <TableRow
                          key={b._id}
                          className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40 border-b border-neutral-200/60 dark:border-neutral-800/60 transition-colors"
                        >
                          <TableCell className="font-mono text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                            #{idStr}
                          </TableCell>

                          <TableCell>
                            <div>
                              <div className="font-bold text-sm text-neutral-900 dark:text-white flex items-center gap-1.5">
                                {guest.firstName || "Walk-in"} {guest.lastName || ""}
                                <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800">
                                  Offline
                                </span>
                              </div>
                              <div className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-2 mt-0.5">
                                {guest.mobile && (
                                  <span className="flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-neutral-400" />
                                    {guest.mobile}
                                  </span>
                                )}
                                {guest.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3 text-neutral-400" />
                                    {guest.city}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-[#FF6900]">
                                {propertyIcons[b.propertyType] || <Building2 className="h-4 w-4" />}
                              </div>
                              <div>
                                <div className="font-semibold text-xs text-neutral-900 dark:text-white">
                                  {b.propertySnapshot?.name || "Direct Property"}
                                </div>
                                <div className="text-[11px] text-neutral-500">
                                  {b.propertyType || "Villa"}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs">
                              <div className="font-semibold text-neutral-800 dark:text-neutral-200">{checkIn}</div>
                              <div className="text-neutral-500 text-[11px]">to {checkOut}</div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <div>
                              <div className="font-bold text-sm text-neutral-900 dark:text-white">
                                {formatCurrency(b.pricing?.totalAmount || 0)}
                              </div>
                              <div className="text-[10px] text-neutral-400 font-medium">
                                Direct Host Walk-in
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={b.paymentStatus || "fully_paid"} type="payment" />
                          </TableCell>

                          <TableCell>
                            <StatusBadge status={b.status || "confirmed"} type="booking" />
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOpenBookingDetails(b)}
                              className="h-8 px-2 text-xs text-neutral-600 hover:text-[#FF6900] hover:bg-orange-50 dark:hover:bg-neutral-800 cursor-pointer"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#121215] rounded-2xl border border-neutral-200/80 dark:border-neutral-800 overflow-hidden shadow-sm">
            <div className="p-4 bg-neutral-50/70 dark:bg-neutral-900/60 border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#FF6900]" />
                  Direct Walk-in Guests (Promotional Audience)
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Curated customer registry collected from offline bookings across all properties for WhatsApp and SMS discount broadcasting.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyPhoneNumbers}
                className="text-xs border-neutral-200 dark:border-neutral-800 hover:border-[#FF6900]/40 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5 mr-1" />
                Copy Numbers
              </Button>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-50/40 dark:bg-neutral-900/40 border-b border-neutral-200/80 dark:border-neutral-800">
                    <TableHead className="font-semibold text-xs">Customer Name</TableHead>
                    <TableHead className="font-semibold text-xs">Mobile Number (WhatsApp Target)</TableHead>
                    <TableHead className="font-semibold text-xs">Email</TableHead>
                    <TableHead className="font-semibold text-xs">Home City</TableHead>
                    <TableHead className="font-semibold text-xs">Offline Stays</TableHead>
                    <TableHead className="font-semibold text-xs">Recent Visit</TableHead>
                    <TableHead className="font-semibold text-xs text-right">Quick Contact</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-[#FF6900]" />
                        Loading promotional audience...
                      </TableCell>
                    </TableRow>
                  ) : filteredAudience.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-16 text-muted-foreground">
                        <Users className="h-8 w-8 mx-auto mb-2 text-neutral-300 dark:text-neutral-700" />
                        No promotional audience contacts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAudience.map((user, idx) => {
                      const cleanPhone = (user.mobile || "").replace(/\D/g, "");
                      const formattedPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;

                      return (
                        <TableRow
                          key={user._id || `${user.mobile}-${idx}`}
                          className="hover:bg-neutral-50/60 dark:hover:bg-neutral-900/40 border-b border-neutral-200/60 dark:border-neutral-800/60 transition-colors"
                        >
                          <TableCell>
                            <div className="font-bold text-sm text-neutral-900 dark:text-white">
                              {user.firstName || "Walk-in"} {user.lastName || ""}
                            </div>
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Promotional Consent
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                              {user.mobile || "-"}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400">
                              {user.email || "-"}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs text-neutral-600 dark:text-neutral-400 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-neutral-400" />
                              {user.city || "Not Provided"}
                            </div>
                          </TableCell>

                          <TableCell>
                            <Badge variant="secondary" className="font-semibold text-xs bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300">
                              {user.bookingCount || 1} stays
                            </Badge>
                          </TableCell>

                          <TableCell>
                            <div className="text-xs text-neutral-500">
                              {user.lastBookingDate ? new Date(user.lastBookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                            </div>
                          </TableCell>

                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {user.mobile && (
                                <a
                                  href={`https://wa.me/${formattedPhone}?text=Hello%20${encodeURIComponent(user.firstName || "Guest")},%20we%20have%20an%20exclusive%20seasonal%20discount%20for%20your%20next%20stay!`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/40 dark:border-emerald-800 transition-colors"
                                  title="Send WhatsApp Promotion"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                              )}
                              {user.mobile && (
                                <a
                                  href={`tel:${user.mobile}`}
                                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-300 transition-colors"
                                  title="Call Guest"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        )}

        {/* Offline Booking Details Dialog */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xl">
            <DialogHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-800">
              <DialogTitle className="text-lg font-bold flex items-center justify-between">
                <span>Offline Booking Details</span>
                <span className="text-xs font-mono text-neutral-400">
                  #{selectedBooking?._id?.slice(-8).toUpperCase()}
                </span>
              </DialogTitle>
            </DialogHeader>

            {selectedBooking && (
              <div className="space-y-4 pt-2">
                {/* Guest Profile Card */}
                <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                  <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
                    Guest Information
                  </div>
                  <div className="text-base font-bold text-neutral-900 dark:text-white">
                    {selectedBooking.customerDetails?.firstName} {selectedBooking.customerDetails?.lastName}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      {selectedBooking.customerDetails?.mobile || "N/A"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-neutral-400" />
                      {selectedBooking.customerDetails?.email || "N/A"}
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                      {selectedBooking.customerDetails?.city || "No City"}
                      {selectedBooking.customerDetails?.address ? `, ${selectedBooking.customerDetails?.address}` : ""}
                    </div>
                  </div>
                </div>

                {/* Stay Info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                    <span className="text-neutral-400 block mb-1">Check-In Date</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {selectedBooking.checkIn ? new Date(selectedBooking.checkIn).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                    <span className="text-neutral-400 block mb-1">Check-Out Date</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {selectedBooking.checkOut ? new Date(selectedBooking.checkOut).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                    </span>
                  </div>
                </div>

                {/* Financial Details */}
                <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-amber-800 dark:text-amber-400 font-semibold block">
                        Direct Host Collection
                      </span>
                      <span className="text-lg font-black text-amber-900 dark:text-amber-200">
                        {formatCurrency(selectedBooking.pricing?.totalAmount || 0)}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-neutral-500 block mb-1">Payment Status</span>
                      <StatusBadge status={selectedBooking.paymentStatus || "fully_paid"} type="payment" />
                    </div>
                  </div>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 mt-2">
                    * This amount was paid directly to the host and is not counted toward platform gross revenue.
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2">
                  {selectedBooking.customerDetails?.mobile && (
                    <Button
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold cursor-pointer"
                      onClick={() => {
                        const clean = (selectedBooking.customerDetails?.mobile || "").replace(/\D/g, "");
                        const target = clean.startsWith("91") ? clean : `91${clean}`;
                        window.open(`https://wa.me/${target}?text=Hello%20${encodeURIComponent(selectedBooking.customerDetails?.firstName || "Guest")},%20we%20are%20reaching%20out%20regarding%20your%20stay!`, "_blank");
                      }}
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                      WhatsApp Guest
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="flex-1 text-xs font-semibold cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
}
