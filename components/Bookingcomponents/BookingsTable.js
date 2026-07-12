import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatusBadge } from "./StatusBadge";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Building2, Tent, Home, Hotel, Users, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const propertyIcons = {
  Villa: <Home className="h-4 w-4" />,
  Hotels: <Hotel className="h-4 w-4" />,
  Cottages: <Building2 className="h-4 w-4" />,
  Camping: <Tent className="h-4 w-4" />,
};

const formatCurrency = (amount, currency = "INR") => {
  if (!amount) return "₹0";

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function BookingsTable({ bookings, isLoading,onViewBooking }) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden h-[50vh] flex justify-center items-center">
        <div className="p-8 text-center text-muted-foreground">
           <span className="loader2"></span>
        </div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="p-8 text-center text-muted-foreground">
          No bookings found matching your filters.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Booking ID</TableHead>
              <TableHead className="font-semibold">Property</TableHead>
              <TableHead className="font-semibold">Customer</TableHead>
              <TableHead className="font-semibold">Dates</TableHead>
              <TableHead className="font-semibold">Guests</TableHead>
              <TableHead className="font-semibold">Amount</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Payment</TableHead>
              <TableHead className="font-semibold">Mode</TableHead>
              <TableHead className="font-semibold text-right">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking._id} className="group">
                <TableCell className="font-mono text-xs">
                  {booking._id.slice(-8).toUpperCase()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                      {propertyIcons[booking.propertyType] || (
                        <Building2 className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {booking.propertyType}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {booking.items.length}{" "}
                        {booking.items.length === 1 ? "unit" : "units"}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium text-sm">
                      {booking.customerDetails.firstName}{" "}
                      {booking.customerDetails.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {booking.customerDetails.email}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>
                      {format(new Date(booking.checkIn), "MMM dd, yyyy")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      to {format(new Date(booking.checkOut), "MMM dd, yyyy")}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-sm">
                      {booking.guests.adults}A
                      {booking.guests.children > 0 &&
                        `, ${booking.guests.children}C`}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold text-sm">
                      {formatCurrency(
                        booking.pricing.totalAmount,
                        booking.pricing.currency
                      )}
                    </div>
                    {booking.coupon.applied && (
                      <div className="text-xs text-success">
                        -{formatCurrency(booking.coupon.discountAmount)}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.status} type="booking" />
                </TableCell>
                <TableCell>
                  <StatusBadge status={booking.paymentStatus} type="payment" />
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      booking.bookingMode === "online"
                        ? "bg-primary/10 text-primary border-primary/30"
                        : "bg-secondary text-secondary-foreground"
                    }
                  >
                    {booking.bookingMode}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => onViewBooking(booking)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
