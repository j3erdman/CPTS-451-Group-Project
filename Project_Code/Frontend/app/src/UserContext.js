// This file defines the UserContext, which provides a way to manage and share
// user authentication state across the React application.

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user information

    const login = (userData) => {
        setUser(userData); // Set user data upon login
    };

    const logout = () => {
        setUser(null); // Clear user data upon logout
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
