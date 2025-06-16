"use client";

import Link from "next/link";
import {
  Store,
  MapPin,
  Mail,
  Phone,
  ChevronRight,
  Package,
  Wallet,
  CreditCard,
  Gift,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import RevenueOverview from "../Analyticscomponents/revenue-overview";
import RevenueCommission from "../revenuecomponent/revenue-commission-card";
import ProductTable from "./product-table";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  fetchSellaranalytics,
  fetchSellarprofile,
} from "@/lib/Redux/Slices/sellarSlice";
import { Banknote, Landmark, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Revenuegraph from "./Revenuegraph";

export default function SellerProfile({ seller }) {
  const params = useParams();
  const { id } = params;
  const { profile, loadingprofile, profileerror } = useSelector(
    (state) => state.sellar
  );

  const { analytics, loadinganalytics, analyticserror } = useSelector(
    (state) => state.sellar
  );
  const data = analytics?.[id];


  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSellarprofile(id));
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchSellaranalytics(id));
  }, [dispatch]);

  // Default seller data if none provided
  const defaultSeller = {
    businessName: "Business Name",
    website: "www.businessname.com",
    address: "This is for a sample address",
    email: "businessname@gmail.com",
    phone: "+91 9738687282",
    alternatePhone: "+91 6783567389",
    rating: 5.0,
    reviews: 23,
    totalProducts: 234,
    revenue: 6876,
    commission: 1876,
    customers: "4K+",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  };

  const sellerData = seller || defaultSeller;

  return (
    <>
      {loadingprofile ? (
        <div className="h-screen flex justify-center items-center w-full">
          <span className="loader2"></span>
        </div>
      ) : (
        <div className="w-full p-4 mx-auto">
          <Card className="mb-3 border border-gray-200">
            <CardContent className="">
              <div className="flex flex-col md:flex-row items-start gap-6 relative">
                <div className="w-full md:w-44 h-44 bg-red-200 rounded-md flex justify-center items-center shrink-0">
                  <Store className="h-16 w-16 text-gray-800" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h1 className="text-lg font-bold mb-1">
                      {profile?.BussinessName}
                    </h1>
                  </div>

                  <Link
                    href={`${profile?.CompanyId?.BussinessWebsite}`}
                    className="text-teal-600 text-sm flex items-center hover:underline mb-2"
                  >
                    {profile?.CompanyId?.BussinessWebsite}
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Link>

                  <div className="flex items-center mb-4">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium">{sellerData.rating}</span>
                    <span className="text-gray-500 ml-1">
                      ({sellerData.reviews})
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-0.5 shrink-0" />
                      <span className="text-gray-700">
                        {profile?.CompanyId?.Address?.City}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                      <span className="text-gray-700">
                        {profile?.CompanyId?.BussinessEmail}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 text-gray-500 mr-2 shrink-0" />
                      <span className="text-gray-700">
                        {profile?.CompanyId?.BussinessNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="w-full mx-auto  ">
                  <h1 className="text-lg font-bold mb-4">Revenue Overview</h1>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {loadinganalytics ? (
                      // Skeleton loading state
                      <>
                        <Card className="border rounded-lg overflow-hidden">
                          <CardContent className="p-6 relative">
                            <div className="absolute top-6 right-6">
                              <Skeleton className="h-11 w-11 rounded-md" />
                            </div>
                            <div className="pt-2">
                              <Skeleton className="h-4 w-24 mb-3" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border rounded-lg overflow-hidden">
                          <CardContent className="p-6 relative">
                            <div className="absolute top-6 right-6">
                              <Skeleton className="h-11 w-11 rounded-md" />
                            </div>
                            <div className="pt-2">
                              <Skeleton className="h-4 w-24 mb-3" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border rounded-lg overflow-hidden">
                          <CardContent className="p-6 relative">
                            <div className="absolute top-6 right-6">
                              <Skeleton className="h-11 w-11 rounded-md" />
                            </div>
                            <div className="pt-2">
                              <Skeleton className="h-4 w-24 mb-3" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                          </CardContent>
                        </Card>
                        <Card className="border rounded-lg overflow-hidden">
                          <CardContent className="p-6 relative">
                            <div className="absolute top-6 right-6">
                              <Skeleton className="h-11 w-11 rounded-md" />
                            </div>
                            <div className="pt-2">
                              <Skeleton className="h-4 w-24 mb-3" />
                              <Skeleton className="h-8 w-20" />
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    ) : (
                      // Actual content
                      <>
                        {/* Total Products Card */}
                        <Card className="border rounded-lg overflow-hidden py-0 h-32">
                          <CardContent className="p-4 relative">
                            <div className="absolute top-2 right-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
                              <Landmark className="h-4 w-4 text-gray-700" />
                            </div>
                            <div className="pt-6">
                              <p className="text-gray-500 text-xs">
                                Total Products
                              </p>
                              <h2 className="text-xl font-bold mt-1">
                                {" "}
                                {data?.summary?.totalProducts}
                              </h2>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Revenue Card */}
                        <Card className="border rounded-lg overflow-hidden py-0 h-32">
                          <CardContent className="p-4 relative">
                            <div className="absolute top-2 right-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
                              <Wallet className="h-4 w-4 text-gray-700" />
                            </div>
                            <div className="pt-6">
                              <p className="text-gray-500 text-xs">Revenue</p>
                              <h2 className="text-xl font-bold mt-1">
                                {" "}
                                ₹ {data?.summary?.totalRevenue?.toFixed(2)}
                              </h2>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Commission Card */}
                        <Card className="border rounded-lg overflow-hidden py-0 h-32">
                          <CardContent className="p-4 relative">
                            <div className="absolute top-2 right-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
                              <Banknote className="h-4 w-4 text-gray-700" />
                            </div>
                            <div className="pt-6">
                              <p className="text-gray-500 text-xs">
                                Commission
                              </p>
                              <h2 className="text-xl font-bold mt-1">
                                {" "}
                                ₹ {data?.summary?.totalCommission?.toFixed(2)}
                              </h2>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Customers Card */}
                        <Card className="border rounded-lg overflow-hidden py-0 h-32">
                          <CardContent className="p-4 relative">
                            <div className="absolute top-2 right-2 bg-gray-100 p-2 border border-gray-300 rounded-md">
                              <Users className="h-4 w-4 text-gray-700" />
                            </div>
                            <div className="pt-6">
                              <p className="text-gray-500 text-xs">Orders</p>
                              <h2 className="text-xl font-bold mt-1">
                                {data?.summary?.totalOrders}
                              </h2>
                            </div>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">About & Description</h2>
              <div className="space-y-4 text-gray-700">
                <p>{sellerData.description}</p>
                <p>{sellerData.description}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-4 items-stretch py-4">
            <Revenuegraph
              revenueoverview={data?.graph}
              loadingrevnue={loadinganalytics}
              errorrevenue={analyticserror}
            />
            {/* <RevenueCommission /> */}
          </div>
          <div>
            <ProductTable />
          </div>
        </div>
      )}
    </>
  );
}

function SkeletonCard() {
  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardContent className="p-6 relative">
        <div className="absolute top-6 right-6">
          <Skeleton className="h-11 w-11 rounded-md" />
        </div>
        <div className="pt-2">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}
