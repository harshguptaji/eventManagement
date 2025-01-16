import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewTag, clearTagMessage } from '../redux/slices/tagSlice';
import { useNavigate } from 'react-router-dom';
import "../styling/AddTagForm.css"
const AddTagForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, error, loading } = useSelector((state) => state.tag);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addNewTag({ name, description }));
  };

  // Redirect to the tag list page after success
  if (message) {
    setTimeout(() => {
      dispatch(clearTagMessage());
      navigate('/dashboard/tags');  // Assuming this is the route for tag list
    }, 5000);
  }

  return (
    <div className='add-tag-container1'>
      <h2 className='add-tag-title1'>Add New Tag</h2>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className='add-tag-name1'>Tag Name :- </label>
          <input
          className='input-name-tag1'
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description" className='add-tag-description1'>Description :- </label>
          <input
          className='input-desc-tag1'
            type='text'
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className='reg-event-btn-div11'>
        <button className='reg-event-btn11' type="submit" disabled={loading}>
          {loading ? 'Adding Tag...' : 'Add Tag'}
        </button>
        </div>
      </form>
    </div>
  );
};

export default AddTagForm;
