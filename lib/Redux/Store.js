import { configureStore } from "@reduxjs/toolkit";
import sellarSlice from "@/lib/Redux/Slices/sellarSlice";
import orderSlice from "@/lib/Redux/Slices/orderSlice";
import revenueSlice from "@/lib/Redux/Slices/revenueSlice";
import masterSlice from "@/lib/Redux/Slices/masterSlice";
import ticketSlice from "@/lib/Redux/Slices/ticketSlice";
import ownerSlice from "@/lib/Redux/Slices/ownerSlice";
import villaSlice from "@/lib/Redux/Slices/villaSlice";
import campingSlice from "@/lib/Redux/Slices/campingSlice";
import hotelSlice from "@/lib/Redux/Slices/hotelSlice";
import cottageSlice from "@/lib/Redux/Slices/cottageSlice";
import locationSlice from "@/lib/Redux/Slices/locationSlice";

export const store = configureStore({
  reducer: {
    sellar: sellarSlice,
    order: orderSlice,
    revenue: revenueSlice,
    master: masterSlice,
    tickets: ticketSlice,
    owner: ownerSlice,
    villa: villaSlice,
    camping: campingSlice,
    hotel: hotelSlice,
    cottage: cottageSlice,
    location: locationSlice,
  },
});
