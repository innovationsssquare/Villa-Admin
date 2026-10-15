"use client";
import { useState, useMemo, useEffect } from "react";
import { IndianRupee, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useToast } from "@/components/ui/toast-provider";
import StatsCard from "@/components/Payoutcomponents/StatsCard";
import PayoutsFilters from "@/components/Payoutcomponents/PayoutsFilters";
import PayoutsTable from "@/components/Payoutcomponents/PayoutsTable";
import PayoutsPagination from "@/components/Payoutcomponents/PayoutsPagination";
import PayoutDetailsModal from "@/components/Payoutcomponents/PayoutDetailsModal";
import RequestPayoutModal from "@/components/Payoutcomponents/RequestPayoutModal";
import PayoutSuccessModal from "@/components/Payoutcomponents/PayoutSuccessModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllpayout } from "@/lib/Redux/Slices/payoutSlice";
import { adminExecutePayout } from "@/lib/API/Payout/AdminPayout";

const AdminPayouts = () => {
  const dispatch = useDispatch();
  const { addToast } = useToast();
  const [filters, setFilters] = useState({ page: 1, limit: 10 });
  const [selectedPayout, setSelectedPayout] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [payoutToRequest, setPayoutToRequest] = useState(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [payoutResult, setPayoutResult] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const { payouts, loading, error, pagination, stats: serverStats } = useSelector(
    (state) => state.payout
  );

  // Fetch paginated data & overall platform stats on filter/page change
  useEffect(() => {
    dispatch(fetchAllpayout(filters));
  }, [dispatch, filters]);

  const safePayouts = useMemo(() => {
    return Array.isArray(payouts) ? payouts : [];
  }, [payouts]);

  // Overall database statistics (independent of current page/pagination)
  const stats = useMemo(() => {
    return {
      totalPending: serverStats?.totalPending ?? 0,
      totalCompleted: serverStats?.totalCompleted ?? 0,
      pendingAmount: serverStats?.pendingAmount ?? 0,
      totalCommission: serverStats?.totalCommission ?? 0,
      totalRevenue: serverStats?.totalRevenue ?? 0,
    };
  }, [serverStats]);

  const totalPages = pagination?.totalPages || 1;
  const totalRecords = pagination?.total ?? safePayouts.length;

  const handleViewPayout = (payout) => {
    setSelectedPayout(payout);
    setIsDetailsModalOpen(true);
  };

  const handleRequestPayout = (payout) => {
    setPayoutToRequest(payout);
    setIsRequestModalOpen(true);
  };

  // Live dynamic payout execution via backend & RazorpayX
  const handleConfirmPayout = async (payout) => {
    if (!payout) return;

    const netPayout = payout.financials?.netPayout || 0;
    const hostName = payout.ownerDetails?.name || "Host";
    const propertyName = payout.propertyName || "Property";
    const toastId = toast.loading(`Processing payout of ₹${Number(netPayout).toLocaleString("en-IN")}...`, {
      description: `Disbursing funds to ${hostName} via RazorpayX IMPS...`,
    });

    try {
      setIsProcessing(true);
      const res = await adminExecutePayout({
        ownerId: payout.ownerId || payout.ownerDetails?._id,
        payoutId: payout._id,
        amount: netPayout,
        mode: "IMPS",
        narration: `Payout Ref #${payout.bookingReference || payout._id?.slice(-8)}`,
        adminNotes: `Admin processed payout via RazorpayX for ${propertyName}`,
      });

      if (res?.success) {
        const utr = res.data?.utr || `UTR${Date.now()}`;
        const bankAcc = payout.ownerDetails?.bankAccount;
        const destinationAccount = bankAcc?.accountNumber
          ? `•••• ${String(bankAcc.accountNumber).slice(-4)} (${bankAcc.bankName || "Bank"})`
          : payout.ownerDetails?.upiId || "Registered Account";

        // Store result for the confirmation success alert dialog
        setPayoutResult({
          amount: netPayout,
          utr: utr,
          payoutId: res.data?.payoutId || payout._id,
          hostName: hostName,
          propertyName: propertyName,
          destinationAccount: destinationAccount,
          mode: res.data?.mode || "IMPS",
        });

        // 1. Toast notification (rich sonner notification)
        toast.success("Payout Disbursed Successfully! 🎉", {
          id: toastId,
          description: `₹${Number(netPayout).toLocaleString("en-IN")} transferred to ${hostName} (UTR: ${utr})`,
          duration: 6000,
        });

        // 2. Secondary toast provider notification
        if (addToast) {
          addToast({
            title: "Payout Disbursed Successfully! 🎉",
            description: `₹${Number(netPayout).toLocaleString("en-IN")} disbursed to ${hostName}. UTR: ${utr}`,
            variant: "success",
          });
        }

        // 3. Close the request prompt and trigger the rich Alert Modal
        setIsRequestModalOpen(false);
        setIsDetailsModalOpen(false);
        setPayoutToRequest(null);
        setSelectedPayout(null);
        setIsSuccessModalOpen(true);

        // Refresh live data and overall platform statistics
        dispatch(fetchAllpayout(filters));
      } else {
        toast.error(res?.message || "Failed to initiate payout", {
          id: toastId,
        });
        if (addToast) {
          addToast({
            title: "Payout Failed",
            description: res?.message || "Failed to initiate payout via RazorpayX.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      console.error("Payout execution error:", err);
      toast.error(err?.message || "An unexpected error occurred while executing payout", {
        id: toastId,
      });
      if (addToast) {
        addToast({
          title: "Execution Error",
          description: err?.message || "An unexpected error occurred while executing payout",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
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
    }).format(amount || 0);
  };

  return (
    <ScrollArea className="pb-14 bg-gray-50 dark:bg-[#09090B] h-[calc(100vh-64px)] p-4 text-neutral-900 dark:text-neutral-100 transition-colors">
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
          payouts={safePayouts}
          onViewPayout={handleViewPayout}
          onRequestPayout={handleRequestPayout}
          isLoading={loading}
        />

        {/* Pagination */}
        <PayoutsPagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          totalRecords={totalRecords}
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

        {/* Payout Disbursed Success Alert Modal */}
        <PayoutSuccessModal
          isOpen={isSuccessModalOpen}
          onClose={() => {
            setIsSuccessModalOpen(false);
            setPayoutResult(null);
          }}
          payoutResult={payoutResult}
        />
      </div>
    </ScrollArea>
  );
};

export default AdminPayouts;
