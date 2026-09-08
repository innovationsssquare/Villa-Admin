"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Tent, Users, IndianRupee, Sparkles, CheckCircle2, Shield } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchcampingbyid } from "@/lib/Redux/Slices/campingSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyVerificationShell from "@/components/Propertymanagecomponent/PropertyVerificationShell";

export default function CampingDetailsPage() {
  const { addToast } = useToast();
  const params = useParams();
  const dispatch = useDispatch();
  const { id } = params;
  const { data, loading, error } = useSelector((state) => state.camping);

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [selectedTentIndex, setSelectedTentIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchcampingbyid(id));
    }
  }, [dispatch, id]);

  const handleStatusUpdate = async ({ status, commission = 0, remarks = "" }) => {
    if (status === "approved" && (!commission || commission <= 0)) {
      addToast({
        title: "Commission Required",
        description: "Please set a valid platform commission percentage to approve.",
        variant: "destructive",
      });
      return;
    }

    const token = Cookies.get("token");
    const body = {
      status: status,
      commission: Number(commission),
      isLive: status === "approved",
      remarks: remarks || "",
    };

    if (status === "approved") setLoadingApprove(true);
    if (status === "rejected") setLoadingReject(true);

    try {
      const res = await fetch(`${BaseUrl}/Camping/approve-reject/${id}`, {
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
          title: `Camping ${status === "approved" ? "Approved" : "Rejected"} Successfully`,
          description: result.message || `Property has been marked as ${status}.`,
          variant: status === "approved" ? "success" : "default",
        });
        dispatch(fetchcampingbyid(id));
      } else {
        addToast({
          title: `Failed to update status`,
          description: result.message || "Server error occurred",
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

  const getTentIcon = (type = "") => {
    switch (type.toLowerCase()) {
      case "luxury":
        return "✨";
      case "couple":
        return "💕";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "treehouse":
        return "🌳";
      default:
        return "🏕️";
    }
  };

  // Render Category-Specific Tents Showcase
  const renderTentsSection = () => {
    const tents = Array.isArray(data?.tents) ? data.tents : [];
    if (tents.length === 0) {
      return (
        <div className="text-center py-6 text-neutral-400 text-xs italic">
          No individual tent types configured for this camping site.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Tent className="w-5 h-5 text-[#FF6900]" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Available Tent Accommodations
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {tents.length} tent accommodation type{tents.length > 1 ? "s" : ""} on property
              </p>
            </div>
          </div>
          <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-none font-bold">
            Total Capacity: {tents.reduce((acc, t) => acc + (t.totaltents || 1) * (t.maxCapacity || 2), 0)} Guests
          </Badge>
        </div>

        <Tabs
          value={selectedTentIndex.toString()}
          onValueChange={(val) => setSelectedTentIndex(Number(val))}
        >
          <TabsList className="bg-neutral-100 dark:bg-neutral-900/80 p-1 rounded-xl flex gap-1 overflow-x-auto w-full justify-start h-auto">
            {tents.map((tent, idx) => (
              <TabsTrigger
                key={idx}
                value={idx.toString()}
                className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-[#121215] data-[state=active]:text-[#FF6900] data-[state=active]:shadow-xs shrink-0"
              >
                <span className="mr-1.5">{getTentIcon(tent.tentType)}</span>
                <span>{tent.tentType || `Tent #${idx + 1}`}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tents.map((tent, idx) => (
            <TabsContent key={idx} value={idx.toString()} className="mt-4 space-y-4">
              {/* Tent Photos Strip */}
              {Array.isArray(tent.tentimages) && tent.tentimages.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {tent.tentimages.map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="relative h-28 sm:h-36 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${tent.tentType} image ${imgIdx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Tent Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Weekday Rate</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block">
                    ₹{(tent.pricing?.weekdayPrice ?? tent.pricePerNight ?? 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-400">Mon - Thu / night</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Weekend Rate</span>
                  <span className="text-base font-black text-[#FF6900] block">
                    ₹{(tent.pricing?.weekendPrice ?? tent.pricing?.weekdayPrice ?? tent.pricePerNight ?? 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-400">Fri - Sun / night</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Guest Capacity</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#FF6900]" />
                    {tent.minCapacity || 1} - {tent.maxCapacity || 2}
                  </span>
                  <span className="text-[10px] text-neutral-400">guests per tent</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Inventory</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block">
                    {tent.totaltents || 1} Tents
                  </span>
                  <span className="text-[10px] text-neutral-400">available units</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Status</span>
                  <Badge
                    className={`mt-0.5 font-bold text-[10px] ${
                      tent.isAvailable !== false
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {tent.isAvailable !== false ? "Active for Booking" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              {/* Tent-Specific Amenities */}
              {Array.isArray(tent.amenities) && tent.amenities.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                    Tent Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tent.amenities.map((item, aIdx) => (
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
      propertyType="camping"
      data={data}
      loading={loading}
      error={error}
      onRefresh={() => id && dispatch(fetchcampingbyid(id))}
      onApprove={({ commission }) => handleStatusUpdate({ status: "approved", commission })}
      onReject={({ remarks }) => handleStatusUpdate({ status: "rejected", remarks })}
      loadingApprove={loadingApprove}
      loadingReject={loadingReject}
      renderUnits={renderTentsSection()}
    />
  );
}
