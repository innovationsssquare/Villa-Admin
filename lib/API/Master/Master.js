import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllcateogries = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Category/get/categories`, {
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

export const Createcategory = async (data) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Category/create/category`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Deletecategory = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Category/delete/category/${id}`, {
      method: "DELETE",
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

export const Getcateogriesbyid = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Category/get/category/${id}`, {
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

export const updateCategory = async (id, data) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/Category/update/category/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        token: token,
      },
      body: JSON.stringify(data),
    });
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};
