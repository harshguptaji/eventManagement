// src/components/AdminInfo.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import "../styling/Navbar.css"

const AdminInfo = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { admin } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className='adminInfo-container'>
      {admin ? (
        <div className='adminInfo-Small-container'>
          <span className='adminInfo-text1'>Welcome, {admin.name} ({admin.role})</span>
          <button className='btn-logout' onClick={handleLogout} >Logout</button>
        </div>
      ) : null}
    </div>
  );
};


export default AdminInfo;
