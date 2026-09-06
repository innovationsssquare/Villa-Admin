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
 * Fetch all hosts with pending payout balance, verified bank accounts, and settlement state
 */
export const getAdminPendingHosts = async ({ search = "", statusFilter = "all" } = {}) => {
  try {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (statusFilter) params.append("statusFilter", statusFilter);

    const res = await fetch(`${BaseUrl}/Payout/admin/pending-hosts?${params.toString()}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getAdminPendingHosts error:", err);
    return { success: false, message: err.message };
  }
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
  try {
    const res = await fetch(`${BaseUrl}/Payout/admin/execute-payout`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ownerId,
        amount,
        mode,
        narration,
        adminNotes,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("adminExecutePayout error:", err);
    return { success: false, message: err.message };
  }
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
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (status) params.append("status", status);

    const res = await fetch(`${BaseUrl}/Payout/admin/ledger?${params.toString()}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getAdminPayoutLedger error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Get total platform earnings (commissions, taxes, gateway fees)
 */
export const getAdminEarningsTotal = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Payout/total-earnings`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getAdminEarningsTotal error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Trigger automated checkout settlement job on demand
 */
export const triggerAutoSettlement = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Payout/admin/auto-settle`, {
      method: "POST",
      headers: getHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("triggerAutoSettlement error:", err);
    return { success: false, message: err.message };
  }
};
