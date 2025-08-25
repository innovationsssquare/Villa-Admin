import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GetAllcateogries ,Getcateogriesbyid} from "@/lib/API/Master/Master";

export const fetchAllCategories = createAsyncThunk(
  "master/fetchAllCategories",
  async () => {
    const response = await GetAllcateogries();
    return response.data;
  }
);

export const fetchCategorybyid = createAsyncThunk(
  "master/fetchCategorybyid",
  async (id, { rejectWithValue }) => {
    try {
      const response = await Getcateogriesbyid(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
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

  Singlecategory: null,
  singleloading: false,
  singleerror: null,
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

     .addCase(fetchCategorybyid.pending, (state) => {
        state.singleloading = true;
      })
      .addCase(fetchCategorybyid.fulfilled, (state, action) => {
        state.singleloading = false;
        state.Singlecategory = action.payload;
      })
      .addCase(fetchCategorybyid.rejected, (state, action) => {
        state.singleloading = false;
        state.singleerror = action.error.message;
      })
  },
});

export default masterSlice.reducer;
