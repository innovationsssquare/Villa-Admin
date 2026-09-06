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
 * Fetch all support tickets with filtering by source, status, category, priority, and search
 */
export const getAllSupportTickets = async ({
  page = 1,
  limit = 50,
  source = "all",
  status = "all",
  priority = "all",
  category = "all",
  search = "",
} = {}) => {
  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (source && source !== "all") params.append("source", source);
    if (status && status !== "all") params.append("status", status);
    if (priority && priority !== "all") params.append("priority", priority);
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);

    const res = await fetch(`${BaseUrl}/Support?${params.toString()}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getAllSupportTickets error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Get detailed ticket by ID
 */
export const getSupportTicketById = async (id) => {
  try {
    const res = await fetch(`${BaseUrl}/Support/${id}`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (err) {
    console.error("getSupportTicketById error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Update support ticket status, assignment, or resolution notes
 */
export const updateSupportTicketStatus = async (id, updateData) => {
  try {
    const res = await fetch(`${BaseUrl}/Support/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify(updateData),
    });
    return await res.json();
  } catch (err) {
    console.error("updateSupportTicketStatus error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Post an admin reply into the conversation thread
 */
export const postTicketReply = async (id, { message, senderName, status }) => {
  try {
    const res = await fetch(`${BaseUrl}/Support/${id}/reply`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        message,
        senderRole: "admin",
        senderName: senderName || "Admin Support",
        status,
      }),
    });
    return await res.json();
  } catch (err) {
    console.error("postTicketReply error:", err);
    return { success: false, message: err.message };
  }
};

/**
 * Soft delete a ticket
 */
export const deleteSupportTicket = async (id) => {
  try {
    const res = await fetch(`${BaseUrl}/Support/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error("deleteSupportTicket error:", err);
    return { success: false, message: err.message };
  }
};
