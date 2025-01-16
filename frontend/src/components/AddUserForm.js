import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { addNewUser, clearUserMessage } from '../redux/slices/userSlice';
import "../styling/AddUserForm.css"

const AddUserForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {message,error,loading} = useSelector((state) => state.users);
    const {admin} = useSelector((state) => state.auth);

    const [name,setName] = useState('');
    const [number,setNumber] =useState('');
    const [registrationId,setRegistrationId] =useState('');
    const [brandName,setBrandName] =useState('');
    const [batchName,setBatchName] =useState('');

    const adminName = admin.name;

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addNewUser({registrationId, name, number, brandName, batchName, adminName}));
        // navigate('/dashboard/users');
    };

    if (message) {
        setTimeout(() => {
          dispatch(clearUserMessage());
          navigate('/dashboard/users');  // Assuming this is the route for tag list
        }, 2000);
      }
    
  return (
    <div className='add-customer-container'>
        <h2 className='add-customer-title'>Add New User</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

        <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className='customer-registration'>Registration Id :- </label>
          <input
            className='input-reg-customer'
            type="text"
            id="registrationId"
            value={registrationId}
            onChange={(e) => setRegistrationId(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name" className='customer-name'>User Name :- </label>
          <input
          className='input-reg-name'
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="number" className='customer-number'>User Number :- </label>
          <input
          className='input-reg-number'
            type="number"
            id="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name" className='customer-brand'>Brand Name :- </label>
          <input
          className='input-reg-brand'
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name" className='customer-branch'>Batch Name :- </label>
          <input
          className='input-reg-branch'
            type="text"
            id="batchName"
            value={batchName}
            onChange={(e) => setBatchName(e.target.value)}
            required
          />
        </div>

        <div className='reg-user-btn-div'>
            <button type="submit" className='reg-user-btn' disabled={loading}>
              {loading ? 'Adding User...' : 'Add User'}
            </button>
        </div>
        
      </form>
    </div>
  )
}

export default AddUserForm