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

export const GetOfflineBookingsAdmin = async ({
  page = 1,
  limit = 50,
  search = "",
  propertyType,
  status,
  paymentStatus,
  startDate,
  endDate,
} = {}) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams({ page, limit });
    if (search && search.trim()) params.append("search", search.trim());
    if (propertyType && propertyType !== "all") params.append("propertyType", propertyType);
    if (status && status !== "all") params.append("status", status);
    if (paymentStatus && paymentStatus !== "all") params.append("paymentStatus", paymentStatus);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const res = await fetch(`${BaseUrl}/Booking/admin/offline?${params.toString()}`, {
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
    console.warn("[Booking API] GetOfflineBookingsAdmin failed:", error?.message || error);
    return {
      success: false,
      data: [],
      message: error?.message || "Failed to fetch offline bookings",
    };
  }
};

export const GetOfflinePromotionalUsers = async ({
  search = "",
  propertyType,
  page = 1,
  limit = 100,
} = {}) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams({ page, limit });
    if (search && search.trim()) params.append("search", search.trim());
    if (propertyType && propertyType !== "all") params.append("propertyType", propertyType);

    const res = await fetch(`${BaseUrl}/Booking/offline/promotional-users?${params.toString()}`, {
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
    console.warn("[Booking API] GetOfflinePromotionalUsers failed:", error?.message || error);
    return {
      success: false,
      data: [],
      message: error?.message || "Failed to fetch promotional audience",
    };
  }
};

export const AdminApproveCancellation = async (
  bookingId,
  {
    refundAmount = 0,
    reason = "",
    adminNotes = "",
    processRazorpayRefund = false,
    transactionId = "",
  } = {}
) => {
  const token = Cookies.get("token");

  try {
    const res = await fetch(
      `${BaseUrl}/Booking/admin-approve-cancellation/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { token, Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          refundAmount,
          reason,
          adminNotes,
          processRazorpayRefund,
          transactionId,
        }),
      }
    );

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result?.message || `HTTP error ${res.status}`,
      };
    }
    return result;
  } catch (error) {
    console.warn("[Booking API] AdminApproveCancellation failed:", error);
    return {
      success: false,
      message: error?.message || "Failed to approve cancellation",
    };
  }
};

export const AdminRejectCancellation = async (
  bookingId,
  { rejectedReason = "", adminNotes = "" } = {}
) => {
  const token = Cookies.get("token");

  try {
    const res = await fetch(
      `${BaseUrl}/Booking/admin-reject-cancellation/${bookingId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { token, Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          rejectedReason,
          adminNotes,
        }),
      }
    );

    const result = await res.json();
    if (!res.ok) {
      return {
        success: false,
        message: result?.message || `HTTP error ${res.status}`,
      };
    }
    return result;
  } catch (error) {
    console.warn("[Booking API] AdminRejectCancellation failed:", error);
    return {
      success: false,
      message: error?.message || "Failed to reject cancellation",
    };
  }
};

