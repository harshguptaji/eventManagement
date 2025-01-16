import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom';
import { updateEventById, clearEventMessage } from '../redux/slices/eventSlice';
import "../styling/AddEventForm.css";

const UpdateEventForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const {event, loading,error,message} = useSelector((state) => state.admin);
    const {admin} = useSelector((state) => state.auth);
    // Initialize state for form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [venue, setVenue] = useState('');
    const [date, setDate] = useState('');


    // Prepopulate the form with current admin details if available
  useEffect(() => {
    if (event && event._id === id) {
      setName(event.name);
      setDescription(event.description);
      setVenue(event.venue);
    }
  }, [event, id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedEventData = {
      eventId: id,
      name,
      description,
      venue,
      date,
      adminName: admin.name
    };

   // Dispatch the action to update the admin info
   dispatch(updateEventById(updatedEventData));
   navigate(-1);
 };

 // Clear the message and error on successful update
 useEffect(() => {
   if (message || error) {
     setTimeout(() => {
       dispatch(clearEventMessage());
     }, 2000); // Clear message after 5 seconds
   }
 }, [message, error, dispatch]);

 // Redirect after success message
 useEffect(() => {
   if (message) {
       dispatch(clearEventMessage()); // Clear the message
       navigate(-1); // Redirect to the admin list page
   }
 }, [message, dispatch, navigate]);


  return (
    <div className='add-event-container'>
      <h2 className='add-event-title'>Update Event Information</h2>
      {loading && <p className='loading'>Loading...</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className='event-name'>Name :- </label>
          <input
          className='input-name-event1'
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description" className='event-description'>Description :- </label>
          <input
          className='input-desc-event1'
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
          />
        </div>
        <div>
          <label htmlFor="date" className='event-date'>Date :- </label>
          <input
          className='input-date-event1'
          type='text'
            id="date"
            value={date}
            placeholder= "DD.MM.YYY"
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div className='reg-event-btn-div1'>
          <button className='reg-event-btn1' type="submit" disabled={loading}>
            Update Event
          </button>
        </div>
        
      </form>
    </div>
  )
}

export default UpdateEventForm