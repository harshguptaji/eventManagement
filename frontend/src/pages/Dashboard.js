// src/pages/Dashboard.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import AdminInfo from '../components/AdminInfo';
import Admins from '../components/Admins';
import Users from '../components/Users';
import Events from '../components/Events';
import Tags from '../components/Tags';
import EventFlow from '../components/EventFlow';
import SearchUserInEvents from '../components/SearchUserInEvents';
import EventAnalysisComponent from '../components/EventAnalysisComponent';
import ImportUserComponent from '../components/ImportUserComponent';
import ImportingUploadCSV from '../components/ImportingUploadCSV';
import EventUserUpload from '../components/EventUserUpload';


const Dashboard = () => {
  return (
    <div>
      <Navbar />
      <AdminInfo />
      <div>
        <Routes>
          <Route path="admins" element={<Admins />} />
          <Route path="users" element={<Users />} />
          <Route path="events" element={<Events />} />
          <Route path="tags" element={<Tags />} />
          <Route path="event-flow" element={<EventFlow />} />
          <Route path="searching" element={<SearchUserInEvents />} />
          <Route path="analysis" element={<EventAnalysisComponent />} />
          <Route path="upload" element={<ImportUserComponent />} />
          <Route path="uploaduser" element={<ImportingUploadCSV />} />
          <Route path="uploadusersevent" element={<EventUserUpload />} />
        </Routes>
      </div>
    </div>
  );
};



export default Dashboard;
