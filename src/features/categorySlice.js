import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { baseUrl } from "../utils/baseUrl";
import { API_PATH } from "../utils/baseUrl";
import axios from "axios";

// Async Thunks for Signin and Signup
export const getAllCategories = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.CATEGORY.GET_ALL}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch category data");
    }
  }
);

// Async Thunk for Create Category
export const createCategory = createAsyncThunk(
  "category/create",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${baseUrl}${API_PATH.CATEGORY.CREATE}`, categoryData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to create category");
    }
  }
);

// Async Thunk for Get Category by ID
export const getCategoryById = createAsyncThunk(
  "category/getById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${baseUrl}${API_PATH.CATEGORY.GET_BY_ID(categoryId)}`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to get category by ID");
    }
  }
);

// Async Thunk for Update Category
export const updateCategory = createAsyncThunk(
  "category/update",
  async (categoryData, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${baseUrl}${API_PATH.CATEGORY.UPDATE}`, categoryData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update category");
    }
  }
);

// Async Thunk for Delete Category
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${baseUrl}${API_PATH.CATEGORY.DELETE}/${categoryId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete category");
    }
  }
);

// Category Slice
const categorySlice = createSlice({
  name: "category",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    // You can add synchronous reducers here if needed
  },
  extraReducers: (builder) => {
    // Handle Get All Categories
    builder
      .addCase(getAllCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Create Category
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = [...state.categories, action.payload];
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Update Category
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.map((category) => {
          if (category._id === action.payload._id) {
            return action.payload;
          } else {
            return category;
          }
        });
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Handle Get Category by ID
    builder
      .addCase(getCategoryById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.map((category) => {
          if (category._id === action.payload._id) {
            return action.payload;
          } else {
            return category;
          }
        });
      })
      .addCase(getCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      }); 

    // Handle Delete Category
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((category) => category._id !== action.payload._id);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export Selector
export const selectCategory = (state) => state.category;

// Export Reducer
export default categorySlice.reducer;   