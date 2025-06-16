import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";


export const GetAllcount = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/payout/summary/payout`, {
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

export const GetAllpendingpayout = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/payout/fetch/pending`, {
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

export const GetAllpaidpayout = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/payout/fetch/paid`, {
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







