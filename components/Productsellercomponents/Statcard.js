"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import Dash1 from "@/public/Asset/Dash1.png";
import Dash2 from "@/public/Asset/Dash2.png";
import Dash3 from "@/public/Asset/Dash3.png";
import Dash4 from "@/public/Asset/Dash4.png";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllSellarscount } from "@/lib/Redux/Slices/sellarSlice";
import { Skeleton } from "@/components/ui/skeleton";

const Statcard = () => {
  const { count, loadingcount, counterror } = useSelector(
    (state) => state.sellar
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllSellarscount());
  }, [dispatch]);

  // Default data if the loading state is active
  const data = {
    productSellers: count?.totalProperties || 0,
    serviceProviders: count?.pendingProperties || 0,
    pendingApprovals: count?.approvedProperties || 0,
    rejectedProfiles: count?.rejectedProperties || 0,
  };

  return (
    <div className="overflow-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Product Sellers Card */}
        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 shadow-sm rounded-xl p-4 flex items-start gap-3 transition-colors">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
           {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />: <Image
              src={Dash1}
              alt="Product Sellers"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                Total Properties
                </p>

                <p className="text-2xl font-black text-[#FF6900]">
                  {data?.productSellers}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Service Providers Card */}
        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 shadow-sm rounded-xl p-4 flex items-start gap-3 transition-colors">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
           {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />:  <Image
              src={Dash2}
              alt="Service Providers"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                 Pending Properties
                </p>
                <p className="text-2xl font-black text-[#FF6900]">
                  {data?.serviceProviders}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 shadow-sm rounded-xl p-4 flex items-start gap-3 transition-colors">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
            {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />:  <Image
              src={Dash3}
              alt="Pending Approvals"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                 Approved Properties
                </p>
                <p className="text-2xl font-black text-[#FF6900]">
                  {data?.pendingApprovals}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Rejected Profiles Card */}
        <div className="bg-white dark:bg-[#121215] border border-gray-200 dark:border-neutral-800 shadow-sm rounded-xl p-4 flex items-start gap-3 transition-colors">
          <div className="w-14 h-14 rounded-xl ring-1 ring-gray-200 dark:ring-neutral-800 bg-gray-50 dark:bg-neutral-900 flex items-center justify-center">
             {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 dark:bg-neutral-800 rounded-xl" />: <Image
              src={Dash4}
              alt="Rejected Profiles"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded-md" />
                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 dark:bg-neutral-800 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600 dark:text-neutral-400">
                Rejected Properties
                </p>
                <p className="text-2xl font-black text-[#FF6900]">
                  {data?.rejectedProfiles}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statcard;
