import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadEventUsers, clearMessages } from '../redux/slices/eventuserSlice';
import "../styling/EventUserUpload.css"

const EventUserUpload = () => {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();

    const {
        isLoading,
        successMessage,
        errorMessage,
        invalidEventNames,
        invalidRegistrationIds,
    } = useSelector((state) => state.eventuser);

    const { admin } = useSelector((state) => state.auth);
    

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            dispatch(uploadEventUsers(file));
        } else {
            alert('Please select a file to upload.');
        }
    };

    const handleClearMessages = () => {
        dispatch(clearMessages());
    };

    return (
        <div className="event-user-container">
            <h1 className='event-user-title'>Upload Event Users</h1>
            <div className='event-user-container1'>
                <input className='custom-file-input' type="file" onChange={handleFileChange} />
                {
                    admin.role === 'admin' ? (
                        <button className='upload-btn' onClick={handleUpload} disabled={isLoading}>
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                    ):(
                        <button className='upload-btn' disabled>Upload</button>
                    )
                }
                <button className='reset1-btn' onClick={handleClearMessages}>Clear Messages</button>
            </div>
            

            {successMessage && <p className="success">{successMessage}</p>}
            {errorMessage && <p className="err">{errorMessage}</p>}

            {invalidEventNames.length > 0 && (
                <div className="error-details">
                    <h3 className='event-user-error-title'>Invalid Event Names:</h3>
                    <ul>
                        {invalidEventNames.map((name, index) => (
                            <li className='event-name-error' key={index}>{name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {invalidRegistrationIds.length > 0 && (
                <div className="error-details">
                    <h3>Invalid Registration IDs:</h3>
                    <ul>
                        {invalidRegistrationIds.map((id, index) => (
                            <li key={index}>{id}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default EventUserUpload;
