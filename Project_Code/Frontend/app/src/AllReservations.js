import React, { useState, useEffect } from "react";

const Reservations = () => {
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/reservations");
                if (!response.ok) {
                    throw new Error("Failed to fetch reservations");
                }
                const data = await response.json();
                setReservations(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div>
            <h2>All Reservations</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <table border="1">
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
                    {reservations.map((res) => (
                        <tr key={res.ReservationID}>
                            <td>{res.ReservationID}</td>
                            <td>{res.ReservationDate}</td>
                            {/* Explicitly check if Status is 1 (Active) or 0 (Inactive) */}
                            <td>{res.Status == 1 ? "Active" : "Inactive"}</td>
                            <td>{res.UserName}</td>
                            <td>{res.Equipment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Reservations;
