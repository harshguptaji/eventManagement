// src/components/SearchUserInEvents.js
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { searchUserInEvents, resetSearch } from '../redux/slices/SearchSlice';
import { Link } from 'react-router-dom';
import "../styling/SearchingUserInEvents.css"

const SearchUserInEvents = () => {
    const [registrationId, setRegistrationId] = useState('');
    const dispatch = useDispatch();

    const { loading, error, user, events, flows } = useSelector((state) => state.search);

    // Handle search
    const handleSearch = (e) => {
        e.preventDefault();
        if (registrationId) {
            dispatch(searchUserInEvents(registrationId));
        }
    };

    // Reset search
    const handleReset = () => {
        setRegistrationId('');
        dispatch(resetSearch());
    };

    return (
        <div className='search-container'>
            <h2 className='search-title'>Search User in Events</h2>
            <form onSubmit={handleSearch} className='search-inner-container11'>
                <div className='input-wrapper'>
                    <input
                        type="text"
                        placeholder="Enter RegistrationId"
                        value={registrationId}
                        onChange={(e) => setRegistrationId(e.target.value)}
                    />
                </div>
                
                <button className='search-btn' type="submit" disabled={loading}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            <button className='reset-search-btn' onClick={handleReset}>Reset Search</button>

            </form>
            

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {user && (
                <div>
                    <div className='search-inner-container1'>
                        <ul className='search-inner-container1 flex1'>
                            <li className='search-inner-name1'>Name</li>
                            <li className='search-inner-batch1'>Batch</li>
                            <li className='search-inner-brand1'>Brand</li>
                            <li className='search-inner-events1'>Events</li>
                            <li className='search-inner-event-flow1'>Event - Flow</li>
                        </ul>
                    </div>
                    <div className='search-inner-container'>
                        <div className='search-inner-name'> <Link className='link' to={`/user/${user.userId}`}>{user.userName}</Link> </div>
                        <div className='search-inner-batch'> {user.batchName} </div>
                        <div className='search-inner-brand'> {user.userBrand} </div>
                    
                
                        <div className='search-inner-events'>
                            {events.map((event) => (
                                <span key={event.eventId}>  <Link className='link' to={`/event/${event.eventId}`}>{event.eventName}. </Link> </span>
                            
                            ))}
                        </div>
                        <div className='search-inner-event-flow'><Link className='link' to={`/eventflow/${flows.flowId}`}>{flows.flowNumber}</Link>  </div>
                    </div>
                </div>
            )}

            {!user && !loading && <p className='para-null'>No user found yet, Please search.</p>}

        </div>
    );
};

export default SearchUserInEvents;
