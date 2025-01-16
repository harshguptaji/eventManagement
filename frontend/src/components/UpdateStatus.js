import React, { useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateStatus} from '../redux/slices/eventFlowSlice';


const UpdateStatus = ({flowId, eventId}) => {
    const dispatch = useDispatch();
   
    const {loading} = useSelector((state) => state.eventFlows);
    const {admin} = useSelector((state) => state.auth);
    const [flowStatus,setFlowStatus] = useState('');
    const adminName = admin.name;
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateStatus({eventId, flowId, flowStatus: flowStatus, adminName}));
        alert('Step-Flow Addedd Successfully');
    }

   

  return (
    <div>
        <h3 className='update-status-title'>Update Status</h3>
        <form onSubmit={handleSubmit}>
            <div>
                <select 
                    className='select-status'
                    type="text" 
                    value={flowStatus} 
                    onChange={(e) => setFlowStatus(e.target.value)} 
                >
                    <option value="">Select</option>
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                </select>
                <button className='update-status' type="submit"> {loading ? 'Update Status...' : 'Update Status'}</button>

            </div>
            
        </form>
    </div>
  )
}

export default UpdateStatus;