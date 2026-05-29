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

// Async Thunk for Update Service Type
export const updateServiceType = createAsyncThunk(
  "serviceType/update",
  async ({ id, serviceTypeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}${API_PATH.SERVICE_TYPE.UPDATE(id)}`, serviceTypeData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update service type");
    }
  }
);

// Async Thunk for Delete Service Type
export const deleteServiceType = createAsyncThunk(
  "serviceType/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}${API_PATH.SERVICE_TYPE.DELETE(id)}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete service type");
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

    // Handle Update Service Type
    builder
      .addCase(updateServiceType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateServiceType.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = state.serviceTypes.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateServiceType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Delete Service Type
    builder
      .addCase(deleteServiceType.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteServiceType.fulfilled, (state, action) => {
        state.loading = false;
        state.serviceTypes = state.serviceTypes.filter(
          (item) => item._id !== action.payload
        );
      })
      .addCase(deleteServiceType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Selectors
export const selectServiceType = (state) => state.serviceType;
export const selectServiceTypes = (state) => state.serviceType.serviceTypes;
export const selectServiceTypeLoading = (state) => state.serviceType.loading;
export const selectServiceTypeError = (state) => state.serviceType.error;

// Export Reducer
export default serviceTypeSlice.reducer;   