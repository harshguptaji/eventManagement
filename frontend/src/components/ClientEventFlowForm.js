// src/components/ClientEventFlowForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientEventInfo, clearError } from '../redux/slices/clientEventFlowSlice';
import "../styling/ClientInfoPage.css"

const ClientEventFlowForm = () => {
    const [registrationId, setRegistartionId] = useState('');
    const [eventName, setEventName] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false); // Tracks form submission
    const dispatch = useDispatch();
    const { flowSteps, loading, error } = useSelector((state) => state.clientEventFlow);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(fetchClientEventInfo({ registrationId, eventName }));
    };

    // Error handling with alert
    useEffect(() => {
        if (error) {
            alert(error);
            dispatch(clearError());
            setIsSubmitted(false); // Reset submission if there's an error
        }
    }, [error, dispatch]);

    // On successful data retrieval, hide the form
    useEffect(() => {
        if (flowSteps.length > 0) {
            setIsSubmitted(true);
        }
    }, [flowSteps]);

    return (
        <div>
            {/* Form is shown only if not submitted */}
            {!isSubmitted && (
                <form onSubmit={handleSubmit}>
                    <div className='div-top1'>
                        <label className='client-registration'>Registration Id :- </label>
                        <input 
                            className='input-client-reg'
                            type="text"
                            value={registrationId}
                            onChange={(e) => setRegistartionId(e.target.value)}
                            required
                        />
                    </div>
                    <div className='div-top'>
                        <label className='client-event'>City Name :- </label>
                        <input 
                            className='input-client-event'
                            type="text"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                        />
                    </div>
                    <div className='get-event-flow-div'>
                        <button className='get-event-flow' type="submit" disabled={loading}>
                            {loading ? "Loading..." : "Get Event Flow"}
                        </button>
                    </div>
                    
                </form>
            )}

            {/* Display flow steps if form is submitted and data is available */}
            {isSubmitted && flowSteps.length > 0 && (
                <div>
                    <h3 className='event-flow-steps-title'>Event Flow Steps</h3>
                    <ul className='event-flow-steps-flex'>
                        {flowSteps.map((step, index) => (
                            <li key={index}>
                                <p><strong>Name : </strong>{step.flowName}</p>
                              
                                <p><strong>Description : </strong>{step.flowDescription}</p>
                                <p><strong>Status : </strong>{step.flowStatus}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ClientEventFlowForm;
