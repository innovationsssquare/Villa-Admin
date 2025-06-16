import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllsellar = async (status) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    if (status) params.append("status", status);

    let result = await fetch(
      `${BaseUrl}/superadmin/get/vendorlist?${params.toString()}`,
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

export const GetAllsellarproduct = async ({
  Status,
  CategoryId,
  SubcategoryId,
  Measturments,
  VendorId,
  page,
  limit,
}) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    if (Status) params.append("Status", Status);
    if (CategoryId) params.append("CategoryId", CategoryId);
    if (SubcategoryId) params.append("SubcategoryId", SubcategoryId);
    if (Measturments) params.append("Measturments", Measturments);
    if (VendorId) params.append("VendorId", VendorId);
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);

    let result = await fetch(
      `${BaseUrl}/product/get/products?${params.toString()}`,
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

export const Getsellarproductbyid = async (id) => {
  const token = Cookies.get("token");

  try {


    let result = await fetch(
      `${BaseUrl}/product/get/products/${id}`,
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

export const Getrevenueandcommision = async (filter) => {
  const token = Cookies.get("token");

  try {
    const params = new URLSearchParams();
    if (filter) params.append("filter", filter);

    let result = await fetch(
      `${BaseUrl}/superadmin/revenue/commision/history?${params.toString()}`,
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

export const GetAllsellarcount = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/superadmin/vendor/count`, {
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

export const Getsellerprofile = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/superadmin/get/vendorlist/${id}`, {
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

export const Getselleranalytics = async (id) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(`${BaseUrl}/superadmin/vendor/history/${id}`, {
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

export const Approvedsellerdoc = async (id, status) => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(
      `${BaseUrl}/superadmin/updatestatus/${id}/${status}`,
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

export const Approvedsellerproduct = async () => {
  const token = Cookies.get("token");

  try {
    let result = await fetch(
      `${BaseUrl}/product/approve/products`,
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
