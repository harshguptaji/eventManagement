// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log("Token attached to request:", config.headers['Authorization']); // Logging the token
    } else {
      console.log("No token found in localStorage.");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
