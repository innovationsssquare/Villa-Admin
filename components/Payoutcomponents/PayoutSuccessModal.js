"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Check, Building2, User, CreditCard, Hash, Calendar } from "lucide-react";
import { format } from "date-fns";

const formatCurrency = (amount, currency = "INR") => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency || "INR",
    minimumFractionDigits: 2,
  }).format(amount || 0);
};

export default function PayoutSuccessModal({ isOpen, onClose, payoutResult }) {
  const [copied, setCopied] = useState(false);

  if (!payoutResult) return null;

  const {
    amount = 0,
    utr = "N/A",
    payoutId = "",
    hostName = "Host",
    propertyName = "Property",
    destinationAccount = "",
    mode = "IMPS",
  } = payoutResult;

  const handleCopyUTR = () => {
    if (navigator?.clipboard && utr) {
      navigator.clipboard.writeText(utr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-card border border-emerald-500/30 p-6 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center pb-2">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-3 animate-in zoom-in-75 duration-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <DialogTitle className="text-xl font-extrabold text-foreground tracking-tight">
            Payout Disbursed Successfully! 🎉
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Funds transferred in real-time via RazorpayX to vendor's registered account.
          </p>
        </DialogHeader>

        {/* Transaction Summary Card */}
        <div className="bg-muted/40 rounded-xl p-4 border border-border/60 space-y-3.5 my-2">
          {/* Transferred Amount */}
          <div className="flex flex-col items-center justify-center py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
              Disbursed Amount
            </span>
            <span className="text-2xl font-black text-emerald-500 tracking-tight mt-0.5">
              {formatCurrency(amount)}
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Mode: {mode} (24x7 Instant Settlement)
            </span>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Beneficiary:
              </span>
              <span className="font-semibold text-foreground">{hostName}</span>
            </div>

            {propertyName && (
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Property:
                </span>
                <span className="font-medium text-foreground truncate max-w-[200px]">
                  {propertyName}
                </span>
              </div>
            )}

            {destinationAccount && (
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5" /> Destination:
                </span>
                <span className="font-medium text-foreground font-mono">
                  {destinationAccount}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Date & Time:
              </span>
              <span className="font-medium text-foreground">
                {format(new Date(), "dd MMM yyyy, hh:mm a")}
              </span>
            </div>

            {/* UTR Reference with Copy Button */}
            <div className="flex items-center justify-between pt-2 border-t border-border/50">
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Hash className="w-3.5 h-3.5" /> UTR / Ref ID:
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-foreground bg-background px-2 py-0.5 rounded border border-border">
                  {utr || payoutId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyUTR}
                  className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                  title="Copy UTR"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-2 sm:justify-center">
          <Button
            type="button"
            onClick={onClose}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-md active:scale-95 transition-all"
          >
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
