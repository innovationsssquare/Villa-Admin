import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Send, Building2, Tent, Home, Hotel } from "lucide-react";
import { format } from "date-fns";
import PayoutStatusBadge from "./PayoutStatusBadge";

const PropertyIcon = ({ type }) => {
  const iconProps = { className: "h-4 w-4 text-muted-foreground" };
  switch (type.toLowerCase()) {
    case "villa":
      return <Home {...iconProps} />;
    case "camping":
      return <Tent {...iconProps} />;
    case "cottages":
      return <Building2 {...iconProps} />;
    case "hotels":
      return <Hotel {...iconProps} />;
    default:
      return <Building2 {...iconProps} />;
  }
};

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const PayoutsTable = ({ payouts, onViewPayout, onRequestPayout }) => {
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="font-semibold text-foreground">
              Reference
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Property
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Owner
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Check-in/out
            </TableHead>
            <TableHead className="font-semibold text-foreground text-right">
              Booking Amt
            </TableHead>
            <TableHead className="font-semibold text-foreground text-right">
              Commission
            </TableHead>
            <TableHead className="font-semibold text-foreground text-right">
              Net Payout
            </TableHead>
            <TableHead className="font-semibold text-foreground">
              Status
            </TableHead>
            <TableHead className="font-semibold text-foreground text-center">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payouts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No payouts found
              </TableCell>
            </TableRow>
          ) : (
            payouts.map((payout) => (
              <TableRow key={payout._id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-mono text-sm font-medium text-foreground">
                      #{payout.bookingReference}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(payout.createdAt), "dd MMM yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PropertyIcon type={payout.propertyType} />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground truncate max-w-[150px]">
                        {payout.propertyName}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payout.propertyType}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                      {payout.ownerDetails.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {payout.ownerDetails.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col text-sm">
                    <span className="text-foreground">
                      {format(new Date(payout.checkIn), "dd MMM")}
                    </span>
                    <span className="text-muted-foreground">
                      {format(new Date(payout.checkOut), "dd MMM yyyy")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-medium text-foreground">
                    {formatCurrency(
                      payout.financials.bookingAmount,
                      payout.financials.currency
                    )}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-medium text-info">
                      {formatCurrency(
                        payout.financials.commissionAmount,
                        payout.financials.currency
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {payout.financials.commissionRate}%
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <span className="font-semibold text-success">
                    {formatCurrency(
                      payout.financials.netPayout,
                      payout.financials.currency
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  <PayoutStatusBadge
                    status={payout.payoutStatus}
                    type="payout"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewPayout(payout)}
                      className="h-8 w-8 hover:bg-primary/10"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {payout.payoutStatus === "pending" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRequestPayout(payout)}
                        className="h-8 w-8 hover:bg-success/10 text-success"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PayoutsTable;
