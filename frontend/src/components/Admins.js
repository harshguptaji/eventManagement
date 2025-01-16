// src/components/Admins.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteAdmin,fetchAllAdmins } from '../redux/slices/adminSlice';
import { Link } from 'react-router-dom';
import "../styling/Admin.css"

const Admins = () => {
  const dispatch = useDispatch();
  const { admins, loading, error } = useSelector((state) => state.admin);
  const { admin } = useSelector((state) => state.auth);
  
  
  useEffect(() => {
    dispatch(fetchAllAdmins());
  }, [dispatch]);

  const handleDelete = (adminId) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      dispatch(deleteAdmin(adminId))
        .then(response => {
          if (response.payload.success) {
            console.log('Admin deleted successfully');
          }
        })
        .catch(error => {
          console.error('Error deleting admin:', error);
        });
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div className='admins-container'>
      <h2 className='admins-title'>All Admins</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      <div>
        <Link to="/admin/register">
          <button className='add-admin-btn'>Add New Admin</button>
        </Link>
      </div>
      <div>
        <ul className='admin-inner-container1 flex1'>
          <li className='admin-inner-name1'>Name</li>
          <li className='admin-inner-number1'>Number</li>
          <li className='admin-inner-role1'>Role</li>
          <li className='admin-inner-tags1'>Tags : Length</li>
          <li className='admin-inner-btn-div1'>Delete</li>
        </ul>
      </div>
      
      <ul className='admin-inner-container'>
        {
          admins && admins.length > 0 ? (
            admins.map((adm) => (
              <li key={adm._id}>
                <strong className='admin-inner-name'>
                  {/* Link to the detailed page for each admin */}
                  <Link className='link' to={`/admin/${adm._id}`}>{adm.name}</Link>
                </strong>  <div className='admin-inner-number'>{adm.number}</div>   <div className='admin-inner-role'>{adm.role}</div>
                {/* <div> */}
                  <div className='admin-inner-tags'>{adm.tags.length}</div>
                  {/* {admin.tags && admin.tags.length > 0 ? (
                    <ul>
                      {admin.tags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No tags assigned</p>
                  )} */}
                {/* </div> */}
                <div className='admin-inner-btn-div'>
                {
                  admin.role === 'admin' ? (
                    <button className='admin-del-btn' onClick={() => handleDelete(admin._id)}>Delete Admin</button>
                  ):(
                    <button className='admin-del-btn' disabled>Delete</button>
                  )
                }

                </div>

              </li>
            ))
          ) : (
            <p>No admins found</p>
          )
        }
        
      </ul>
    </div>
  );
};

export default Admins;
