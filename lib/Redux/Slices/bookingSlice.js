import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllbooking } from "@/lib/API/Booking/Booking";

/**
 * Fetch all bookings (Admin)
 */
export const fetchAllBookings = createAsyncThunk(
  "booking/fetchAllBookings",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await GetAllbooking({ page, limit });

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

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    bookings: [],
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
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;

        // adjust based on API response
        state.bookings = action.payload.data || action.payload;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearBookingError } = bookingSlice.actions;
export default bookingSlice.reducer;
