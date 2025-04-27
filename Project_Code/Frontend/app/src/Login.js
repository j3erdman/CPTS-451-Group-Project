import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import './main.css';

function Login() {
    const { login } = useUser();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            setError("Invalid username or password. Please try again.");
            return;
        }

        const data = await response.json();

        // Update user context with current user id and type
        login({ UserID: data.UserID, UserType: data.UserType });

        console.log(data);

        navigate('/home');
    };

    return (
        <div className="auth-container">
            <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
            <div className="auth-card">
                <h2>Login</h2>
                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="login-email">Email:</label>
                        <input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="login-password">Password:</label>
                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="auth-btn">Login</button>
                </form>
            </div>
            {error && <p className="error-msg">{error}</p>}
            <div className="switch-auth">
                <h3>Don't have an account yet? Register!</h3>
                <button className="switch-btn" onClick={() => navigate('/register')} type="button">Register</button>
            </div>
        </div>
    );
}

export default Login;