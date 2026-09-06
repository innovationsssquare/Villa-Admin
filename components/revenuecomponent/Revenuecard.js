"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Wallet from "@/public/Asset/Wallet.png";
import Commission from "@/public/Asset/Commission.png";
import pending from "@/public/Asset/pending.png";
import withdraw from "@/public/Asset/withdraw.png";
import { useDispatch, useSelector } from "react-redux";
import { FetchAllcount } from "@/lib/Redux/Slices/revenueSlice";
import { Skeleton } from "@/components/ui/skeleton";

const Revenuecard = () => {
  const { data, loading, error } = useSelector((state) => state.revenue);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(FetchAllcount());
  }, [dispatch]);

  const revenue = {
    totalVendorAmount: data?.summary?.totalVendorAmount || 0,
    totalCommission: data?.summary?.totalCommission || 0,
    totalWithdrawn: data?.summary?.totalWithdrawn || 0,
    totalPendingPayout: data?.summary?.totalPendingPayout || 0,
  };

  return (
    <div className="overflow-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
            ) : (
              <Image
                src={Wallet}
                alt="Total Earnings"
                className="object-contain w-10 h-10"
              />
            )}
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-[#FF6900]">
                  {revenue?.totalVendorAmount}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
            ) : (
              <Image
                src={Commission}
                alt="Total Commission"
                className="object-contain w-10 h-10"
              />
            )}
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Commission</p>
                <p className="text-2xl font-bold text-[#FF6900]">
                  {revenue?.totalCommission}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
            ) : (
              <Image
                src={pending}
                alt="Pending Payout"
                className="object-contain w-10 h-10"
              />
            )}
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                  Pending Payout
                </p>
                <p className="text-2xl font-bold text-[#FF6900]">
                  {revenue?.totalPendingPayout}
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />
            ) : (
              <Image
                src={withdraw}
                alt="Withdrawn"
                className="object-contain w-10 h-10"
              />
            )}
          </div>
          <div>
            {loading ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">Withdrawn</p>
                <p className="text-2xl font-bold text-[#FF6900]">
                  {revenue?.totalWithdrawn}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Revenuecard;
