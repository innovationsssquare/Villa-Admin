import { BaseUrl } from "../Baseurl";

/**
 * 📢 Broadcast Announcement to all Property Owners
 * @param {Object} data { title, message, priority, category, targetAudience }
 */
export const broadcastAnnouncementToHosts = async (data) => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") || localStorage.getItem("token") : "";
    const response = await fetch(`${BaseUrl}/Notification/announcement`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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
    const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") || localStorage.getItem("token") : "";
    const response = await fetch(`${BaseUrl}/Notification/announcements`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: error.message, data: [] };
  }
};
