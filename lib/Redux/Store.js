import { configureStore } from "@reduxjs/toolkit";
import sellarSlice from "@/lib/Redux/Slices/sellarSlice"
import orderSlice from "@/lib/Redux/Slices/orderSlice"
import revenueSlice from "@/lib/Redux/Slices/revenueSlice"
import masterSlice from "@/lib/Redux/Slices/masterSlice"
import ticketSlice from "@/lib/Redux/Slices/ticketSlice"

export const store = configureStore({
  reducer: {
    sellar:sellarSlice,
    order:orderSlice,
    revenue:revenueSlice,
    master:masterSlice,
    tickets:ticketSlice,
  },
});
