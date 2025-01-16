// src/redux/slices/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

// Initial state is set from localStorage if available
const initialState = {
  admin: JSON.parse(localStorage.getItem('admin')) || null, // Load admin data from localStorage
  token: localStorage.getItem('token') || null, // Load token from localStorage
  loading: false,
  error: null,
};

export const adminLogin = (credentials) => async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:5000/api/v1/admin/login', credentials,{
        withCredentials: true, 
      });
      const { token, admin } = response.data;
  
      // Dispatch success action and store in Redux state
      dispatch(loginSuccess({ admin, token }));
    } catch (error) {
      // Handle errors
      dispatch(loginFailure(error.response ? error.response.data.message : 'Login failed'));
    }
  };

// Redux slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { admin, token } = action.payload;
      state.admin = admin;
      state.token = token;
      localStorage.setItem('admin', JSON.stringify(admin)); // Store admin data in localStorage
      localStorage.setItem('token', token); // Store token in localStorage
    },
    logout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem('admin'); // Remove admin data from localStorage
      localStorage.removeItem('token'); // Remove token from localStorage
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { loginSuccess, logout, loginFailure } = authSlice.actions;
export default authSlice.reducer;
