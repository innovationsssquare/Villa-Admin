import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {GetAllcateogries} from "@/lib/API/Master/Master";



export const fetchAllCategories = createAsyncThunk(
  "master/fetchAllCategories",
  async () => {
    const response = await GetAllcateogries();
    return response.data;
  }
);



// Initial state
const initialState = {
  tax: [],
  measurement: [],
  categories: [],
  subcategories: [],
  loading: false,
  error: null,
};

const masterSlice = createSlice({
  name: "master",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
   

      // Measurement
   

      // Categories
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Subcategories
      
  },
});

export default masterSlice.reducer;
