import { BaseUrl } from "../Baseurl";
import Cookies from "js-cookie";

const getToken = () => {
  return Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("adminToken") || localStorage.getItem("token") : "");
};

/**
 * 📢 Broadcast Announcement to all Property Owners
 * @param {Object} data { title, message, priority, category, targetAudience }
 */
export const broadcastAnnouncementToHosts = async (data) => {
  try {
    const token = getToken();
    const response = await fetch(`${BaseUrl}/Notification/announcement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        token,
      },
      body: JSON.stringify(data),
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * 📜 Fetch Announcement History with delivery stats
 */
export const fetchAnnouncementHistory = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${BaseUrl}/Notification/announcements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        token,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};

/**
 * 🔔 Fetch All Admin Notifications (persisted from MongoDB)
 */
export const fetchAdminNotifications = async (page = 1, limit = 40) => {
  try {
    const token = getToken();
    const response = await fetch(
      `${BaseUrl}/Notification/admin/all?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          token,
        },
      }
    );
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};

/**
 * 🔔 Mark a Single Notification as Read
 */
export const markNotificationRead = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${BaseUrl}/Notification/read/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        token,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * 🔔 Mark All Admin Notifications as Read
 */
export const markAllNotificationsRead = async () => {
  try {
    const token = getToken();
    const response = await fetch(`${BaseUrl}/Notification/read-all/admin`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        token,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * 🗑️ Delete Notification
 */
export const deleteNotification = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${BaseUrl}/Notification/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        token,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message };
  }
};
