import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { clearUserMessage, fetchUserById } from '../redux/slices/userSlice';
// import { Link } from 'react-router-dom';
import "../styling/UserDetail.css"
const UserDetail = () => {
    const {id: userId} = useParams();
    const dispatch = useDispatch();

    const {user, loading, error} = useSelector((state) => state.users);

    useEffect(() => {
        if(userId){
            dispatch(fetchUserById(userId));
        }
            dispatch(clearUserMessage());
    }, [dispatch,userId]);

    if (loading) return <p>Loading event details...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className='userInfo-container'>
        <h2 className='userInfo-title'>User Details</h2>

        {/* <Link to={`/user/${userId}/edit`}>
            <button>Edit user</button>
        </Link> */}
        

        {
            user ? (
                <div>
                    <p className='userInfo-1'> <span className='userInfo-11'>Name : </span> <span className='userInfo-111'>{user.name}</span> </p>
                    
                  <p className='userInfo-2'><span className='userInfo-22'>Registration-Id : </span> <span className='userInfo-222'>{user.registrationId}</span>  </p>
                  <p className='userInfo-3'><span className='userInfo-33'>Number : </span> <span className='userInfo-333'>{user.number}</span> </p>
                  <p className='userInfo-4'><span className='userInfo-44'>Batch : </span> <span className='userInfo-444'>{user.batchName}</span> </p>
                  <p className='userInfo-5'><span className='userInfo-55'>Brand : </span> <span className='userInfo-555'>{user.brandName}</span> </p>
                  <p className='userInfo-2'><span className='userInfo-22'>Workflow-Number : </span> <span className='userInfo-222'>{user.registrationId}</span> </p>
                  <p className='userInfo-2'><span className='userInfo-22'>Update By : </span> <span className='userInfo-222'>{user.updatedBy}</span> </p>
                  <p className='userInfo-2'><span className='userInfo-22'>Created Time : </span> <span className='userInfo-222'>{new Date(user.createdTimestamp).toLocaleString()}</span> </p>
                  <p className='userInfo-2'><span className='userInfo-22'>Updated Time : </span> <span className='userInfo-222'>{new Date(user.updatedTimestamp).toLocaleString()} </span> </p>
                </div>
            ):(
                <p>No User details available</p>
            )
        }
    </div>
  )
}

export default UserDetail