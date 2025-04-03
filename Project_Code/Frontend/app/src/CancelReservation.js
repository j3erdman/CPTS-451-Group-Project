import React, { useState, useEffect } from "react";
import { useUser } from './UserContext';

const CancelReservation = () => {
    const { user } = useUser();
    const [reservations, setReservations] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return; // Ensure user is logged in before fetching
        
        const fetchReservations = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/account_reservations/${user.UserID}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch reservations');
                }
                const data = await response.json();
                setReservations(data); // Store the reservations in state
            } catch (err) {
                setError(err.message);
            }
        };

        fetchReservations();
    }, [user]); // Runs when `user` changes

    const handleCancel = async (reservationId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/account_reservations/${reservationId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to cancel reservation");
            }

            setReservations(reservations.filter(res => res.ReservationID !== reservationId)); // Remove from UI
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div>
            <h2>My Reservations</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {reservations.map(reservation => (
                    <li key={reservation.ReservationID}>
                        {reservation.Part} - {reservation.ReservationDate} 
                        <button onClick={() => handleCancel(reservation.ReservationID)}>Cancel</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CancelReservation;
