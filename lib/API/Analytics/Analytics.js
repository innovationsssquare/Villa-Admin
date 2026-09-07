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
 * Robust API fetcher with graceful network and server error handling
 */
const safeApiFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BaseUrl}${endpoint}`, {
      headers: getHeaders(),
      cache: "no-store",
      ...options,
    });

    if (!res?.ok) {
      return {
        success: false,
        data: null,
        message: `HTTP error ${res?.status || "unknown"}`,
      };
    }

    const json = await res.json();
    return json || { success: false, data: null };
  } catch (err) {
    // Graceful warning without throwing uncaught console errors
    console.warn(`[Analytics API] Request to ${endpoint} failed:`, err?.message || err);
    return {
      success: false,
      data: null,
      message: err?.message || "Server response failed",
    };
  }
};

/**
 * Fetch executive metrics summary (Total bookings, revenue, paid, pending, cancellations)
 */
export const getAnalyticsSummary = async () => {
  return safeApiFetch("/Analytics/summary");
};

/**
 * Fetch booking status aggregation (confirmed, pending, cancelled, etc.)
 */
export const getBookingStatusAnalytics = async () => {
  return safeApiFetch("/Analytics/booking-status");
};

/**
 * Fetch payment status aggregation (paid, pending, refunded)
 */
export const getPaymentStatusAnalytics = async () => {
  return safeApiFetch("/Analytics/payment-status");
};

/**
 * Fetch payout status aggregation
 */
export const getPayoutStatusAnalytics = async () => {
  return safeApiFetch("/Analytics/payout-status");
};

/**
 * Fetch revenue trend over time (monthly, weekly, daily)
 */
export const getRevenueTrends = async (period = "month") => {
  const groupBy = period === "daily" || period === "day" ? "day" : "month";
  return safeApiFetch(`/Analytics/revenue-trend?groupBy=${groupBy}`);
};

/**
 * Fetch property type distribution and revenue contribution
 */
export const getPropertyTypeAnalytics = async () => {
  return safeApiFetch("/Analytics/property-type");
};

/**
 * Fetch coupon usage metrics
 */
export const getCouponsAnalytics = async () => {
  return safeApiFetch("/Analytics/coupons");
};

/**
 * Fetch cancellation statistics & root causes
 */
export const getCancellationAnalytics = async () => {
  return safeApiFetch("/Analytics/cancellations");
};

/**
 * Fetch stay duration metrics (average nights per stay)
 */
export const getStayDurationAnalytics = async () => {
  return safeApiFetch("/Analytics/stay-duration");
};
