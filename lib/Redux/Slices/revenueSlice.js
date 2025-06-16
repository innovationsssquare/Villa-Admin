import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllcount,GetAllpendingpayout ,GetAllpaidpayout} from "@/lib/API/Revenue/Revenue";

export const FetchAllcount = createAsyncThunk(
  "revenue/FetchAllcount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetAllcount();
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const FetchAllpendingpayout = createAsyncThunk(
  "revenue/FetchAllpendingpayout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetAllpendingpayout();
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const FetchAllpaidpayout = createAsyncThunk(
  "revenue/FetchAllpaidpayout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetAllpaidpayout();
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const revenueSlice = createSlice({
  name: "revenue",
  initialState: {
    data:null,
    loading: false,
    error: null,

    pendingpayout:[],
    pendingpayoutloading: false,
    pendingpayouterror: null,

    paidpayout:[],
    paidpayoutloading: false,
    paidpayouterror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchAllcount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(FetchAllcount.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(FetchAllcount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })
      .addCase(FetchAllpendingpayout.pending, (state) => {
        state.pendingpayoutloading = true;
        state.pendingpayouterror = null;
      })
      .addCase(FetchAllpendingpayout.fulfilled, (state, action) => {
        state.pendingpayoutloading = false;
        state.pendingpayout = action.payload;
      })
      .addCase(FetchAllpendingpayout.rejected, (state, action) => {
        state.pendingpayoutloading = false;
        state.pendingpayouterror = action.payload || "Something went wrong";
      })
      .addCase(FetchAllpaidpayout.pending, (state) => {
        state.paidpayoutloading = true;
        state.paidpayouterror = null;
      })
      .addCase(FetchAllpaidpayout.fulfilled, (state, action) => {
        state.paidpayoutloading = false;
        state.paidpayout = action.payload;
      })
      .addCase(FetchAllpaidpayout.rejected, (state, action) => {
        state.paidpayoutloading = false;
        state.paidpayouterror = action.payload || "Something went wrong";
      });
  },
});

export default revenueSlice.reducer;
