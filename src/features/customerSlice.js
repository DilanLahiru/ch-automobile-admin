import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async Thunks for Signin and Signup
export const getAllCustomers = createAsyncThunk(
  "customer/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.CUSTOMER.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch customer data");
    }
  }
);

// Async Thunk for Create Customer
export const createCustomer = createAsyncThunk(
  "customer/create",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.CUSTOMER.CREATE}`, customerData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create customer");
    }
  }
);

// Async Thunk for Update Customer
export const updateCustomer = createAsyncThunk(
  "customer/update",
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}${API_PATH.CUSTOMER.UPDATE}`, customerData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update customer");
    }
  }
);

// Async Thunk for Delete Customer
export const deleteCustomer = createAsyncThunk(
  "customer/delete",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}${API_PATH.CUSTOMER.DELETE}/${customerId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete customer");
    }
  }
);

// Customer Slice
const customerSlice = createSlice({
  name: "customer",
  initialState: {
    customers: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    // Handle Get All Customers
    builder
      .addCase(getAllCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(getAllCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Create Customer
    builder
      .addCase(createCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = [...state.customers, action.payload];
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Update Customer
    builder
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.map((customer) => {
          if (customer._id === action.payload._id) {
            return action.payload;
          } else {
            return customer;
          }
        });
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Delete Customer
    builder
      .addCase(deleteCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = state.customers.filter((customer) => customer._id !== action.payload._id);
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Selector
export const selectCustomer = (state) => state.customer;

// Export Reducer
export default customerSlice.reducer;

