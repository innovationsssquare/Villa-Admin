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
 * Fetch all disputes with pagination, filters, and KPI summary stats
 */
export const getAllDisputes = async ({
  page = 1,
  limit = 10,
  status = "ALL",
  priority = "ALL",
  search = "",
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status && status !== "ALL") params.append("status", status);
    if (priority && priority !== "ALL") params.append("priority", priority);
    if (search) params.append("search", search);

    const res = await fetch(`${BaseUrl}/Dispute?${params.toString()}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getAllDisputes error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Fetch a single dispute by ID
 */
export const getDisputeById = async (id) => {
  try {
    const res = await fetch(`${BaseUrl}/Dispute/${id}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getDisputeById error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Update dispute status (e.g., INVESTIGATING, ESCALATED, RESOLVED)
 */
export const updateDisputeStatus = async (id, { status, note }) => {
  try {
    const res = await fetch(`${BaseUrl}/Dispute/${id}/status`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ status, note }),
    });
    return await res.json();
  } catch (err) {
    console.error("updateDisputeStatus error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Add an internal admin note to a dispute
 */
export const addAdminNote = async (id, { note, isInternal = true }) => {
  try {
    const res = await fetch(`${BaseUrl}/Dispute/${id}/notes`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ note, isInternal }),
    });
    return await res.json();
  } catch (err) {
    console.error("addAdminNote error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Execute resolution for a dispute (REFUNDED, PAID_TO_OWNER, SPLIT_RESOLVED, DISMISSED)
 */
export const resolveDispute = async (
  id,
  { action, amountRefunded = 0, amountPaidToOwner = 0, summary }
) => {
  try {
    const res = await fetch(`${BaseUrl}/Dispute/${id}/resolve`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        action,
        amountRefunded,
        amountPaidToOwner,
        summary,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("resolveDispute error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Create a new dispute (used by Admin on behalf of customer/owner or directly)
 */
export const createDispute = async (payload) => {
  try {
    const res = await fetch(`${BaseUrl}/Dispute`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch (err) {
    console.error("createDispute error:", err);
    return { success: false, message: err.message };
  }
};
