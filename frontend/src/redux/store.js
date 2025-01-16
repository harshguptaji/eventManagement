// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import adminReducer from './slices/adminSlice';
import tagReducer from "./slices/tagSlice";
import eventReducer from "./slices/eventSlice";
import eventFlowReducer from "./slices/eventFlowSlice";
import userReducer from "./slices/userSlice";
import clientEventFlowReducer from "./slices/clientEventFlowSlice";
import searchReducer from "./slices/SearchSlice"
import  eventAnalysisReducer  from './slices/eventAnalysisSlice';
import importUserReducer from "./slices/importUserSlice";
import importingUserReducer from "./slices/importingUserSlice";
import eventuserReducer from "./slices/eventuserSlice";

// import clientReducer from "./slices/clientSlice";

const store = configureStore({
  reducer: {
    tag: tagReducer,
    admin: adminReducer,
    auth: authReducer,
    events: eventReducer,
    eventFlows: eventFlowReducer,
    users: userReducer,
    clientEventFlow: clientEventFlowReducer,
    search: searchReducer,
    eventAnalysis: eventAnalysisReducer,
    importUser: importUserReducer,
    importUsers: importingUserReducer,
    eventuser: eventuserReducer,
    
    // clients: clientReducer
  },
});

export default store;
