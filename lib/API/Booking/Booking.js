import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllbooking = async ({ page = 1, limit = 10 } = {}) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams({ page, limit });

    const res = await fetch(`${BaseUrl}/Booking/admin?${params.toString()}`, {
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
        message: `HTTP error ${res?.status || "unknown"}`,
      };
    }

    const result = await res.json();
    return result || { success: false, data: [] };
  } catch (error) {
    console.warn("[Booking API] GetAllbooking failed:", error?.message || error);
    return {
      success: false,
      data: [],
      message: error?.message || "Failed to fetch bookings",
    };
  }
};
