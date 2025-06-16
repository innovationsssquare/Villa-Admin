import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";

export const GetAllTax = async () => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/get/Tax`,
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

export const GetAllmeasurement = async () => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/get/measurement`,
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

export const GetAllcateogries = async () => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/get/cateogries`,
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

export const GetAllsubcateogries = async () => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/get/subcateogries`,
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

export const Createsubcategory = async (data) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/create/subcateogries`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body:JSON.stringify(data)
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Createcategory = async (data) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/create/cateogries`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body:JSON.stringify(data)
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};
export const Createtax = async (data) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/create/Tax`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body:JSON.stringify(data)
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};

export const Createmeasurement = async (data) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/create/measurement`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          token: token,
        },
        body:JSON.stringify(data)
      }
    );
    result = await result.json();
    return result;
  } catch (error) {
    return error.message;
  }
};


export const Deletecategory = async (id) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/delete/cateogries/${id}`,
      {
        method: "DELETE",
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
export const DeleteSubcategory = async (id) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/delete/subcateogries/${id}`,
      {
        method: "DELETE",
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

export const Deletetax = async (id) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/delete/Tax/${id}`,
      {
        method: "DELETE",
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

export const Deletemeasurement = async (id) => {
  const token = Cookies.get("token");

  try {

    let result = await fetch(
      `${BaseUrl}/master/delete/measurement/${id}`,
      {
        method: "DELETE",
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









