import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllpayout } from "@/lib/API/Payout/Payout";

/**
 * Fetch all bookings / payouts (Admin)
 */
export const fetchAllpayout = createAsyncThunk(
  "payout/fetchAllpayouts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await GetAllpayout(filters);

      if (!response || response.success === false) {
        return rejectWithValue(response?.message || "Failed to fetch payouts");
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
    stats: {
      totalPending: 0,
      totalCompleted: 0,
      pendingAmount: 0,
      totalCommission: 0,
      totalRevenue: 0,
      totalRecords: 0,
    },
  },
  reducers: {
    clearBookingError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      /* Fetch all bookings / payouts */
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
        if (action.payload?.total !== undefined) {
          state.pagination.total = action.payload.total;
          state.pagination.page = action.payload.page || 1;
          state.pagination.limit = action.payload.limit || 10;
          state.pagination.totalPages = action.payload.totalPages || 1;
        }
        if (action.payload?.stats) {
          state.stats = action.payload.stats;
        }
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
