import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewEvent, clearEventMessage } from '../redux/slices/eventSlice';
import { useNavigate } from 'react-router-dom';
import "../styling/AddEventForm.css";

const AddEventForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, error, loading } = useSelector((state) => state.events);
  const { admin } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('');
    const adminName = admin.name;

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewEvent({ name, description, venue, date, adminName }));
  };

  // Redirect to the tag list page after success
  if (message) {
    setTimeout(() => {
      dispatch(clearEventMessage());
      navigate('/dashboard/events');  // Assuming this is the route for tag list
    }, 5000);
  }

  return (
    <div className='add-event-container'>
      <h2 className='add-event-title'>Add New Event</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className='event-name'>Name :- </label>
          <input
            className='input-name-event1'
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className='event-description'>Description :- </label>
          <input
          className='input-desc-event1'
          type='text'
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="venue" className='event-venue'>Venue :- </label>
          <input
          className='input-venue-event1'
            type="text"
            id="venue"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="date" className='event-date'>Date :- </label>
          <input
          className='input-date-event1'
            type="text"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder='DD.MM.YYYY'
            required
          />
        </div>
        <div className='reg-event-btn-div1'>
          <button className='reg-event-btn1' type="submit" disabled={loading}>
            {loading ? 'Adding Event...' : 'Add Event'}
          </button>
        </div>
        
      </form>
    </div>
  );
};

export default AddEventForm;
