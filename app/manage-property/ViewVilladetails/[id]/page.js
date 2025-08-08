"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  MapPin,
  Users,
  Clock,
  Shield,
  Utensils,
  Play,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchvillabyid } from "@/lib/Redux/Slices/villaSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function VillaDetailsPage() {
  const { addToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;
  const { data, loading, error } = useSelector((state) => state.villa);
  const [commission, setCommission] = useState(0);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchvillabyid(id));
    }
  }, [dispatch, id]);

  const handleVillaStatus = async (status) => {
    if (status === "approved" && (!commission || commission <= 0)) {
      addToast({
        title: "Commission is required to approve the villa.",
        description: "Please enter a valid commission percentage.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const token = Cookies.get("token");
    const villaId = id;

    const body = {
      status: status,
      commission: commission,
      isLive: status === "approved" ? true : false,
    };

    if (status === "approved") {
      setLoadingApprove(true);
    } else if (status === "rejected") {
      setLoadingReject(true);
    }

    try {
      let result = await fetch(`${BaseUrl}/Villa/approve-reject/${villaId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });
      result = await result.json();

      if (result.success) {
        addToast({
          title: `Villa ${status} Successfully`,
          description: result.message || `Villa has been ${status}`,
          variant: "success",
          duration: 5000,
        });
        // Refresh the data
        dispatch(fetchvillabyid(id));
      } else {
        addToast({
          title: `Failed to ${status} villa`,
          description: result.message || "Something went wrong",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      addToast({
        title: `Failed to ${status} villa`,
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingApprove(false);
      setLoadingReject(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <div className="loader2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error loading villa details</p>
          <Button onClick={() => dispatch(fetchvillabyid(id))}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p>No villa data found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full mx-auto bg-white h-screen pb-14 px-4">
      {/* Header */}
      <header className="py-4 flex items-center sticky top-0 bg-white z-10 border-b">
        <ChevronLeft
          className="h-5 w-5 mr-2 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Villa Details</h1>
        <Badge
          className={
            data?.isapproved === "approved"
              ? "bg-green-50 text-green-500 ring-1 ring-green-500 rounded-full ml-12 capitalize"
              : data.isapproved === "rejected"
              ? "bg-red-50 text-red-500 ring-1 ring-red-500 rounded-full ml-12 capitalize"
              : data.isapproved === "pending"
              ? "bg-yellow-50 text-yellow-500 ring-1 ring-yellow-500 rounded-full ml-12 capitalize"
              : "secondary"
          }
          // className="ml-auto capitalize"
        >
          {data.isapproved}
        </Badge>
      </header>

      <div className="p-4">
        {/* Villa Images */}
        <div className="mb-6">
          <div className="rounded-lg overflow-hidden mb-4">
            <Image
              src={
                data.images?.[imageIndex] ||
                "/placeholder.svg?height=400&width=600"
              }
              alt="Villa Image"
              width={600}
              height={400}
              className="w-full h-80 object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {data.images?.map((img, key) => (
              <div
                key={key}
                onClick={() => setImageIndex(key)}
                className={`flex-shrink-0 w-20 h-16 cursor-pointer rounded-lg overflow-hidden border-2 ${
                  key === imageIndex ? "border-[#106C83]" : "border-gray-200"
                }`}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`Thumbnail ${key + 1}`}
                  width={80}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Reel Video */}
        {data.reelVideo && (
          <div className="mb-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Villa Reel
            </h3>
            <div className="rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-64 object-cover"
                poster={
                  data?.images?.[0] || "/placeholder.svg?height=256&width=400"
                }
              >
                <source src={data?.reelVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Villa Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge className="mb-2">{data?.bhkType}</Badge>
                <h2 className="text-2xl font-bold mb-2">{data?.name}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {data?.location?.addressLine}, {data.location?.city}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Users className="h-4 w-4 mr-1" />
                  <span className="text-sm">Max {data.maxCapacity} guests</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-[#106C83]">
                  ₹{data.basePricePerNight?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per night</div>
              </div>
            </div>

            {/* Additional Charges */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Extra Person:</span>
                <span className="ml-2">₹{data.extraPersonCharge}</span>
              </div>
              <div>
                <span className="font-medium">Kitchen Charge:</span>
                <span className="ml-2">₹{data.kitchenCharge}</span>
              </div>
              <div>
                <span className="font-medium">Security Deposit:</span>
                <span className="ml-2">₹{data.securityDeposit}</span>
              </div>
              <div>
                <span className="font-medium">Late Checkout:</span>
                <span className="ml-2">₹{data.lateCheckoutCharge}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check-in/Check-out Times */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Check-in & Check-out
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Check-in:</span>
                <span className="ml-2">{data.checkInTime}</span>
              </div>
              <div>
                <span className="font-medium">Check-out:</span>
                <span className="ml-2">{data.checkOutTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Description</h3>
            <p className="text-gray-700 leading-relaxed">{data.description}</p>
          </CardContent>
        </Card>

        {/* Amenities */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {data?.amenities?.map((amenity, index) => (
                <Badge key={index} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* House Rules */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              House Rules
            </h3>
            <ul className="space-y-2">
              {data?.houseRules?.map((rule, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 flex items-start"
                >
                  <span className="w-2 h-2 bg-[#106C83] rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  {rule}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Food Options */}
        {data.foodOptions && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Utensils className="h-5 w-5 mr-2" />
                Food Options
              </h3>
              <p className="text-gray-700">{data.foodOptions}</p>
            </CardContent>
          </Card>
        )}

        {/* Cancellation Policy */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Cancellation Policy</h3>
            <p className="text-gray-700">{data.cancellationPolicy}</p>
          </CardContent>
        </Card>

        {/* Location Map */}
        {data.location?.maplink && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Location
              </h3>
              <a
                href={data.location.maplink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#106C83] hover:underline"
              >
                View on Google Maps
              </a>
            </CardContent>
          </Card>
        )}

        {/* Commission Section - Only show if villa is pending approval */}

        {/* Villa Stats */}
        <Card className={"mb-4"}>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Villa Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Average Rating:</span>
                <span className="ml-2">
                  {data.averageRating || "No ratings yet"}
                </span>
              </div>
              <div>
                <span className="font-medium">Total Reviews:</span>
                <span className="ml-2">{data.totalReviews}</span>
              </div>
              <div>
                <span className="font-medium">Status:</span>
                <span className="ml-2 capitalize">{data.status}</span>
              </div>
              <div>
                <span className="font-medium">Live Status:</span>
                <span className="ml-2">
                  {data.isLive ? "Live" : "Not Live"}
                </span>
              </div>
              {data?.commission && <div>
                <span className="font-medium">commission:</span>
                <span className="ml-2">
                  {data?.commission}
                </span>
              </div>}
            </div>
          </CardContent>
        </Card>

        {data.isapproved === "pending" && (
          <>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <Label htmlFor="commission" className="font-bold">
                    Add Commission
                  </Label>
                  <div className="flex items-center">
                    <Input
                      id="commission"
                      type="number"
                      value={commission}
                      onChange={(e) => setCommission(Number(e.target.value))}
                      className="w-20 text-right mr-2"
                      min="0"
                      max="100"
                    />
                    <span>%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
              <Button
                onClick={() => handleVillaStatus("approved")}
                className="flex-1 bg-[#106C83] hover:bg-[#0d5a6e]"
                disabled={loadingApprove}
              >
                {loadingApprove ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Approve Villa"
                )}
              </Button>
              <Button
                onClick={() => handleVillaStatus("rejected")}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                disabled={loadingReject}
              >
                {loadingReject ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                  "Reject Villa"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
