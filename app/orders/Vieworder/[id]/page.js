"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { MapPin, Mail, Phone, ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchordersbyid } from "@/lib/Redux/Slices/orderSlice";
import { useParams, useRouter } from "next/navigation";

const Page = () => {
  const { orderdata, orderloading, ordererror } = useSelector(
    (state) => state.order
  );
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    dispatch(fetchordersbyid(id));
  }, [dispatch, id]);

  return (
    <>
      {orderloading ? (
        <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#09090B]">
          <span className="loader2"></span>
        </div>
      ) : (
        <>
          {ordererror ? (
            <div className="flex justify-center items-center h-[calc(100vh-64px)] bg-gray-50 dark:bg-[#09090B] text-neutral-600 dark:text-neutral-400">
              <span>No order data found</span>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-64px)] pb-14 bg-gray-50 dark:bg-[#09090B] text-neutral-900 dark:text-neutral-100 transition-colors">
              <div className="max-w-7xl mx-auto p-4 w-full space-y-4">
                {/* Back button */}
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-1 text-sm font-medium text-gray-600 dark:text-neutral-400 hover:text-[#FF6900] dark:hover:text-[#FF6900] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Orders
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column - Order Details */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Order Header */}
                    <div className="bg-white dark:bg-[#121215] rounded-xl p-4 border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <div className="flex flex-wrap justify-between items-center gap-4">
                        <div className="space-y-2">
                          <h2 className="font-bold text-gray-900 dark:text-neutral-100 text-lg">#order829</h2>
                          <div className="bg-[#FF6900] text-white px-4 py-1.5 rounded-full inline-flex items-center text-sm font-medium shadow-sm shadow-[#FF6900]/25">
                            <span className="mr-2">📦</span> Estimated Delivery: 27-03-2025
                          </div>
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl font-medium shadow-sm transition-colors cursor-pointer text-sm">
                          Cancel Order
                        </button>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="bg-white dark:bg-[#121215] rounded-xl p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-neutral-100">Status</h3>
                      <div className="relative">
                        {/* Progress Bar */}
                        <div className="h-1 bg-gray-200 dark:bg-neutral-800 absolute top-5 left-7 right-7 z-0">
                          <div className="h-1 bg-[#FF6900] w-[40%]"></div>
                        </div>

                        {/* Status Steps */}
                        <div className="flex justify-between relative z-10">
                          {/* Order Placed */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6900] flex items-center justify-center text-white mb-2 shadow-sm shadow-[#FF6900]/30">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-neutral-100">
                              Order Placed
                            </p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">24-02-2025</p>
                          </div>

                          {/* In Transit */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-[#FF6900] flex items-center justify-center text-white mb-2 shadow-sm shadow-[#FF6900]/30">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M13 10V3L4 14h7v7l9-11h-7z"
                                />
                              </svg>
                            </div>
                            <p className="font-semibold text-sm text-gray-900 dark:text-neutral-100">
                              In Transit
                            </p>
                            <p className="text-xs text-gray-500 dark:text-neutral-400">28-02-2025</p>
                          </div>

                          {/* Product Shipped */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-400 dark:text-neutral-500 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="font-medium text-sm text-gray-600 dark:text-neutral-400">
                              Product Shipped
                            </p>
                            <p className="text-xs text-gray-400 dark:text-neutral-500">2-03-2025</p>
                          </div>

                          {/* Out for Delivery */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-gray-400 dark:text-neutral-500 mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                            <p className="font-medium text-sm text-gray-600 dark:text-neutral-400">
                              Out for Delivery
                            </p>
                            <p className="text-xs text-gray-400 dark:text-neutral-500">4-03-2025</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white dark:bg-[#121215] rounded-xl p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-neutral-400 uppercase tracking-wider mb-4">
                        PRODUCT DETAILS
                      </h3>

                      {/* Product 1 */}
                      <div className="border-b border-gray-200 dark:border-neutral-800 pb-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-36 h-36 bg-gray-100 dark:bg-neutral-900 rounded-xl flex items-center justify-center text-gray-400 dark:text-neutral-600 text-xs">
                            Product Image
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-2">
                              Elite Sewing Machine
                            </h4>
                            <div className="grid grid-cols-2 gap-2 mb-2 text-sm">
                              <div>
                                <p className="text-gray-500 dark:text-neutral-400 text-xs">
                                  QUANTITY:
                                </p>
                                <p className="font-medium">X2</p>
                              </div>
                              <div>
                                <p className="text-gray-500 dark:text-neutral-400 text-xs">
                                  PRODUCT ID:
                                </p>
                                <p className="font-mono">#6578</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3 text-xs">
                              <div className="bg-gray-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300">
                                Size: Small
                              </div>
                              <div className="bg-gray-100 dark:bg-neutral-900 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-neutral-800 text-gray-700 dark:text-neutral-300">
                                Color: Teal
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 dark:text-neutral-400 text-xs">PRICE:</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-neutral-100">$568</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Order Summary */}
                  <div className="space-y-4">
                    {/* Order Details */}
                    <div className="bg-white dark:bg-[#121215] rounded-xl p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <h3 className="text-base font-semibold mb-1 text-gray-900 dark:text-neutral-100">
                        Order Details
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-neutral-400 mb-4">Customer Contact</p>

                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="text-[#FF6900]" size={18} />
                          <span className="text-gray-700 dark:text-neutral-300">robbink@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="text-[#FF6900]" size={18} />
                          <span className="text-gray-700 dark:text-neutral-300">+91 783678356</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-white dark:bg-[#121215] rounded-xl p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <p className="text-xs font-mono text-gray-500 dark:text-neutral-400 mb-4">#TRANSACTIONID6729</p>
                      <h4 className="font-semibold mb-3 text-gray-900 dark:text-neutral-100">Summary</h4>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">Payment Method</span>
                          <span className="font-medium">UPI</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">Paid On</span>
                          <span className="font-medium">25-02-2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">Order</span>
                          <span className="font-medium">$789</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">Delivery</span>
                          <span className="font-medium">$56</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">Discount</span>
                          <span className="text-red-500 font-medium">-$40</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-neutral-400">Tax</span>
                          <span className="font-medium">$29</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-neutral-800 pt-3 mt-3 flex justify-between font-bold text-base">
                          <span className="text-[#FF6900]">Total</span>
                          <span className="text-[#FF6900]">$829</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white dark:bg-[#121215] rounded-xl p-6 border border-gray-200 dark:border-neutral-800 shadow-sm">
                      <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-neutral-100">
                        Shipping Address
                      </h3>
                      <div className="flex gap-3">
                        <MapPin
                          className="text-[#FF6900] flex-shrink-0 mt-0.5"
                          size={20}
                        />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900 dark:text-neutral-100">Robbin K</p>
                          <p className="text-gray-500 dark:text-neutral-400 text-xs mt-1">
                            This will be a sample address acting as a filler.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </>
      )}
    </>
  );
};

export default Page;
