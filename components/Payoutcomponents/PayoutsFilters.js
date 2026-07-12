import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const PayoutsFilters = ({ filters, onFilterChange, onReset }) => {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleDateChange = (key, date) => {
    onFilterChange({
      ...filters,
      [key]: date ? date.toISOString().split("T")[0] : undefined,
      page: 1,
    });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg border border-border">
      {/* Payout Status Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Payout Status
        </label>
        <Select
          value={filters.payoutStatus || "all"}
          onValueChange={(value) => handleFilterChange("payoutStatus", value)}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="on_hold">On Hold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Property Type Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Property Type
        </label>
        <Select
          value={filters.propertyType || "all"}
          onValueChange={(value) => handleFilterChange("propertyType", value)}
        >
          <SelectTrigger className="w-[160px] bg-background">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Villa">Villa</SelectItem>
            <SelectItem value="Camping">Camping</SelectItem>
            <SelectItem value="Cottages">Cottages</SelectItem>
            <SelectItem value="Hotels">Hotels</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Start Date Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          From Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal bg-background",
                !filters.startDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.startDate
                ? format(new Date(filters.startDate), "PP")
                : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={
                filters.startDate ? new Date(filters.startDate) : undefined
              }
              onSelect={(date) => handleDateChange("startDate", date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* End Date Filter */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          To Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-[160px] justify-start text-left font-normal bg-background",
                !filters.endDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.endDate
                ? format(new Date(filters.endDate), "PP")
                : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={filters.endDate ? new Date(filters.endDate) : undefined}
              onSelect={(date) => handleDateChange("endDate", date)}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Reset Button */}
      <div className="flex flex-col gap-1.5 justify-end">
        <label className="text-xs font-medium text-transparent">Reset</label>
        <Button
          variant="ghost"
          size="icon"
          onClick={onReset}
          className="h-10 w-10"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PayoutsFilters;
