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

  const safeBookings = useMemo(() => {
    return Array.isArray(bookings) ? bookings : [];
  }, [bookings]);

  // Filter bookings based on current filters (client-side for demo)
  const filteredBookings = useMemo(() => {
    let result = [...safeBookings];

    if (filters?.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim();
      result = result.filter((b) => {
        const guestName = (
          b?.guestDetails?.name ||
          b?.user?.name ||
          b?.customerDetails?.name ||
          b?.customerName ||
          ""
        ).toLowerCase();
        const guestEmail = (
          b?.guestDetails?.email ||
          b?.user?.email ||
          b?.customerDetails?.email ||
          b?.email ||
          ""
        ).toLowerCase();
        const guestPhone = (
          b?.guestDetails?.phoneNumber ||
          b?.user?.phoneNumber ||
          b?.customerDetails?.mobile ||
          b?.phoneNumber ||
          ""
        ).toLowerCase();
        const bookingId = (
          b?.bookingId ||
          b?._id ||
          ""
        ).toLowerCase();
        const propertyTitle = (
          b?.propertyId?.title ||
          b?.propertyId?.name ||
          b?.property?.title ||
          b?.property?.name ||
          b?.propertyTitle ||
          ""
        ).toLowerCase();

        return (
          guestName.includes(q) ||
          guestEmail.includes(q) ||
          guestPhone.includes(q) ||
          bookingId.includes(q) ||
          propertyTitle.includes(q)
        );
      });
    }

    if (filters?.status) {
      result = result.filter((b) => b?.status === filters.status);
    }
    if (filters?.paymentStatus) {
      result = result.filter((b) => b?.paymentStatus === filters.paymentStatus);
    }
    if (filters?.propertyType) {
      result = result.filter((b) => b?.propertyType === filters.propertyType);
    }
    if (filters?.startDate) {
      result = result.filter(
        (b) => b?.checkIn && new Date(b.checkIn) >= new Date(filters.startDate)
      );
    }
    if (filters?.endDate) {
      result = result.filter(
        (b) => b?.checkOut && new Date(b.checkOut) <= new Date(filters.endDate)
      );
    }

    return result;
  }, [filters, safeBookings]);

  // Calculate stats
  const stats = useMemo(() => {
    // Only calculate revenue for confirmed or completed transactions (exclude pending and unpaid)
    const confirmedOrCompletedBookings = safeBookings.filter(
      (b) =>
        (b?.status === "confirmed" || b?.status === "completed") &&
        b?.paymentStatus !== "unpaid" &&
        b?.bookingMode !== "offline" &&
        !b?.isOffline
    );

    const totalRevenue = confirmedOrCompletedBookings.reduce(
      (sum, b) => sum + (b?.pricing?.totalAmount || 0),
      0
    );

    const completedBookings = safeBookings.filter(
      (b) => b?.status === "completed"
    ).length;

    const paidBookings = safeBookings.filter(
      (b) => b?.paymentStatus === "fully_paid" || b?.paymentStatus === "paid"
    ).length;

    return {
      totalBookings: safeBookings.length,
      totalRevenue,
      completedBookings,
      paidBookings,
    };
  }, [safeBookings]);


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
          page={pagination?.page || 1}
          totalPages={pagination?.totalPages || 1}
          total={pagination?.total || 0}
          limit={pagination?.limit || 10}
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
