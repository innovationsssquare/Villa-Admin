import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const statusConfig = {
  booking: {
    pending: {
      label: "Pending",
      className: "bg-warning/15 text-warning border-warning/30",
    },
    confirmed: {
      label: "Confirmed",
      className: "bg-info/15 text-info border-info/30",
    },
    completed: {
      label: "Completed",
      className: "bg-success/15 text-success border-success/30",
    },
    cancelled: {
      label: "Cancelled",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    },
    cancellation_requested: {
      label: "Cancel Requested",
      className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-semibold",
    },
    requires_admin_review: {
      label: "Needs Review",
      className: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 font-semibold",
    },
  },
  refund: {
    pending: {
      label: "Refund Pending",
      className: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 font-medium",
    },
    processed: {
      label: "Refund Processed",
      className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-semibold",
    },
    rejected: {
      label: "Refund Rejected",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    },
    non_refundable: {
      label: "Non-Refundable",
      className: "bg-muted text-muted-foreground border-border",
    },
  },
  payment: {
    unpaid: {
      label: "Unpaid",
      className: "bg-destructive/15 text-destructive border-destructive/30",
    },
    partially_paid: {
      label: "Partial",
      className: "bg-warning/15 text-warning border-warning/30",
    },
    fully_paid: {
      label: "Paid",
      className: "bg-success/15 text-success border-success/30",
    },
  },
  payout: {
    pending: {
      label: "Pending",
      className: "bg-warning/15 text-warning border-warning/30",
    },
    not_created: {
      label: "Not Created",
      className: "bg-muted text-muted-foreground border-border",
    },
    completed: {
      label: "Completed",
      className: "bg-success/15 text-success border-success/30",
    },
  },
};

export function StatusBadge({ status, type }) {
  const config = statusConfig[type]?.[status] || {
    label: status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge
      variant="outline"
      className={cn("font-medium text-xs capitalize", config.className)}
    >
      {config.label}
    </Badge>
  );
}
