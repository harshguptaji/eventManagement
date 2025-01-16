import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { importingUploadCSV } from '../redux/slices/importingUserSlice';
import "../styling/ImportingUploadCSV.css"

const ImportingUploadCSV = () => {
    const [file, setFile] = useState(null);
    const dispatch = useDispatch();
    
    const { loading, message, success, duplicates } = useSelector(state => state.users);
    const { admin } = useSelector((state) => state.auth);
    

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = () => {
        if (file) {
            dispatch(importingUploadCSV(file));  // Dispatch the upload action
        } else {
            alert('Please select a file first.');
        }
    };

    return (
        <div className='importing-upload-container'>
            <h1 className='importing-upload-title'>Upload CSV For Users</h1>
            <div className='importing-upload-container1'>
                <input className='custom-file-input'
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                />
                {
                    admin.role === 'admin' ? (
                        <button className='upload-btn' onClick={handleUpload} disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload'}
                        </button>
                    ):(
                        <button className='upload-btn' disabled>Upload</button>
                    )
                }
            </div>
            

            {message && (
                <div style={{ marginTop: '20px' }}>
                    <h3>{message}</h3>
                    {!success && duplicates.length > 0 && (
                        <div>
                            <h4>Skipped Duplicates:</h4>
                            <ul>
                                {duplicates.map((dup, index) => (
                                    <li key={index}>{dup}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ImportingUploadCSV;
