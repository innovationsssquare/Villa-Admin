import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetCottagebyid } from "@/lib/API/Cottage/cottage";

export const fetchcottagebyid = createAsyncThunk(
  "cottage/fetchcottagebyid",
  async (id, { rejectWithValue }) => {
    try {
      const response = await GetCottagebyid(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const cottageSlice = createSlice({
  name: "cottage",
  initialState: {
    data:null,
    loading: false,
    error: null,
    datapagination: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchcottagebyid.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcottagebyid.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchcottagebyid.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

// export const {  } = sellarSlice.actions;
export default cottageSlice.reducer;
