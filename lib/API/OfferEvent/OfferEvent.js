import { BaseUrl } from "../Baseurl";
import Cookies from "js-cookie";

const getHeaders = () => {
  const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : "");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}`, token } : {}),
  };
};

export async function fetchAllOfferEvents() {
  try {
    const res = await fetch(`${BaseUrl}/OfferEvent/all`, {
      headers: getHeaders(),
      cache: "no-store",
    });
    return await res.json();
  } catch (error) {
    console.error("fetchAllOfferEvents error:", error);
    return { success: false, data: [] };
  }
}

export async function createOfferEventApi(data) {
  try {
    const res = await fetch(`${BaseUrl}/OfferEvent/create`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("createOfferEventApi error:", error);
    return { success: false, message: error.message };
  }
}

export async function updateOfferEventApi(id, data) {
  try {
    const res = await fetch(`${BaseUrl}/OfferEvent/update/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (error) {
    console.error("updateOfferEventApi error:", error);
    return { success: false, message: error.message };
  }
}

export async function deleteOfferEventApi(id) {
  try {
    const res = await fetch(`${BaseUrl}/OfferEvent/delete/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return await res.json();
  } catch (error) {
    console.error("deleteOfferEventApi error:", error);
    return { success: false, message: error.message };
  }
}
