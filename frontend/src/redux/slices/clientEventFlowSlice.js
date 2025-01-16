// src/slices/clientEventFlowSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch client event info
export const fetchClientEventInfo = createAsyncThunk(
    'clientEventFlow/fetchClientEventInfo',
    async ({ registrationId, eventName }, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/client/information', { registrationId, eventName });
            return response.data.eventInfo.flowSteps;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch event info");
        }
    }
);

// Slice definition
const clientEventFlowSlice = createSlice({
    name: 'clientEventFlow',
    initialState: {
        flowSteps: [],    // Array of flow steps
        loading: false,   // Loading state
        error: null,      // Error message
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClientEventInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientEventInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.flowSteps = action.payload;
            })
            .addCase(fetchClientEventInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError } = clientEventFlowSlice.actions;
export default clientEventFlowSlice.reducer;
