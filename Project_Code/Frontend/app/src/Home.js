import React from 'react';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user } = useUser();

    const renderNavigation = () => {
        if (!user) {
            return <p>Please <Link to="/login">log in</Link> to access the system.</p>;
        }

        switch (user.userType) {
            case 'researcher':
                return (
                    <nav>
                        <h2>Researcher Dashboard</h2>
                        <ul>
                            <li><Link to="/account-info">View Account Information</Link></li>
                        </ul>
                    </nav>
                );
            case 'admin':
                return (
                    <nav>
                        <h2>Admin Dashboard</h2>
                        <ul>
                            <li><Link to="/account-info">View Account Information</Link></li>
                        </ul>
                    </nav>
                );
            case 'supplier':
                return (
                    <nav>
                        <h2>Supplier Dashboard</h2>
                        <ul>
                            <li><Link to="/account-info">View Account Information</Link></li>
                        </ul>
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