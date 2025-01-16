// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { adminLogin } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import "../styling/login.css";

const Login = () => {
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const { loading, error, admin } = useSelector((state) => state.auth);
  
    // Redirect if already logged in
    useEffect(() => {
      if (admin) {
        navigate('/dashboard'); // Redirect to dashboard if admin is already logged in
      }
    }, [admin, navigate]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      dispatch(adminLogin({ number, password }));
    };
  
    return (
      <div className="login-container">
        <h2 className='login-title'>Admin Login</h2>
        <form onSubmit={handleSubmit} className='form-container'>
          <div className='div-center'>
            <label htmlFor="number" className='login-number'>Number </label><br/>
            <input className='input-number'
              type="number"
              id="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className='login-password '>Password</label><br/>
            <input
            className='input-password'
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className='div-btn'>
            <button type="submit" className='button-17' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
          
        </form>
      </div>
    );
  };
  
  export default Login;