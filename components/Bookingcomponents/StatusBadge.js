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
