import React, { useState} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { clearEventFlowMessage, updateOrder } from '../redux/slices/eventFlowSlice';


const UpdateOrder = ({stepFlowId, eventId}) => {
    const dispatch = useDispatch();
   
    const {loading} = useSelector((state) => state.eventFlows);
    const {admin} = useSelector((state) => state.auth);
    const [flowOrder,setFlowOrder] = useState('');
    const adminName = admin.name;
    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(updateOrder({eventId, stepFlowId, flowOrder: flowOrder, adminName}));
        dispatch(clearEventFlowMessage());
        alert('Update Order Successfully');
    }

   

  return (
    <div>
        <h3 className='update-status-title'>Update Order</h3>
        <form onSubmit={handleSubmit}>
            <div>
                <input 
                className='select-status1'
                    type="number" 
                    value={flowOrder} 
                    onChange={(e) => setFlowOrder(e.target.value)} 
                    placeholder='update order'
                />
                <button className='update-status' type="submit"> {loading ? 'Update Order...' : 'Update Order'}</button>
            </div>
            
        </form>
    </div>
  )
}

export default UpdateOrder;