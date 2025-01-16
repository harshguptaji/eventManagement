// redux/slices/eventsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch all events
export const fetchAllEvents = createAsyncThunk(
  'events/fetchAllEvents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/event/all'); // Assuming the endpoint for fetching events is `/api/events`
      return response.data.events;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Async action to add a new event
export const addNewEvent = createAsyncThunk(
    'event/addNewEvent',
    async ({ name, description, venue, date, adminName }, { rejectWithValue }) => {
      try {
        const response = await axios.post(
          'http://localhost:5000/api/v1/event/register',  // Backend endpoint
          { name, description, venue, date, adminName }
        );
        return response.data;  // Return the response data
      } catch (error) {
        return rejectWithValue(error.response.data);  // Handle any errors
      }
    }
  );

// Thunk to fetch event details by ID
export const fetchEventById = createAsyncThunk(
  'event/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/event/${eventId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async action to update an event by ID
export const updateEventById = createAsyncThunk(
  'events/updateEventById',
  async ({eventId, name, description, venue, date, adminName}, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/v1/event/${eventId}/edit`, 
        { name, description, venue, date, adminName },
        { headers: { 'Content-Type': 'application/json' } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

  // Delete Event by ID
  export const deleteEventById = createAsyncThunk('event/deleteEventById', async (eventId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/v1/event/${eventId}/delete`);
        return { eventId, message: response.data.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error deleting tag');
    }
  });


  // Action to add a user to a specific event
  export const addUserToEvent = createAsyncThunk(
    'event/addUserToAdmin',
    async({eventid, userRegistration, adminName},{rejectWithValue}) => {
      try {
        const response = await axios.post(`http://localhost:5000/api/v1/event/${eventid}/addnewuser`,{userRegistration, adminName});
        return {eventid, userRegistration, message: response.data.message};
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  );

  //Thunk For Removing a User from Event
  export const removeUserFromEvent = createAsyncThunk(
    'event/removeUserFromEvent',
    async({eventid, userRegistration, adminName},{rejectWithValue}) => {
      try {
        const response = await axios.post(`http://localhost:5000/api/v1/event/${eventid}/removeuser`,{userRegistration, adminName});
        return {eventid, userRegistration, message: response.data.message, updateEvent: response.data.eventDetail};
      } catch (error) {
        return rejectWithValue(error.response.data.message);
      }
    }
  )

const eventsSlice = createSlice({
  name: 'events',
  initialState: {
    events: [],
    event: null,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearEventMessage: (state) => {
        state.message = null;
        state.error = null;
      },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'An Error Occured';
      })
      .addCase(addNewEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addNewEvent.fulfilled, (state,action) => {
        state.loading = false;
        if (action.payload.success) {
          state.events.push(action.payload);  // Add the new tag to the list
          state.message = action.payload.message;
        }
      })
      .addCase(addNewEvent.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload.message || 'An error occurred while adding the tag';
      })
      .addCase(deleteEventById.pending, (state) => {
        state.loading = true;
    })
    .addCase(deleteEventById.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(event => event._id !== action.payload.eventId);
        state.message = action.payload.message;
    })
    .addCase(deleteEventById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
    })
    .addCase(fetchEventById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchEventById.fulfilled, (state, action) => {
      state.loading = false;
      state.event = action.payload.event;
      // state.message = action.payload.message;
    })
    .addCase(fetchEventById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    })
    .addCase(updateEventById.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateEventById.fulfilled, (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      const updatedEvent = action.payload.event;
      state.event = updatedEvent;
      const index = state.events.findIndex(event => event._id === updatedEvent._id);
      if (index !== -1) {
        state.events[index] = updatedEvent; // Update the specific event in the state
      }
    })
    .addCase(updateEventById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(addUserToEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    })
    .addCase(addUserToEvent.fulfilled, (state, action) => {
      state.loading = false;
      const { eventid, userRegistration, message } = action.payload;
      const event = state.events.find((event) => event._id === eventid);
      if (event) {
        event.users.push(userRegistration);
      }
      state.event.users.push(userRegistration);
      state.message = message;
    })
    .addCase(addUserToEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase(removeUserFromEvent.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(removeUserFromEvent.fulfilled, (state, action) => {
      state.loading = false;
      const updatedEventFlow = state.events.find(
        (eventFlow) => eventFlow._id.toString() === action.payload.eventid.toString()
      );
      if (updatedEventFlow) {
        state.event.users = state.event.users.filter(
          (registration) => registration !== action.payload.userRegistration
        );
      }
      state.message = action.payload.message;
    })
    .addCase(removeUserFromEvent.rejected, (state, action, obj) => {
      console.log({rejected: obj});
      state.loading = false;
      state.error = action.payload.message || 'An error occurred';
    });
  },
});

export const { clearEventMessage } = eventsSlice.actions;
export default eventsSlice.reducer;
