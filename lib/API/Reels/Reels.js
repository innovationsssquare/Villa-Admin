import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

/**
 * Fetch all reels with weekend occupancy, bookings count, and yield ranking intelligence
 */
export const FetchAdminReels = async () => {
  const token = Cookies.get("token");

  try {
    const res = await fetch(`${BaseUrl}/Admin/reels`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("FetchAdminReels error:", error);
    return { success: false, message: error.message, data: [] };
  }
};

/**
 * Update drag-and-drop order & priority scores for reels
 */
export const ReorderAdminReels = async (reels) => {
  const token = Cookies.get("token");

  try {
    const res = await fetch(`${BaseUrl}/Admin/reels/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ reels }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("ReorderAdminReels error:", error);
    return { success: false, message: error.message };
  }
};

/**
 * 1-Click Yield Action: Boost unreserved properties for the upcoming weekend
 */
export const BoostVacantWeekendReels = async ({ boostPriority = 50, customBadge = "Weekend Deal" } = {}) => {
  const token = Cookies.get("token");

  try {
    const res = await fetch(`${BaseUrl}/Admin/reels/boost-vacant-weekends`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token,
      },
      body: JSON.stringify({ boostPriority, customBadge }),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    console.error("BoostVacantWeekendReels error:", error);
    return { success: false, message: error.message };
  }
};

