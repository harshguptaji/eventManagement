import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteUserById, fetchAllUsers } from '../redux/slices/userSlice';
import { Link } from 'react-router-dom';
import "../styling/Users.css"

const Users = () => {
  const dispatch = useDispatch();
  const {users, loading, error} = useSelector((state) => state.users);
  const { admin } = useSelector((state) => state.auth);
  

  useEffect(() => {
    dispatch(fetchAllUsers());
  },[dispatch]);

  const handleDeleteUser = (userId) => {
      if(window.confirm("Are are you sure you want to delete this user ? ")){
        if(window.confirm("Are are you sure you want to delete this user ? ")){
          dispatch(deleteUserById(userId));
        }
      }
  }

  if (loading) return <p>Loading events...</p>;

  if (error) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div className='users-container'>
      <h2 className='users-title'>All Customers</h2>

      <div>
        <Link to="/user/register">
          <button className='add-user-btn'>Add New User</button>
        </Link>
      </div>

      <div>
        <ul className='user-inner-container1 flex1'>
          <li className='user-inner-name1'>Name</li>
          <li className='user-inner-registration1'>Registration Id</li>
          <li className='user-inner-number1'>Number</li>
          <li className='user-inner-batch1'>Batch</li>
          <li className='user-inner-brand1'>Brand</li>
          <li className='user-inner-btn-delete1'>Delete</li>
        </ul>
      </div>
      
      {
        users.length === 0 ? (
          <p>No Customer Found</p>
        ):(
          <ul className='user-inner-container'>
            {
              users.map((user) => (
                <li key={user._id}>
                  <div className='user-inner-name'><Link className='link' to={`/user/${user._id}`}>{user.name}</Link></div>
                  <div className='user-inner-reg'>{user.registrationId} </div>
                  <div className='user-inner-number'> {user.number} </div>
                  <div className='user-inner-batch'> {user.batchName} </div>
                  <div className='user-inner-brand'> {user.brandName} </div>
                  <div className='user-inner-btn-div'>
                  {
                  admin.role === 'admin' ? (
                    <button className='user-del-btn' onClick={() => handleDeleteUser(user._id)}>Delete</button>

                  ):(
                    <button className='user-del-btn' disabled>Delete</button>
                  )
                }
                  </div>
                </li>
              ))
            }
          </ul>
        )
      }
    </div>
  )
};

export default Users