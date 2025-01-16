import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to import user data
export const importUserData = createAsyncThunk(
  'importUser/importData',
  async (file, { rejectWithValue }) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5000/api/v1/csv/importflow', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Redux Slice for user import
const importUserSlice = createSlice({
  name: 'importUser',
  initialState: {
    loading: false,
    success: false,
    errors: [],
    message: '',
  },
  reducers: {
    resetImportState: (state) => {
      state.loading = false;
      state.success = false;
      state.errors = [];
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(importUserData.pending, (state) => {
        state.loading = true;
      })
      .addCase(importUserData.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = action.payload.msg;
        state.errors = action.payload.validationErrors || [];
      })
      .addCase(importUserData.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.message = action.payload?.msg || 'Failed to import data.';
        state.errors = action.payload?.validationErrors || [];
      });
  },
});

export const { resetImportState } = importUserSlice.actions;

export default importUserSlice.reducer;
