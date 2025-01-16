import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeUserFromEvent } from '../redux/slices/eventSlice';


const RemoveUserFromEvent = ({eventid}) => {
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
    <div >
        <h3>Delete User From Event</h3>
        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="userNumber">User Number</label>
          <input
            type="number"
            id="userNumber"
            value={userNumber}
            onChange={(e) => setUserNumber(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Delete User</button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default RemoveUserFromEvent;