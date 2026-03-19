import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async Thunks for Signin and Signup
export const getAllServiceTypes = createAsyncThunk(
  "serviceType/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.SERVICE_TYPE.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch category data");
    }
  }
);

// Async Thunk for Create Service Type
export const createServiceType = createAsyncThunk(
  "serviceType/create",
  async (serviceTypeData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.SERVICE_TYPE.CREATE}`, serviceTypeData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create service type");
    }
  }
);

// Service Type Slice
const serviceTypeSlice = createSlice({
  name: "serviceType",
  initialState: {
    serviceTypes: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    // Handle Get All Service Types
    builder
      .addCase(getAllServiceTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllServiceTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = action.payload;
      })
      .addCase(getAllServiceTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Create Service Type
    builder
      .addCase(createServiceType.pending, (state) => {
        state.loading = true;
      })
      .addCase(createServiceType.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = [...state.serviceTypes, action.payload];
      })
      .addCase(createServiceType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Selector
export const selectServiceType = (state) => state.serviceType;

// Export Reducer
export default serviceTypeSlice.reducer;   