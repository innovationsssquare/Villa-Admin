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
  Hotel,
  Bed,
  Users,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDispatch, useSelector } from "react-redux";
import { fetchhotelbyid } from "@/lib/Redux/Slices/hotelSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HotelDetailsPage() {
  const { addToast } = useToast();
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { id } = params;
  const { data, loading, error } = useSelector((state) => state.hotel);
  const [commission, setCommission] = useState(0);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [selectedRoom, setSelectedRoom] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchhotelbyid(id));
    }
  }, [dispatch, id]);

  const handleHotelStatus = async (status) => {
    if (status === "approved" && (!commission || commission <= 0)) {
      addToast({
        title: "Commission is required to approve the hotel.",
        description: "Please enter a valid commission percentage.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    const token = Cookies.get("token");
    const hotelId = id;
    const body = {
      hotelId: [
        {
          hotelId,
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
      let result = await fetch(`${BaseUrl}/hotel/approve/hotels`, {
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
          title: `Hotel ${status} Successfully`,
          description: result.message || `Hotel has been ${status}`,
          variant: "success",
          duration: 5000,
        });
        // Refresh the data
        dispatch(fetchhotelbyid(id));
      } else {
        addToast({
          title: `Failed to ${status} hotel`,
          description: result.message || "Something went wrong",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      addToast({
        title: `Failed to ${status} hotel`,
        description: error.message,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setLoadingApprove(false);
      setLoadingReject(false);
    }
  };

  const getRoomTypeIcon = (roomType) => {
    switch (roomType.toLowerCase()) {
      case "single":
        return "🛏️";
      case "double":
        return "🛏️🛏️";
      case "deluxe":
        return "✨";
      case "suite":
        return "🏨";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "presidential":
        return "👑";
      default:
        return "🛏️";
    }
  };

  const getRoomTypeColor = (roomType) => {
    switch (roomType.toLowerCase()) {
      case "single":
        return "bg-[#106C83]/10 text-[#106C83]";
      case "double":
        return "bg-green-100 text-green-800";
      case "deluxe":
        return "bg-purple-100 text-purple-800";
      case "suite":
        return "bg-amber-100 text-amber-800";
      case "family":
        return "bg-pink-100 text-pink-800";
      case "presidential":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoomTypeDescription = (roomType) => {
    switch (roomType.toLowerCase()) {
      case "single":
        return "Comfortable accommodation for solo travelers.";
      case "double":
        return "Spacious room perfect for couples or two guests.";
      case "deluxe":
        return "Premium room with enhanced amenities and comfort.";
      case "suite":
        return "Luxurious suite with separate living area.";
      case "family":
        return "Large room designed for families with children.";
      case "presidential":
        return "Ultimate luxury experience with exclusive amenities.";
      default:
        return "Comfortable hotel accommodation.";
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
          <p className="text-red-500 mb-4">Error loading hotel details</p>
          <Button onClick={() => dispatch(fetchhotelbyid(id))}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full flex justify-center items-center h-screen">
        <p>No hotel data found</p>
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
        <h1 className="text-lg font-bold">Hotel Details</h1>
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
        {/* Hotel Images */}
        <div className="mb-6">
          <div className="rounded-lg overflow-hidden mb-4">
            <Image
              src={
                data.images?.[imageIndex] ||
                "/placeholder.svg?height=400&width=600"
              }
              alt="Hotel Image"
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
              Hotel Reel
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

        {/* Hotel Basic Info */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Badge className="mb-2">Hotel</Badge>
                <h2 className="text-2xl font-bold mb-2">{data.name}</h2>
                <div className="flex items-center text-gray-600 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {data.location?.addressLine}, {data.location?.city}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Hotel className="h-4 w-4 mr-1" />
                  <span className="text-sm">
                    {data.rooms?.length} room types available
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#106C83]">
                  From ₹
                  {Math.min(
                    ...(data.rooms?.map((room) => room.pricePerNight) || [0])
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
                <span className="font-medium">Total Rooms:</span>
                <span className="ml-2">
                  {data.rooms?.reduce(
                    (total, room) => total + room.totalRooms,
                    0
                  )}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Room Details */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bed className="h-5 w-5 mr-2" />
              Available Rooms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedRoom.toString()}
              onValueChange={(value) => setSelectedRoom(Number.parseInt(value))}
            >
              <TabsList
                className={`grid w-full ${
                  data.rooms?.length <= 2
                    ? "grid-cols-2"
                    : data.rooms?.length === 3
                    ? "grid-cols-3"
                    : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                }`}
              >
                {data.rooms?.map((room, index) => (
                  <TabsTrigger
                    key={index}
                    value={index.toString()}
                    className="text-xs md:text-sm"
                  >
                    {room.roomType}
                  </TabsTrigger>
                ))}
              </TabsList>

              {data.rooms?.map((room, index) => (
                <TabsContent
                  key={index}
                  value={index.toString()}
                  className="mt-4"
                >
                  <div className="space-y-4">
                    {/* Room Images */}
                    <div className="grid grid-cols-2 gap-2">
                      {room.images?.map((img, imgIndex) => (
                        <div
                          key={imgIndex}
                          className="rounded-lg overflow-hidden"
                        >
                          <Image
                            src={img || "/placeholder.svg"}
                            alt={`${room.roomType} room`}
                            width={200}
                            height={150}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Room Info */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl">
                        {getRoomTypeIcon(room.roomType)}
                      </span>
                      <Badge className={getRoomTypeColor(room.roomType)}>
                        {room.roomType} Room
                      </Badge>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 italic">
                        {getRoomTypeDescription(room.roomType)}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Room Details</h4>
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="font-medium">Type:</span>
                            <span className="ml-2">{room.roomType}</span>
                          </div>
                          <div>
                            <span className="font-medium">Room Number:</span>
                            <span className="ml-2">{room.roomNumber}</span>
                          </div>
                          <div>
                            <span className="font-medium">Total Rooms:</span>
                            <span className="ml-2">{room.totalRooms}</span>
                          </div>
                          <div>
                            <span className="font-medium">Max Capacity:</span>
                            <div className="flex items-center ml-2">
                              <Users className="h-3 w-3 mr-1" />
                              <span>{room.maxCapacity} guests</span>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">Status:</span>
                            <Badge
                              variant={
                                room.status === "available"
                                  ? "default"
                                  : "secondary"
                              }
                              className="ml-2"
                            >
                              {room.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Pricing</h4>
                        <div className="text-2xl font-bold text-[#106C83] mb-2">
                          ₹{room.pricePerNight?.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">per night</div>
                      </div>
                    </div>

                    {/* Room Amenities */}
                    <div>
                      <h4 className="font-semibold mb-2">Room Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities?.map((amenity, amenityIndex) => (
                          <Badge key={amenityIndex} variant="outline">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Booked Dates */}
                    {room.bookedDates && room.bookedDates.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Booked Dates</h4>
                        <div className="text-sm text-gray-600">
                          {room.bookedDates.length} booking(s) found
                        </div>
                      </div>
                    )}
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
        {data.amenities && data.amenities.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4">Hotel Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {data.amenities?.map((amenity, index) => (
                  <Badge key={index} variant="outline">
                    {amenity}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Hotel Rules */}
        {data.HotelRules && data.HotelRules.length > 0 && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <h3 className="font-bold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Hotel Rules
              </h3>
              <ul className="space-y-2">
                {data.HotelRules?.map((rule, index) => (
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
        )}

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
                className="text-[#106C83] hover:underline hover:text-[#0e5c6f]"
              >
                View on Google Maps
              </a>
            </CardContent>
          </Card>
        )}

        {/* Hotel Stats */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-bold mb-4">Hotel Statistics</h3>
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
                onClick={() => handleHotelStatus("approved")}
                className="flex-1 bg-[#106C83] hover:bg-[#0e5c6f]"
                disabled={loadingApprove}
              >
                {loadingApprove ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  "Approve Hotel"
                )}
              </Button>
              <Button
                onClick={() => handleHotelStatus("rejected")}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
                disabled={loadingReject}
              >
                {loadingReject ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                ) : (
                  "Reject Hotel"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}
