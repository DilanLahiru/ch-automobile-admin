import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async Thunks for Signin and Signup
export const getAllAppointments = createAsyncThunk(
  "appointment/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.APPOINTMENT.GET_ALL}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch appointments");
    }
  }
);

// Async Thunk for Signup
export const createAppointment = createAsyncThunk(
  "appointment/create",
  async (appointmentData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.APPOINTMENT.CREATE}`, appointmentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create appointment");
    }
  }
);

const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    // Handle Get All Appointments
    builder
      .addCase(getAllAppointments.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(getAllAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Create Appointment
    builder
      .addCase(createAppointment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = [...state.appointments, action.payload];
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Selector
export const selectAppointment = (state) => state.appointment;

// Export Reducer
export default appointmentSlice.reducer;