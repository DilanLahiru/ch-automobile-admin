import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async Thunks for Signin and Signup
export const signinUser = createAsyncThunk(
  "auth/signin",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.AUTH.LOGIN}`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      // If the request is successful, return the data
      return response.data; // { user, token, message }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login Failed");
    }
  }
);

// Async Thunk for Signup
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.AUTH.REGISTER}`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      // If the request is successful, return the data
      return response.data; // { user, token, message }
    } catch (error) {
      // If there's an error, return the error message
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

// Async Thunk for Logout not using endpoint
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async ({ rejectWithValue }) => {
    try {
      // Remove the isAuthenticated flag from localStorage
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");

      // Dispatch the logoutUser action
      return dispatch(logoutUser());
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Get User by ID
export const getUserById = createAsyncThunk(
  "auth/getUserById",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.AUTH.GET_LOGIN_USER}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: localStorage.getItem("isAuthenticated") === "true",
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    // Handle Signin
    builder
      .addCase(signinUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        localStorage.setItem("isAuthenticated", false);
      })
      .addCase(signinUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("isAuthenticated", true);
        localStorage.setItem("token", action.payload.token);
      })
      .addCase(signinUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        localStorage.setItem("isAuthenticated", true);
      });

    // Handle Signup
    builder
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.isAuthenticated = false;
        localStorage.setItem("isAuthenticated", false);
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem("isAuthenticated", true);
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        localStorage.setItem("isAuthenticated", false);
      });

      // Handle Get User By ID
      builder
        .addCase(getUserById.pending, (state) => {
          state.loading = true;
        })
        .addCase(getUserById.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload;
        })
        .addCase(getUserById.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });

      // Handle Logout
      builder
        .addCase(logoutUser.pending, (state) => {
          state.loading = true;
          state.isAuthenticated = false;
          localStorage.setItem("isAuthenticated", false);
        })
        .addCase(logoutUser.fulfilled, (state, action) => {
          state.loading = false;
          state.isAuthenticated = false;
          localStorage.setItem("isAuthenticated", false);
        })
        .addCase(logoutUser.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
          state.isAuthenticated = false;
          localStorage.setItem("isAuthenticated", false);
        });
  },
});

// Export Selector
export const selectAuth = (state) => state.auth;

// Export Reducer
export default authSlice.reducer;