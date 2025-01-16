// src/redux/slices/searchSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async function for searching user in events
export const searchUserInEvents = createAsyncThunk(
    'search/searchUserInEvents',
    async (registrationId, { rejectWithValue }) => {
        try {
            const response = await axios.post('http://localhost:5000/api/v1/event/searching', { registrationId });
            return response.data; // Success response
        } catch (error) {
            return rejectWithValue(error.response.data); // Error response
        }
    }
);

const initialState = {
    loading: false,
    error: null,
    user: null,
    events: [],
    flows: null,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        resetSearch: (state) => {
            state.loading = false;
            state.error = null;
            state.user = null;
            state.events = [];
            state.flows = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(searchUserInEvents.pending, (state) => {
                state.loading = true;
            })
            .addCase(searchUserInEvents.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                state.events = action.payload.events;
                state.flows = action.payload.flows;
                state.error = null;
            })
            .addCase(searchUserInEvents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            });
    }
});

export const { resetSearch } = searchSlice.actions;

export default searchSlice.reducer;
