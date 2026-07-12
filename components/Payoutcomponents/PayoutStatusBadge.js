import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";



const PayoutStatusBadge = ({ status, type = 'payout' }) => {
  const getStatusConfig = () => {
    const lowerStatus = status.toLowerCase();
    
    if (type === 'payout') {
      switch (lowerStatus) {
        case 'pending':
          return { label: 'Pending', className: 'bg-warning/20 text-warning border-warning/30' };
        case 'processing':
          return { label: 'Processing', className: 'bg-info/20 text-info border-info/30' };
        case 'completed':
        case 'paid':
          return { label: 'Paid', className: 'bg-success/20 text-success border-success/30' };
        case 'failed':
          return { label: 'Failed', className: 'bg-destructive/20 text-destructive border-destructive/30' };
        case 'on_hold':
          return { label: 'On Hold', className: 'bg-muted text-muted-foreground border-muted' };
        default:
          return { label: status, className: 'bg-muted text-muted-foreground border-muted' };
      }
    }
    
    if (type === 'booking') {
      switch (lowerStatus) {
        case 'confirmed':
          return { label: 'Confirmed', className: 'bg-success/20 text-success border-success/30' };
        case 'pending':
          return { label: 'Pending', className: 'bg-warning/20 text-warning border-warning/30' };
        case 'cancelled':
          return { label: 'Cancelled', className: 'bg-destructive/20 text-destructive border-destructive/30' };
        case 'completed':
          return { label: 'Completed', className: 'bg-info/20 text-info border-info/30' };
        default:
          return { label: status, className: 'bg-muted text-muted-foreground border-muted' };
      }
    }

    if (type === 'refund') {
      return status ? 
        { label: 'Refunded', className: 'bg-destructive/20 text-destructive border-destructive/30' } :
        { label: 'No Refund', className: 'bg-muted text-muted-foreground border-muted' };
    }

    if (type === 'dispute') {
      return status ? 
        { label: 'Disputed', className: 'bg-warning/20 text-warning border-warning/30' } :
        { label: 'No Dispute', className: 'bg-muted text-muted-foreground border-muted' };
    }

    return { label: status, className: 'bg-muted text-muted-foreground border-muted' };
  };

  const config = getStatusConfig();

  return (
    <Badge 
      variant="outline" 
      className={cn("font-medium text-xs border", config.className)}
    >
      {config.label}
    </Badge>
  );
};

export default PayoutStatusBadge;
