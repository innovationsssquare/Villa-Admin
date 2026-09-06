"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  MapPin,
  Clock,
  Shield,
  Utensils,
  Play,
  Tent,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchcampingbyid } from "@/lib/Redux/Slices/campingSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CampingDetailsPage() {
  const { addToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;
  const { data, loading, error } = useSelector((state) => state.camping);
  const [commission, setCommission] = useState(0);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedTent, setSelectedTent] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchcampingbyid(id));
    }
  }, [dispatch, id]);

  const handleCampingStatus = async (status) => {
    if (status === "approved" && (!commission || commission <= 0)) {
      addToast({
        title: "Commission is required to approve the camping.",
        description: "Please enter a valid commission percentage.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const token = Cookies.get("token");
    const campingId = id;
    const body = {
      campingId: [
        {
          campingId,
          remarks: status,
          commission: commission,
        },
      ],
    };

    if (status === "approved") {
      setLoadingApprove(true);
    } else if (status === "rejected") {
      setLoadingReject(true);
    }

    try {
      let result = await fetch(`${BaseUrl}/camping/approve/campings`, {
        method: "PATCH",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });
      result = await result.json();

      if (result.success) {
        addToast({
          title: `Camping ${status} Successfully`,
          description: result.message || `Camping has been ${status}`,
          variant: "success",
          duration: 5000,
        });
        // Refresh the data
        dispatch(fetchcampingbyid(id));
      } else {
        addToast({
          title: `Failed to ${status} camping`,
          description: result.message || "Something went wrong",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      addToast({
        title: `Failed to ${status} camping`,
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingApprove(false);
      setLoadingReject(false);
    }
  };

  const getTentTypeIcon = (tentType) => {
    switch (tentType.toLowerCase()) {
      case "single":
        return "🏕️";
      case "couple":
        return "💕";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "luxury":
        return "✨";
      case "treehouse":
        return "🌳";
      default:
        return "🏕️";
    }
  };

  const getTentTypeColor = (tentType) => {
    switch (tentType.toLowerCase()) {
      case "single":
        return "bg-blue-100 text-blue-800";
      case "couple":
        return "bg-pink-100 text-pink-800";
      case "family":
        return "bg-green-100 text-green-800";
      case "luxury":
        return "bg-purple-100 text-purple-800";
      case "treehouse":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTentTypeDescription = (tentType) => {
    switch (tentType.toLowerCase()) {
      case "single":
        return "Perfect for solo travelers seeking adventure and solitude.";
      case "couple":
        return "Romantic getaway for couples with cozy accommodations.";
      case "family":
        return "Spacious tents designed for families with children.";
      case "luxury":
        return "Premium camping experience with high-end amenities.";
      case "treehouse":
        return "Unique elevated experience among the trees.";
      default:
        return "Comfortable camping accommodation.";
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
          <p className="text-red-500 mb-4">Error loading camping details</p>
          <Button onClick={() => dispatch(fetchcampingbyid(id))}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p>No camping data found</p>
      </div>
    );
  }

  return (
    <ScrollArea className="w-full mx-auto bg-gray-50 dark:bg-[#09090B] h-[calc(100vh-64px)] pb-14 px-4 text-neutral-900 dark:text-neutral-100 transition-colors">
      {/* Header */}
      <header className="py-4 flex items-center sticky top-0 bg-white dark:bg-[#09090B] z-10 border-b border-gray-200 dark:border-neutral-800">
        <ChevronLeft
          className="h-5 w-5 mr-2 cursor-pointer"
          onClick={() => router.back()}
        />
        <h1 className="text-lg font-bold">Camping Details</h1>
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
        {/* Camping Images */}
        <div className="mb-6">
          <div className="rounded-lg overflow-hidden mb-4">
            <Image
              src={
                data.images?.[imageIndex] ||
                "/placeholder.svg?height=400&width=600"
              }
              alt="Camping Image"
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
                  key === imageIndex ? "border-[#FF6900]" : "border-gray-200"
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
              Camping Reel
            </h3>
            <div className="rounded-lg overflow-hidden">
              <video
                controls
                className="w-full h-64 object-cover"
                poster={
                  data.images?.[0] || "/placeholder.svg?height=256&width=400"
                }
              >
                <source src={data.reelVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        )}

        {/* Camping Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge className="mb-2">Camping</Badge>
                <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {data.location?.addressLine}, {data.location?.city}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Tent className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {data.tents?.length} tent types available
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#FF6900]">
                  From ₹
                  {Math.min(
                    ...(data.tents?.map((tent) => tent.pricePerNight) || [0])
                  )?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">per night</div>
              </div>
            </div>

            {/* Additional Charges */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Security Deposit:</span>
                <span className="ml-2">₹{data.securityDeposit}</span>
              </div>
              <div>
                <span className="font-medium">Late Checkout:</span>
                <span className="ml-2">₹{data.lateCheckoutCharge}</span>
              </div>
              <div>
                <span className="font-medium">Commission:</span>
                <span className="ml-2">₹{data.commission}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tent Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Tent className="h-5 w-5 mr-2" />
              Available Tents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedTent.toString()}
              onValueChange={(value) => setSelectedTent(Number.parseInt(value))}
            >
              <TabsList
                className={`grid w-full ${
                  data.tents?.length <= 2
                    ? "grid-cols-2"
                    : data.tents?.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
                }`}
              >
                {data.tents?.map((tent, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    className="text-xs md:text-sm"
                  >
                    {tent.tentType}
                  </TabsTrigger>
                ))}
              </TabsList>

              {data.tents?.map((tent, index) => (
                <TabsContent
                  key={index}
                  value={index.toString()}
                  className="mt-4"
                >
                  <div className="space-y-4">
                    {/* Tent Images */}
                    <div className="grid grid-cols-2 gap-2">
                      {tent.tentimages?.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="rounded-lg overflow-hidden"
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`${tent.tentType} tent`}
                            width={200}
                            height={150}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Tent Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">
                        {getTentTypeIcon(tent.tentType)}
                      </span>
                      <Badge className={getTentTypeColor(tent.tentType)}>
                        {tent.tentType} Tent
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 italic">
                        {getTentTypeDescription(tent.tentType)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Tent Details</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Type:</span>
                            <span className="ml-2">{tent.tentType}</span>
                          </div>
                          <div>
                            <span className="font-medium">Total Tents:</span>
                            <span className="ml-2">{tent.totaltents}</span>
                          </div>
                          <div>
                            <span className="font-medium">Capacity:</span>
                            <span className="ml-2">
                              {tent.minCapacity} - {tent.maxCapacity} guests
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <Badge
                              variant={
                                tent.isAvailable ? "default" : "secondary"
                              }
                              className="ml-2"
                            >
                              {tent.isAvailable ? "Available" : "Not Available"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Pricing</h4>
                        <div className="text-2xl font-bold text-[#FF6900] mb-2">
                          ₹{tent.pricePerNight?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">per night</div>
                      </div>
                    </div>

                    {/* Tent Amenities */}
                    <div>
                      <h4 className="font-semibold mb-2">Tent Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {tent.amenities?.map((amenity, amenityIndex) => (
                          <Badge key={amenityIndex} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
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

        {/* General Amenities */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">General Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {data.amenities?.map((amenity, index) => (
                <Badge key={index} variant="outline">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Camping Rules */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Camping Rules
            </h3>
            <ul className="space-y-2">
              {data.CampingRules?.map((rule, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 flex items-start"
                >
                  <span className="w-2 h-2 bg-[#FF6900] rounded-full mt-2 mr-3 flex-shrink-0"></span>
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
                className="text-[#FF6900] hover:underline"
              >
                View on Google Maps
              </a>
            </CardContent>
          </Card>
        )}

        {/* Camping Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Camping Statistics</h3>
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
            </div>
          </CardContent>
        </Card>

        {/* Commission Section - Only show if camping is pending approval */}
        {data.isapproved === "pending" && (
          <>
            <Card className="my-6">
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
                onClick={() => handleCampingStatus("approved")}
                className="flex-1 bg-[#FF6900] hover:bg-[#0d5a6e]"
                disabled={loadingApprove}
              >
                {loadingApprove ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Approve Camping"
                )}
              </Button>
              <Button
                onClick={() => handleCampingStatus("rejected")}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                disabled={loadingReject}
              >
                {loadingReject ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                  "Reject Camping"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
