"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Home, Users, Calendar, UtensilsCrossed, UserPlus, Clock } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchvillabyid } from "@/lib/Redux/Slices/villaSlice";
import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";
import { useToast } from "@/components/ui/toast-provider";
import { Badge } from "@/components/ui/badge";
import PropertyVerificationShell from "@/components/Propertymanagecomponent/PropertyVerificationShell";

export default function VillaDetailsPage() {
  const { addToast } = useToast();
  const params = useParams();
  const dispatch = useDispatch();
  const { id } = params;
  const { data, loading, error } = useSelector((state) => state.villa);

  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchvillabyid(id));
    }
  }, [dispatch, id]);

  const handleStatusUpdate = async ({ status, commission = 0 }) => {
    if (status === "approved" && (!commission || commission <= 0)) {
      addToast({
        title: "Commission Required",
        description: "Please set a valid platform commission percentage to approve.",
        variant: "destructive",
      });
      return;
    }

    const token = Cookies.get("token");
    const villaId = id;
    const body = {
      status: status,
      commission: commission,
      isLive: status === "approved",
    };

    if (status === "approved") setLoadingApprove(true);
    if (status === "rejected") setLoadingReject(true);

    try {
      const res = await fetch(`${BaseUrl}/Villa/approve-reject/${villaId}`, {
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
          title: `Villa ${status === "approved" ? "Approved" : "Rejected"} Successfully`,
          description: result.message || `Villa status updated to ${status}.`,
          variant: status === "approved" ? "success" : "default",
        });
        dispatch(fetchvillabyid(id));
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

  // Render Villa-Specific Unit & Pricing Breakdown
  const renderVillaDetails = () => {
    if (!data) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-[#FF6900]" />
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                Villa Layout & Pricing Structure
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Exclusive entire-villa accommodation details
              </p>
            </div>
          </div>
          <Badge className="bg-[#FFF1E6] dark:bg-[#FF6900]/10 text-[#FF6900] border-none font-bold text-xs">
            {data.bhkType || "Luxury Villa"}
          </Badge>
        </div>

        {/* Pricing & Capacity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#FF6900]" />
              Weekday Price
            </span>
            <span className="text-lg font-black text-[#FF6900] block">
              ₹{data.pricing?.weekdayPrice?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-[10px] text-neutral-400">Mon - Thu per night</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              Weekend Price
            </span>
            <span className="text-lg font-black text-neutral-900 dark:text-white block">
              ₹{data.pricing?.weekendPrice?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-[10px] text-neutral-400">Fri - Sun per night</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-[#FF6900]" />
              Max Guest Capacity
            </span>
            <span className="text-lg font-black text-neutral-900 dark:text-white block">
              {data.maxCapacity || 8} Guests
            </span>
            <span className="text-[10px] text-neutral-400">full villa capacity</span>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800">
            <span className="text-[11px] text-neutral-400 block mb-0.5 font-medium flex items-center gap-1">
              <UserPlus className="w-3.5 h-3.5 text-blue-500" />
              Extra Guest Charge
            </span>
            <span className="text-lg font-black text-neutral-900 dark:text-white block">
              ₹{data.extraPersonCharge?.toLocaleString("en-IN") || 0}
            </span>
            <span className="text-[10px] text-neutral-400">per extra person</span>
          </div>
        </div>

        {/* Additional Charges Banner */}
        <div className="p-3.5 rounded-xl bg-neutral-100/70 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-neutral-500 dark:text-neutral-400 font-medium block">Kitchen Usage Charge:</span>
            <span className="font-bold text-neutral-900 dark:text-white text-sm">
              {data.kitchenCharge ? `₹${data.kitchenCharge.toLocaleString("en-IN")}` : "Free / Included"}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 dark:text-neutral-400 font-medium block">Security Deposit:</span>
            <span className="font-bold text-neutral-900 dark:text-white text-sm">
              {data.securityDeposit ? `₹${data.securityDeposit.toLocaleString("en-IN")}` : "₹0 (No deposit)"}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 dark:text-neutral-400 font-medium block">Late Checkout Charge:</span>
            <span className="font-bold text-neutral-900 dark:text-white text-sm">
              {data.lateCheckoutCharge ? `₹${data.lateCheckoutCharge.toLocaleString("en-IN")}` : "₹0"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PropertyVerificationShell
      propertyType="villa"
      data={data}
      loading={loading}
      error={error}
      onRefresh={() => id && dispatch(fetchvillabyid(id))}
      onApprove={({ commission }) => handleStatusUpdate({ status: "approved", commission })}
      onReject={({ remarks }) => handleStatusUpdate({ status: "rejected", remarks })}
      loadingApprove={loadingApprove}
      loadingReject={loadingReject}
      renderUnits={renderVillaDetails()}
    />
  );
}
