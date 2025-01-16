import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addUserToEvent } from '../redux/slices/eventSlice';

const AddUserToEvent = ({eventid}) => {
    const dispatch = useDispatch();
    const[userRegistration, setUserRegistration] = useState('');
    const {message, error, loading} = useSelector((state) => state.events);
    const {admin} = useSelector((state) => state.auth);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addUserToEvent({eventid, userRegistration, adminName: admin.name}));
        setUserRegistration('');
    }
  return (
    <div className='add-user-container'>
        <h3 className='add-user-title'>Add User To Event</h3>
        <form onSubmit={handleSubmit}>
          <input
            className='select-user'
            type="text"
            id="userRegistration"
            value={userRegistration}
            onChange={(e) => setUserRegistration(e.target.value)}
            placeholder='Registration-Id'
            required
          />
     
        <button className='add-user-btn1' type="submit" disabled={loading}>Add User</button>
        </form>
        {message && <p style={{ color: 'green' }}>{message}</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}

export default AddUserToEvent