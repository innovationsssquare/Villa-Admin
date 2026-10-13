import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAlllocations,
  Createlocation,
  Deletelocation,
  Getlocationbyid,
  updateLocation as updateLocationApi,
} from "@/lib/API/Location/Location";

// Get all locations
export const fetchLocations = createAsyncThunk(
  "location/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetAlllocations();
      if (res?.success === false) {
        return rejectWithValue(res.message || "Failed to fetch locations");
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch locations");
    }
  }
);

// Create location
export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Createlocation(data);
      if (res?.success === false) {
        return rejectWithValue(res.message || "Failed to create location");
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to create location");
    }
  }
);

// Delete location
export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Deletelocation(id);
      if (res?.success === false) {
        return rejectWithValue(res.message || "Failed to delete location");
      }
      return { id, res };
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete location");
    }
  }
);

// Get location by id
export const fetchLocationById = createAsyncThunk(
  "location/fetchLocationById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Getlocationbyid(id);
      if (res?.success === false) {
        return rejectWithValue(res.message || "Failed to fetch location");
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch location");
    }
  }
);

// Update location
export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateLocationApi(id, data);
      if (res?.success === false) {
        return rejectWithValue(res.message || "Failed to update location");
      }
      return res;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to update location");
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [],
    singleLocation: null,
    loading: false,
    actionLoading: false,
    error: null,
  },
  reducers: {
    clearLocationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get all locations
    builder.addCase(fetchLocations.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchLocations.fulfilled, (state, action) => {
      state.loading = false;
      state.locations = Array.isArray(action.payload?.data)
        ? action.payload.data
        : Array.isArray(action.payload)
        ? action.payload
        : [];
    });
    builder.addCase(fetchLocations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch locations";
    });

    // Create location
    builder.addCase(createLocation.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(createLocation.fulfilled, (state, action) => {
      state.actionLoading = false;
      if (action.payload?.data) {
        state.locations.unshift(action.payload.data);
      }
    });
    builder.addCase(createLocation.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload || "Failed to create location";
    });

    // Delete location
    builder.addCase(deleteLocation.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(deleteLocation.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.locations = state.locations.filter(
        (loc) => loc._id !== action.payload.id
      );
    });
    builder.addCase(deleteLocation.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload || "Failed to delete location";
    });

    // Get location by id
    builder.addCase(fetchLocationById.fulfilled, (state, action) => {
      state.singleLocation = action.payload?.data || null;
    });

    // Update location
    builder.addCase(updateLocation.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
    });
    builder.addCase(updateLocation.fulfilled, (state, action) => {
      state.actionLoading = false;
      if (action.payload?.data) {
        state.locations = state.locations.map((loc) =>
          loc._id === action.payload.data._id ? action.payload.data : loc
        );
      }
    });
    builder.addCase(updateLocation.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload || "Failed to update location";
    });
  },
});

export const { clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;
