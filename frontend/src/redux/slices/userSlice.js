import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios';


//Async action to fetch all users
export const fetchAllUsers = createAsyncThunk(
    'users/fetchAllUsers',
    async(_,{ rejectWithValue }) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/user/all`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred');
        }
    }
);

// Async Action to Add New User
export const addNewUser = createAsyncThunk(
    'users/addNewUser',
    async({registrationId, name, number, brandName, batchName, adminName},{rejectWithValue}) => {
        try {
            const response = await axios.post(`http://localhost:5000/api/v1/user/register`,
            {registrationId, name, number, brandName, batchName, adminName});
            // return response.data.user;
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);  // Handle any errors
        }
    }
)

// Thunk to fetch user details By ID
export const fetchUserById = createAsyncThunk(
    'users/fetchuserById',
    async(userId,{rejectWithValue}) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/v1/user/${userId}`)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Thunk for updating the user
export const updateUserById = createAsyncThunk(
    'users/updateUserById',
    async (updateUserData, { rejectWithValue }) => {
        try {
            const response = await axios.put(`http://localhost:5000/api/v1/user/${updateUserData.userId}`, updateUserData);
            return response.data;
        } catch (error) {
            // Return custom error message
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data);
            }
            return rejectWithValue({
                message: 'An error occurred, please try again later',
                success: false
            });
        }
    }
);

// Delete User By Id
export const deleteUserById = createAsyncThunk(
    'users/deleteUserById',
    async(userId, {rejectWithValue}) => {
        try {
            const response = axios.delete(`http://localhost:5000/api/v1/user/${userId}/delete`);
            return {userId, message: (await response).data.message};
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Failed to update user";
            return rejectWithValue(errorMessage);
        }
    }
);

const userSlice = createSlice({
    name: 'user',
    initialState: {
        users: [],
        user: null,
        loading: false,
        message: null,
        error: null,
    },
    reducers:{
        clearUserMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchAllUsers.fulfilled, (state,action) => {
            state.loading = false;
            state.users = action.payload.users;
        })
        .addCase(fetchAllUsers.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(addNewUser.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.message = null;
          })
          .addCase(addNewUser.fulfilled, (state, action) => {
            state.loading = false;
            state.users.push(action.payload.user);
            state.message = action.payload.message;
          })
          .addCase(addNewUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message || 'An error occured while adding new user';
          })
          .addCase(fetchUserById.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchUserById.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            // state.message = action.payload.message;
          })
          .addCase(fetchUserById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
          })
        .addCase(deleteUserById.pending, (state) => {
            state.loading = true;
        })
        .addCase(deleteUserById.fulfilled, (state,action) => {
            state.loading = false;
            state.users = state.users.filter(user => user._id !== action.payload.userId)
            state.message = action.payload.message;
        })
        .addCase(deleteUserById.rejected, (state,action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateUserById.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateUserById.fulfilled, (state, action) => {
            state.loading = false;
            state.message = action.payload.message;
            state.user = action.payload.user; // Update the user state with the updated data
            state.error = null;
        })
        .addCase(updateUserById.rejected, (state, action) => {
            console.log("Rejected action payload:", action.payload);  // Log the error payload here
            state.loading = false;
            state.error = action.payload?.message || 'Failed to update user';
            state.message = null; // Reset success message
        });
    },
});

export const { clearUserMessage } = userSlice.actions;

export default userSlice.reducer;
