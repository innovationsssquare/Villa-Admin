"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Play,
  Percent,
  TrendingUp,
  Wallet,
  Phone,
  Mail,
  MessageCircle,
  Users,
  Utensils,
  Sparkles,
  Info,
  Calendar,
  IndianRupee,
  RefreshCw,
  X,
  FileText,
  Building,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function PropertyVerificationShell({
  propertyType = "property",
  data,
  loading,
  error,
  onRefresh,
  onApprove,
  onReject,
  loadingApprove,
  loadingReject,
  renderUnits,
  extraDetails,
}) {
  const router = useRouter();

  // Active Media state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Commission & Verification state
  const [commission, setCommission] = useState(data?.commission || 15);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionRemarks, setRejectionRemarks] = useState("");

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-[calc(100vh-64px)] bg-[#FAFAFA] dark:bg-[#09090B]">
        <div className="w-12 h-12 rounded-full border-3 border-[#FF6900]/20 border-t-[#FF6900] animate-spin mb-4"></div>
        <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 animate-pulse">
          Loading {propertyType} verification profile...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="w-full flex flex-col justify-center items-center h-[calc(100vh-64px)] bg-[#FAFAFA] dark:bg-[#09090B] p-6 text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-4">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">
          Failed to Load {propertyType.toUpperCase()} Details
        </h2>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-5">
          {error?.message || "The requested property record could not be retrieved from the database."}
        </p>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="border-neutral-200 dark:border-neutral-800"
          >
            Go Back
          </Button>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              className="bg-[#FF6900] hover:bg-[#E05D00] text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry Fetch
            </Button>
          )}
        </div>
      </div>
    );
  }

  const images = Array.isArray(data.images) && data.images.length > 0 ? data.images : [];
  const currentImage = images[selectedImageIndex] || "/placeholder.svg?height=600&width=800";
  const isApproved = data.isapproved === "approved" || data.status === "approved";
  const isRejected = data.isapproved === "rejected" || data.status === "rejected";
  const isPending = !isApproved && !isRejected;

  // Base & Weekend pricing discovery for live calculator and specs strip
  const getMinPrice = (arr, selector) => {
    if (!Array.isArray(arr) || arr.length === 0) return 0;
    const valid = arr.map(selector).filter((p) => typeof p === "number" && p > 0);
    return valid.length > 0 ? Math.min(...valid) : 0;
  };

  const basePrice =
    data.pricing?.weekdayPrice ||
    data.pricing?.basePrice ||
    getMinPrice(data.tents, (t) => t.pricing?.weekdayPrice || t.pricePerNight) ||
    getMinPrice(data.rooms, (r) => r.pricing?.weekdayPrice || r.pricePerNight) ||
    getMinPrice(data.cottages, (c) => c.pricing?.weekdayPrice || c.pricePerNight) ||
    data.pricePerNight ||
    data.price ||
    0;

  const weekendPrice =
    data.pricing?.weekendPrice ||
    getMinPrice(data.tents, (t) => t.pricing?.weekendPrice) ||
    getMinPrice(data.rooms, (r) => r.pricing?.weekendPrice) ||
    getMinPrice(data.cottages, (c) => c.pricing?.weekendPrice) ||
    basePrice;

  const commissionPercent = Number(commission) || 0;
  const platformEarnings = Math.round((basePrice * commissionPercent) / 100);
  const hostPayout = Math.max(0, basePrice - platformEarnings);

  const owner = data.ownerId && typeof data.ownerId === "object" ? data.ownerId : null;
  const ownerName = owner?.name || data.ownerName || "Property Host";
  const ownerPhone = owner?.phone || data.ownerPhone || "";
  const ownerEmail = owner?.email || data.ownerEmail || "";

  const locationStr =
    data.location?.addressLine ||
    data.address?.addressLine ||
    [data.address?.area, data.address?.city].filter(Boolean).join(", ") ||
    [data.location?.city, data.location?.state].filter(Boolean).join(", ") ||
    "Location on file";

  const mapLink = data.location?.maplink || data.address?.maplink || null;

  return (
    <ScrollArea className="w-full bg-[#FAFAFA] dark:bg-[#09090B] h-[calc(100vh-64px)] pb-16 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ========================================================================= */}
        {/* 1. TOP STICKY-STYLE NAVIGATION & AUDIT HEADER                             */}
        {/* ========================================================================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => router.back()}
              className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-neutral-600 dark:text-neutral-300 hover:text-[#FF6900] dark:hover:text-[#FF6900] hover:border-[#FF6900]/40 shadow-xs transition-all cursor-pointer shrink-0"
              title="Return to property management"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-[#FFF1E6] dark:bg-[#FF6900]/10 text-[#FF6900] border-transparent font-bold capitalize text-xs px-2.5 py-0.5">
                  {propertyType} Verification
                </Badge>
                {/* Status Badge */}
                {isApproved && (
                  <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold flex items-center gap-1 text-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Approved & Live
                  </Badge>
                )}
                {isRejected && (
                  <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 font-bold flex items-center gap-1 text-xs">
                    <XCircle className="w-3.5 h-3.5" /> Rejected
                  </Badge>
                )}
                {isPending && (
                  <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-bold flex items-center gap-1 text-xs animate-pulse">
                    <Clock className="w-3.5 h-3.5" /> Awaiting Admin Review
                  </Badge>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight truncate mt-1">
                {data.name || "Untitled Property"}
              </h1>
            </div>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2">
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:border-[#FF6900]/40 hover:text-[#FF6900] shadow-xs transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF6900]" />
                <span>Open in Maps</span>
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] text-neutral-500 hover:text-[#FF6900] transition-colors"
                title="Refresh property data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* 2. TWO-COLUMN WORKFLOW: CONTENT (LEFT) + COMMAND CENTER (RIGHT)            */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ======================================================================= */}
          {/* LEFT COLUMN: PROPERTY SPECIFICATIONS & MEDIA (8 COLS)                  */}
          {/* ======================================================================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* --- Hero Media Gallery --- */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-3 shadow-xs space-y-3">
              {/* Main Feature Image / Reel Viewport */}
              <div className="relative w-full h-72 sm:h-96 md:h-[420px] rounded-xl overflow-hidden bg-neutral-950 group">
                <Image
                  src={currentImage}
                  alt={data.name || "Property Photo"}
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-102"
                />

                {/* Subtle gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                {/* Top Overlay Badges */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-[11px] font-bold tracking-wide flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FF6900]" />
                    {selectedImageIndex + 1} / {images.length || 1} Photos
                  </span>
                </div>

                {/* Reel Video Quick Play Pill (if reel exists) */}
                {data.reelVideo && (
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#FF6900] hover:bg-[#E05D00] text-white text-xs font-bold shadow-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Property Reel</span>
                  </button>
                )}

                {/* Bottom Left Title Overlay */}
                <div className="absolute bottom-3 left-3 text-white max-w-md">
                  <div className="flex items-center gap-1.5 text-xs text-white/80 font-medium mb-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#FF6900]" />
                    <span className="truncate">{locationStr}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black tracking-tight drop-shadow-sm truncate">
                    {data.name}
                  </h3>
                </div>
              </div>

              {/* Thumbnails Strip + Reel Button */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      idx === selectedImageIndex
                        ? "border-[#FF6900] ring-2 ring-[#FF6900]/20 scale-102"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`Thumb ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}

                {data.reelVideo && (
                  <button
                    onClick={() => setIsVideoModalOpen(true)}
                    className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-neutral-900 border border-[#FF6900]/40 flex flex-col items-center justify-center text-[#FF6900] hover:bg-[#FF6900]/10 transition-colors cursor-pointer group"
                    title="Play Video Reel"
                  >
                    <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-wider text-white mt-0.5">
                      Reel
                    </span>
                  </button>
                )}
              </div>
            </div>

            {/* --- Key Specifications & Pricing Strip --- */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
                  Weekday Starting
                </span>
                <span className="text-lg font-black text-neutral-900 dark:text-white block tracking-tight">
                  {formatCurrency(basePrice)}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                  Mon - Thu / night
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
                  Weekend Starting
                </span>
                <span className="text-lg font-black text-[#FF6900] block tracking-tight">
                  {formatCurrency(weekendPrice || basePrice)}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                  Fri - Sun / night
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
                  Security Deposit
                </span>
                <span className="text-lg font-black text-neutral-900 dark:text-white block tracking-tight">
                  {data.securityDeposit ? formatCurrency(data.securityDeposit) : "₹0"}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                  refundable on checkout
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs">
                <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
                  Check-in Time
                </span>
                <span className="text-lg font-black text-neutral-900 dark:text-white block tracking-tight flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#FF6900]" />
                  {data.checkInTime || "12:00 PM"}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                  standard check-in
                </span>
              </div>

              <div className="p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs col-span-2 sm:col-span-1">
                <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block mb-1">
                  Check-out Time
                </span>
                <span className="text-lg font-black text-neutral-900 dark:text-white block tracking-tight flex items-center gap-1">
                  <Clock className="w-4 h-4 text-neutral-400" />
                  {data.checkOutTime || "11:00 AM"}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
                  standard checkout
                </span>
              </div>
            </div>

            {/* --- Category-Specific Unit Showcase (Tents / Rooms / Cottages / Villa BHK) --- */}
            {renderUnits && (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-5 shadow-xs">
                {renderUnits}
              </div>
            )}

            {/* --- Extra Details Slot (BHK pricing, kitchen charges, etc.) --- */}
            {extraDetails && (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-5 shadow-xs">
                {extraDetails}
              </div>
            )}

            {/* --- Property Description --- */}
            <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-5 shadow-xs space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#FF6900]" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                  Property Overview & Description
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                {data.description || "No description provided by the host."}
              </p>
            </div>

            {/* --- Amenities & Features --- */}
            {Array.isArray(data.amenities) && data.amenities.length > 0 && (
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FF6900]" />
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                      Verified Amenities & Offerings
                    </h3>
                  </div>
                  <span className="text-xs text-neutral-400 font-medium">
                    {data.amenities.length} items
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {data.amenities.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* --- Rules, Policies & Food Options --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* House / Camping Rules */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#FF6900]" />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    House & Property Rules
                  </h4>
                </div>
                {Array.isArray(data.rules || data.CampingRules || data.hotelRules || data.cottageRules) &&
                (data.rules || data.CampingRules || data.hotelRules || data.cottageRules).length > 0 ? (
                  <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                    {(data.rules || data.CampingRules || data.hotelRules || data.cottageRules).map(
                      (r, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900] mt-1.5 shrink-0" />
                          <span>{r}</span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-xs text-neutral-400 italic">No special rules specified.</p>
                )}
              </div>

              {/* Policies & Food */}
              <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs space-y-3">
                <div className="flex items-center gap-2">
                  <Utensils className="w-4 h-4 text-[#FF6900]" />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Food & Cancellation Policy
                  </h4>
                </div>
                <div className="space-y-2 text-xs text-neutral-600 dark:text-neutral-300">
                  {data.foodOptions && (
                    <div>
                      <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">
                        Dining & Meals:
                      </span>
                      {typeof data.foodOptions === "string" ? (
                        <span>{data.foodOptions}</span>
                      ) : typeof data.foodOptions === "object" ? (
                        <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
                          {Array.isArray(data.foodOptions.available) && data.foodOptions.available.length > 0 && (
                            <div>
                              <span className="font-medium text-neutral-500 dark:text-neutral-400">Available: </span>
                              <span>{data.foodOptions.available.join(", ")}</span>
                            </div>
                          )}
                          {(Number(data.foodOptions.adultPrice) > 0 || Number(data.foodOptions.childPrice) > 0) && (
                            <div className="flex gap-4">
                              {Number(data.foodOptions.adultPrice) > 0 && (
                                <span>
                                  <span className="font-medium text-neutral-500 dark:text-neutral-400">Adult: </span>
                                  ₹{Number(data.foodOptions.adultPrice).toLocaleString("en-IN")}
                                </span>
                              )}
                              {Number(data.foodOptions.childPrice) > 0 && (
                                <span>
                                  <span className="font-medium text-neutral-500 dark:text-neutral-400">Child: </span>
                                  ₹{Number(data.foodOptions.childPrice).toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          )}
                          {data.foodOptions.note ? (
                            <div>
                              <span className="font-medium text-neutral-500 dark:text-neutral-400">Note: </span>
                              <span>{data.foodOptions.note}</span>
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-white block mb-0.5">
                      Cancellation Policy:
                    </span>
                    <span>
                      {Array.isArray(data.cancellationPolicy)
                        ? data.cancellationPolicy.join("; ")
                        : typeof data.cancellationPolicy === "string"
                        ? data.cancellationPolicy
                        : "Standard non-refundable within 48 hours of check-in."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================================= */}
          {/* RIGHT COLUMN: STICKY VERIFICATION DECISION PANEL (4 COLS)              */}
          {/* ======================================================================= */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-4 self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
            {/* --- Card 1: Verification Action Center --- */}
            <div className="p-5 rounded-2xl border-2 border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#FF6900]" />
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white tracking-tight">
                    Verification Review
                  </h3>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FFF1E6] dark:bg-[#FF6900]/10 text-[#FF6900] font-bold uppercase">
                  Admin Action
                </span>
              </div>

              {/* Status Display */}
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Current Status
                </span>
                <span className="text-xs font-bold capitalize text-neutral-900 dark:text-white">
                  {data.isapproved || data.status || "Pending"}
                </span>
              </div>

              {/* Commission Percentage Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Platform Commission %
                  </label>
                  <span className="text-xs font-black text-[#FF6900]">
                    {commissionPercent}%
                  </span>
                </div>

                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={commission}
                    onChange={(e) => setCommission(Number(e.target.value))}
                    disabled={loadingApprove || loadingReject}
                    className="pr-8 font-black text-sm bg-neutral-50 dark:bg-neutral-900/80 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white"
                  />
                  <Percent className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3" />
                </div>

                {/* Preset Chips */}
                <div className="flex gap-1.5 pt-1">
                  {[10, 12, 15, 18, 20].map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setCommission(rate)}
                      className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                        commissionPercent === rate
                          ? "bg-[#FF6900] text-white shadow-xs"
                          : "bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Earnings Projection Breakdown */}
              {basePrice > 0 && (
                <div className="p-3.5 rounded-xl bg-[#FFF1E6]/40 dark:bg-[#FF6900]/5 border border-[#FF6900]/20 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-neutral-500 dark:text-neutral-400 font-medium">
                      Base Rate Per Stay:
                    </span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {formatCurrency(basePrice)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#FF6900] font-medium">
                      Platform Fee ({commissionPercent}%):
                    </span>
                    <span className="font-black text-[#FF6900]">
                      +{formatCurrency(platformEarnings)}
                    </span>
                  </div>
                  <div className="border-t border-[#FF6900]/20 pt-1.5 flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">
                      Host Net Payout:
                    </span>
                    <span className="font-black text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(hostPayout)}
                    </span>
                  </div>
                </div>
              )}

              {/* Primary Decision Triggers */}
              <div className="space-y-2 pt-1">
                <Button
                  onClick={() => onApprove && onApprove({ commission: commissionPercent })}
                  disabled={loadingApprove || loadingReject || commissionPercent <= 0}
                  className="w-full bg-[#FF6900] hover:bg-[#E05D00] text-white font-bold py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {loadingApprove ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Publishing Property...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Publish Live</span>
                    </div>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setIsRejectModalOpen(true)}
                  disabled={loadingApprove || loadingReject}
                  className="w-full border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-bold py-2.5 rounded-xl transition-all cursor-pointer"
                >
                  <XCircle className="w-4 h-4 mr-1.5" />
                  <span>Reject Property</span>
                </Button>
              </div>
            </div>

            {/* --- Card 2: Property Host / Owner Details --- */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs space-y-3.5">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-[#FF6900]" />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                    Host / Owner Profile
                  </h4>
                </div>
                <span className="text-[10px] text-neutral-400 font-medium">Registered</span>
              </div>

              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-neutral-400 block mb-0.5">Host Name</span>
                  <span className="font-bold text-neutral-900 dark:text-white text-sm">
                    {ownerName}
                  </span>
                </div>

                {ownerPhone && (
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Contact Phone</span>
                    <a
                      href={`tel:${ownerPhone}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 hover:text-[#FF6900] flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5 text-neutral-400" />
                      {ownerPhone}
                    </a>
                  </div>
                )}

                {ownerEmail && (
                  <div>
                    <span className="text-neutral-400 block mb-0.5">Email</span>
                    <a
                      href={`mailto:${ownerEmail}`}
                      className="font-medium text-neutral-800 dark:text-neutral-200 hover:text-[#FF6900] flex items-center gap-1.5 truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{ownerEmail}</span>
                    </a>
                  </div>
                )}

                {/* Quick WhatsApp Link for instant host clarification */}
                {ownerPhone && (
                  <div className="pt-2">
                    <a
                      href={`https://wa.me/91${ownerPhone.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-current" />
                      <span>Contact Host via WhatsApp</span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* --- Card 3: Property Platform Statistics --- */}
            <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#121215] shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Listing Health
              </h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Rating</span>
                  <span className="font-bold text-neutral-900 dark:text-white text-sm">
                    {data.averageRating ? `${data.averageRating} ★` : "New Listing"}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-neutral-400 block mb-0.5">Reviews</span>
                  <span className="font-bold text-neutral-900 dark:text-white text-sm">
                    {data.totalReviews || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. REJECTION MODAL WITH REMARKS REASON                                     */}
      {/* ========================================================================= */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-[#121215] border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white p-6 rounded-2xl">
          <DialogHeader>
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 flex items-center justify-center mb-2">
              <XCircle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold">Reject Property Submission</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 my-3">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Please provide feedback or the reason for rejection so the property owner can rectify and resubmit their listing.
            </p>
            <Textarea
              placeholder="e.g., Incomplete address verification, unclear bedroom photos, missing mandatory reel video, or mismatched property policies."
              value={rejectionRemarks}
              onChange={(e) => setRejectionRemarks(e.target.value)}
              rows={4}
              className="bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white"
            />
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={loadingReject}
              className="border-neutral-200 dark:border-neutral-800"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (onReject) {
                  await onReject({ remarks: rejectionRemarks });
                  setIsRejectModalOpen(false);
                }
              }}
              disabled={loadingReject}
              className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {loadingReject ? "Rejecting..." : "Confirm Rejection"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* 4. REEL VIDEO MODAL                                                       */}
      {/* ========================================================================= */}
      {data.reelVideo && isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-sm max-h-[90vh] aspect-[9/16] bg-black rounded-2xl overflow-hidden shadow-2xl border border-neutral-800"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsVideoModalOpen(false)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <video
              src={data.reelVideo}
              controls
              autoPlay
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </ScrollArea>
  );
}
