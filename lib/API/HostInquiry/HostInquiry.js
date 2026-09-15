import { BaseUrl } from "@/lib/API/Baseurl";

/**
 * Fetch all host inquiries with optional filtering, search, and pagination
 */
export const getAllHostInquiries = async ({
  page = 1,
  limit = 20,
  status = "all",
  search = "",
  propertyType = "all",
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status && status !== "all") params.append("status", status);
    if (search && search.trim()) params.append("search", search.trim());
    if (propertyType && propertyType !== "all") params.append("propertyType", propertyType);

    const res = await fetch(`${BaseUrl}/HostInquiry/all?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to fetch host inquiries");
    }

    return await res.json();
  } catch (err) {
    console.error("getAllHostInquiries error:", err);
    throw err;
  }
};

/**
 * Update host inquiry status and admin notes
 */
export const updateHostInquiryStatus = async (id, { status, adminNotes }) => {
  try {
    const res = await fetch(`${BaseUrl}/HostInquiry/update-status/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, adminNotes }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to update inquiry status");
    }

    return await res.json();
  } catch (err) {
    console.error("updateHostInquiryStatus error:", err);
    throw err;
  }
};

/**
 * Delete host inquiry
 */
export const deleteHostInquiry = async (id) => {
  try {
    const res = await fetch(`${BaseUrl}/HostInquiry/delete/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || "Failed to delete inquiry");
    }

    return await res.json();
  } catch (err) {
    console.error("deleteHostInquiry error:", err);
    throw err;
  }
};
