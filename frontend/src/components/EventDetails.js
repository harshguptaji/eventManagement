// components/EventDetails.js

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById, clearEventMessage } from "../redux/slices/eventSlice";
import {Link, useParams } from 'react-router-dom';
import AddUserToEvent from './AddUserToEvent';
import RemoveUserFromEvents from './RemoveUserFromEvents';
import "../styling/EventDetails.css"

const EventDetails = () => {
  const { id: eventId } = useParams();
  const dispatch = useDispatch();
  const { event, loading, error} = useSelector((state) => state.events);

  useEffect(() => {
    if (eventId) {
      dispatch(fetchEventById(eventId));
    }
    
    return () => {
      dispatch(clearEventMessage()); // Clear messages when the component unmounts
    };
  }, [dispatch, eventId]);

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className='eventInfo1-container'>
      <h2 className='eventInfo1-title'>Event Details</h2>
      <Link to={`/event/${eventId}/edit`}>
            <button className='edit-event-btn11'>Edit Event</button>
      </Link>
      {/* {message && <p style={{ color: 'green' }}>{message}</p>} */}
      {event ? (
        <div>
          <p className='eventInfo-1'><span className='eventInfo-11'>Name: </span><span className='eventInfo-111'>{event.name}</span></p>
          <p className='eventInfo-2'><span className='eventInfo-22'>Description:</span> <span className='eventInfo-222'>{event.description}</span></p>
          <p className='eventInfo-3'><span className='eventInfo-33'>Venue:</span> <span className='eventInfo-333'>{event.venue}</span></p>
          <p className='eventInfo-4'><span className='eventInfo-44'>Date:</span> <span className='eventInfo-444'>{new Date(event.date).toLocaleDateString()}</span></p>
          <p className='eventInfo-5'><span className='eventInfo-55'>Created By :</span> <span className='eventInfo-555'>{event.createdBy}</span></p>
          <p className='eventInfo-5'><span className='eventInfo-11'>Updated By :</span> <span className='eventInfo-111'>{event.updatedBy}</span></p>
          <p className='eventInfo-5'><span className='eventInfo-11'>Created Date:</span> <span className='eventInfo-111'>{new Date(event.createdTimestamp).toLocaleDateString()}</span></p>
          <p className='eventInfo-5'><span className='eventInfo-11'>Updated Date:</span> <span className='eventInfo-111'>{new Date(event.updatedTimestamp).toLocaleDateString()}</span></p>
          <div className='eventInfo-6'>
            <strong className='eventInfo-66'>Users :- </strong>
            {event.users && event.users.length > 0 ? (
              <ul className='eventInfo-666'>
                {event.users.map((user, index) => (
                  <li key={index}>{user}, </li>
                ))}
              </ul>
            ) : (
              <p>No Userss assigned</p>
            )}

          </div>
          <div className='eventInfo-7'>
            <AddUserToEvent eventid={eventId} />
            <RemoveUserFromEvents eventid={eventId} />
          </div>
          
         
        </div>
      ) : (
        <p>No event details available</p>
      )}
    </div>
  );
};

export default EventDetails;
