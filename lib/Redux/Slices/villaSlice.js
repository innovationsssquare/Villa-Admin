import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetVillabyid } from "@/lib/API/Villa/Villa";

export const fetchvillabyid = createAsyncThunk(
  "sellar/fetchvillabyid",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetVillabyid(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const villaSlice = createSlice({
  name: "villa",
  initialState: {
    data:null,
    loading: false,
    error: null,
    datapagination: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchvillabyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchvillabyid.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchvillabyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// export const {  } = sellarSlice.actions;
export default villaSlice.reducer;
