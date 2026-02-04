import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async Thunks for Signin and Signup
export const getAllSuppliers = createAsyncThunk(
  "supplier/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.SUPPLIER.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch supplier data");
    }
  }
);

// Async Thunk for Create Supplier
export const createSupplier = createAsyncThunk(
  "supplier/create",
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.SUPPLIER.CREATE}`, supplierData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create supplier");
    }
  }
);

// Async Thunk for Update Supplier
export const updateSupplier = createAsyncThunk(
  "supplier/update",
  async (supplierData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}${API_PATH.SUPPLIER.UPDATE}`, supplierData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update supplier");
    }
  }
);

// Async Thunk for Delete Supplier
export const deleteSupplier = createAsyncThunk(
  "supplier/delete",
  async (supplierId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}${API_PATH.SUPPLIER.DELETE}/${supplierId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete supplier");
    }
  }
);

// Supplier Slice
const supplierSlice = createSlice({
  name: "supplier",
  initialState: {
    suppliers: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    // Handle Get All Suppliers
    builder
      .addCase(getAllSuppliers.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = action.payload;
      })
      .addCase(getAllSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Create Supplier
    builder
      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = [...state.suppliers, action.payload];
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Update Supplier
    builder
      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.map((supplier) => {
          if (supplier._id === action.payload._id) {
            return action.payload;
          } else {
            return supplier;
          }
        });
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Delete Supplier
    builder
      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.suppliers = state.suppliers.filter((supplier) => supplier._id !== action.payload._id);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Selector
export const selectSupplier = (state) => state.supplier;

// Export Reducer
export default supplierSlice.reducer;