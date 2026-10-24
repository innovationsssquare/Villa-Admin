import { BaseUrl } from "../Baseurl";
import Cookies from "js-cookie";

const getHeaders = () => {
  const token =
    Cookies.get("token") ||
    (typeof window !== "undefined" ? localStorage.getItem("token") : "");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}`, token } : {}),
  };
};

export async function fetchAllHeroBanners() {
  try {
    const res = await fetch(`${BaseUrl}/HeroBanner/all`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("fetchAllHeroBanners error:", error);
    return { success: false, data: [] };
  }
}

export async function fetchActiveHeroBanners() {
  try {
    const res = await fetch(`${BaseUrl}/HeroBanner/active`, {
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("fetchActiveHeroBanners error:", error);
    return { success: false, data: [] };
  }
}

export async function createHeroBannerApi(data) {
  try {
    const res = await fetch(`${BaseUrl}/HeroBanner/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("createHeroBannerApi error:", error);
    return { success: false, message: error.message };
  }
}

export async function updateHeroBannerApi(id, data) {
  try {
    const res = await fetch(`${BaseUrl}/HeroBanner/update/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("updateHeroBannerApi error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteHeroBannerApi(id) {
  try {
    const res = await fetch(`${BaseUrl}/HeroBanner/delete/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("deleteHeroBannerApi error:", error);
    return { success: false, message: error.message };
  }
}

export async function toggleHeroBannerApi(id) {
  try {
    const res = await fetch(`${BaseUrl}/HeroBanner/toggle/${id}`, {
      method: "PATCH",
      headers: getHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("toggleHeroBannerApi error:", error);
    return { success: false, message: error.message };
  }
}
