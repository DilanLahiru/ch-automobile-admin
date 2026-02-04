import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async thunk to fetch all service orders
export const getAllServiceOrders = createAsyncThunk(
  "serviceOrder/getAllServiceOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.SERVICE_ORDER.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log('====================================');
      console.log(response.data);
      console.log('====================================');
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response?.data || "Failed to fetch service orders");
    }
  }
);

// Async thunk to create a new service order
export const createServiceOrder = createAsyncThunk(
  "serviceOrder/createServiceOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.SERVICE_ORDER.CREATE}`, orderData, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log("Create service order response:");
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log("Create service order error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to create service order";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update a service order
export const updateServiceOrder = createAsyncThunk(
  "serviceOrder/updateServiceOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${baseUrl}${API_PATH.SERVICE_ORDER.UPDATE}`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to update service order";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to delete a service order
export const deleteServiceOrder = createAsyncThunk(
  "serviceOrder/deleteServiceOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${baseUrl}${API_PATH.SERVICE_ORDER.DELETE}/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return orderId;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to delete service order";
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
};

export const serviceOrderSlice = createSlice({
  name: "serviceOrder",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Service Orders
    builder.addCase(getAllServiceOrders.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllServiceOrders.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = action.payload;
    });
    builder.addCase(getAllServiceOrders.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create Service Order
    builder.addCase(createServiceOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createServiceOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders.push(action.payload);
    });
    builder.addCase(createServiceOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Update Service Order
    builder.addCase(updateServiceOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateServiceOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      const index = state.orders.findIndex((order) => order._id === action.payload._id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    });
    builder.addCase(updateServiceOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Delete Service Order
    builder.addCase(deleteServiceOrder.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteServiceOrder.fulfilled, (state, action) => {
      state.isLoading = false;
      state.orders = state.orders.filter((order) => order._id !== action.payload);
    });
    builder.addCase(deleteServiceOrder.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = serviceOrderSlice.actions;
export default serviceOrderSlice.reducer;
