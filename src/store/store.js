import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import appointmentReducer from "../features/appointmentSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointment: appointmentReducer,
  },
});