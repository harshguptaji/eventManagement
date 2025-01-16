import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteEventFlowById, fetchAllEventFlows } from '../redux/slices/eventFlowSlice';
import { Link } from 'react-router-dom';
import "../styling/EventFlow.css";

const EventFlow = () => {

  const dispatch = useDispatch();
  const { eventFlows, loading, error } = useSelector((state) => state.eventFlows);
  const { admin } = useSelector((state) => state.auth);
  

  console.log('Redux State:', eventFlows); // Log the eventFlows state

  // Fetch event flows when the component mounts
  useEffect(() => {
    dispatch(fetchAllEventFlows());
  }, [dispatch]);

  const handleDeleteEventFlow = (eventFlowId) => {
    if (window.confirm("Are you sure you want to delete this Event?")) {
      dispatch(deleteEventFlowById(eventFlowId));
    }
};


  if (loading) return <p>Loading...</p>;

  if (error)  <p style={{ color: 'red' }}>{error}</p>;
  

  return (
    <div className='eventFlow-container'>
      <h2 className='eventFlow-title'>Event Flows</h2>

      <div>
        <Link to="/eventflow/register">
          <button className='add-eventFlow-btn'>Add New Event Flow</button>
        </Link>
      </div>

      <div>
        <ul className='eventFlow-inner-container1 flex1'>
          <li className='eventFlow-inner-name1'>Expected Registration</li>
          <li className='eventFlow-inner-number1'>Is Linked</li>
          <li className='eventFlow-inner-role1'>Flow Steps</li>
          <li className='eventFlow-inner-tags1'>Last Update</li>
          <li className='eventFlow-inner-btn-div1'>Delete</li>
        </ul>
      </div>

      {eventFlows.length === 0 ? (
        <p>No event flows available</p>
      ) : (
        <ul className='eventFlow-inner-container'>
          {eventFlows.map((flow) => (
            <li key={flow._id}>
              <div className='eventFlow-inner-name'> <Link className='link' to={`/eventflow/${flow._id}`}>{flow.expectedUserNumber}</Link> </div>
            
              <div className='eventFlow-inner-number'>{
                flow.isLinkedWithUser === true ? (<span>True</span>) : (<span>False</span>)
              }</div>
              <div className='eventFlow-inner-role'> {flow.flowSteps.length} </div>
              <div className='eventFlow-inner-tags'> {flow.lastUpdateBy} </div>
              <div className='eventFlow-inner-btn-div'>
                {
                  admin.role === 'admin' ? (
                    <button className='eventFlow-del-btn' onClick={() => handleDeleteEventFlow(flow._id)}>Delete</button>
                  ):(
                    <button className='eventFlow-del-btn' disabled>Delete</button>
                  )
                }
              </div>
            </li> // Display the name of each event flow
          ))}
        </ul>
      )}
    </div>
  );
};



export default EventFlow;
