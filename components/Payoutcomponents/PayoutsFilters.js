import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, RotateCcw, Search, X } from "lucide-react";
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

  const handleSearchChange = (e) => {
    onFilterChange({
      ...filters,
      search: e.target.value,
      page: 1,
    });
  };

  const handleClearSearch = () => {
    onFilterChange({
      ...filters,
      search: "",
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
    <div className="flex flex-wrap items-end gap-3 p-4 bg-card dark:bg-[#121215] rounded-xl border border-border dark:border-neutral-800 shadow-sm">
      {/* Search Input */}
      <div className="flex flex-col gap-1.5 flex-1 min-w-[220px]">
        <label className="text-xs font-medium text-muted-foreground">
          Search Payouts
        </label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Host, property, payout ID, UTR..."
            value={filters.search || ""}
            onChange={handleSearchChange}
            className="pl-8 pr-8 h-10 text-xs bg-background dark:bg-neutral-900 border-border dark:border-neutral-800"
          />
          {filters.search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Payout Status Filter */}
      <div className="flex flex-col gap-1.5 min-w-[150px]">
        <label className="text-xs font-medium text-muted-foreground">
          Payout Status
        </label>
        <Select
          value={filters.payoutStatus || "all"}
          onValueChange={(value) => handleFilterChange("payoutStatus", value)}
        >
          <SelectTrigger className="w-full bg-background dark:bg-neutral-900 h-10">
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
