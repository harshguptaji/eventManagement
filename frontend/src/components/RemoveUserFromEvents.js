import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeUserFromEvent } from '../redux/slices/eventSlice';
import "../styling/EventDetails.css"
const RemoveUserFromEvents = ({eventid}) => {
    const dispatch = useDispatch();
    const[userNumber, setUserNumber] = useState('');
    const {message, error, loading} = useSelector((state) => state.events);
    const {admin} = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(removeUserFromEvent({eventid, userNumber, adminName: admin.name}));
        setUserNumber('');
    }
  return (
    <div className='add-user-container'>
        <h3 className='add-user-title'>Delete User From Event</h3>
        <form onSubmit={handleSubmit} className='form-11'>
       
          
          <input
          className='select-user'
            type="text"
            id="userNumber"
            value={userNumber}
            onChange={(e) => setUserNumber(e.target.value)}
            required
          />
        
        <button className='add-user-btn1' type="submit" disabled={loading}>Delete User</button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default RemoveUserFromEvents;