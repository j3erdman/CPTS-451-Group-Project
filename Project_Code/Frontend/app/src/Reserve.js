import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Reserve() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDate, setSelectedDate] = useState('');

    // fetch the options
    useEffect(() => {
        console.log("hello")
        fetch('http://localhost:5000/get_equipment')
        .then(response => response.json())
        .then(data => setOptions(data));
    }, []);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedOption || !selectedDate){
            alert("Please select both an option and a date");
            return;
        }

        fetch('http://localhost:5000/submit_reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ option: selectedOption,
                date: selectedDate
             }),
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.error('Error submitting the form:', error);
        alert("There was an error submitting the form.");
        });
    };

    return (
        <div className="reservation-container">
            <Link className="back-link" to="/home">← Back to Home</Link>
            <h1>Create Reservation</h1>
            <form className="reservation-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="equipment-select">Select the Equipment:</label>
                    <select id="equipment-select" value={selectedOption} onChange={handleSelectChange} required>
                        <option value="">Equipment</option>
                        {options.map((option, index) => (
                            <option key={index} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="date-input">Select a date:</label>
                    <input id="date-input" type="date" value={selectedDate} onChange={handleDateChange} required/>
                </div>
                
                <button className="reservation-btn" type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Reserve;