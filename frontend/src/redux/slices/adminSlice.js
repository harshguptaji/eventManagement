// src/redux/adminSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios"

export const fetchAllAdmins = createAsyncThunk(
    'admin/fetchAllAdmins',
    async (_, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/v1/admin/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(token)}`
          }
        });
        return response.data.admins;
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

  // Async action for creating a new admin
  export const createAdmin = createAsyncThunk(
    'admin/createAdmin',
    async (adminData, { rejectWithValue }) => {
      try {
        const response = await axios.post('http://localhost:5000/api/v1/admin/register', adminData);
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response.data);  // Handle only data to catch 'message'
      }
    }
  );

  export const fetchAdminById = createAsyncThunk('admin/fetchAdminById', async (id) => {
    const response = await axios.get(`http://localhost:5000/api/v1/admin/${id}`);
    return response.data.admin;
  });

  // Async action to update admin's information
export const updateAdminInfo = createAsyncThunk(
  'admin/updateInfo',
  async ({ adminId, name, number, password, role }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:5000/api/v1/admin/${adminId}/edit`,
        { name, number, password, role },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to delete an admin
export const deleteAdmin = createAsyncThunk(
  'admin/deleteAdmin',
  async (adminId, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/v1/admin/${adminId}`);
      return { adminId, success: true, message: response.data.message}; // Return the admin ID to remove it from the state
    } catch (error) {
      return rejectWithValue(error.response.data.message); // Handle error and return the message
    }
  }
);

// Action to add a tag to a specific admin
export const addTagToAdmin = createAsyncThunk(
  'admin/addTagToAdmin',
  async ({ adminId, tagName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/admin/${adminId}/newtag`,
        { tagName }
      );
      return { adminId, tagName, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Thunk for removing a tag from the admin
export const removeTagFromAdmin = createAsyncThunk(
  'admin/removeTagFromAdmin',
  async ({ adminId, tagName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/admin/${adminId}/removetag`, // Your backend endpoint for removing the tag
        { tagName }
      );
      return {adminId, tagName, message: response.data.message}; // Returns the data if successful
    } catch (error) {
      return rejectWithValue(error.response.data); // Returns error data if the request fails
    }
  }
);
  
const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admins: [],
    admin: null,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearAdminMessage: (state) => {
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdmins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(createAdmin.fulfilled, (state, action) => {
        state.loading = false;
        
          // state.admins.push(action.payload.admin);  // Push new admin to list if successful
          state.message = action.payload.message;
        
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred';
      })
      .addCase(fetchAdminById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminById.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(fetchAdminById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Update Admin Info
      .addCase(updateAdminInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateAdminInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;  // Set the success message from backend
        const updatedAdmin = action.payload.admin;

        // Find and replace the updated admin in the list
        const index = state.admins.findIndex((admin) => admin._id.toString() === updatedAdmin._id.toString());
        if (index !== -1) {
          state.admins[index] = updatedAdmin;
        }
        state.admin = updatedAdmin;
      })
      .addCase(updateAdminInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred';  // Set error message
      })
      .addCase(deleteAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(deleteAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.admins = state.admins.filter(admin => admin._id !== action.payload.adminId);
          state.message = action.payload.message; // Store success message
        }
      })
      .addCase(deleteAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'An error occurred while deleting the admin';
      })
      .addCase(addTagToAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addTagToAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const { adminId, tagName, message } = action.payload;
        const admin = state.admins.find((admin) => admin._id === adminId);
        if (admin) {
          admin.tags.push(tagName);
        }
        state.admin.tags.push(tagName);
        state.message = message;
      })
      .addCase(addTagToAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeTagFromAdmin.pending, (state) => {
        state.loading = true;
        state.message = '';
        state.error = '';
      })
      .addCase(removeTagFromAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        
        const admin = state.admins.find((admin) => admin._id.toString() === action.payload.adminId.toString());
        if (admin) {
          // Remove the tag from the admin's tags array in the state
          admin.tags = admin.tags.filter((tag) => tag !== action.payload.tagName);
          state.admin.tags = state.admin.tags.filter((tag) => tag !== action.payload.tagName);
        }
      })
      .addCase(removeTagFromAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred';
      });
  },
});

export const { clearAdminMessage } = adminSlice.actions;
export default adminSlice.reducer;
