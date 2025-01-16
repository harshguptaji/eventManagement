import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for uploading event users
export const uploadEventUsers = createAsyncThunk(
    'eventuser/uploadEventUsers',
    async (file, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:5000/api/v1/eventuserupload/importusers', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data; // Successful response
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: 'Unknown error occurred.' });
        }
    }
);

const eventuserSlice = createSlice({
    name: 'eventuser',
    initialState: {
        isLoading: false,
        successMessage: null,
        errorMessage: null,
        invalidEventNames: [],
        invalidRegistrationIds: [],
    },
    reducers: {
        clearMessages: (state) => {
            state.successMessage = null;
            state.errorMessage = null;
            state.invalidEventNames = [];
            state.invalidRegistrationIds = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(uploadEventUsers.pending, (state) => {
                state.isLoading = true;
                state.successMessage = null;
                state.errorMessage = null;
                state.invalidEventNames = [];
                state.invalidRegistrationIds = [];
            })
            .addCase(uploadEventUsers.fulfilled, (state, action) => {
                state.isLoading = false;
                state.successMessage = action.payload.message;
                state.invalidEventNames = action.payload.invalidEventNames || [];
                state.invalidRegistrationIds = action.payload.invalidRegistrationIds || [];
            })
            .addCase(uploadEventUsers.rejected, (state, action) => {
                state.isLoading = false;
                state.errorMessage = action.payload.message;
                state.invalidEventNames = action.payload.invalidEventNames || [];
                state.invalidRegistrationIds = action.payload.invalidRegistrationIds || [];
            });
    },
});

export const { clearMessages } = eventuserSlice.actions;
export default eventuserSlice.reducer;
