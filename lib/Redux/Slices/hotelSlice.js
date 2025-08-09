import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetHotelbyid } from "@/lib/API/Hotel/hotel";

export const fetchhotelbyid = createAsyncThunk(
  "hotel/fetchhotelbyid",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetHotelbyid(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const hotelSlice = createSlice({
  name: "hotel",
  initialState: {
    data:null,
    loading: false,
    error: null,
    datapagination: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchhotelbyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchhotelbyid.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchhotelbyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// export const {  } = sellarSlice.actions;
export default hotelSlice.reducer;
