import React, { useState } from 'react';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

const AddEquipment = () => {
    const { user } = useUser();
    const [part, setPart] = useState('');
    const [status, setStatus] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Basic validation
        if (!part) {
            setError('Part is required.');
            return;
        }

        // Prepare data
        const data = {
            Part: part,
            Status: status,
            SupplierID: user.UserID,
            UserID: null
        };

        try {
            const response = await fetch('http://localhost:5000/api/add_equipment', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setSuccess('Equipment added successfully!');
                setPart('');
                setStatus(false);

            } else {
                const resData = await response.json();
                setError(resData.message || 'Failed to add equipment.');
            }
        } catch (err) {
            setError('Error connecting to server.');
        }
    }

    if (!user) {
        return (
            <div>
                <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
                <p>Please <Link to="/login">log in</Link> to access the system.</p>
            </div>
        );
    }

    return (
        <div className="add-equipment-container">
            <Link className="back-link" to="/home">← Back to Home</Link>
            <h2>Add Equipment</h2>
            <form className="add-equipment-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="part-input">Part:</label>
                    <input
                        id="part-input"
                        type="text"
                        value={part}
                        onChange={(e) => setPart(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="status-select">Status:</label>
                    <select
                        id="status-select"
                        value={status ? 'true' : 'false'}
                        onChange={(e) => setStatus(e.target.value === 'true')}
                    >
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                </div>
                <button className="add-btn" type="submit">Add Equipment</button>
            </form>
            {error && <div className="form-error">{error}</div>}
            {success && <div className="form-success">{success}</div>}
        </div>
    );
};

export default AddEquipment;