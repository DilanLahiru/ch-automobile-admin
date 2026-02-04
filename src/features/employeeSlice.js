import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async thunk to fetch all employees
export const getAllEmployee = createAsyncThunk(
  "employee/getAllEmployee",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.EMLOYEE.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to create a new employee
export const createEmployee = createAsyncThunk(
  "employee/createEmployee",
  async (employee, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.EMLOYEE.CREATE}`, employee, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.log("Create employee error:", error);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || "Failed to create employee";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update an employee
export const updateEmployee = createAsyncThunk(
  "employee/updateEmployee",
  async (employee, { dispatch }) => {
    const response = await axios.put(
      baseUrl + API_PATH.EMLOYEE.UPDATE,
      employee
    );
    dispatch(getAllEmployee());
    return response.data;
  }
);

// Async thunk to delete an employee
export const deleteEmployee = createAsyncThunk(
  "employee/deleteEmployee",
  async (employeeId, { dispatch }) => {
    await axios.delete(baseUrl + API_PATH.EMLOYEE.DELETE + `/${employeeId}`);
    dispatch(getAllEmployee());
    return employeeId;
  }
);

const initialState = {
  employee: [],
  isLoading: false,
  error: null,
};

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllEmployee.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllEmployee.fulfilled, (state, { payload }) => {
      state.employee = payload;
      state.isLoading = false;
    });
    builder.addCase(getAllEmployee.rejected, (state, { error }) => {
      state.error = error.message;
      state.isLoading = false;
    });
    builder.addCase(createEmployee.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createEmployee.fulfilled, (state, { payload }) => {
      state.isLoading = false;
    });
    builder.addCase(createEmployee.rejected, (state, { error }) => {
      state.error = error.message;
      state.isLoading = false;
    });
    builder.addCase(updateEmployee.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(updateEmployee.fulfilled, (state, { payload }) => {
      state.isLoading = false;
    });
    builder.addCase(updateEmployee.rejected, (state, { error }) => {
      state.error = error.message;
      state.isLoading = false;
    });
    builder.addCase(deleteEmployee.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(deleteEmployee.fulfilled, (state) => {
      state.isLoading = false;
    });
    builder.addCase(deleteEmployee.rejected, (state, { error }) => {
      state.error = error.message;
      state.isLoading = false;
    });
  },
});

export const selectEmployee = (state) => state.employee;

export default employeeSlice.reducer;