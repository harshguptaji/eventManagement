import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { updateUserById, clearUserMessage } from '../redux/slices/userSlice';

const UpdateUserForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { user = {}, loading, error, message } = useSelector((state) => state.users || {});
    const { admin } = useSelector((state) => state.auth);

    const [name, setName] = useState('');
    const [number, setNumber] = useState('');

    useEffect(() => {
        if (user._id === id) {
            setName(user.name || '');
            setNumber(user.number || '');
        }
        dispatch(clearUserMessage()); // Clear any previous messages
    }, [user, id, dispatch]);
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const updateUserData = {
            userId: id,
            name,
            number,
            adminName: admin.name
        };
    
        dispatch(updateUserById(updateUserData))
            .unwrap()
            .then(() => {
                navigate(-1); // Redirect to the previous page
            })
            .catch((error) => {
                console.error("Update failed:", error);
                // Optionally handle any additional error handling here
            });
    };

    useEffect(() => {
        if (message) {
            setTimeout(() => {
                navigate(-1); // Redirect after success
            }, 2000); // Wait for 2 seconds before redirecting
        }
    }, [message, navigate]);

    return (
        <div>
            <h2>Update User Information</h2>
            {loading && <p>Loading...</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="number">Number:</label>
                    <input
                        type="text"
                        id="number"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    Update User
                </button>
            </form>
        </div>
    );
};

export default UpdateUserForm;
