import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllpropertiesowner = async ({ isVerified, page, limit }) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    if (isVerified) params.append("isVerified", isVerified);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    let result = await fetch(
      `${BaseUrl}/Owner/get/owners?${params.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};


export const GetAllownerscount = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Owner/get-owner-counts`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};