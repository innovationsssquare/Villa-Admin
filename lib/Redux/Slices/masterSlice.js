import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {GetAllTax,GetAllcateogries,GetAllmeasurement,GetAllsubcateogries} from "@/lib/API/Master/Master";

// Thunks
export const fetchAllTax = createAsyncThunk("master/fetchAllTax", async () => {
  const response = await GetAllTax();
  return response.data;
});

export const fetchAllMeasurement = createAsyncThunk(
  "master/fetchAllMeasurement",
  async () => {
    const response = await GetAllmeasurement();
    return response.data;
  }
);

export const fetchAllCategories = createAsyncThunk(
  "master/fetchAllCategories",
  async () => {
    const response = await GetAllcateogries();
    return response.data;
  }
);

export const fetchAllSubCategories = createAsyncThunk(
  "master/fetchAllSubCategories",
  async () => {
    const response = await GetAllsubcateogries();
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
      // Tax
      .addCase(fetchAllTax.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllTax.fulfilled, (state, action) => {
        state.loading = false;
        state.tax = action.payload;
      })
      .addCase(fetchAllTax.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Measurement
      .addCase(fetchAllMeasurement.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllMeasurement.fulfilled, (state, action) => {
        state.loading = false;
        state.measurement = action.payload;
      })
      .addCase(fetchAllMeasurement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

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
      .addCase(fetchAllSubCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subcategories = action.payload;
      })
      .addCase(fetchAllSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default masterSlice.reducer;
