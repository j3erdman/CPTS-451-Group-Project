import React from 'react';
import { useUser } from './UserContext';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
    const { user, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Log user out from user context and redirect to login page
        logout();
        navigate('/login');
    };

    const renderNavigation = () => {
        if (!user) {
            return <p>Please <Link to="/login">log in</Link> to access the system.</p>;
        }

        switch (user.UserType) {
            case 'User':
                return (
                    <nav>
                        <h2>User Dashboard</h2>
                        <ul>
                            <li><Link to="/account-info">Account Information</Link></li>
                            <li><Link to="/equipment">View Equipment</Link></li>
                            <li><Link to="/reserve">Create a Reservation</Link></li>
                            <li><Link to="/cancel-reservation">Cancel Reservation</Link></li>
                        </ul>
                        <button onClick={handleLogout}>Logout</button>
                    </nav>
                );
            case 'Admin':
                return (
                    <nav>
                        <h2>Admin Dashboard</h2>
                        <ul>
                            <li><Link to="/account-info">Account Information</Link></li>
                            <li><Link to="/equipment">View Equipment</Link></li>
                            <li><Link to="/all-reservations">View All Reservations (Usage Log)</Link></li>
                        </ul>
                        <button onClick={handleLogout}>Logout</button>
                    </nav>
                );
            case 'Supplier':
                return (
                    <nav>
                        <h2>Supplier Dashboard</h2>
                        <ul>
                            <li><Link to="/account-info">Account Information</Link></li>
                            <li><Link to="/equipment">View Equipment</Link></li>
                            <li><Link to="/add-equipment">Add Equipment</Link></li>
                        </ul>
                        <button onClick={handleLogout}>Logout</button>
                    </nav>
                );
            default:
                return <p>Unknown user type.</p>;
        }
    };

    return (
        <div>
            <h1>Welcome to the WSU Research Lab Equipment Booking System!</h1>
            {renderNavigation()}
        </div>
    );
};

export default Home;