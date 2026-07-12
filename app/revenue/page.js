"use client";
import { useState, useMemo, useEffect } from "react";
import { IndianRupee, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import StatsCard from "@/components/Payoutcomponents/StatsCard";
import PayoutsFilters from "@/components/Payoutcomponents/PayoutsFilters";
import PayoutsTable from "@/components/Payoutcomponents/PayoutsTable";
import PayoutsPagination from "@/components/Payoutcomponents/PayoutsPagination";
import PayoutDetailsModal from "@/components/Payoutcomponents/PayoutDetailsModal";
import RequestPayoutModal from "@/components/Payoutcomponents/RequestPayoutModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllpayout } from "@/lib/Redux/Slices/payoutSlice";



const AdminPayouts = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [payoutToRequest, setPayoutToRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { payouts, loading, error } = useSelector((state) => state.payout);
  // Filter data based on current filters
  useEffect(() => {
    dispatch(fetchAllpayout(filters));
  }, [dispatch, filters]);

const filteredData = useMemo(() => {
  let data = [...payouts];

  if (filters.payoutStatus) {
    data = data.filter((p) => p.payoutStatus === filters.payoutStatus);
  }
  if (filters.propertyType) {
    data = data.filter((p) => p.propertyType === filters.propertyType);
  }
  if (filters.startDate) {
    data = data.filter(
      (p) => new Date(p.checkIn) >= new Date(filters.startDate)
    );
  }
  if (filters.endDate) {
    data = data.filter(
      (p) => new Date(p.checkOut) <= new Date(filters.endDate)
    );
  }

  return data;
}, [filters, payouts]);   // 👈 add payouts

  // Calculate stats
const stats = useMemo(() => {
  const allData = payouts;

  const totalPending = allData.filter(
    (p) => p.payoutStatus === "pending"
  ).length;

  const totalCompleted = allData.filter(
    (p) => p.payoutStatus === "completed"
  ).length;

  const pendingAmount = allData
    .filter((p) => p.payoutStatus === "pending")
    .reduce((sum, p) => sum + p.financials.netPayout, 0);

  const totalCommission = allData.reduce(
    (sum, p) => sum + p.financials.commissionAmount,
    0
  );

  return {
    totalPending,
    totalCompleted,
    pendingAmount,
    totalCommission,
  };
}, [payouts]);   // 👈 add payouts


  // Pagination
  const paginatedData = useMemo(() => {
    const start = ((filters.page || 1) - 1) * (filters.limit || 10);
    const end = start + (filters.limit || 10);
    return filteredData.slice(start, end);
  }, [filteredData, filters.page, filters.limit]);

  const totalPages = Math.ceil(filteredData.length / (filters.limit || 10));

  const handleViewPayout = (payout) => {
    setSelectedPayout(payout);
    setIsDetailsModalOpen(true);
  };

  const handleRequestPayout = (payout) => {
    setPayoutToRequest(payout);
    setIsRequestModalOpen(true);
  };

  const handleConfirmPayout = async (payout) => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsRequestModalOpen(false);
    setPayoutToRequest(null);
    toast.success(
      `Payout request initiated for ₹${payout.financials.netPayout.toLocaleString()}`
    );
  };

  const handleResetFilters = () => {
    setFilters({ page: 1, limit: 10 });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ScrollArea className="pb-14 bg-gray-50 h-screen p-4">
      <div className="w-full mx-auto space-y-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Pending Payouts"
            value={stats.totalPending.toString()}
            icon={Clock}
            iconColor="text-warning"
          />
          <StatsCard
            title="Completed Payouts"
            value={stats.totalCompleted.toString()}
            icon={CheckCircle2}
            iconColor="text-success"
          />
          <StatsCard
            title="Pending Amount"
            value={formatCurrency(stats.pendingAmount)}
            icon={IndianRupee}
            iconColor="text-warning"
          />
          <StatsCard
            title="Total Commission"
            value={formatCurrency(stats.totalCommission)}
            icon={AlertTriangle}
            iconColor="text-info"
          />
        </div>

        {/* Filters */}
        <PayoutsFilters
          filters={filters}
          onFilterChange={setFilters}
          onReset={handleResetFilters}
        />

        {/* Table */}
        <PayoutsTable
          payouts={paginatedData}
          onViewPayout={handleViewPayout}
          onRequestPayout={handleRequestPayout}
        />

        {/* Pagination */}
        <PayoutsPagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          totalRecords={filteredData.length}
          limit={filters.limit || 10}
          onPageChange={(page) => setFilters({ ...filters, page })}
          onLimitChange={(limit) => setFilters({ ...filters, limit, page: 1 })}
        />

        {/* Modals */}
        <PayoutDetailsModal
          payout={selectedPayout}
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedPayout(null);
          }}
          onRequestPayout={handleRequestPayout}
        />

        <RequestPayoutModal
          payout={payoutToRequest}
          isOpen={isRequestModalOpen}
          onClose={() => {
            setIsRequestModalOpen(false);
            setPayoutToRequest(null);
          }}
          onConfirm={handleConfirmPayout}
          isLoading={isProcessing}
        />
      </div>
    </ScrollArea>
  );
};

export default AdminPayouts;
