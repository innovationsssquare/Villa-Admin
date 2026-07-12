import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import PayoutStatusBadge from "./PayoutStatusBadge";
import {
  Building2,
  User,
  Calendar,
  IndianRupee,
  Percent,
  Send,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const PayoutDetailsModal = ({ payout, isOpen, onClose, onRequestPayout }) => {
  if (!payout) return null;

  const { financials } = payout;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-xl">Payout Details</span>
            <PayoutStatusBadge status={payout.payoutStatus} type="payout" />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Booking Reference & Property */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <Building2 className="h-4 w-4" />
                <span className="text-sm font-medium">Property</span>
              </div>
              <p className="font-semibold text-foreground">
                {payout.propertyName}
              </p>
              <p className="text-sm text-muted-foreground">
                {payout.propertyType}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-mono">
                Ref: #{payout.bookingReference}
              </p>
            </div>

            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Owner</span>
              </div>
              <p className="font-semibold text-foreground">
                {payout.ownerDetails.name}
              </p>
              <p className="text-sm text-muted-foreground">
                {payout.ownerDetails.email}
              </p>
            </div>
          </div>

          {/* Booking Dates */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">Booking Period</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Check-in</p>
                <p className="font-medium text-foreground">
                  {format(new Date(payout.checkIn), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Check-out</p>
                <p className="font-medium text-foreground">
                  {format(new Date(payout.checkOut), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Booking Status</p>
                <PayoutStatusBadge
                  status={payout.bookingStatus}
                  type="booking"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Breakdown */}
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-4">
              <IndianRupee className="h-4 w-4" />
              <span className="text-sm font-medium">Financial Breakdown</span>
            </div>

            <div className="space-y-3">
              {/* Booking Amount */}
              <div className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded">
                <span className="text-muted-foreground">Booking Amount</span>
                <span className="font-semibold text-foreground">
                  {formatCurrency(
                    financials.bookingAmount,
                    financials.currency
                  )}
                </span>
              </div>

              {/* Commission */}
              <div className="border border-border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">
                      Platform Commission
                    </span>
                  </div>
                  <span className="text-info font-semibold">
                    {formatCurrency(
                      financials.commissionAmount,
                      financials.currency
                    )}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Rate</span>
                    <span>{financials.commissionRate}%</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Type</span>
                    <span className="capitalize">
                      {financials.commissionType}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax on Commission */}
              <div className="border border-border rounded-lg p-3">
                <p className="font-medium text-foreground mb-2">
                  Tax on Commission
                </p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>TDS ({financials.taxOnCommission.tdsRate}%)</span>
                    <span>
                      {formatCurrency(
                        financials.taxOnCommission.tdsAmount,
                        financials.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST ({financials.taxOnCommission.gstRate}%)</span>
                    <span>
                      {formatCurrency(
                        financials.taxOnCommission.gstAmount,
                        financials.currency
                      )}
                    </span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Total Tax</span>
                    <span>
                      {formatCurrency(
                        financials.taxOnCommission.totalTax,
                        financials.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Gateway Fee */}
              {financials.paymentGatewayFee.amount > 0 && (
                <div className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded">
                  <span className="text-muted-foreground">
                    Gateway Fee ({financials.paymentGatewayFee.rate}%)
                  </span>
                  <span className="text-foreground">
                    {formatCurrency(
                      financials.paymentGatewayFee.amount,
                      financials.currency
                    )}
                  </span>
                </div>
              )}

              {/* Admin Earnings */}
              <div className="bg-info/10 border border-info/30 rounded-lg p-3">
                <p className="font-medium text-info mb-2">Admin Earnings</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Commission</span>
                    <span>
                      {formatCurrency(
                        financials.adminEarnings.commission,
                        financials.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax Collected</span>
                    <span>
                      {formatCurrency(
                        financials.adminEarnings.tax,
                        financials.currency
                      )}
                    </span>
                  </div>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold text-info">
                  <span>Total Admin Earnings</span>
                  <span>
                    {formatCurrency(
                      financials.adminEarnings.total,
                      financials.currency
                    )}
                  </span>
                </div>
              </div>

              {/* Payout Summary */}
              <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Gross Payout</span>
                    <span>
                      {formatCurrency(
                        financials.grossPayout,
                        financials.currency
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Deductions</span>
                    <span>
                      -{" "}
                      {formatCurrency(
                        financials.deductions,
                        financials.currency
                      )}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-success">
                    <span>Net Payout</span>
                    <span>
                      {formatCurrency(
                        financials.netPayout,
                        financials.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Payout Schedule */}
          <div className="bg-muted/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">Payout Schedule</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Type</p>
                <p className="font-medium text-foreground capitalize">
                  {payout.payoutSchedule.type.replace("_", " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hold Period</p>
                <p className="font-medium text-foreground">
                  {payout.payoutSchedule.holdPeriod} days
                </p>
              </div>
            </div>
          </div>

          {/* Refund & Dispute Status */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`rounded-lg p-4 ${
                payout.refund.isRefunded ? "bg-destructive/10" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {payout.refund.isRefunded ? (
                  <XCircle className="h-4 w-4 text-destructive" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                )}
                <span className="text-sm font-medium text-foreground">
                  Refund Status
                </span>
              </div>
              <p
                className={`font-medium ${
                  payout.refund.isRefunded ? "text-destructive" : "text-success"
                }`}
              >
                {payout.refund.isRefunded ? "Refunded" : "No Refund"}
              </p>
            </div>

            <div
              className={`rounded-lg p-4 ${
                payout.dispute.isDisputed ? "bg-warning/10" : "bg-muted/30"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {payout.dispute.isDisputed ? (
                  <AlertTriangle className="h-4 w-4 text-warning" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-success" />
                )}
                <span className="text-sm font-medium text-foreground">
                  Dispute Status
                </span>
              </div>
              <p
                className={`font-medium ${
                  payout.dispute.isDisputed ? "text-warning" : "text-success"
                }`}
              >
                {payout.dispute.isDisputed ? "Disputed" : "No Dispute"}
              </p>
            </div>
          </div>

          {/* Action Button */}
          {payout.payoutStatus === "pending" && (
            <div className="pt-4">
              <Button
                onClick={() => onRequestPayout(payout)}
                className="w-full bg-success hover:bg-success/90 text-success-foreground"
              >
                <Send className="h-4 w-4 mr-2" />
                Request Payout via Razorpay
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutDetailsModal;
