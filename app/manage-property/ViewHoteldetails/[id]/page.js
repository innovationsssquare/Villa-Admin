"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Hotel, Bed, Users, IndianRupee, Sparkles, CheckCircle2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchhotelbyid } from "@/lib/Redux/Slices/hotelSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyVerificationShell from "@/components/Propertymanagecomponent/PropertyVerificationShell";

export default function HotelDetailsPage() {
  const { addToast } = useToast();
  const params = useParams();
  const dispatch = useDispatch();
  const { id } = params;
  const { data, loading, error } = useSelector((state) => state.hotel);

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [selectedRoomIndex, setSelectedRoomIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchhotelbyid(id));
    }
  }, [dispatch, id]);

  const handleStatusUpdate = async ({ status, commission = 0, remarks = "" }) => {
    if (status === "approved" && (!commission || Number(commission) <= 0)) {
      addToast({
        title: "Commission Required",
        description: "Please set a valid platform commission percentage to approve.",
        variant: "destructive",
      });
      return;
    }

    const token = Cookies.get("token");
    const hotelId = id;
    const body = {
      id: hotelId,
      status: status,
      commission: Number(commission) || 0,
      isLive: status === "approved",
      remarks: remarks || "",
    };

    if (status === "approved") setLoadingApprove(true);
    if (status === "rejected") setLoadingReject(true);

    try {
      const res = await fetch(`${BaseUrl}/Hotel/approve-reject/${hotelId}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body: JSON.stringify(body),
      });
      const result = await res.json();

      if (result.success) {
        addToast({
          title: `Hotel ${status === "approved" ? "Approved" : "Rejected"} Successfully`,
          description: result.message || `Hotel status updated to ${status}.`,
          variant: status === "approved" ? "success" : "default",
        });
        dispatch(fetchhotelbyid(id));
      } else {
        addToast({
          title: `Failed to update status`,
          description: result.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (err) {
      addToast({
        title: "Request Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoadingApprove(false);
      setLoadingReject(false);
    }
  };

  const getRoomIcon = (type = "") => {
    switch (type.toLowerCase()) {
      case "suite":
        return "✨";
      case "deluxe":
        return "👑";
      case "double":
        return "🛏️🛏️";
      case "single":
        return "🛏️";
      case "family":
        return "👨‍👩‍👧‍👦";
      default:
        return "🏨";
    }
  };

  // Render Hotel Rooms Section
  const renderRoomsSection = () => {
    const rooms = Array.isArray(data?.rooms) ? data.rooms : [];
    if (rooms.length === 0) {
      return (
        <div className="text-center py-6 text-neutral-400 text-xs italic">
          No individual room categories configured for this hotel.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Hotel className="w-5 h-5 text-[#FF6900]" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Hotel Room Categories
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {rooms.length} room type{rooms.length > 1 ? "s" : ""} available on property
              </p>
            </div>
          </div>
          <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-none font-bold">
            Total Inventory: {rooms.reduce((acc, r) => acc + (r.totalRooms || 1), 0)} Rooms
          </Badge>
        </div>

        <Tabs
          value={selectedRoomIndex.toString()}
          onValueChange={(val) => setSelectedRoomIndex(Number(val))}
        >
          <TabsList className="bg-neutral-100 dark:bg-neutral-900/80 p-1 rounded-xl flex gap-1 overflow-x-auto w-full justify-start h-auto">
            {rooms.map((room, idx) => (
              <TabsTrigger
                key={idx}
                value={idx.toString()}
                className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-[#121215] data-[state=active]:text-[#FF6900] data-[state=active]:shadow-xs shrink-0"
              >
                <span className="mr-1.5">{getRoomIcon(room.roomType)}</span>
                <span>{room.roomType || `Room #${idx + 1}`}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {rooms.map((room, idx) => (
            <TabsContent key={idx} value={idx.toString()} className="mt-4 space-y-4">
              {/* Room Photos Strip */}
              {Array.isArray(room.images || room.roomImages) && (room.images || room.roomImages).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(room.images || room.roomImages).map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="relative h-28 sm:h-36 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${room.roomType} photo ${imgIdx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Room Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Weekday Rate</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block">
                    ₹{(room.pricing?.weekdayPrice ?? room.pricePerNight ?? 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-400">Mon - Thu / night</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Weekend Rate</span>
                  <span className="text-base font-black text-[#FF6900] block">
                    ₹{(room.pricing?.weekendPrice ?? room.pricing?.weekdayPrice ?? room.pricePerNight ?? 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-400">Fri - Sun / night</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Room Capacity</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#FF6900]" />
                    {room.maxCapacity || room.capacity || 2} Guests
                  </span>
                  <span className="text-[10px] text-neutral-400">maximum occupancy</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Inventory</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block">
                    {room.totalRooms || 1} Rooms
                  </span>
                  <span className="text-[10px] text-neutral-400">total units</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Status</span>
                  <Badge
                    className={`mt-0.5 font-bold text-[10px] ${
                      room.isAvailable !== false
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {room.isAvailable !== false ? "Active for Booking" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              {/* Room Amenities */}
              {Array.isArray(room.amenities) && room.amenities.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                    Room Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {room.amenities.map((item, aIdx) => (
                      <Badge
                        key={aIdx}
                        variant="outline"
                        className="border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs py-1 px-2.5 rounded-lg"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    );
  };

  return (
    <PropertyVerificationShell
      propertyType="hotel"
      data={data}
      loading={loading}
      error={error}
      onRefresh={() => id && dispatch(fetchhotelbyid(id))}
      onApprove={({ commission }) => handleStatusUpdate({ status: "approved", commission })}
      onReject={({ remarks }) => handleStatusUpdate({ status: "rejected", remarks })}
      loadingApprove={loadingApprove}
      loadingReject={loadingReject}
      renderUnits={renderRoomsSection()}
    />
  );
}
