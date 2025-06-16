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
    productSellers: count?.totalVendors || 0,
    serviceProviders: count?.approvedVendors || 0,
    pendingApprovals: count?.pendingVendors || 0,
    rejectedProfiles: count?.rejectedVendors || 0,
  };

  return (
    <div className="overflow-auto">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Product Sellers Card */}
        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center">
           {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 rounded-md" />: <Image
              src={Dash1}
              alt="Product Sellers"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 rounded-md" />

                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600">
                  Product Sellers
                </p>

                <p className="text-2xl font-bold text-[#106C83]">
                  {data?.productSellers}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Service Providers Card */}
        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center">
           {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 rounded-md" />:  <Image
              src={Dash2}
              alt="Service Providers"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 rounded-md" />

                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600">
                  Service Providers
                </p>
                <p className="text-2xl font-bold text-[#106C83]">
                  {data?.serviceProviders}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Pending Approvals Card */}
        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center">
            {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 rounded-md" />:  <Image
              src={Dash3}
              alt="Pending Approvals"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 rounded-md" />

                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600">
                  Pending Approvals
                </p>
                <p className="text-2xl font-bold text-[#106C83]">
                  {data?.pendingApprovals}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Rejected Profiles Card */}
        <div className="bg-white border rounded-lg p-4 flex items-start gap-3">
          <div className="w-14 h-14 rounded-md ring-1 ring-gray-300 flex items-center justify-center">
             {loadingcount?<Skeleton className="w-14 h-14 bg-gray-200 rounded-md" />: <Image
              src={Dash4}
              alt="Rejected Profiles"
              className="object-contain w-10 h-10"
            />}
          </div>
          <div>
            {loadingcount ? (
              <>
                <Skeleton className="h-4 w-32 bg-gray-200 rounded-md" />

                <Skeleton className="h-8 w-16 mt-2 bg-gray-200 rounded-md" />
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-gray-600">
                  Rejected Profiles
                </p>
                <p className="text-2xl font-bold text-[#106C83]">
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
