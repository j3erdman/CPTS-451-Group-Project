import React, { useState, useEffect } from "react";
import { useUser } from './UserContext';
import {Link} from 'react-router-dom'

const ApproveReservations = () => {
    const [reservations, setReservations] = useState([]);
    const [selected, setSelected] = useState({});
    const { user } = useUser();

    useEffect(() => {
        fetchReservations();
    }, []);

    const fetchReservations = async () => {
        const response = await fetch('http://localhost:5000/api/approve_reservation');
        const data = await response.json();

        console.log(data);

        const reservationList = Array.isArray(data) ? data : [];
        console.log(reservationList);


        const initialSelected = {};

        reservationList.forEach((res) => {
            initialSelected[res.ReservationID] = false;
        });

        setReservations(reservationList);
        setSelected(initialSelected);
    }

    const toggleSelect = (id) => {
        setSelected(prev => ({...prev, [id]: !prev[id]}));
    };

    const handleApproveSelected = async () => {
        const toApprove = reservations.filter(r => selected[r.ReservationID] && !r.approved);

        for (const res of toApprove){
            await fetch(`http://localhost:5000/approve_reservation/${res.ReservationID}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    UserID: user.UserID
                })
            });
        }

        fetchReservations();
    };

    if (!user) {
        return <div>
                <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
                <p>Please <Link to="/login">log in</Link> to access the system.</p>
            </div>;
    }

    return (
        <div>
            <h2>Approve Reservations</h2>
            <h3>Select reservations to be approved</h3>
            {reservations.length === 0 ? (
                <p>No reservations to approve.</p>
            ): ( <>
            <ul>
                {reservations.map((res => (
                    <li key={res.ReservationID}>
                        <input type='checkbox'
                         checked={selected[res.ReservationID] || false}
                         onChange={() => toggleSelect(res.ReservationID)}/>
                         {res.UserName} - {res.Equipment} - {res.ReservationDate}
                    </li>
                )))}
            </ul>

            <button
                onClick={handleApproveSelected}
            >Approve</button>
            </>)}
        </div>
    );
}

export default ApproveReservations;