import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllEvents,deleteEventById } from "../redux/slices/eventSlice";
import { Link } from 'react-router-dom';
import "../styling/Events.css"

const Events = () => {

  const dispatch = useDispatch();
  const { events, loading, error } = useSelector((state) => state.events);
  const { admin } = useSelector((state) => state.auth);
  
  
  useEffect(() => {
    dispatch(fetchAllEvents());
  }, [dispatch]);

  const handleDeleteEvent = (eventId) => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
    dispatch(deleteEventById(eventId));
    }
};
  

  if (loading) return <p className='loading'>Loading events...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div className='events-container'>
      <h2 className='events-title'>All Events</h2>
      <div>
        <Link to="/event/register">
          <button className='add-event-btn'>Add New Event</button>
        </Link>
      </div>

      <div>
        <ul className='event-inner-container1 flex1'>
          <li className='event-inner-name1'>Name</li>
          <li className='event-inner-description1'>Description</li>
          <li className='event-inner-venue1'>Venue</li>
          <li className='event-inner-date1'>Date</li>
          <li className='event-inner-btn-div1'>Delete</li>
        </ul>
      </div>
      
      {events.length === 0 ? (
        <p>No events found</p>
      ) : (
        <ul className='event-inner-container'>
          {events.map((event) => (
            <li key={event._id}>
              <div className='event-inner-name'>
                <Link className='link' to={`/event/${event._id}`}>{event.name}</Link>
              </div>
              <div className='event-inner-description'>{event.description}</div>
              <div className='event-inner-venue'>{event.venue}</div>
              <div className='event-inner-date'>{new Date(event.date).toLocaleDateString()}</div>
              <div className='event-inner-btn-div'>
              {
                  admin.role === 'admin' ? (
                    <button className='event-del-btn' onClick={() => handleDeleteEvent(event._id)}>Delete</button>
                  ):(
                    <button className='event-del-btn' disabled>Delete</button>
                  )
                }
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Events