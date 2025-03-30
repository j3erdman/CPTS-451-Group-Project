import React, { useState, useEffect } from 'react';

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
        <div>
            <h1>Create Reservation</h1>
            <form onSubmit={handleSubmit}>
                <label>Select the Equipment:</label>
                <select value={selectedOption} onChange={handleSelectChange}>
                    <option value="">Equipment</option>
                    {options.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <label>Select a date:</label>
                <input type="date" value={selectedDate} onChange={handleDateChange}/>
                
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}

export default Reserve;