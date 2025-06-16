"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchSellarproduct } from "@/lib/Redux/Slices/sellarSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;
  const { productLoading, productError, Product } = useSelector(
    (state) => state.sellar
  );
  const [commission, setCommission] = useState(0);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (id) {
      dispatch(fetchSellarproduct(id));
    }
  }, [dispatch]);

  const handleProductStatus = async (status) => {
    if (status === "approved" && commission <= 0) {
      // Check if commission is provided before approving
      alert("Commission is required to approve the product.");
      return; // Do not proceed if commission is not provided
    }
    const token = Cookies.get("token");
    const productId = id;

    const body = {
      productId: [
        {
          productId,
          remarks: status,
          Commision: commission,
        },
      ],
    };
    if (status === "approved") {
      setLoadingApprove(true);
    } else if (status === "rejected") {
      setLoadingReject(true);
    }
    try {
      let result = await fetch(`${BaseUrl}/product/approve/products`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });
      result = await result.json();
      setLoading(false);
      if (result.success) {
        console.log(
          `${status.charAt(0).toUpperCase() + status.slice(1)} successfully`
        );
      } else {
        console.error(
          `${status.charAt(0).toUpperCase() + status.slice(1)} Error:`,
          result.message
        );
      }
    } catch (error) {
      console.error("Error:", error.message);
      setLoading(false);
    } finally {
      // End loading based on status
      if (status === "approved") {
        setLoadingApprove(false);
      } else if (status === "rejected") {
        setLoadingReject(false);
      }
    }
  };

  return (
    <>
   { productLoading?<div className="w-full flex justify-center items-center h-screen"><span className="loader2"></span></div>:<ScrollArea className="w-full mx-auto bg-white h-screen pb-14 px-4">
      {/* Header */}
      <header className="py-4  flex items-center">
        <ChevronLeft
          className="h-5 w-5 mr-2 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-xl font-bold">Product Details</h1>
      </header>

      <div className="p-4">
        {/* Product Image and Info Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Product Images */}
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden mb-2">
              <Image
                src={Product?.Images[0]}
                alt="Product Image"
                width={400}
                height={300}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex gap-2">
              <div className="w-1/4 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Thumbnail 1"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/4 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Thumbnail 2"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/4 h-24 bg-gray-100 rounded-lg overflow-hidden border">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Thumbnail 3"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="w-1/4 h-24 bg-gray-100 rounded-lg overflow-hidden border relative">
                <Image
                  src="/placeholder.svg?height=100&width=100"
                  alt="Thumbnail 4"
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">5</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="w-full md:w-1/2">
            <div className="inline-block bg-[#106C83] text-white px-3 py-1 rounded-md text-sm mb-2">
              Product Category
            </div>
            <h2 className="text-3xl font-bold mb-1">{Product?.Name}</h2>
            <p className="text-[#106C83] mb-4">Seller Name</p>
            <div className="text-right text-3xl font-bold mb-4">
              ₹{Product?.Yourprice}
            </div>

            <div className="border-t border-b py-4 my-4">
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="font-bold mb-2">Product Details</h3>
                <p className="text-gray-700 text-sm">
                  {Product?.Description}
                  <span className="text-[#106C83]">More...</span>
                </p>
              </div>

              <h3 className="font-bold mb-3">Features</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {Product?.Features.map((item, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <h3 className="font-bold mb-3">Select Avalible</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                <button className="bg-gray-200 px-4 py-2 rounded-md text-sm">
                  Small - 5 KG
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded-md text-sm">
                  Small - 5 KG
                </button>
                <button className="bg-gray-200 px-4 py-2 rounded-md text-sm">
                  Small - 5 KG
                </button>
              </div>

              <h3 className="font-bold mb-3">Select Available</h3>
              <div className="flex gap-3 mb-4">
                <button className="w-10 h-10 rounded-full bg-yellow-200 border"></button>
                <button className="w-10 h-10 rounded-full bg-blue-300 border"></button>
                <button className="w-10 h-10 rounded-full bg-green-400 border"></button>
                <button className="w-10 h-10 rounded-full bg-pink-400 border"></button>
                <button className="w-10 h-10 rounded-full bg-teal-700 border"></button>
              </div>

              <div className="border-t pt-4">
                <p className="font-bold">
                  Quantity Available -{" "}
                  <span className="font-normal">200 per color</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Description</h2>
          <h3 className="text-xl font-bold mb-2">
            Lorem ipsum dolor sit amet elit.
          </h3>
          <p className="text-gray-600 mb-4">{Product?.Description}</p>
        </div>

        {/* Commission Section */}
        <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between mb-4">
          <span className="font-bold">Add Commession-</span>
          <div className="flex items-center">
            <input
              type="number"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              className="border rounded-md px-2 py-1 w-20 text-right"
            />
            <span className="ml-2">%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => handleProductStatus("approved")}
            className="w-full bg-[#106C83] text-white py-3 rounded-md font-medium"
          >
           {loadingApprove?<span className="loader"></span>: "Accept"}
          </button>
          <button
            onClick={() => handleProductStatus("rejected")}
            className="w-full border border-red-500 text-red-500 py-3 rounded-md font-medium"
          >
           {loadingReject?<span className="loader2"></span>:"Rejected"}
          </button>
        </div>
      </div>
    </ScrollArea>}

    </>
  );
}
