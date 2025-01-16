import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action to fetch all event flows
export const fetchAllEventFlows = createAsyncThunk(
  'eventFlows/fetchAllEventFlows',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/api/v1/eventflow/all'); // Your backend endpoint
      return response.data.eventFlows;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'An error occurred');
    }
  }
);

// Async Action to add new event flow
export const addNewEventFlow = createAsyncThunk(
    'eventFlows/addNewEventFlow',
    async({registrationId, adminName}, {rejectWithValue}) => {
        try {
            const response = await axios.post(
                'http://localhost:5000/api/v1/eventflow/register',
                {registrationId, adminName}
            );
            return {eventFlow: response.data.eventFlow, message: response.data.message};
        } catch (error) {
            return rejectWithValue(error.response.data);  // Handle any errors
        }
    }
);

// Delete EventFlow By Id
export const deleteEventFlowById = createAsyncThunk('eventFlows/deleteEventFlowById', async (eventFlowId, {rejectWithValue}) => {
    try {
        const response = axios.delete(`http://localhost:5000/api/v1/eventflow/${eventFlowId}/delete`);
        return {eventFlowId, message: (await response).data.message};
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error deleting Event Flow');
    }
});

// Async Thunk to show eventflow, Information By Id
export const eventFlowInfoById = createAsyncThunk(
  'eventFlows/eventfloeInfoById',
  async({id},{rejectWithValue}) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/v1/eventflow/${id}`);
      return {message: response.data.message, eventFlow: response.data.eventFlow};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error Fething Event Flow');
    }
  }
);

// Async Thunk to Add New Step Flow
export const addStepFlow = createAsyncThunk(
  'eventFlows/addStepFlow',
  async ({ eventId, flowName, flowOrder, flowDescription, flowTag, adminName  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/v1/eventflow/${eventId}/addstepflow`,  
       { flowName, flowOrder, flowDescription, flowTag, adminName }
      );
      return { flowStep: response.data.flowStep, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error adding step flow');
    }
  }
);

// Delete Step Flow By Id
// Async Thunk to delete a particular step flow
export const deleteStepFlow = createAsyncThunk(
  'eventFlows/deleteStepFlow',
  async ({ eventId, stepFlowId, adminName }, { rejectWithValue }) => {
    try {
      console.log('EventFlowId:', eventId, 'StepFlowId:', stepFlowId);

      const response = await axios.post(
        `http://localhost:5000/api/v1/eventflow/${eventId}/deletestepflow`,
        { stepFlowId, adminName }
      );
      return {eventFlowId: eventId, stepFlowId: stepFlowId, message: response.data.message};  // Assuming the response contains a message and success flag
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting step flow');
    }
  }
);
// Update Status of a particular step Flow
export const updateStatus = createAsyncThunk(
  'eventFlows/updateStatus',
  async({eventId, flowId, flowStatus, adminName},{rejectWithValue}) => {
      try {
        const response = await axios.put(`http://localhost:5000/api/v1/eventflow/${eventId}/updatestepflowstatus`,{flowId, flowStatus, adminName});
        return {eventFlowId: eventId, stepFlowId: flowId, flowStatus: flowStatus, message: response.data.message};
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Error deleting step flow');
      }
  }
);

// Update Order of a particular step flow
export const updateOrder = createAsyncThunk(
  'eventFlows/updateOrder',
  async({eventId, stepFlowId, flowOrder, adminName},{rejectWithValue}) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/v1/eventflow/${eventId}/updatestepfloworder`,{stepFlowId, flowOrder, adminName});
        return {eventFlowId: eventId, stepFlowId: stepFlowId, flowOrder: flowOrder, message: response.data.message, flow: response.data.flow};
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting step flow');
    }
  }
);

const eventFlowSlice = createSlice({
  name: 'eventFlows',
  initialState: {
    eventFlows: [],
    eventFlow: null,
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearEventFlowMessage: (state) => {
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEventFlows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEventFlows.fulfilled, (state, action) => {
        state.loading = false;
        state.eventFlows = action.payload;
      })
      .addCase(fetchAllEventFlows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addNewEventFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addNewEventFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.eventFlows.push(action.payload.eventFlow);
        state.message = action.payload.message;
      })
      .addCase(addNewEventFlow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(deleteEventFlowById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEventFlowById.fulfilled, (state,action) => {
        state.loading = false;
        state.eventFlows = state.eventFlows.filter(eventFlow => eventFlow._id !==action.payload.eventFlowId)
      })
      .addCase(deleteEventFlowById.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(eventFlowInfoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eventFlowInfoById.fulfilled, (state,action) => {
        state.loading = false;
        state.eventFlow = action.payload.eventFlow;
        state.message = action.payload.message;
      })
      .addCase(eventFlowInfoById.rejected, (state,action) => {
        state.loading = false;
        state.error = action.payload || 'An error on fetching event flow by id';
      })
      .addCase(addStepFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStepFlow.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        // Assuming `eventFlow` holds the currently viewed/selected flow details
        // if (state.eventFlow) {
        //   state.eventFlow.flowSteps.push(action.payload.flowStep);
          
        //   state.eventFlow.flowSteps.sort((a, b) => a.flowOrder - b.flowOrder);
        // }
      })
      .addCase(addStepFlow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteStepFlow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStepFlow.fulfilled, (state, action) => {
        state.loading = false;
        // Find the event flow by ID and update it by removing the deleted step flow
        const updatedEventFlow = state.eventFlows.find(
          (eventFlow) => eventFlow._id.toString() === action.payload.eventFlowId.toString()
        );
        if (updatedEventFlow) {
          state.eventFlow.flowSteps = state.eventFlow.flowSteps.filter(
            (step) => step._id.toString() !== action.payload.stepFlowId.toString()
          );
        }
        state.message = action.payload.message;
      })
      .addCase(deleteStepFlow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Find the event flow by ID and update it by removing the deleted step flow
        const updatedEventFlow = state.eventFlows.find(
          (eventFlow) => eventFlow._id.toString() === action.payload.eventFlowId.toString()
        );
        if (updatedEventFlow) {
          const index = state.eventFlow.flowSteps.findIndex(
            (step) => step._id.toString() === action.payload.stepFlowId.toString()
          );
          state.eventFlow.flowSteps[index].flowStatus = action.payload.flowStatus;
        }
        state.message = action.payload.message;
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.loading = false;
        // Find the event flow by ID and update it by removing the deleted step flow
        const updatedEventFlow = state.eventFlows.find(
          (eventFlow) => eventFlow._id.toString() === action.payload.eventFlowId.toString()
        );
        if (updatedEventFlow) {
          const index = state.eventFlow.flowSteps.findIndex(
            (step) => step._id.toString() === action.payload.stepFlowId.toString()
          );
          state.eventFlow.flowSteps[index].flowOrder = action.payload.flowOrder;
        }
        state.message = action.payload.message;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearEventFlowMessage } = eventFlowSlice.actions;
export default eventFlowSlice.reducer;
