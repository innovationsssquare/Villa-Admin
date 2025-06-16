"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { MapPin, Mail, Phone } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchordersbyid } from "@/lib/Redux/Slices/orderSlice";
import { useParams } from "next/navigation";

const Page = () => {
  const { orderdata, orderloading, ordererror } = useSelector(
    (state) => state.order
  );
  const dispatch = useDispatch();
  const params = useParams();
  const { id } = params;

  useEffect(() => {
    dispatch(fetchordersbyid(id));
  }, [dispatch]);

  return (
    <>
      {orderloading ? (
        <div className="flex justify-center items-center h-screen">
          <span className="loader2"></span>
        </div>
      ) : (
        <>
          {ordererror ? (
            <div className="flex justify-center items-center h-full">
              <span>No order data found</span>
            </div>
          ) : (
            <ScrollArea className="h-screen pb-14 bg-gray-50">
              <div className=" mx-auto p-4 w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Left Column - Order Details */}
                  <div className="md:col-span-2 space-y-4">
                    {/* Order Header */}
                    <div className="bg-white rounded-lg p-4  border ">
                      <div className="flex justify-between items-center">
                        <div className="space-y-2">
                          <h2 className="font-bold text-gray-800">#order829</h2>
                          <div className="bg-[#106C83] text-white px-4 py-2 rounded-full inline-flex items-center">
                            <span className="mr-2">📦</span> Estimated Delivery:
                            27-03-2025
                          </div>
                        </div>
                        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md">
                          Cancel Order
                        </button>
                      </div>
                    </div>

                    {/* Order Status */}
                    <div className="bg-white rounded-lg p-6  border ">
                      <h3 className="text-lg font-semibold mb-6">Status</h3>
                      <div className="relative">
                        {/* Progress Bar */}
                        <div className="h-1 bg-gray-200 absolute top-5 left-7 right-7 z-0">
                          <div className="h-1 bg-[#106C83] w-[40%]"></div>
                        </div>

                        {/* Status Steps */}
                        <div className="flex justify-between relative z-10">
                          {/* Order Placed */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-[#106C83] flex items-center justify-center text-white mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
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
                            <p className="font-medium text-gray-800">
                              Order Placed
                            </p>
                            <p className="text-sm text-gray-500">24-02-2025</p>
                          </div>

                          {/* In Transit */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-[#106C83] flex items-center justify-center text-white mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
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
                            <p className="font-medium text-gray-800">
                              In Transit
                            </p>
                            <p className="text-sm text-gray-500">28-02-2025</p>
                          </div>

                          {/* Product Shipped */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
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
                            <p className="font-medium text-gray-800">
                              Product Shipped
                            </p>
                            <p className="text-sm text-gray-500">2-03-2025</p>
                          </div>

                          {/* Out for Delivery */}
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white mb-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
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
                            <p className="font-medium text-gray-800">
                              Out for Delivery
                            </p>
                            <p className="text-sm text-gray-500">4-03-2025</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="bg-white rounded-lg p-6  border">
                      <h3 className="text-lg font-semibold text-gray-500 mb-4">
                        PRODUCT DETAILS
                      </h3>

                      {/* Product 1 */}
                      <div className="border-b border-gray-200 pb-6 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-36">
                            <Image
                              src=""
                              alt="Elite Sewing Machine"
                              width={144}
                              height={144}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">
                              Elite Sewing Machine
                            </h4>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <p className="text-gray-500 text-sm">
                                  QUANTITY:
                                </p>
                                <p>X2</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">
                                  PRODUCT ID:
                                </p>
                                <p>#6578</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <div className="bg-gray-100 px-4 py-2 rounded-md">
                                Size: Small
                              </div>
                              <div className="bg-gray-100 px-4 py-2 rounded-md">
                                Color: Teal
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-sm">PRICE:</p>
                            <p className="text-xl font-semibold">$568</p>
                          </div>
                        </div>
                      </div>

                      {/* Product 2 (duplicate) */}
                      <div>
                        <div className="flex flex-col md:flex-row gap-4">
                          <div className="w-full md:w-36">
                            <Image
                              src=""
                              alt="Elite Sewing Machine"
                              width={144}
                              height={144}
                              className="rounded-md object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xl font-semibold text-gray-800 mb-2">
                              Elite Sewing Machine
                            </h4>
                            <div className="grid grid-cols-2 gap-2 mb-2">
                              <div>
                                <p className="text-gray-500 text-sm">
                                  QUANTITY:
                                </p>
                                <p>X2</p>
                              </div>
                              <div>
                                <p className="text-gray-500 text-sm">
                                  PRODUCT ID:
                                </p>
                                <p>#6578</p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <div className="bg-gray-100 px-4 py-2 rounded-md">
                                Size: Small
                              </div>
                              <div className="bg-gray-100 px-4 py-2 rounded-md">
                                Color: Teal
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-500 text-sm">PRICE:</p>
                            <p className="text-xl font-semibold">$568</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Order Summary */}
                  <div className="space-y-4">
                    {/* Order Details */}
                    <div className="bg-white rounded-lg p-6 border">
                      <h3 className="text-lg font-semibold mb-1">
                        Order Details
                      </h3>
                      <p className="text-gray-500 mb-4">Customer Contact</p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Mail className="text-[#106C83]" size={20} />
                          <span>robbink@gmail.com</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="text-[#106C83]" size={20} />
                          <span>+91 783678356</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Details */}
                    <div className="bg-white rounded-lg p-6  border">
                      <p className="text-gray-500 mb-4">#TRANSACTIONID6729</p>
                      <h4 className="font-semibold mb-2">Summary</h4>

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Payment Method</span>
                          <span>UPI</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Paid On</span>
                          <span>25-02-2025</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Order</span>
                          <span>$789</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Delivery</span>
                          <span>$56</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Discount</span>
                          <span className="text-red-500">-$40</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tax</span>
                          <span>$29</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold">
                          <span className="text-[#106C83]">Total</span>
                          <span className="text-[#106C83]">$829</span>
                        </div>
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-lg p-6  border">
                      <h3 className="text-lg font-semibold mb-4">
                        Shipping Address
                      </h3>
                      <div className="flex gap-3">
                        <MapPin
                          className="text-[#106C83] flex-shrink-0"
                          size={24}
                        />
                        <div>
                          <p className="font-semibold">Robbin K</p>
                          <p className="text-gray-500">
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
