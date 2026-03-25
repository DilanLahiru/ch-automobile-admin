import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl, API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async thunk to fetch all old service records
export const getAllOldServiceRecords = createAsyncThunk(
  "oldServiceRecord/getAllOldServiceRecords",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.OLD_SERVICE_ORDER.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to create a new old service record
export const createOldServiceRecord = createAsyncThunk(
  "oldServiceRecord/createOldServiceRecord",
  async (oldServiceRecord, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.OLD_SERVICE_ORDER.CREATE}`, oldServiceRecord, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  oldServiceRecords: [],
  isLoading: false,
  error: null,
};

export const oldServiceRecordSlice = createSlice({
  name: "oldServiceRecord",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle getAll Old Service Records
    builder.addCase(getAllOldServiceRecords.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getAllOldServiceRecords.fulfilled, (state, { payload }) => {
      state.oldServiceRecords = payload;
      state.isLoading = false;
    });
    builder.addCase(getAllOldServiceRecords.rejected, (state, { error }) => {
      state.error = error.message;
      state.isLoading = false;
    });
    // Handle create Old Service Record
    builder.addCase(createOldServiceRecord.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOldServiceRecord.fulfilled, (state, { payload }) => {
      state.isLoading = false;
    });
    builder.addCase(createOldServiceRecord.rejected, (state, { error }) => {
      state.error = error.message;
      state.isLoading = false;
    });
  },
});

export const selectOldServiceRecord = (state) => state.oldServiceRecord;

export default oldServiceRecordSlice.reducer;   