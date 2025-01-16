import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importUserData, resetImportState } from '../redux/slices/importUserSlice';
import "../styling/ImportUserComponent.css"

const ImportUserComponent = () => {
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const { loading, success, errors, message } = useSelector((state) => state.importUser);
  const { admin } = useSelector((state) => state.auth);
  

  // Handle file change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload
  const handleFileUpload = () => {
    if (!file) {
      alert('Please select a file');
      return;
    }
    dispatch(importUserData(file));
  };

  // Handle reset import state
  const handleReset = () => {
    dispatch(resetImportState());
  };

  return (
    <div className='importUser-container'>
      <h1 className='importUser-title'>Upload Event Flow</h1>
      <div className='importUser-container1'>
        <input className='custom-file-input' type="file" onChange={handleFileChange} />
        {
          admin.role === 'admin' ? (
            <button className='upload-btn' onClick={handleFileUpload} disabled={loading}>
              {loading ? 'Uploading...' : 'Upload'}
            </button>
          ):(
            <button className='upload-btn' disabled>Upload</button>
          )
        }
        <button className='reset1-btn' onClick={handleReset}>Reset</button>
      </div>
     

      {message && <div className="message">{message}</div>}

      {errors.length > 0 && (
        <div className="errors">
          <h3 className='importUserError-title'>Validation Errors:</h3>
          <ul>
            {errors.map((error, index) => (
              <li key={index} className='li-error'>
                <div className='err-1'>{error.expectedUserNumber}</div>
                <div className='err-2'>{error.message}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {success && <div className="success">File uploaded successfully!</div>}

  
    </div>
  );
};

export default ImportUserComponent;
