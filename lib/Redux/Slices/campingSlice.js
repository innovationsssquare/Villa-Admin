import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetCampingbyid } from "@/lib/API/Camping/Camping";

export const fetchcampingbyid = createAsyncThunk(
  "sellar/fetchcampingbyid",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetCampingbyid(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const campingSlice = createSlice({
  name: "camping",
  initialState: {
    data:null,
    loading: false,
    error: null,
    datapagination: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchcampingbyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcampingbyid.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchcampingbyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// export const {  } = sellarSlice.actions;
export default campingSlice.reducer;
