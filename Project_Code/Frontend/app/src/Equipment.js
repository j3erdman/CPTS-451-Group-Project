import React, { useEffect, useState } from 'react';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

const Equipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { user } = useUser();

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch('http://localhost:5000/equipment');
                if (!response.ok) {
                    throw new Error('Failed to fetch equipment data');
                }
                const data = await response.json();
                setEquipment(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, []);

    if (!user) {
        return (
            <div>
                <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
                <p>Please <Link to="/login">log in</Link> to access the system.</p>
            </div>
        );
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    // Filtered list based on search term
    const filteredEquipment = equipment.filter((item) =>
        item.Part.toLowerCase().startsWith(searchTerm.toLowerCase())
    );

    return (
        <div>
            <Link to="/home">← Back to Home</Link>
            <h1>Equipment List</h1>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '8px', marginBottom: '20px', width: '300px' }}
            />

            <ul>
                {filteredEquipment.length === 0 ? (
                    <li>No equipment matches your search.</li>
                ) : (
                    filteredEquipment.map((item) => (
                        <li key={item.EquipmentID}>
                            <h2>{item.Part}</h2>
                            <p>Status: {item.Status}</p>
                            <p>SupplierID: {item.SupplierID}</p>
                            {item.UserID !== null && <p>Reserved By: {item.UserName}</p>}
                            <Link to={`/equipment/${item.EquipmentID}`}>View Details</Link>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default Equipment;
