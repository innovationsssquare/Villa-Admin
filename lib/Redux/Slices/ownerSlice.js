import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllpropertiesowner,
  GetAllownerscount,
} from "@/lib/API/Owner/Owner";

export const fetchAllPropertiesowner = createAsyncThunk(
  "sellar/fetchAllPropertiesowner",
  async ({ isVerified, page, limit }, { rejectWithValue }) => {
    try {
      const response = await GetAllpropertiesowner({ isVerified, page, limit });
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllownerscount = createAsyncThunk(
  "sellar/fetchAllownerscount",
  async (_, { rejectWithValue }) => {
    try {
      const response = await GetAllownerscount();
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const ownerSlice = createSlice({
  name: "owner",
  initialState: {
    data: [],
    loading: false,
    error: null,
    datapagination: null,

    count: null,
    loadingcount: false,
    counterror: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllPropertiesowner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPropertiesowner.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.datapagination = action.payload.pagination || null;
      })
      .addCase(fetchAllPropertiesowner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
        state.datapagination = null;
      })

      .addCase(fetchAllownerscount.pending, (state) => {
        state.loadingcount = true;
        state.counterror = null;
      })
      .addCase(fetchAllownerscount.fulfilled, (state, action) => {
        state.loadingcount = false;
        state.count = action.payload;
      })
      .addCase(fetchAllownerscount.rejected, (state, action) => {
        state.loadingcount = false;
        state.counterror = action.payload || "Something went wrong";
      });
  },
});

// export const {  } = sellarSlice.actions;
export default ownerSlice.reducer;
