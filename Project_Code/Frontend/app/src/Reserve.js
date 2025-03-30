import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Reserve() {
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    // fetch the options
    useEffect(() => {
        fetch('http://localhost:5000/get_equipment')
        .then(response => response.json())
        .then(data => setOptions(data));
    }, []);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedOption){
            alert("Please select an option.");
            return;
        }

        fetch('http://localhost:5000/submit_reservation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ option: selectedOption }),
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
        <div>
            <h1>Create Reservation</h1>
            <form onSubmit={handleSubmit}>
                <select value={selectedOption} onChange={handleChange}>
                    <option value="">Select the Equipment</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Reserve;