import React, { useState, useEffect } from "react";
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';


const Account = () => {
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useUser();

    useEffect(() => {
        const fetchAccountDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/account/${user.UserID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch account data');
                }
                const data = await response.json();
                setAccountDetails(data);
            } catch (err) {
                setError(err.message);
                setAccountDetails(null); // Clear details on error
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [user]);

    if (!user) {
                return <div>
                        <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
                        <p>Please <Link to="/login">log in</Link> to access the system.</p>
                    </div>;
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <Link to="/home">← Back to Home</Link>
            <h2>My Account</h2>
            <p>
                <strong>Name:</strong> {accountDetails.Name}
            </p>
            <p>
                <strong>Email:</strong> {accountDetails.Email}
            </p>
            {user.UserType && (<p><strong>Account Type:</strong> {user.UserType}</p>)}
        </div>
    );
}

export default Account;
