// src/features/eventAnalysis/eventAnalysisSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for fetching event analysis
export const fetchEventAnalysis = createAsyncThunk(
    'eventAnalysis/fetchEventAnalysis',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('http://localhost:5000/api/v1/analysis/event'); // API endpoint
            return response.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Failed to fetch event analysis");
        }
    }
);

const eventAnalysisSlice = createSlice({
    name: 'eventAnalysis',
    initialState: {
        data: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEventAnalysis.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEventAnalysis.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchEventAnalysis.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default eventAnalysisSlice.reducer;
