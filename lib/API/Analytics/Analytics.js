import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

const getHeaders = () => {
  const token = Cookies.get("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}`, token } : {}),
  };
};

/**
 * Fetch executive metrics summary (Total bookings, revenue, paid, pending, cancellations)
 */
export const getAnalyticsSummary = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/summary`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getAnalyticsSummary error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch booking status aggregation (confirmed, pending, cancelled, etc.)
 */
export const getBookingStatusAnalytics = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/booking-status`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getBookingStatusAnalytics error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch payment status aggregation (paid, pending, refunded)
 */
export const getPaymentStatusAnalytics = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/payment-status`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getPaymentStatusAnalytics error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch payout status aggregation
 */
export const getPayoutStatusAnalytics = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/payout-status`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getPayoutStatusAnalytics error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch revenue trend over time (monthly, weekly, daily)
 */
export const getRevenueTrends = async (period = "month") => {
  try {
    const groupBy = period === "daily" || period === "day" ? "day" : "month";
    const res = await fetch(`${BaseUrl}/Analytics/revenue-trend?groupBy=${groupBy}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getRevenueTrends error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch property type distribution and revenue contribution
 */
export const getPropertyTypeAnalytics = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/property-type`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getPropertyTypeAnalytics error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch coupon usage metrics
 */
export const getCouponsAnalytics = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/coupons`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getCouponsAnalytics error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch cancellation statistics & root causes
 */
export const getCancellationAnalytics = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/cancellations`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getCancellationAnalytics error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch stay duration metrics (average nights per stay)
 */
export const getStayDurationAnalytics = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Analytics/stay-duration`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getStayDurationAnalytics error:", err);
    return { success: false, message: err.message };
  }
};
