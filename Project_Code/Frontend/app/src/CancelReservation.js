import React, { useState, useEffect } from "react";
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

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

                // Filter out inactive reservations (status = false)
                const activeReservations = data.filter(reservation => reservation.Status === true);
                setReservations(activeReservations); // Store only active reservations in state
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

            // Remove canceled reservation from UI (filter out from state)
            setReservations(reservations.filter(res => res.ReservationID !== reservationId)); 
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="cancel-reservations-container">
            <Link className="back-link" to="/home">← Back to Home</Link>
            <h2>My Reservations</h2>
            {error && <p className="form-error">{error}</p>}
            {reservations.length === 0 ? (
                <div className="no-reservations">No active reservations available.</div>
            ) : (
                <ul className="reservations-list">
                {reservations.map((reservation) => (
                    <li className="reservation-card" key={reservation.ReservationID}>
                    <div>
                        <span className="reservation-part">{reservation.Part}</span>
                        <span className="reservation-date">
                            {reservation.ReservationDate}
                        </span>
                    </div>
                    <button
                        className="cancel-btn"
                        onClick={() => handleCancel(reservation.ReservationID)}
                        >
                        Cancel
                    </button>
                    </li>
                ))}
                </ul>
            )}
        </div>
    );
}

export default CancelReservation;
