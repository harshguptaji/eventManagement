import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for uploading the CSV file
export const importingUploadCSV = createAsyncThunk(
    'users/importingUploadCSV',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            // Assuming the endpoint for file upload is '/api/uploadUser'
            const response = await axios.post('http://localhost:5000/api/v1/upload/importuser', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;  // Return response for success
        } catch (error) {
            return rejectWithValue(error.response.data); // Handle errors
        }
    }
);

// Initial state
const initialState = {
    loading: false,
    message: '',
    success: false,
    duplicates: [],
};

// Redux slice
const importingUserSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(importingUploadCSV.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.message = 'Uploading file...';
            })
            .addCase(importingUploadCSV.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.message = action.payload.message;
                state.duplicates = action.payload.duplicates || [];
            })
            .addCase(importingUploadCSV.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.message = action.payload.message || 'File upload failed.';
            });
    },
});

export default importingUserSlice.reducer;
