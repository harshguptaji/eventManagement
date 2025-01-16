import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewEventFlow, clearEventFlowMessage } from '../redux/slices/eventFlowSlice';
import "../styling/AddEventFlowForm.css";

const AddEventFlowForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading,message } = useSelector((state) => state.eventFlows);
  const { admin } = useSelector((state) => state.auth);

  const [registrationId, setRegistrationId] = useState('');
    const adminName = admin.name;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewEventFlow({ registrationId, adminName }));
    setTimeout(() => {
      dispatch(clearEventFlowMessage());
      navigate('/dashboard/event-flow');  // Assuming this is the route for tag list
    }, 2000);
  };

  return (
    <div className='add-eventFlow-container'>
      <h2 className='add-eventFlow-title'>Add New Event-Flow</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="registrationId" className='add-eventFlow-registration'>Registration Id :- </label>
          <input
            className='input-registration-eventFlow'
            type="text"
            id="registrationId"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            required
          />
        </div>
        <div className='reg-event-btn-div'>
          <button className='reg-event-btn' type="submit" disabled={loading}>
            {loading ? 'Adding Event-Flow...' : 'Add Event Flow'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default AddEventFlowForm;
