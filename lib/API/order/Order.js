import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllorder = async (page,limit,status) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status) params.append("status",status);

    let result = await fetch(
      `${BaseUrl}/order/super/order?${params.toString()}`,
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

export const Getorderbyid = async (id) => {
  const token = Cookies.get("token");

  try {
  

    let result = await fetch(
      `${BaseUrl}/order/super/order/${id}`,
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

