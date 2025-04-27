import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate()

    // IMPORTANT!! THIS FUNCTION WILL COMMUNICATE WITH OUR FLASK BACKEND. FLASK WILL RUN ON LOCALHOST 5000
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
        });
        const data = await response.json();
        console.log(data);
    };

    return (
        <div className="auth-container">
            <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
            <div className="auth-card">
                <h2>Register</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="register-name">Name:</label>
                        <input
                            id="register-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-email">Email:</label>
                        <input
                            id="register-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="register-password">Password:</label>
                        <input
                            id="register-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">Register</button>
                </form>
            </div>
            <div className="switch-auth">
                <h3>Already have an account? Login!</h3>
                <button className="switch-btn" onClick={() => navigate('/login')} type="button">Login</button>
            </div>
        </div>
    );
}

export default Register;