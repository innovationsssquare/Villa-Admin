import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllpayout } from "@/lib/API/Payout/Payout";

/**
 * Fetch all bookings (Admin)
 */
export const fetchAllpayout = createAsyncThunk(
  "payout/fetchAllpayouts",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await GetAllpayout({ page, limit });

      // adjust this check if your backend response structure differs
      if (!response || response.success === false) {
        return rejectWithValue(response?.message || "Failed to fetch bookings");
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const payoutSlice = createSlice({
  name: "payout",
  initialState: {
    payouts: [],
    loading: false,
    error: null,
    pagination: {
      total: 0,
      page: 1,
      totalPages: 1,
      limit: 10,
    },
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch all bookings */
      .addCase(fetchAllpayout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllpayout.fulfilled, (state, action) => {
        state.loading = false;
        const payloadData = action.payload?.data;
        state.payouts = Array.isArray(payloadData)
          ? payloadData
          : Array.isArray(action.payload)
          ? action.payload
          : [];
      })
      .addCase(fetchAllpayout.rejected, (state, action) => {
        state.loading = false;
        state.payouts = [];
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearBookingError } = payoutSlice.actions;
export default payoutSlice.reducer;
