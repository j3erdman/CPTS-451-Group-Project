import React, { useState, useEffect } from "react";
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

const Account = () => {
    const [accountDetails, setAccountDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({ Name: '', Email: '' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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
                setFormData({ Name: data.Name, Email: data.Email, Password:data.Password });
            } catch (err) {
                setError(err.message);
                setAccountDetails(null); // Clear details on error
            } finally {
                setLoading(false);
            }
        };

        fetchAccountDetails();
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/account/${user.UserID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                throw new Error('Failed to update account data');
            }

            setAccountDetails(formData); // Update local state
            setEditMode(false); // Exit edit mode
        } catch (err) {
            setError(err.message);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    if (!user) {
        return (
            <div>
                <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
                <p>Please <Link to="/login">log in</Link> to access the system.</p>
            </div>
        );
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
            {editMode ? (
                <div>
                    <label>
                        <strong>Name:</strong>
                        <input
                            type="text"
                            name="Name"
                            value={formData.Name}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        <strong>Email:</strong>
                        <input
                            type="email"
                            name="Email"
                            value={formData.Email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        <strong>Password:</strong>
                        <input
                            type="text"
                            name="Password"
                            value={formData.Password}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditMode(false)}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>
                        <strong>Name:</strong> {accountDetails.Name}
                    </p>
                    <p>
                        <strong>Email:</strong> {accountDetails.Email}
                    </p>
                    <div>
                        <strong>Password:</strong>{" "}
                        <span>
                            {isPasswordVisible ? accountDetails.Password : "•".repeat(accountDetails.Password.length)}
                        </span>{" "}
                        <button onClick={togglePasswordVisibility} style={{ marginLeft: "10px" }}>
                            {isPasswordVisible ? "Hide" : "Show"}
                        </button>
                    </div>
                    {user.UserType && (
                        <p>
                            <strong>Account Type:</strong> {user.UserType}
                        </p>
                    )}
                    <button onClick={() => setEditMode(true)}>Edit</button>
                </div>
            )}
        </div>
    );
};

export default Account;
