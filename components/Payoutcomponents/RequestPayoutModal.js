import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IndianRupee, Send, User, Building2 } from "lucide-react";

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

const RequestPayoutModal = ({
  payout,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!payout) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-card">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-success" />
            Request Payout via Razorpay
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <p className="text-muted-foreground">
                You are about to initiate a payout request through Razorpay for
                the following:
              </p>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {payout.propertyName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ref: #{payout.bookingReference}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {payout.ownerDetails.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payout.ownerDetails.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Net Payout Amount
                    </p>
                    <p className="text-lg font-bold text-success">
                      {formatCurrency(
                        payout.financials.netPayout,
                        payout.financials.currency
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-warning">
                This action will trigger a Razorpay payout to the vendor's
                registered bank account.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(payout)}
            disabled={isLoading}
            className="bg-success hover:bg-success/90 text-success-foreground"
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Confirm Payout
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RequestPayoutModal;
