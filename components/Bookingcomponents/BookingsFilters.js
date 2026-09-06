import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function BookingsFilters({ filters, onFilterChange, onReset }) {
  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
      page: 1,
    });
  };

  return (
    <div className="bg-card dark:bg-[#121215] rounded-xl border border-border dark:border-neutral-800 p-5 shadow-sm">
      <div className="flex flex-wrap items-end gap-4">
        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-xs font-medium text-muted-foreground">
            Booking Status
          </label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Filter */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-xs font-medium text-muted-foreground">
            Payment Status
          </label>
          <Select
            value={filters.paymentStatus || "all"}
            onValueChange={(value) => handleChange("paymentStatus", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Payments" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="partially_paid">Partially Paid</SelectItem>
              <SelectItem value="fully_paid">Fully Paid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type Filter */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-xs font-medium text-muted-foreground">
            Property Type
          </label>
          <Select
            value={filters.propertyType || "all"}
            onValueChange={(value) => handleChange("propertyType", value)}
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="All Properties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
              <SelectItem value="Hotels">Hotels</SelectItem>
              <SelectItem value="Cottages">Cottages</SelectItem>
              <SelectItem value="Camping">Camping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Start Date with Calendar */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-xs font-medium text-muted-foreground">
            From Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate
                  ? format(new Date(filters.startDate), "MMM dd, yyyy")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  filters.startDate ? new Date(filters.startDate) : undefined
                }
                onSelect={(date) => handleChange("startDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* End Date with Calendar */}
        <div className="flex flex-col gap-1.5 min-w-[160px]">
          <label className="text-xs font-medium text-muted-foreground">
            To Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate
                  ? format(new Date(filters.endDate), "MMM dd, yyyy")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={
                  filters.endDate ? new Date(filters.endDate) : undefined
                }
                onSelect={(date) => handleChange("endDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Reset Button */}
        {/* <Button
          variant="outline"
          onClick={onReset}
          className="h-10 gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button> */}
      </div>
    </div>
  );
}
