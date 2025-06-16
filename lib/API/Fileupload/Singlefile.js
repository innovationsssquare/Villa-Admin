import { BaseUrl } from "@/lib/API/Baseurl";
import Cookies from "js-cookie";


export const Uploadfile = async (file) => {
  const token = Cookies.get("token");

  try {
    const formData = new FormData();
    formData.append("Image", file); 

    let result = await fetch(
      `${BaseUrl}/file/single`,
      {
        method: "POST",
        headers: {
          token: token, 
        },
        body: formData, 
      }
    );

    result = await result.json();
    return result; 
  } catch (error) {
    return error.message; 
  }
};
