"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Home, Users, IndianRupee, Sparkles, CheckCircle2, Trees } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchcottagebyid } from "@/lib/Redux/Slices/cottageSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyVerificationShell from "@/components/Propertymanagecomponent/PropertyVerificationShell";

export default function CottageDetailsPage() {
  const { addToast } = useToast();
  const params = useParams();
  const dispatch = useDispatch();
  const { id } = params;
  const { data, loading, error } = useSelector((state) => state.cottage);

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [selectedCottageIndex, setSelectedCottageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(fetchcottagebyid(id));
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
    const cottageId = id;
    const body = {
      id: cottageId,
      status: status,
      commission: Number(commission) || 0,
      isLive: status === "approved",
      remarks: remarks || "",
    };

    if (status === "approved") setLoadingApprove(true);
    if (status === "rejected") setLoadingReject(true);

    try {
      const res = await fetch(`${BaseUrl}/Cottage/approve-reject/${cottageId}`, {
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
          title: `Cottage ${status === "approved" ? "Approved" : "Rejected"} Successfully`,
          description: result.message || `Cottage status updated to ${status}.`,
          variant: status === "approved" ? "success" : "default",
        });
        dispatch(fetchcottagebyid(id));
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

  const getCottageIcon = (type = "") => {
    switch (type.toLowerCase()) {
      case "wooden":
        return "🪵";
      case "luxury":
        return "✨";
      case "family":
        return "👨‍👩‍👧‍👦";
      case "couple":
        return "💕";
      default:
        return "🏡";
    }
  };

  // Render Cottage Units Section
  const renderCottagesSection = () => {
    const cottages = Array.isArray(data?.cottages) ? data.cottages : [];
    if (cottages.length === 0) {
      return (
        <div className="text-center py-6 text-neutral-400 text-xs italic">
          No individual cottage categories configured for this property.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-[#FF6900]" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Cottage Accommodations
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {cottages.length} cottage type{cottages.length > 1 ? "s" : ""} on site
              </p>
            </div>
          </div>
          <Badge className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-none font-bold">
            Total Units: {cottages.reduce((acc, c) => acc + (c.totalCottages || 1), 0)} Cottages
          </Badge>
        </div>

        <Tabs
          value={selectedCottageIndex.toString()}
          onValueChange={(val) => setSelectedCottageIndex(Number(val))}
        >
          <TabsList className="bg-neutral-100 dark:bg-neutral-900/80 p-1 rounded-xl flex gap-1 overflow-x-auto w-full justify-start h-auto">
            {cottages.map((cottage, idx) => (
              <TabsTrigger
                key={idx}
                value={idx.toString()}
                className="px-3.5 py-2 rounded-lg text-xs font-bold transition-all data-[state=active]:bg-white dark:data-[state=active]:bg-[#121215] data-[state=active]:text-[#FF6900] data-[state=active]:shadow-xs shrink-0"
              >
                <span className="mr-1.5">{getCottageIcon(cottage.cottageType)}</span>
                <span>{cottage.cottageType || `Cottage #${idx + 1}`}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {cottages.map((cottage, idx) => (
            <TabsContent key={idx} value={idx.toString()} className="mt-4 space-y-4">
              {/* Cottage Photos Strip */}
              {Array.isArray(cottage.cottageimages || cottage.cottageImages || cottage.images) && (cottage.cottageimages || cottage.cottageImages || cottage.images).length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {(cottage.cottageimages || cottage.cottageImages || cottage.images).map((img, imgIdx) => (
                    <div
                      key={imgIdx}
                      className="relative h-28 sm:h-36 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
                    >
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${cottage.cottageType} photo ${imgIdx + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Weekday Rate</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block">
                    ₹{(cottage.pricing?.weekdayPrice ?? cottage.pricePerNight ?? 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-400">Mon - Thu / night</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Weekend Rate</span>
                  <span className="text-base font-black text-[#FF6900] block">
                    ₹{(cottage.pricing?.weekendPrice ?? cottage.pricing?.weekdayPrice ?? cottage.pricePerNight ?? 0).toLocaleString("en-IN")}
                  </span>
                  <span className="text-[10px] text-neutral-400">Fri - Sun / night</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Capacity</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block flex items-center gap-1">
                    <Users className="w-4 h-4 text-[#FF6900]" />
                    {cottage.minCapacity ? `${cottage.minCapacity} - ${cottage.maxCapacity}` : (cottage.capacity || cottage.maxCapacity || 2)} Guests
                  </span>
                  <span className="text-[10px] text-neutral-400">per cottage</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Total Cottages</span>
                  <span className="text-base font-black text-neutral-900 dark:text-white block">
                    {cottage.totalcottage || cottage.totalCottages || 1} Units
                  </span>
                  <span className="text-[10px] text-neutral-400">on site</span>
                </div>

                <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium">Status</span>
                  <Badge
                    className={`mt-0.5 font-bold text-[10px] ${
                      cottage.isAvailable !== false
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                    }`}
                  >
                    {cottage.isAvailable !== false ? "Active for Booking" : "Unavailable"}
                  </Badge>
                </div>
              </div>

              {/* Cottage Amenities */}
              {Array.isArray(cottage.amenities) && cottage.amenities.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider block">
                    Cottage Amenities
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {cottage.amenities.map((item, aIdx) => (
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
      propertyType="cottage"
      data={data}
      loading={loading}
      error={error}
      onRefresh={() => id && dispatch(fetchcottagebyid(id))}
      onApprove={({ commission }) => handleStatusUpdate({ status: "approved", commission })}
      onReject={({ remarks }) => handleStatusUpdate({ status: "rejected", remarks })}
      loadingApprove={loadingApprove}
      loadingReject={loadingReject}
      renderUnits={renderCottagesSection()}
    />
  );
}
