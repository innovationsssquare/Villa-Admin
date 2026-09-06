"use client";
import { useState, useMemo, useEffect } from "react";
import {
  CalendarDays,
  CreditCard,
  IndianRupee,
  TrendingUp,
} from "lucide-react";
import { BookingsPagination } from "@/components/Bookingcomponents/BookingsPagination";
import { BookingsTable } from "@/components/Bookingcomponents/BookingsTable";
import { BookingsFilters } from "@/components/Bookingcomponents/BookingsFilters";
import { StatsCard } from "@/components/Bookingcomponents/StatsCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookingDetailsModal } from "@/components/Bookingcomponents/BookingDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings } from "@/lib/Redux/Slices/bookingSlice";

const defaultFilters = {
  page: 1,
  limit: 10,
  sortBy: "createdAt",
  sortOrder: "desc",
};

export default function AdminBookings() {
  const [filters, setFilters] = useState(defaultFilters);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { bookings, loading, pagination } = useSelector(
    (state) => state.booking
  );

  useEffect(() => {
    dispatch(
      fetchAllBookings({
        page: filters.page,
        limit: filters.limit,
      })
    );
  }, [filters.page, filters.limit, dispatch]);

  // Filter bookings based on current filters (client-side for demo)
  const filteredBookings = useMemo(() => {
    let result = [...bookings];

    if (filters.status) {
      result = result.filter((b) => b.status === filters.status);
    }
    if (filters.paymentStatus) {
      result = result.filter((b) => b.paymentStatus === filters.paymentStatus);
    }
    if (filters.propertyType) {
      result = result.filter((b) => b.propertyType === filters.propertyType);
    }
    if (filters.startDate) {
      result = result.filter(
        (b) => new Date(b.checkIn) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      result = result.filter(
        (b) => new Date(b.checkOut) <= new Date(filters.endDate)
      );
    }

    return result;
  }, [filters, bookings]);

  // Paginate


  // Calculate stats
const stats = useMemo(() => {
  const totalRevenue = bookings.reduce(
    (sum, b) => sum + (b.pricing?.totalAmount || 0),
    0
  );

  const completedBookings = bookings.filter(
    (b) => b.status === "completed"
  ).length;

  const paidBookings = bookings.filter(
    (b) => b.paymentStatus === "fully_paid"
  ).length;

  return {
    totalBookings: bookings.length,
    totalRevenue,
    completedBookings,
    paidBookings,
  };
}, [bookings]);


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (limit) => {
    setFilters((prev) => ({ ...prev, limit, page: 1 }));
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  return (
    <ScrollArea className="pb-14 bg-gray-50 dark:bg-[#09090B] h-[calc(100vh-64px)] text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={CalendarDays}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Total Revenue"
            value={formatCurrency(stats.totalRevenue)}
            icon={IndianRupee}
            trend={{ value: 8, isPositive: true }}
          />
          <StatsCard
            title="Completed"
            value={stats.completedBookings}
            icon={TrendingUp}
          />
          <StatsCard
            title="Paid"
            value={stats.paidBookings}
            icon={CreditCard}
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <BookingsFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Table */}
        <div className="mb-6">
          <BookingsTable
            bookings={filteredBookings}
            onViewBooking={handleViewBooking}
            isLoading={loading}
          />
        </div>

        {/* Pagination */}
        <BookingsPagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          total={pagination.total}
          limit={pagination.limit}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />

        <BookingDetailsModal
          booking={selectedBooking}
          open={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </ScrollArea>
  );
}
