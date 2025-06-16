import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const CreateSuperadmin = async (data) => {
  try {
    let result = await fetch(`${BaseUrl}/users/user/create`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "content-type": "application/json",
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Superadminlogin = async (data) => {
  try {
    let result = await fetch(`${BaseUrl}/SuperAdmin/login/SuperAdmin`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { 
        "content-type": "application/json",
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Getuserbyid = async (id) => {
  try {
    let result = await fetch(`${BaseUrl}/users/user/getuser/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};
