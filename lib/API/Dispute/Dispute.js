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
 * Robust API fetcher for disputes with graceful network and server error handling
 */
const safeDisputeFetch = async (endpoint, options = {}) => {
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
    console.warn(`[Dispute API] Request to ${endpoint} failed:`, err?.message || err);
    return {
      success: false,
      data: [],
      stats: null,
      message: err?.message || "Server response failed",
    };
  }
};

/**
 * Fetch all disputes with pagination, filters, and KPI summary stats
 */
export const getAllDisputes = async ({
  page = 1,
  limit = 10,
  status = "ALL",
  priority = "ALL",
  search = "",
} = {}) => {
  const params = new URLSearchParams();
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);
  if (status && status !== "ALL") params.append("status", status);
  if (priority && priority !== "ALL") params.append("priority", priority);
  if (search) params.append("search", search);

  return safeDisputeFetch(`/Dispute?${params.toString()}`);
};

/**
 * Fetch a single dispute by ID
 */
export const getDisputeById = async (id) => {
  return safeDisputeFetch(`/Dispute/${id}`);
};

/**
 * Update dispute status (e.g., INVESTIGATING, ESCALATED, RESOLVED)
 */
export const updateDisputeStatus = async (id, { status, note }) => {
  return safeDisputeFetch(`/Dispute/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, note }),
  });
};

/**
 * Add an internal admin note to a dispute
 */
export const addAdminNote = async (id, { note, isInternal = true }) => {
  return safeDisputeFetch(`/Dispute/${id}/notes`, {
    method: "POST",
    body: JSON.stringify({ note, isInternal }),
  });
};

/**
 * Execute resolution for a dispute (REFUNDED, PAID_TO_OWNER, SPLIT_RESOLVED, DISMISSED)
 */
export const resolveDispute = async (
  id,
  { action, amountRefunded = 0, amountPaidToOwner = 0, summary }
) => {
  return safeDisputeFetch(`/Dispute/${id}/resolve`, {
    method: "POST",
    body: JSON.stringify({
      action,
      amountRefunded,
      amountPaidToOwner,
      summary,
    }),
  });
};

/**
 * Create a new dispute (used by Admin on behalf of customer/owner or directly)
 */
export const createDispute = async (payload) => {
  return safeDisputeFetch(`/Dispute`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
