"use client"
import { useEffect } from "react";

const KeepAlive = () => {

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        // Sending a request to the keepalive endpoint
        const response = await fetch('https://villa-camping-backend.onrender.com/keepalive'); // Replace with your backend URL
        if (response.ok) {
          console.log('Server is alive');
        } else {
          console.error('Error: Server is not responding');
        }
      } catch (error) {
        console.error('Error pinging server:', error);
      }
    }, 10 * 60 * 1000); // Every 10 minutes (600,000 ms)

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return null; // You don't need to render anything for this
};

export default KeepAlive;