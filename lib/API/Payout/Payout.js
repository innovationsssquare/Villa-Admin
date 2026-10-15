import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllpayout = async (filters = {}) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "" && value !== "all") {
        params.append(key, value);
      }
    });

    const res = await fetch(`${BaseUrl}/Payout/list?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        ...(token ? { token, Authorization: `Bearer ${token}` } : {}),
      },
      cache: "no-store",
    });

    if (!res?.ok) {
      return {
        success: false,
        data: [],
        stats: null,
        message: `HTTP error ${res?.status || "unknown"}`,
      };
    }

    const result = await res.json();
    return result || { success: false, data: [], stats: null };
  } catch (error) {
    console.warn("[Payout API] GetAllpayout failed:", error?.message || error);
    return {
      success: false,
      data: [],
      stats: null,
      message: error?.message || "Failed to fetch payouts",
    };
  }
};
