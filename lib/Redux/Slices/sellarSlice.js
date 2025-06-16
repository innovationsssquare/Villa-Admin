import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAllsellar,
  GetAllsellarcount,
  Getsellerprofile,
  Getselleranalytics,
  Getrevenueandcommision,
  Approvedsellerdoc,
  GetAllsellarproduct,
  Getsellarproductbyid,
} from "@/lib/API/Seller/Sellar";

export const fetchAllSellars = createAsyncThunk(
  "sellar/fetchAllSellars",
  async (status, { rejectWithValue }) => {
    try {
      const response = await GetAllsellar(status);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllsellarproduct = createAsyncThunk(
  "sellar/fetchAllsellarproduct",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await GetAllsellarproduct(filters);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchrevenueandcommision = createAsyncThunk(
  "sellar/fetchrevenueandcommision",
  async (status, { rejectWithValue }) => {
    try {
      const response = await Getrevenueandcommision(status);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchAllSellarscount = createAsyncThunk(
  "sellar/fetchAllSellarscount",
  async (status, { rejectWithValue }) => {
    try {
      const response = await GetAllsellarcount(status);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSellarproduct = createAsyncThunk(
  "sellar/fetchSellarproduct",
  async (id, { rejectWithValue }) => {
    try {
      const response = await Getsellarproductbyid(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
export const fetchSellarprofile = createAsyncThunk(
  "sellar/fetchSellarprofile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await Getsellerprofile(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchSellaranalytics = createAsyncThunk(
  "sellar/fetchSellaranalytics",
  async (id, { rejectWithValue }) => {
    try {
      const response = await Getselleranalytics(id);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateSellerDocumentStatus = createAsyncThunk(
  "sellar/updateSellerDocumentStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await Approvedsellerdoc(id, status);
      if (response?.status === false) {
        return rejectWithValue(response.message);
      }
      return { id, status, data: response };
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update document status"
      );
    }
  }
);

const sellarSlice = createSlice({
  name: "sellar",
  initialState: {
    data: [],
    loading: false,
    error: null,

    productdata: [],
    productloading: false,
    producterror: null,

    count: null,
    loadingcount: false,
    counterror: null,

    profile: null,
    loadingprofile: false,
    profileerror: null,

    analytics: {},
    loadinganalytics: false,
    analyticserror: null,

    revenueoverview: [],
    loadingrevnue: false,
    errorrevenue: null,

    updateStatusLoading: false,
    updateStatusError: null,
    updatedSellerStatus: null,

    productLoading: false,
    productError: null,
    Product: null,
  },
  reducers: {
    resetSellarState: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSellars.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllSellars.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllSellars.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(fetchAllSellarscount.pending, (state) => {
        state.loadingcount = true;
        state.counterror = null;
      })
      .addCase(fetchAllSellarscount.fulfilled, (state, action) => {
        state.loadingcount = false;
        state.count = action.payload;
      })
      .addCase(fetchAllSellarscount.rejected, (state, action) => {
        state.loadingcount = false;
        state.counterror = action.payload || "Something went wrong";
      })

      .addCase(fetchSellarprofile.pending, (state) => {
        state.loadingprofile = true;
        state.profileerror = null;
      })
      .addCase(fetchSellarprofile.fulfilled, (state, action) => {
        state.loadingprofile = false;
        state.profile = action.payload;
      })
      .addCase(fetchSellarprofile.rejected, (state, action) => {
        state.loadingprofile = false;
        state.profileerror = action.payload || "Something went wrong";
      })

      .addCase(fetchSellaranalytics.pending, (state) => {
        state.loadinganalytics = true;
        state.analyticserror = null;
      })
      .addCase(fetchSellaranalytics.fulfilled, (state, action) => {
        const { id, data } = action.payload;
        state.analytics[id] = data;
        state.loadinganalytics = false;
      })
      .addCase(fetchSellaranalytics.rejected, (state, action) => {
        state.loadinganalytics = false;
        state.analyticserror = action.payload || "Something went wrong";
      })

      .addCase(fetchrevenueandcommision.pending, (state) => {
        state.loadingrevnue = true;
        state.errorrevenue = null;
      })
      .addCase(fetchrevenueandcommision.fulfilled, (state, action) => {
        state.revenueoverview = action.payload;
        state.loadingrevnue = false;
      })
      .addCase(fetchrevenueandcommision.rejected, (state, action) => {
        state.loadingrevnue = false;
        state.errorrevenue = action.payload || "Something went wrong";
      })

      .addCase(updateSellerDocumentStatus.pending, (state) => {
        state.updateStatusLoading = true;
        state.updateStatusError = null;
      })
      .addCase(updateSellerDocumentStatus.fulfilled, (state, action) => {
        state.updateStatusLoading = false;
        state.updatedSellerStatus = action.payload;
      })
      .addCase(updateSellerDocumentStatus.rejected, (state, action) => {
        state.updateStatusLoading = false;
        state.updateStatusError = action.payload || "Failed to update status";
      })

      .addCase(fetchAllsellarproduct.pending, (state) => {
        state.productloading = true;
        state.producterror = null;
      })
      .addCase(fetchAllsellarproduct.fulfilled, (state, action) => {
        state.productloading = false;
        state.productdata = action.payload;
      })
      .addCase(fetchAllsellarproduct.rejected, (state, action) => {
        state.productloading = false;
        state.producterror = action.payload || "Failed to update status";
      })
      .addCase(fetchSellarproduct.pending, (state) => {
        state.productLoading = true;
        state.productError = null;
      })
      .addCase(fetchSellarproduct.fulfilled, (state, action) => {
        state.productLoading = false;
        state.Product = action.payload;
      })
      .addCase(fetchSellarproduct.rejected, (state, action) => {
        state.productLoading = false;
        state.productError = action.payload || "Failed to update status";
      });
  },
});

export const { resetSellarState } = sellarSlice.actions;
export default sellarSlice.reducer;
