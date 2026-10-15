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
import { IndianRupee, Send, User, Building2, CreditCard, ShieldCheck, Loader2 } from "lucide-react";

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

const RequestPayoutModal = ({
  payout,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!payout) return null;

  const bankAccount = payout?.ownerDetails?.bankAccount;
  const upiId = payout?.ownerDetails?.upiId;

  return (
    <AlertDialog open={isOpen} onOpenChange={isLoading ? () => {} : onClose}>
      <AlertDialogContent className="bg-card max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-success" />
            Request Payout via Razorpay
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4 pt-2">
              <p className="text-muted-foreground">
                You are about to initiate a live payout request through Razorpay for
                the following:
              </p>

              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {payout?.propertyName || "Property"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Ref: #{payout?.bookingReference || payout?._id || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {payout?.ownerDetails?.name || "Host"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {payout?.ownerDetails?.email || ""}
                      {payout?.ownerDetails?.mobile ? ` • ${payout.ownerDetails.mobile}` : ""}
                    </p>
                  </div>
                </div>

                {/* Vendor's Registered Destination Bank Details */}
                {(bankAccount?.accountNumber || upiId) && (
                  <div className="flex items-center gap-3 pt-1 border-t border-border/50">
                    <CreditCard className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      {bankAccount?.accountNumber ? (
                        <>
                          <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                            <span>
                              {bankAccount.bankName || "Bank"}: ••••{" "}
                              {String(bankAccount.accountNumber).slice(-4)}
                            </span>
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-medium">
                              <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            IFSC: {bankAccount.ifscCode || "N/A"} • Name:{" "}
                            {bankAccount.accountHolderName || payout?.ownerDetails?.name}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs font-semibold text-foreground">
                            UPI ID: {upiId}
                          </p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Instant UPI Settlement
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-1 border-t border-border/50">
                  <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div className="flex items-baseline justify-between w-full">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Net Payout Amount
                      </p>
                      <p className="text-lg font-bold text-success">
                        {formatCurrency(
                          payout?.financials?.netPayout || 0,
                          payout?.financials?.currency
                        )}
                      </p>
                    </div>
                    <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-1 rounded">
                      Mode: IMPS (24x7)
                    </span>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Loader2 className="h-5 w-5 animate-spin shrink-0 text-emerald-400" />
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-emerald-300">
                      Processing Live Transfer...
                    </span>
                    <span className="text-[11px] text-emerald-400/80">
                      Communicating with RazorpayX to disburse funds. Please do not close this window.
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-warning">
                  This action will trigger an automated RazorpayX payout directly to the vendor's
                  registered account.
                </p>
              )}
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              if (!isLoading && onConfirm) onConfirm(payout);
            }}
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white min-w-[150px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
