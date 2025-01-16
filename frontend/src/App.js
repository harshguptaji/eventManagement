// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminDetail from './components/AdminDetail';
import RegisterAdmin from './components/RegisterAdmin';
import UpdateAdminForm from './components/updateAdminForm';
import PrivateRoute from './components/PrivateRoute'; // Import the PrivateRoute component
import AddTagForm from './components/AddTagForm';
import AddEventForm from './components/AddEventForm';
import EventDetails from './components/EventDetails';
import UpdateEventForm from './components/UpdateEventForm';
import AddEventFlowForm from './components/AddEventFlowForm';
import AddUserForm from './components/AddUserForm';
import UserDetail from './components/UserDetail';
import UpdateUserForm from './components/UpdateUserForm';
import EventFlowDetail from './components/EventFlowDetail';
import AddStepFlow from './components/AddStepFlow';
import ClientInfoPage from './pages/ClientInfoPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/client" element={<ClientInfoPage />} />
        
        {/* No requiredTag, both admin and subAdmin can access */}
        <Route 
          path="/dashboard/*" 
          element={<PrivateRoute element={<Dashboard />}  />} 
        />    {/*requiredTag="someRequiredTag"*/}
        <Route path="/admin/:id" element={<PrivateRoute element={<AdminDetail />} requiredTag="Admin Details" />}  />
        <Route path="/admin/register" element={<PrivateRoute element={<RegisterAdmin />} requiredTag="Admin New" />}  />
        <Route path="/tag/register" element={<PrivateRoute element={<AddTagForm />} requiredTag="Tag New" />}  />
        <Route path="/event/register" element={<PrivateRoute element={<AddEventForm />} requiredTag="Event New" />}  />
        <Route path="/event/:id" element={<PrivateRoute element={<EventDetails />} requiredTag="Event Details" />}  />
        <Route path="/eventflow/register" element={<PrivateRoute element={<AddEventFlowForm />} requiredTag="Event Flow New" />}  />
        <Route path="/user/register" element={<PrivateRoute element={<AddUserForm />}  />} requiredTag="Customer New" />
        <Route path="/user/:id" element={<PrivateRoute element={<UserDetail />} requiredTag="Customer Details" />}  />
        <Route path="/eventflow/:id" element={<PrivateRoute element={<EventFlowDetail />} requiredTag="Event Flow Details" />}  />
        <Route path="/eventflow/:id/addstepflow" element={<PrivateRoute element={<AddStepFlow />} requiredTag="New Step Flow" />}  />

        <Route
          path="/admin/:id/edit"
          element={<PrivateRoute element={<UpdateAdminForm />} requiredTag="Admin Details" />}
        />
        <Route
          path="/event/:id/edit"
          element={<PrivateRoute element={<UpdateEventForm />} requiredTag="Event Details" />}
        />
        <Route
          path="/user/:id/edit"
          element={<PrivateRoute element={<UpdateUserForm />} requiredTag="Customer Details"  />}
        />


        
      </Routes>
    </Router>
  );
}

export default App;
