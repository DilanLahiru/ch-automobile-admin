import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, API_PATH } from "../utils/baseUrl";
import axios from "axios";

const normalizeMaterialName = (name = "") => name.trim().toLowerCase();

const extractExternalMaterials = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.externalMaterials)) return payload.externalMaterials;
  if (Array.isArray(payload?.data)) return payload.data;
  return [];
};

const extractCreatedExternalMaterial = (payload) => {
  if (!payload || Array.isArray(payload)) return null;
  if (payload.externalMaterial && typeof payload.externalMaterial === "object") {
    return payload.externalMaterial;
  }
  if (payload.data && typeof payload.data === "object") {
    return payload.data;
  }
  return payload;
};

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
      return response.data;
    } catch (error) {
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
      return response.data;
    } catch (error) {
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

// Load service orders by employee ID
export const getServiceOrdersByEmployee = createAsyncThunk(
  "serviceOrder/getServiceOrdersByEmployee",
  async (employeeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.SERVICE_ORDER.GET_BY_EMPLOYEE(employeeId)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data.serviceHistory || [];
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch service orders by employee");
    }
  }
);


// Save External Materials
export const createExternalMaterial = createAsyncThunk(
  "serviceOrder/createExternalMaterial",
  async (externalMaterialData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.EXTERNAL_MATERIALS.CREATE}`, externalMaterialData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Failed to create external material";
      return rejectWithValue(errorMessage);
    }
  }
);

// Load All External Materials
export const getAllExternalMaterials = createAsyncThunk(
  "serviceOrder/getAllExternalMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.EXTERNAL_MATERIALS.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch external materials");
    }
  }
);

const initialState = {
  orders: [],
  externalMaterials: [],
  isLoading: false,
  isExternalMaterialsLoading: false,
  error: null,
  employeeRecords: [], // For storing service orders by employee
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

    // Get Service Orders by Employee
    builder.addCase(getServiceOrdersByEmployee.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getServiceOrdersByEmployee.fulfilled, (state, action) => {
      state.isLoading = false;
      state.employeeRecords = action.payload;
    });
    builder.addCase(getServiceOrdersByEmployee.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Create External Material
    builder.addCase(createExternalMaterial.pending, (state) => {
      state.isExternalMaterialsLoading = true;
      state.error = null;
    });
    builder.addCase(createExternalMaterial.fulfilled, (state, action) => {
      state.isExternalMaterialsLoading = false;
      const createdMaterial = extractCreatedExternalMaterial(action.payload);

      if (createdMaterial && createdMaterial.name) {
        const existingIndex = state.externalMaterials.findIndex((item) => {
          const hasSameId = item?._id && createdMaterial?._id && item._id === createdMaterial._id;
          const hasSameName =
            normalizeMaterialName(item?.name) ===
            normalizeMaterialName(createdMaterial?.name);
          return hasSameId || hasSameName;
        });

        if (existingIndex >= 0) {
          state.externalMaterials[existingIndex] = {
            ...state.externalMaterials[existingIndex],
            ...createdMaterial,
          };
        } else {
          state.externalMaterials.push(createdMaterial);
        }
      }
    });
    builder.addCase(createExternalMaterial.rejected, (state, action) => {
      state.isExternalMaterialsLoading = false;
      state.error = action.payload;
    });

    // Get All External Materials
    builder.addCase(getAllExternalMaterials.pending, (state) => {
      state.isExternalMaterialsLoading = true;
      state.error = null;
    });
    builder.addCase(getAllExternalMaterials.fulfilled, (state, action) => {
      state.isExternalMaterialsLoading = false;
      state.externalMaterials = extractExternalMaterials(action.payload);
    });
    builder.addCase(getAllExternalMaterials.rejected, (state, action) => {
      state.isExternalMaterialsLoading = false;
      state.error = action.payload;
    });
  },
});

export const { clearError } = serviceOrderSlice.actions;
export default serviceOrderSlice.reducer;
