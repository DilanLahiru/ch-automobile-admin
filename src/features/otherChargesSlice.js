import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";

// Async Thunks
export const getAllOtherCharges = createAsyncThunk(
  "otherCharges/getAllOtherCharges",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${baseUrl}${API_PATH.OTHER_CHARGES.GET_ALL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch other charges");
    }
  }
);

export const createOtherCharge = createAsyncThunk(
  "otherCharges/createOtherCharge",
  async (chargeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(`${baseUrl}${API_PATH.OTHER_CHARGES.CREATE}`, chargeData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create charge");
    }
  }
);

export const updateOtherCharge = createAsyncThunk(
  "otherCharges/updateOtherCharge",
  async ({ id, chargeData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(`${baseUrl}${API_PATH.OTHER_CHARGES.UPDATE(id)}`, chargeData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update charge");
    }
  }
);

export const deleteOtherCharge = createAsyncThunk(
  "otherCharges/deleteOtherCharge",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(`${baseUrl}${API_PATH.OTHER_CHARGES.DELETE(id)}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete charge");
    }
  }
);

// Initial State
const initialState = {
  otherCharges: [],
  loading: false,
  error: null,
};

// Slice
const otherChargesSlice = createSlice({
  name: "otherCharges",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get All Other Charges
    builder
      .addCase(getAllOtherCharges.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllOtherCharges.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCharges = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllOtherCharges.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Other Charge
    builder
      .addCase(createOtherCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOtherCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCharges.push(action.payload);
      })
      .addCase(createOtherCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Other Charge
    builder
      .addCase(updateOtherCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOtherCharge.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.otherCharges.findIndex(
          (charge) => charge._id === action.payload._id
        );
        if (index !== -1) {
          state.otherCharges[index] = action.payload;
        }
      })
      .addCase(updateOtherCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Other Charge
    builder
      .addCase(deleteOtherCharge.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOtherCharge.fulfilled, (state, action) => {
        state.loading = false;
        state.otherCharges = state.otherCharges.filter(
          (charge) => charge._id !== action.payload._id
        );
      })
      .addCase(deleteOtherCharge.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default otherChargesSlice.reducer;

// Selectors
export const selectOtherCharges = (state) => state.otherCharges?.otherCharges || [];
export const selectOtherChargesLoading = (state) => state.otherCharges?.loading || false;
export const selectOtherChargesError = (state) => state.otherCharges?.error || null;
