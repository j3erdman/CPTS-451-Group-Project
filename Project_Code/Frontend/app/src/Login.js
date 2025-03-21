import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // IMPORTANT!! THIS FUNCTION WILL COMMUNICATE WITH OUR FLASK BACKEND. FLASK WILL RUN ON LOCALHOST 5000
    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        console.log(data);
    };

    return (
        <div>
        <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <label>Email:</label>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            </div>
            <div>
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <button type="submit">Login</button>
        </form>
        <h3>Don't have an account yet? Register!</h3>
        <button onClick={() => navigate('/register')}>Register</button>
        </div>
    );
}

export default Login;