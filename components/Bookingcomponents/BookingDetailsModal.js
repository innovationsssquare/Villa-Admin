import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground break-words">
          {value}
        </p>
      </div>
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-sm font-semibold text-foreground mb-3">{children}</h3>
  );
}

export function BookingDetailsModal({ booking, open, onClose }) {
  if (!booking) return null;

  const customerName = `${booking.customerDetails.firstName} ${
    booking.customerDetails.lastName || ""
  }`.trim();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-xl font-bold">
                Booking Details
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                ID: {booking._id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={booking.status} type="booking" />
              <StatusBadge status={booking.paymentStatus} type="payment" />
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-100px)]">
          <div className="p-6 pt-4 space-y-6">
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
                        {booking.propertyType}
                      </Badge>
                    }
                  />
                  <InfoRow
                    icon={Tag}
                    label="Booking Mode"
                    value={
                      <span className="capitalize">{booking.bookingMode}</span>
                    }
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Check-in"
                    value={format(
                      new Date(booking.checkIn),
                      "EEEE, MMMM dd, yyyy"
                    )}
                  />
                  <InfoRow
                    icon={Calendar}
                    label="Check-out"
                    value={format(
                      new Date(booking.checkOut),
                      "EEEE, MMMM dd, yyyy"
                    )}
                  />
                  <InfoRow
                    icon={Users}
                    label="Guests"
                    value={`${booking.guests.adults} Adult(s)${
                      booking.guests.children > 0
                        ? `, ${booking.guests.children} Child(ren)`
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
                    value={booking.customerDetails.email}
                  />
                  <InfoRow
                    icon={Phone}
                    label="Mobile"
                    value={booking.customerDetails.mobile}
                  />
                  {booking.customerDetails.city && (
                    <InfoRow
                      icon={MapPin}
                      label="City"
                      value={booking.customerDetails.city}
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
                {booking.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {item.typeName || item.unitType}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {item.unitType} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(item.totalPrice)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.pricePerNight)}/night
                      </p>
                    </div>
                  </div>
                ))}
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
                      {formatCurrency(booking.pricing.subtotal)}
                    </span>
                  </div>
                  {booking.pricing.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Discount</span>
                      <span className="text-success">
                        -{formatCurrency(booking.pricing.discountAmount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax</span>
                    <span className="text-foreground">
                      {formatCurrency(booking.pricing.taxAmount)}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary text-lg">
                      {formatCurrency(booking.pricing.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {booking.coupon.applied && (
                <div>
                  <SectionTitle>Coupon Applied</SectionTitle>
                  <div className="bg-success/10 border border-success/20 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Tag className="h-4 w-4 text-success" />
                      <span className="font-mono font-bold text-success">
                        {booking.coupon.code}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {booking.coupon.discountType === "percentage"
                        ? `${booking.coupon.discountValue}% off`
                        : formatCurrency(booking.coupon.discountValue || 0)}
                    </p>
                    <p className="text-sm font-medium text-success mt-1">
                      Saved: {formatCurrency(booking.coupon.discountAmount)}
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
                {booking.payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-primary/10">
                        <CreditCard className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">
                          {payment.paymentType} Payment
                        </p>
                        <p className="text-xs text-muted-foreground font-mono">
                          {payment.transactionId}
                        </p>
                        {payment.paidAt && (
                          <p className="text-xs text-muted-foreground">
                            {format(
                              new Date(payment.paidAt),
                              "MMM dd, yyyy 'at' hh:mm a"
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                      <StatusBadge status={payment.status} type="payment" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payout Information */}
            {booking.payoutId && (
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
                        status={booking.payoutId.payoutStatus}
                        type="payout"
                      />
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Booking Amount</p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(
                            booking.payoutId.financials.bookingAmount
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">
                          Commission (
                          {booking.payoutId.financials.commissionRate}%)
                        </p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(
                            booking.payoutId.financials.commissionAmount
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gross Payout</p>
                        <p className="font-medium text-foreground">
                          {formatCurrency(
                            booking.payoutId.financials.grossPayout
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Deductions</p>
                        <p className="font-medium text-destructive">
                          -
                          {formatCurrency(
                            booking.payoutId.financials.deductions
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
                        {formatCurrency(booking.payoutId.financials.netPayout)}
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
                  value={booking.ownerId.name}
                />
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={booking.ownerId.email}
                />
              </div>
            </div>

            {/* Metadata */}
            <Separator />
            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                <p>
                  Created:{" "}
                  {format(
                    new Date(booking.createdAt),
                    "MMM dd, yyyy 'at' hh:mm a"
                  )}
                </p>
              </div>
              <div>
                <p>
                  Updated:{" "}
                  {format(
                    new Date(booking.updatedAt),
                    "MMM dd, yyyy 'at' hh:mm a"
                  )}
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
