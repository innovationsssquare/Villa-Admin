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
 * Robust API fetcher for payouts with graceful network and server error handling
 */
const safePayoutFetch = async (endpoint, options = {}) => {
  try {
    const res = await fetch(`${BaseUrl}${endpoint}`, {
      headers: getHeaders(),
      cache: "no-store",
      ...options,
    });

    if (!res?.ok) {
      return {
        success: false,
        data: [],
        stats: null,
        message: `HTTP error ${res?.status || "unknown"}`,
      };
    }

    const json = await res.json();
    return json || { success: false, data: [], stats: null };
  } catch (err) {
    console.warn(`[Payout API] Request to ${endpoint} failed:`, err?.message || err);
    return {
      success: false,
      data: [],
      stats: null,
      message: err?.message || "Server response failed",
    };
  }
};

/**
 * Fetch all hosts with pending payout balance, verified bank accounts, and settlement state
 */
export const getAdminPendingHosts = async ({ search = "", statusFilter = "all" } = {}) => {
  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (statusFilter) params.append("statusFilter", statusFilter);

  return safePayoutFetch(`/Payout/admin/pending-hosts?${params.toString()}`);
};

/**
 * Execute live RazorpayX payout transfer to host
 */
export const adminExecutePayout = async ({
  ownerId,
  amount,
  mode = "IMPS",
  narration = "",
  adminNotes = "",
}) => {
  return safePayoutFetch(`/Payout/admin/execute-payout`, {
    method: "POST",
    body: JSON.stringify({
      ownerId,
      amount,
      mode,
      narration,
      adminNotes,
    }),
  });
};

/**
 * Fetch unified transaction ledger of all payouts with UTR and status
 */
export const getAdminPayoutLedger = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "all",
} = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (search) params.append("search", search);
  if (status) params.append("status", status);

  return safePayoutFetch(`/Payout/admin/ledger?${params.toString()}`);
};

/**
 * Get total platform earnings (commissions, taxes, gateway fees)
 */
export const getAdminEarningsTotal = async () => {
  return safePayoutFetch("/Payout/total-earnings");
};

/**
 * Trigger automated checkout settlement job on demand
 */
export const triggerAutoSettlement = async () => {
  return safePayoutFetch("/Payout/admin/auto-settle", {
    method: "POST",
  });
};

/**
 * Fetch Live RazorpayX Account Balance
 */
export const getAdminRazorpayXBalance = async () => {
  return safePayoutFetch("/Payout/admin/razorpayx-balance");
};

/**
 * Create an Instant Payout Link for a Host
 */
export const adminCreatePayoutLink = async ({
  ownerId,
  amount,
  description = "",
  sendSms = true,
  sendEmail = true,
}) => {
  return safePayoutFetch("/Payout/admin/payout-link", {
    method: "POST",
    body: JSON.stringify({
      ownerId,
      amount,
      description,
      sendSms,
      sendEmail,
    }),
  });
};

/**
 * Fetch all Payout Links
 */
export const getAdminPayoutLinks = async ({ count = 20, skip = 0 } = {}) => {
  return safePayoutFetch(`/Payout/admin/payout-links?count=${count}&skip=${skip}`);
};

