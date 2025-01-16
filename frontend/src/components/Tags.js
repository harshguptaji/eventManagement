import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTagById,fetchAllTags } from '../redux/slices/tagSlice';
import { Link } from 'react-router-dom';
import "../styling/Tags.css"


const Tags = () => {

  const dispatch = useDispatch();
  const { tags, loading, error, message } = useSelector((state) => state.tag);
  const { admin } = useSelector((state) => state.auth);
  

  // Fetch all tags on component mount
  useEffect(() => {
    dispatch(fetchAllTags());
  }, [dispatch]);

  const handleDeleteTag = (tagId) => {
    if (window.confirm("Are you sure you want to delete this Tag?")) {
    dispatch(deleteTagById(tagId));
    }
};

return (
    <div className='tags-container'>
      <h2 className='tags-title'>All Tags</h2>
      
      {loading && <p>Loading tags...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {message && <p style={{ color: 'green' }}>{message}</p>}
      <div>
        <Link to="/tag/register">
          <button className='add-tag-btn'>Add New Tag</button>
        </Link>
      </div>

      <div>
        <ul className='tag-inner-container1 flex1'>
          <li className='tag-inner-name1'>Tag Name</li>
          <li className='tag-inner-description1'>Tag Description</li>
          <li className='tag-inner-btn-div1'>Delete</li>
        </ul>
      </div>

      <ul className='tag-inner-container'>
        {tags && tags.length > 0 ? (
          tags.map((tag) => (
            <li key={tag._id}>
              <div className='tag-inner-name'>{tag.name}</div> 
              <div className='tag-inner-description'>{tag.description}</div>   
              <div className='tag-inner-btn-div'>
              {
                  admin.role === 'admin' ? (
                    <button className='tag-del-btn' onClick={() => handleDeleteTag(tag._id)}>Delete</button>

                  ):(
                    <button className='tag-del-btn' disabled>Delete</button>
                  )
                }

              </div>
            </li>
          ))
        ) : (
          <p>No tags available.</p>
        )}
      </ul>
    </div>
  );
};

export default Tags;