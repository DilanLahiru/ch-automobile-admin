// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { baseUrl } from "../utils/baseUrl";
// import { API_PATH } from "../utils/baseUrl";
// import axios from "axios";

// // Async Thunks for Signin and Signup
// export const getAllAppointments = createAsyncThunk(
//   "appointment/all",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get(`${baseUrl}${API_PATH.APPOINTMENT.GET_ALL}`, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       console.log(response);
//       return response.data;
//     } catch (error) {
//       console.log('====================================');
//       console.log(error);
//       console.log('====================================');
//       return rejectWithValue(error.response?.data?.message || "Failed to fetch appointments");
//     }
//   }
// );

// // Async Thunk for Signup
// export const createAppointment = createAsyncThunk(
//   "appointment/create",
//   async (appointmentData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(`${baseUrl}${API_PATH.APPOINTMENT.CREATE}`, appointmentData, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || "Failed to create appointment");
//     }
//   }
// );

// const appointmentSlice = createSlice({
//   name: "appointment",
//   initialState: {
//     appointments: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {
//     // You can add synchronous reducers here if needed
//   },
//   extraReducers: (builder) => {
//     // Handle Get All Appointments
//     builder
//       .addCase(getAllAppointments.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(getAllAppointments.fulfilled, (state, action) => {
//         state.loading = false;
//         state.appointments = action.payload;
//       })
//       .addCase(getAllAppointments.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });

//     // Handle Create Appointment
//     builder
//       .addCase(createAppointment.pending, (state) => {
//         state.loading = true;
//       })
//       .addCase(createAppointment.fulfilled, (state, action) => {
//         state.loading = false;
//         state.appointments = [...state.appointments, action.payload];
//       })
//       .addCase(createAppointment.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// // Export Selector
// export const selectAppointment = (state) => state.appointment;

// // Export Reducer
// export default appointmentSlice.reducer;

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async Thunk for Get All Appointments
export const getAllAppointments = createAsyncThunk(
  "appointment/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.APPOINTMENT.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch appointments");
    }
  }
);

// Async Thunk for Create Appointment
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

// Async Thunk for Update Appointment
export const updateAppointment = createAsyncThunk(
  "appointment/update",
  async ({ id, ...appointmentData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}${API_PATH.APPOINTMENT.UPDATE}/${id}`, appointmentData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update appointment");
    }
  }
);

// Async Thunk for Delete Appointment
export const deleteAppointment = createAsyncThunk(
  "appointment/delete",
  async (appointmentId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}${API_PATH.APPOINTMENT.DELETE}/${appointmentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return { _id: appointmentId, ...response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete appointment");
    }
  }
);

// Appointment Slice
const appointmentSlice = createSlice({
  name: "appointment",
  initialState: {
    appointments: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
  },
  reducers: {
    clearAppointmentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle Get All Appointments
    builder
      .addCase(getAllAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
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
        state.creating = true;
        state.error = null;
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
        state.creating = false;
        state.appointments = [...state.appointments, action.payload];
      })
      .addCase(createAppointment.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      });

    // Handle Update Appointment
    builder
      .addCase(updateAppointment.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateAppointment.fulfilled, (state, action) => {
        state.updating = false;
        state.appointments = state.appointments.map((appointment) => {
          if (appointment._id === action.payload._id) {
            return action.payload;
          } else {
            return appointment;
          }
        });
      })
      .addCase(updateAppointment.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      });

    // Handle Delete Appointment
    builder
      .addCase(deleteAppointment.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteAppointment.fulfilled, (state, action) => {
        state.deleting = false;
        state.appointments = state.appointments.filter((appointment) => appointment._id !== action.payload._id);
      })
      .addCase(deleteAppointment.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

// Export Actions and Reducer
export const { clearAppointmentError } = appointmentSlice.actions;
export const selectAppointment = (state) => state.appointment;
export default appointmentSlice.reducer;