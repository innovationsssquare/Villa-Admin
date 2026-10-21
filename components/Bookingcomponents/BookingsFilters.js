import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { CalendarIcon, RotateCcw, Search, X } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function BookingsFilters({ filters, onFilterChange, onReset }) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  useEffect(() => {
    setSearchTerm(filters.search || "");
  }, [filters.search]);

  // Debounce search input by 400ms to avoid firing on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== (filters.search || "")) {
        onFilterChange({
          ...filters,
          search: searchTerm,
          page: 1,
        });
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onFilterChange({
      ...filters,
      search: "",
      page: 1,
    });
  };

  const hasActiveFilters = Boolean(
    filters.search ||
    filters.status ||
    filters.paymentStatus ||
    filters.propertyType ||
    filters.startDate ||
    filters.endDate
  );

  return (
    <div className="bg-card dark:bg-[#121215] rounded-xl border border-border dark:border-neutral-800 p-5 shadow-sm space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Search Input */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-[240px]">
          <label className="text-xs font-medium text-muted-foreground">
            Search Bookings
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Guest, phone, email, booking ID, villa..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-9 pr-9 h-10 text-sm bg-background dark:bg-neutral-900 border-border dark:border-neutral-800"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground">
            Booking Status
          </label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) => handleChange("status", value)}
          >
            <SelectTrigger className="h-10 bg-background dark:bg-neutral-900">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="cancellation_requested">Cancellation Requests ⚠️</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Payment Status Filter */}
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground">
            Payment Status
          </label>
          <Select
            value={filters.paymentStatus || "all"}
            onValueChange={(value) => handleChange("paymentStatus", value)}
          >
            <SelectTrigger className="h-10 bg-background dark:bg-neutral-900">
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
        <div className="flex flex-col gap-1.5 min-w-[150px]">
          <label className="text-xs font-medium text-muted-foreground">
            Property Type
          </label>
          <Select
            value={filters.propertyType || "all"}
            onValueChange={(value) => handleChange("propertyType", value)}
          >
            <SelectTrigger className="h-10 bg-background dark:bg-neutral-900">
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
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground">
            From Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 justify-start text-left font-normal bg-background dark:bg-neutral-900",
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
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <label className="text-xs font-medium text-muted-foreground">
            To Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-10 justify-start text-left font-normal bg-background dark:bg-neutral-900",
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
        {hasActiveFilters && onReset && (
          <Button
            variant="outline"
            onClick={onReset}
            className="h-10 gap-2 border-dashed border-gray-300 dark:border-neutral-700 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
