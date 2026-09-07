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

const PropertyIcon = ({ type = "" }) => {
  const iconProps = { className: "h-4 w-4 text-muted-foreground" };
  switch (String(type).toLowerCase()) {
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
    currency: currency || "INR",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const PayoutsTable = ({ payouts, onViewPayout, onRequestPayout }) => {
  const safePayouts = Array.isArray(payouts) ? payouts : [];

  return (
    <div className="rounded-lg border border-border dark:border-neutral-800 bg-card dark:bg-[#121215] overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 dark:bg-neutral-900/60 hover:bg-muted/50 dark:hover:bg-neutral-900/60 border-b border-border dark:border-neutral-800">
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
          {safePayouts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={9}
                className="text-center py-8 text-muted-foreground"
              >
                No payouts found
              </TableCell>
            </TableRow>
          ) : (
            safePayouts.map((payout) => {
              const createdDate = payout?.createdAt ? new Date(payout.createdAt) : null;
              const checkInDate = payout?.checkIn ? new Date(payout.checkIn) : null;
              const checkOutDate = payout?.checkOut ? new Date(payout.checkOut) : null;

              return (
                <TableRow
                  key={payout?._id || Math.random()}
                  className="hover:bg-muted/30 dark:hover:bg-neutral-800/40 border-b border-border dark:border-neutral-800/60"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-mono text-sm font-medium text-foreground">
                        #{payout?.bookingReference || "N/A"}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {createdDate && !isNaN(createdDate) ? format(createdDate, "dd MMM yyyy") : "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <PropertyIcon type={payout?.propertyType} />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground truncate max-w-[150px]">
                          {payout?.propertyName || "Property"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {payout?.propertyType || ""}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">
                        {payout?.ownerDetails?.name || "Host"}
                      </span>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {payout?.ownerDetails?.email || ""}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      <span className="text-foreground">
                        {checkInDate && !isNaN(checkInDate) ? format(checkInDate, "dd MMM") : "-"}
                      </span>
                      <span className="text-muted-foreground">
                        {checkOutDate && !isNaN(checkOutDate) ? format(checkOutDate, "dd MMM yyyy") : "-"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-medium text-foreground">
                      {formatCurrency(
                        payout?.financials?.bookingAmount || 0,
                        payout?.financials?.currency
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span className="font-medium text-info">
                        {formatCurrency(
                          payout?.financials?.commissionAmount || 0,
                          payout?.financials?.currency
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {payout?.financials?.commissionRate || 0}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-success">
                      {formatCurrency(
                        payout?.financials?.netPayout || 0,
                        payout?.financials?.currency
                      )}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PayoutStatusBadge
                      status={payout?.payoutStatus || "pending"}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewPayout && onViewPayout(payout)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payout?.payoutStatus === "pending" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onRequestPayout && onRequestPayout(payout)}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Pay
                        </Button>
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
  );
};

export default PayoutsTable;
