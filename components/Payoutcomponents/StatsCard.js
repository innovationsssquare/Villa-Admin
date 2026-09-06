import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor,
  trend,
  className,
}) {
  return (
    <div
      className={cn(
        "bg-card dark:bg-[#121215] rounded-xl border border-border dark:border-neutral-800 p-5 shadow-sm transition-all hover:shadow-md dark:hover:border-neutral-700",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground dark:text-neutral-400">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground dark:text-white">{value}</p>
          {trend && (
            <p
              className={cn(
                "mt-1 text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.isPositive ? "+" : ""}
              {trend.value}% from last month
            </p>
          )}
        </div>
        <div className="p-2.5 rounded-lg bg-primary/10">
          <Icon className={cn("h-5 w-5", iconColor || "text-primary")} />
        </div>
      </div>
    </div>
  );
}

export default StatsCard;
