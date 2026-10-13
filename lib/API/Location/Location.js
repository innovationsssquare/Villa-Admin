import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

const getHeaders = () => {
  const token = Cookies.get("token");
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["token"] = token;
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

export const GetAlllocations = async () => {
  try {
    const res = await fetch(`${BaseUrl}/Location/get/locations`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, message: error.message || "Failed to fetch locations" };
  }
};

export const Createlocation = async (data) => {
  try {
    const res = await fetch(`${BaseUrl}/Location/create/location`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, message: error.message || "Failed to create location" };
  }
};

export const Deletelocation = async (id) => {
  try {
    const res = await fetch(`${BaseUrl}/Location/delete/location/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, message: error.message || "Failed to delete location" };
  }
};

export const Getlocationbyid = async (id) => {
  try {
    const res = await fetch(`${BaseUrl}/Location/get/location/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, message: error.message || "Failed to fetch location" };
  }
};

export const UpdateLocation = async (id, data) => {
  try {
    const res = await fetch(`${BaseUrl}/Location/update/location/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    const result = await res.json();
    return result;
  } catch (error) {
    return { success: false, message: error.message || "Failed to update location" };
  }
};

// Alias for backward compatibility
export const updateCategory = UpdateLocation;
export const updateLocation = UpdateLocation;
