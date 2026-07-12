import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllpayout = async ({ page = 1, limit = 10 }) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams({ page, limit });

    let result = await fetch(`${BaseUrl}/Payout/list?${params.toString()}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
    });
    result = await result.json();
    console.log(result,"fg")
    return result;
  } catch (error) {
    return error.message;
  }
};
