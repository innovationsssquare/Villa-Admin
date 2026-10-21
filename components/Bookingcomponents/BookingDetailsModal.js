import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  Tag,
  Building,
  Wallet,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Loader2,
  HelpCircle,
} from "lucide-react";
import {
  AdminApproveCancellation,
  AdminRejectCancellation,
} from "@/lib/API/Booking/Booking";
import { toast } from "sonner";

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium text-foreground break-words">
          {value}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-semibold text-foreground mb-3">{children}</h3>
  );
}

export function BookingDetailsModal({ booking, open, onClose, onRefresh }) {
  if (!booking) return null;

  const [localBooking, setLocalBooking] = useState(booking);
  const [refundAmount, setRefundAmount] = useState(0);
  const [adminNotes, setAdminNotes] = useState("");
  const [processRazorpay, setProcessRazorpay] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [rejectedReason, setRejectedReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);
  const [showOverrideBox, setShowOverrideBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync when booking changes
  useEffect(() => {
    if (booking) {
      setLocalBooking(booking);
      setShowRejectBox(false);
      setShowOverrideBox(false);
      setRejectedReason("");

      // Calculate initial suggested refund
      const successfulPayments = (booking?.payments || []).filter(
        (p) => p.status === "successful"
      );
      const paid = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);

      const checkInDate = booking?.checkIn ? new Date(booking.checkIn) : null;
      let suggested = 0;
      if (checkInDate && !isNaN(checkInDate)) {
        const days = Math.ceil(
          (checkInDate - new Date()) / (1000 * 60 * 60 * 24)
        );
        if (days > 7) suggested = Math.round(paid * 0.9);
        else if (days > 3) suggested = Math.round(paid * 0.5);
      }

      setRefundAmount(
        booking?.cancellation?.refundAmount !== undefined && booking?.cancellation?.refundAmount !== null
          ? booking.cancellation.refundAmount
          : suggested
      );
      setAdminNotes(booking?.cancellation?.adminNotes || "");
      setTransactionId(booking?.cancellation?.refundTransactionId || "");
      setProcessRazorpay(false);
    }
  }, [booking]);

  const activeBooking = localBooking || booking;

  const customerName = `${activeBooking?.customerDetails?.firstName || ""} ${
    activeBooking?.customerDetails?.lastName || ""
  }`.trim() || "Guest";

  const checkInDate = activeBooking?.checkIn ? new Date(activeBooking.checkIn) : null;
  const checkOutDate = activeBooking?.checkOut ? new Date(activeBooking.checkOut) : null;
  const createdDate = activeBooking?.createdAt ? new Date(activeBooking.createdAt) : null;
  const updatedDate = activeBooking?.updatedAt ? new Date(activeBooking.updatedAt) : null;
  const idStr = activeBooking?._id ? String(activeBooking._id).slice(-8).toUpperCase() : "N/A";

  const items = Array.isArray(activeBooking?.items) ? activeBooking.items : [];
  const payments = Array.isArray(activeBooking?.payments) ? activeBooking.payments : [];

  const successfulPayments = payments.filter((p) => p.status === "successful");
  const totalPaid = successfulPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const hasGatewayPayment = successfulPayments.some((p) => p.transactionId);

  const daysUntilCheckIn = checkInDate && !isNaN(checkInDate)
    ? Math.ceil((checkInDate - new Date()) / (1000 * 60 * 60 * 24))
    : 0;

  const isCancellationRequested =
    activeBooking?.status === "cancellation_requested" ||
    activeBooking?.cancellation?.requested;

  const isCancelled =
    activeBooking?.status === "cancelled" || activeBooking?.cancellation?.cancelled;

  const isConfirmed = activeBooking?.status === "confirmed";

  // Policy tier calculation for admin reference
  let suggestedPolicyTier = "Strict (Non-refundable)";
  let suggestedPolicyAmount = 0;
  if (daysUntilCheckIn > 7) {
    suggestedPolicyTier = "Flexible (90% Refund)";
    suggestedPolicyAmount = Math.round(totalPaid * 0.9);
  } else if (daysUntilCheckIn > 3) {
    suggestedPolicyTier = "Moderate (50% Refund)";
    suggestedPolicyAmount = Math.round(totalPaid * 0.5);
  }

  // Handle Admin Approval of Cancellation
  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      const res = await AdminApproveCancellation(activeBooking._id, {
        refundAmount: Number(refundAmount) || 0,
        reason: activeBooking?.cancellation?.reason || "Admin Approved Cancellation",
        adminNotes: adminNotes.trim(),
        processRazorpayRefund: processRazorpay,
        transactionId: transactionId.trim(),
      });

      if (res?.success) {
        toast.success("Cancellation approved and processed successfully!");
        setLocalBooking((prev) => ({
          ...prev,
          status: "cancelled",
          cancellation: {
            ...prev.cancellation,
            cancelled: true,
            requested: false,
            refundAmount: Number(refundAmount) || 0,
            refundStatus: res.data?.refundStatus || (Number(refundAmount) > 0 ? "processed" : "non_refundable"),
            adminNotes: adminNotes.trim(),
            refundTransactionId: res.data?.booking?.cancellation?.refundTransactionId || transactionId.trim(),
          },
        }));
        if (onRefresh) onRefresh();
      } else {
        toast.error(res?.message || "Failed to approve cancellation");
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Admin Rejection of Cancellation
  const handleReject = async () => {
    if (!rejectedReason.trim()) {
      toast.error("Please enter a reason for rejecting the cancellation request");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await AdminRejectCancellation(activeBooking._id, {
        rejectedReason: rejectedReason.trim(),
        adminNotes: adminNotes.trim(),
      });

      if (res?.success) {
        toast.success("Cancellation request rejected. Booking remains confirmed.");
        setLocalBooking((prev) => ({
          ...prev,
          status: "confirmed",
          cancellation: {
            ...prev.cancellation,
            requested: false,
            cancelled: false,
            refundStatus: "rejected",
            rejectedReason: rejectedReason.trim(),
          },
        }));
        setShowRejectBox(false);
        if (onRefresh) onRefresh();
      } else {
        toast.error(res?.message || "Failed to reject cancellation");
      }
    } catch (err) {
      toast.error(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 bg-card dark:bg-[#121215] border-border dark:border-neutral-800 text-foreground dark:text-neutral-100">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold flex items-center gap-2">
                Booking Details
                {isCancellationRequested && (
                  <Badge variant="outline" className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold animate-pulse">
                    Action Required
                  </Badge>
                )}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                ID: {idStr}
              </p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={activeBooking?.status || "pending"} type="booking" />
              <StatusBadge status={activeBooking?.paymentStatus || "pending"} type="payment" />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 pt-4 space-y-6">

            {/* 🚨 CANCELLATION REQUESTED REVIEW PANEL (ADMIN INTERVENTION REQUIRED) */}
            {isCancellationRequested && (
              <div className="bg-amber-500/10 dark:bg-amber-500/5 border-2 border-amber-500/40 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400">
                  <ShieldAlert className="h-5 w-5 shrink-0" />
                  <h3 className="font-bold text-base">Guest Cancellation Request — Review & Authorize</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-background/80 dark:bg-neutral-900/80 p-3.5 rounded-lg border border-amber-500/20">
                  <div>
                    <span className="text-muted-foreground">Guest Reason:</span>
                    <p className="font-semibold text-foreground text-sm mt-0.5">
                      "{activeBooking?.cancellation?.reason || "No reason given"}"
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Requested At:</span>
                    <p className="font-medium text-foreground mt-0.5">
                      {activeBooking?.cancellation?.requestedAt
                        ? format(new Date(activeBooking.cancellation.requestedAt), "MMM dd, yyyy 'at' hh:mm a")
                        : "Just now"}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Paid by Guest:</span>
                    <p className="font-bold text-foreground text-sm mt-0.5">
                      {formatCurrency(totalPaid)}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Check-in Proximity:</span>
                    <p className="font-semibold text-foreground mt-0.5">
                      {daysUntilCheckIn > 0 ? `${daysUntilCheckIn} day(s) away` : "Today / Passed"}
                    </p>
                  </div>
                </div>

                <div className="bg-background/90 dark:bg-neutral-900/90 p-4 rounded-lg border border-border space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Standard Policy Suggestion:</span>
                    <Badge variant="outline" className="border-amber-500/30 text-amber-600 dark:text-amber-400 font-medium">
                      {suggestedPolicyTier} — {formatCurrency(suggestedPolicyAmount)}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Refund Amount (₹) <span className="text-destructive">*</span>
                      </label>
                      <Input
                        type="number"
                        min="0"
                        max={totalPaid}
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(e.target.value)}
                        placeholder="0"
                        className="h-9 text-sm"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Max refundable: {formatCurrency(totalPaid)}
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-foreground block mb-1">
                        Admin Decision Notes
                      </label>
                      <Input
                        type="text"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="e.g. Approved 90% as per 7-day policy"
                        className="h-9 text-sm"
                      />
                    </div>
                  </div>

                  {Number(refundAmount) > 0 && (
                    <div className="pt-2 border-t border-border space-y-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="processRazorpay"
                          checked={processRazorpay}
                          disabled={!hasGatewayPayment}
                          onChange={(e) => setProcessRazorpay(e.target.checked)}
                          className="rounded border-border text-primary focus:ring-primary h-4 w-4"
                        />
                        <label htmlFor="processRazorpay" className="text-xs font-medium cursor-pointer">
                          Trigger Real-time Razorpay Gateway Refund API
                          {!hasGatewayPayment && " (No gateway payment found — manual refund required)"}
                        </label>
                      </div>

                      {!processRazorpay && (
                        <div>
                          <label className="text-xs text-muted-foreground block mb-1">
                            Manual / Bank / UPI Reference ID (Optional)
                          </label>
                          <Input
                            type="text"
                            value={transactionId}
                            onChange={(e) => setTransactionId(e.target.value)}
                            placeholder="e.g. UTR123456789 or Cash"
                            className="h-8 text-xs"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {!showRejectBox ? (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      <Button
                        size="sm"
                        disabled={isSubmitting}
                        onClick={handleApprove}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                      >
                        {isSubmitting ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        )}
                        Approve Cancellation & Authorize Refund
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isSubmitting}
                        onClick={() => setShowRejectBox(true)}
                        className="border-destructive/40 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4 mr-1.5" />
                        Decline / Reject Request
                      </Button>
                    </div>
                  ) : (
                    <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg space-y-2 pt-3">
                      <label className="text-xs font-semibold text-destructive block">
                        Reason for Declining Cancellation:
                      </label>
                      <Input
                        type="text"
                        value={rejectedReason}
                        onChange={(e) => setRejectedReason(e.target.value)}
                        placeholder="e.g. Does not meet minimum 48hr cancellation policy"
                        className="h-8 text-xs bg-background"
                      />
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isSubmitting}
                          onClick={handleReject}
                          className="h-8 text-xs"
                        >
                          {isSubmitting ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : null}
                          Confirm Rejection
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          disabled={isSubmitting}
                          onClick={() => setShowRejectBox(false)}
                          className="h-8 text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 📋 CANCELLED AUDIT CARD */}
            {isCancelled && (
              <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-destructive" />
                    <h3 className="font-semibold text-sm text-foreground">Cancellation & Refund Record</h3>
                  </div>
                  <StatusBadge
                    status={activeBooking?.cancellation?.refundStatus || "non_refundable"}
                    type="refund"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Refund Amount</span>
                    <span className="font-bold text-foreground text-sm">
                      {formatCurrency(activeBooking?.cancellation?.refundAmount || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Cancelled On</span>
                    <span className="font-medium text-foreground">
                      {activeBooking?.cancellation?.cancelledAt
                        ? format(new Date(activeBooking.cancellation.cancelledAt), "MMM dd, yyyy")
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Reason</span>
                    <span className="font-medium text-foreground truncate block">
                      {activeBooking?.cancellation?.reason || "Admin Cancelled"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Refund Reference</span>
                    <span className="font-mono text-foreground text-[11px] truncate block">
                      {activeBooking?.cancellation?.refundTransactionId || "N/A"}
                    </span>
                  </div>
                </div>
                {activeBooking?.cancellation?.adminNotes && (
                  <div className="text-xs pt-1 border-t border-border">
                    <span className="text-muted-foreground">Admin Notes: </span>
                    <span className="font-medium text-foreground">{activeBooking.cancellation.adminNotes}</span>
                  </div>
                )}
              </div>
            )}

            {/* Property & Booking Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <SectionTitle>Property Information</SectionTitle>
                <div className="space-y-3">
                  <InfoRow
                    icon={Building}
                    label="Property Type"
                    value={
                      <Badge variant="outline" className="font-medium">
                        {activeBooking?.propertyType || "Property"}
                      </Badge>
                    }
                  />
                  <InfoRow
                    icon={Tag}
                    label="Booking Mode"
                    value={
                      <span className="capitalize">{activeBooking?.bookingMode || "standard"}</span>
                    }
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Check-in"
                    value={
                      checkInDate && !isNaN(checkInDate)
                        ? format(checkInDate, "EEEE, MMMM dd, yyyy")
                        : "-"
                    }
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Check-out"
                    value={
                      checkOutDate && !isNaN(checkOutDate)
                        ? format(checkOutDate, "EEEE, MMMM dd, yyyy")
                        : "-"
                    }
                  />
                  <InfoRow
                    icon={Users}
                    label="Guests"
                    value={`${activeBooking?.guests?.adults || 0} Adult(s)${
                      (activeBooking?.guests?.children || 0) > 0
                        ? `, ${activeBooking.guests.children} Child(ren)`
                        : ""
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <SectionTitle>Customer Information</SectionTitle>
                <div className="space-y-3">
                  <InfoRow icon={User} label="Name" value={customerName} />
                  <InfoRow
                    icon={Mail}
                    label="Email"
                    value={activeBooking?.customerDetails?.email || "-"}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Mobile"
                    value={activeBooking?.customerDetails?.mobile || "-"}
                  />
                  {activeBooking?.customerDetails?.city && (
                    <InfoRow
                      icon={MapPin}
                      label="City"
                      value={activeBooking.customerDetails.city}
                    />
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Booked Items */}
            <div>
              <SectionTitle>Booked Items</SectionTitle>
              <div className="space-y-2">
                {items.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No item details available</p>
                ) : (
                  items.map((item, idx) => (
                    <div
                      key={item?._id || idx}
                      className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {item?.typeName || item?.unitType || "Unit"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item?.unitType || "standard"} • Qty: {item?.quantity || 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">
                          {formatCurrency(item?.totalPrice || 0)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatCurrency(item?.pricePerNight || 0)}/night
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Separator />

            {/* Pricing Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <SectionTitle>Pricing Summary</SectionTitle>
                <div className="space-y-2 bg-muted/30 p-4 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">
                      {formatCurrency(activeBooking?.pricing?.subtotal || 0)}
                    </span>
                  </div>
                  {(activeBooking?.pricing?.discountAmount || 0) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Discount</span>
                      <span className="text-success">
                        -{formatCurrency(activeBooking.pricing.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">
                      {formatCurrency(activeBooking?.pricing?.taxAmount || 0)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total Amount</span>
                    <span className="text-primary text-lg">
                      {formatCurrency(activeBooking?.pricing?.totalAmount || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1">
                    <span>Total Paid So Far:</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(totalPaid)}
                    </span>
                  </div>
                </div>
              </div>

              {activeBooking?.coupon?.applied && (
                <div>
                  <SectionTitle>Coupon Applied</SectionTitle>
                  <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-success" />
                      <span className="font-mono font-bold text-success">
                        {activeBooking.coupon.code}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {activeBooking.coupon.discountType === "percentage"
                        ? `${activeBooking.coupon.discountValue}% off`
                        : formatCurrency(activeBooking.coupon.discountValue || 0)}
                    </p>
                    <p className="text-sm font-medium text-success mt-1">
                      Saved: {formatCurrency(activeBooking.coupon.discountAmount || 0)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Separator />

            {/* Payments */}
            <div>
              <SectionTitle>Payment History</SectionTitle>
              <div className="space-y-2">
                {payments.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No payment transaction records</p>
                ) : (
                  payments.map((payment, idx) => {
                    const paidDate = payment?.paidAt ? new Date(payment.paidAt) : null;
                    return (
                      <div
                        key={payment?._id || idx}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">
                            <CreditCard className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground capitalize">
                              {payment?.paymentType || "Card"} Payment
                            </p>
                            <p className="text-xs text-muted-foreground font-mono">
                              {payment?.transactionId || "N/A"}
                            </p>
                            {paidDate && !isNaN(paidDate) && (
                              <p className="text-xs text-muted-foreground">
                                {format(paidDate, "MMM dd, yyyy 'at' hh:mm a")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">
                            {formatCurrency(payment?.amount || 0, payment?.currency)}
                          </p>
                          <StatusBadge status={payment?.status || "pending"} type="payment" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Payout Information */}
            {activeBooking?.payoutId && (
              <>
                <Separator />
                <div>
                  <SectionTitle>Payout Information</SectionTitle>
                  <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Payout Status
                      </span>
                      <StatusBadge
                        status={activeBooking.payoutId.payoutStatus || "pending"}
                        type="payout"
                      />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Booking Amount</p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(
                            activeBooking.payoutId.financials?.bookingAmount || 0
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Commission (
                          {activeBooking.payoutId.financials?.commissionRate || 0}%)
                        </p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(
                            activeBooking.payoutId.financials?.commissionAmount || 0
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gross Payout</p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(
                            activeBooking.payoutId.financials?.grossPayout || 0
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deductions</p>
                        <p className="font-medium text-destructive">
                          -
                          {formatCurrency(
                            activeBooking.payoutId.financials?.deductions || 0
                          )}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-success" />
                        <span className="font-semibold text-foreground">
                          Net Payout
                        </span>
                      </div>
                      <span className="text-xl font-bold text-success">
                        {formatCurrency(activeBooking.payoutId.financials?.netPayout || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Owner Information */}
            <Separator />
            <div>
              <SectionTitle>Owner Information</SectionTitle>
              <div className="space-y-3">
                <InfoRow
                  icon={User}
                  label="Name"
                  value={activeBooking?.ownerId?.name || "Host"}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={activeBooking?.ownerId?.email || "-"}
                />
              </div>
            </div>

            {/* 🛡️ ADMIN OVERRIDE CANCELLATION (FOR ACTIVE/CONFIRMED BOOKINGS) */}
            {isConfirmed && (
              <>
                <Separator />
                <div>
                  {!showOverrideBox ? (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowOverrideBox(true)}
                      className="text-xs text-muted-foreground hover:text-destructive"
                    >
                      Administrative Cancellation Override...
                    </Button>
                  ) : (
                    <div className="bg-destructive/5 border border-destructive/20 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-destructive flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          Administrative Cancellation Override
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowOverrideBox(false)}
                          className="h-6 text-xs text-muted-foreground"
                        >
                          Cancel
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use only if guest requested direct manual cancellation or emergency intervention.
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-foreground block mb-1">
                            Refund Amount (₹)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            max={totalPaid}
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            placeholder="0"
                            className="h-8 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-foreground block mb-1">
                            Reason / Administrative Note
                          </label>
                          <Input
                            type="text"
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="Guest called support / Emergency"
                            className="h-8 text-xs"
                          />
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isSubmitting}
                        onClick={handleApprove}
                        className="text-xs mt-2"
                      >
                        {isSubmitting ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                        Execute Administrative Cancellation
                      </Button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Metadata */}
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <p>
                  Created:{" "}
                  {createdDate && !isNaN(createdDate)
                    ? format(createdDate, "MMM dd, yyyy 'at' hh:mm a")
                    : "-"}
                </p>
              </div>
              <div>
                <p>
                  Updated:{" "}
                  {updatedDate && !isNaN(updatedDate)
                    ? format(updatedDate, "MMM dd, yyyy 'at' hh:mm a")
                    : "-"}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
