import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addStepFlow, clearEventFlowMessage } from '../redux/slices/eventFlowSlice';
import { useParams } from 'react-router-dom';
import "../styling/AddStepFlow.css"

const AddStepFlow = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const { admin } = useSelector((state) => state.auth); // Extract adminName from auth state
    const { message, error } = useSelector((state) => state.eventFlows);
    const [flowName, setFlowName] = useState('');
    const [flowOrder, setFlowOrder] = useState('');
    const [flowDescription, setFlowDescription] = useState('');
    const [flowTag, setFlowTag] = useState('');
    const adminName = admin.name;

    useEffect(() => {
        if (message) {
            alert(message); // Display success message
            dispatch(clearEventFlowMessage());
        }
        if (error) {
            alert(`Error: ${error}`); // Display error message
            dispatch(clearEventFlowMessage());
        }
    }, [message, error, dispatch]);


    const handleSubmit = (e) => {
        e.preventDefault();

        if (!adminName) {
            alert('Admin name is missing. Please log in again.');
            return;
        }

        const formData = {
            eventId: id, // Pass the 'id' taken from URL params
            flowName,
            flowOrder,
            flowDescription,
            flowTag,
            adminName,
        };

        dispatch(addStepFlow(formData));
        alert('Step-Flow Addedd Successfully');
    };

    return (
        <div className='add-step-container'>
            <h2 className='add-step-title'>Add New Step Flow</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label className='step-name'>Flow Name :- </label>
                    <input 
                        className='input-name-step'
                        type="text" 
                        value={flowName} 
                        onChange={(e) => setFlowName(e.target.value)} 
                    />
                </div>
                <div>
                    <label className='step-order'>Flow Order :- </label>
                    <input 
                        className='input-order-step'
                        type="number" 
                        value={flowOrder} 
                        onChange={(e) => setFlowOrder(e.target.value)} 
                    />
                </div>
                <div>
                    <label className='step-description'>Flow Description :- </label>
                    <input
                        className='input-desc-step'
                        type='text'
                        value={flowDescription} 
                        onChange={(e) => setFlowDescription(e.target.value)} 
                    />
                </div>
                <div>
                    <label className='step-tag'>Flow Tag :- </label>
                    <input 
                        className='input-tag-step'
                        type="text" 
                        value={flowTag} 
                        onChange={(e) => setFlowTag(e.target.value)} 
                    />
                </div>
                <div className='reg-step-btn-div'>
                    <button type="submit" className='reg-step-btn'>Add Step Flow</button>
                </div>
            </form>
        </div>
    );
};

export default AddStepFlow;