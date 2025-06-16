import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllTickets } from "@/lib/API/Messages/Messages"; 

// Thunk to fetch all tickets
export const fetchAllTickets = createAsyncThunk(
  "tickets/fetchAllTickets",
  async (role, { rejectWithValue }) => {
    try {
      const response = await GetAllTickets(role);
      if (response?.success === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTickets: (state) => {
      state.tickets = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload
      })
      .addCase(fetchAllTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tickets.";
      });
  },
});

export const { clearTickets } = ticketSlice.actions;

export default ticketSlice.reducer;
