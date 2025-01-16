import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch all tags
export const fetchAllTags = createAsyncThunk(
  'tag/fetchAllTags',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/tag/all');  // Backend endpoint to fetch all tags
      return response.data;  // Return the tags from the response
    } catch (error) {
      return rejectWithValue(error.response.data);  // If error, return the error message
    }
  }
);

// Async action to add a new tag
export const addNewTag = createAsyncThunk(
    'tag/addNewTag',
    async ({ name, description }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/v1/tag/register',  // Backend endpoint
          { name, description }
        );
        return response.data;  // Return the response data
      } catch (error) {
        return rejectWithValue(error.response.data);  // Handle any errors
      }
    }
  );

  // Delete tag by ID
export const deleteTagById = createAsyncThunk('tags/deleteTagById', async (tagId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/v1/tag/delete/${tagId}`);
        return { tagId, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error deleting tag');
    }
});

const tagSlice = createSlice({
  name: 'tag',
  initialState: {
    tags: [],    // Array to store all tags
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearTagMessage: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTags.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTags.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = action.payload.tags;  // Save fetched tags to state
      })
      .addCase(fetchAllTags.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred';  // Handle error if any
      })
      .addCase(addNewTag.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addNewTag.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.success) {
          state.tags.push(action.payload);  // Add the new tag to the list
          state.message = action.payload.message;
        }
      })
      .addCase(addNewTag.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred while adding the tag';
      })
      .addCase(deleteTagById.pending, (state) => {
        state.loading = true;
    })
    .addCase(deleteTagById.fulfilled, (state, action) => {
        state.loading = false;
        state.tags = state.tags.filter(tag => tag._id !== action.payload.tagId);
        state.message = action.payload.message;
    })
    .addCase(deleteTagById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    });
  },
});

export const { clearTagMessage } = tagSlice.actions;
export default tagSlice.reducer;
