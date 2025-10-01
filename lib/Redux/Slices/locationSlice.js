import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  GetAlllocations,
  Createlocation,
  Deletelocation,
  Getlocationbyid,
  updateCategory,
} from "@/lib/API/Location/Location";
// Get all locations
export const fetchLocations = createAsyncThunk(
  "location/fetchLocations",
  async (_, { rejectWithValue }) => {
    try {
      const res = await GetAlllocations();
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create location
export const createLocation = createAsyncThunk(
  "location/createLocation",
  async (data, { rejectWithValue }) => {
    try {
      const res = await Createlocation(data);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete location
export const deleteLocation = createAsyncThunk(
  "location/deleteLocation",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Deletelocation(id);
      return { id, res };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get location by id
export const fetchLocationById = createAsyncThunk(
  "location/fetchLocationById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await Getlocationbyid(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update location
export const updateLocation = createAsyncThunk(
  "location/updateLocation",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await updateCategory(id, data);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const locationSlice = createSlice({
  name: "location",
  initialState: {
    locations: [],
    singleLocation: null,
    loading: false,
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
      state.locations = action.payload?.data || []; // assuming API returns {data: []}
    });
    builder.addCase(fetchLocations.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Create location
    builder.addCase(createLocation.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLocation.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.data) {
        state.locations.push(action.payload.data);
      }
    });
    builder.addCase(createLocation.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Delete location
    builder.addCase(deleteLocation.fulfilled, (state, action) => {
      state.locations = state.locations.filter(
        (loc) => loc._id !== action.payload.id
      );
    });

    // Get location by id
    builder.addCase(fetchLocationById.fulfilled, (state, action) => {
      state.singleLocation = action.payload?.data || null;
    });

    // Update location
    builder.addCase(updateLocation.fulfilled, (state, action) => {
      if (action.payload?.data) {
        state.locations = state.locations.map((loc) =>
          loc._id === action.payload.data._id ? action.payload.data : loc
        );
      }
    });
  },
});

export const { clearLocationError } = locationSlice.actions;
export default locationSlice.reducer;
