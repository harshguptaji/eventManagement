import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { eventFlowInfoById, clearEventFlowMessage,deleteStepFlow } from '../redux/slices/eventFlowSlice';
import UpdateStatus from './UpdateStatus';
import UpdateOrder from './UpdateOrder';
import "../styling/EventFlowDetail.css"

const EventFlowDetail = () => {
  const dispatch = useDispatch();

  const { id } = useParams(); // Assumes route param: /eventflow/:id
    const {admin} = useSelector((state) => state.auth);
    const adminName = admin.name;
  const { eventFlow, loading, error} = useSelector((state) => state.eventFlows);


  const handleDeleteStepFlow = (stepFlowId) => {
    dispatch(deleteStepFlow({ eventId: id, stepFlowId, adminName }));
    dispatch(clearEventFlowMessage());
};
  // Fetch event flow information by ID when component mounts
  useEffect(() => {
    if (id) {
      dispatch(eventFlowInfoById({ id }));
    }

    // Optional: Clear messages on unmount
    return () => {
      dispatch(clearEventFlowMessage());
    };
  }, [dispatch, id]);

  // Redirect on success message if needed
//   useEffect(() => {
//     if (message) {
//       navigate(-1); 
//     }
//   }, [message, navigate]);

  // Error handling: Display error message
  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  // Loading state: Display a spinner while loading
  if (loading) {
    return <p className='loading'>Loading.....</p>;
  }

  // Main component rendering
  return (
    <div className='eventInfo-container'>
      <h1 className='eventInfo-title'>Event Flow Details</h1>
      {eventFlow ? (
        <div>
          <p><strong className='str-title'>Name :</strong> <span className='span-title'>{eventFlow.expectedUserNumber}</span></p>
          <p><strong className='str-title'>Linking status :</strong> <span className='span-title'>{eventFlow.isLinkedWithUser === true ? (<span>True</span>) : (<span>False</span>)}</span></p>
          <p><strong className='str-title'>Updated By :</strong> <span className='span-title'>{eventFlow.lastUpdateBy}</span></p>
          <p><strong className='str-title'>Flow Steps :</strong> <span className='span-title'>{eventFlow.flowSteps.length}</span></p>
              <Link to={`/eventflow/${id}/addstepflow`}><button className='add-flow-btn1'>Add New Step Flow</button></Link>
                {/* <div><button>Add New Step Flow</button></div> */}
            <div>
                {
                    eventFlow.flowSteps && eventFlow.flowSteps.length > 0 ? (
                        <ul className='eventFlows-container'>
                            {eventFlow.flowSteps.map((flow, index) => (
                                <li key={index}>
                                    <p><span className='step-title'>Step Name :- </span> <span className='step-para'>{flow.flowName}</span></p>
                                    <p><span className='step-title'>Step Order :- </span> <span className='step-para'>{flow.flowOrder}</span></p>
                                    <p><span className='step-title'>Step Description :- </span> <span className='step-para'>{flow.flowDescription}</span></p>
                                    <p><span className='step-title'>Step Tag :- </span> <span className='step-para'>{flow.flowTag}</span></p>
                                    <p><span className='step-title'>Step Status :- </span> <span className='step-para'>{flow.flowStatus}</span></p>
                                    <p><span className='step-title'>Last Update By :- </span> <span className='step-para'>{flow.lastUpdatedBy}</span></p>
                                    <p><span className='step-title'>Last Update Date :- </span> <span className='step-para'>{new Date(flow.lastUpdateTiming).toLocaleDateString()}</span></p>
                                    <button className='update-status1' onClick={() => handleDeleteStepFlow(flow._id)}>Delete Step</button>

                                    <UpdateStatus flowId={flow._id} eventId={id} />
                                    <UpdateOrder stepFlowId={flow._id} eventId={id}/>
                                   

                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No Step Flows Found</p>
                    )
                }
            </div>
          {/* Add more details as necessary */}
        </div>
      ) : (
        <p>No event flow details available.</p>
      )}
    </div>
  );
};

export default EventFlowDetail;
