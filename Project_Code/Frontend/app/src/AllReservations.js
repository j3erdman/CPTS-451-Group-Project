import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [filteredReservations, setFilteredReservations] = useState([]);
    const [error, setError] = useState(null);

    // Filters
    const [equipmentFilter, setEquipmentFilter] = useState('');
    const [userFilter, setUserFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/reservations");
                if (!response.ok) {
                    throw new Error("Failed to fetch reservations");
                }
                const data = await response.json();
                setReservations(data);
                setFilteredReservations(data); // Initialize filtered with all data
            } catch (err) {
                setError(err.message);
            }
        };

        fetchReservations();
    }, []);

    // Handle filtering
    useEffect(() => {
        let filtered = reservations;

        if (equipmentFilter.trim()) {
            filtered = filtered.filter(res =>
                res.Equipment.toLowerCase().includes(equipmentFilter.toLowerCase())
            );
        }

        if (userFilter.trim()) {
            filtered = filtered.filter(res =>
                res.UserName.toLowerCase().includes(userFilter.toLowerCase())
            );
        }

        if (statusFilter) {
            const statusValue = statusFilter === 'Active' ? 1 : 0;
            filtered = filtered.filter(res => res.Status === statusValue);
        }

        setFilteredReservations(filtered);
    }, [equipmentFilter, userFilter, statusFilter, reservations]);

    return (
        <div className="usage-log-container">
            <Link className="back-link" to="/home">← Back to Home</Link>
            <h2>All Reservations</h2>
            {error && <div className="form-error">{error}</div>}

            {/* Filters */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filter by Equipment"
                    value={equipmentFilter}
                    onChange={(e) => setEquipmentFilter(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Filter by User"
                    value={userFilter}
                    onChange={(e) => setUserFilter(e.target.value)}
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">All Statuses</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>

            <div className="table-wrapper">
                <table className="usage-log-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>User</th>
                            <th>Equipment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredReservations.map((res) => (
                            <tr key={res.ReservationID}>
                                <td>{res.ReservationID}</td>
                                <td>{res.ReservationDate}</td>
                                <td>
                                    <span
                                        className={
                                            res.Status === 1
                                                ? "status-badge active"
                                                : "status-badge inactive"
                                        }
                                    >
                                        {res.Status === 1 ? "Active" : "Inactive"}
                                    </span>
                                </td>
                                <td>{res.UserName}</td>
                                <td>{res.Equipment}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Reservations;