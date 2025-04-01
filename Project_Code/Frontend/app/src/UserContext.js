// This file defines the UserContext, which provides a way to manage and share
// user authentication state across the React application.

import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Store user information

    // Set user data upon login
    const login = (userData) => {
        setUser(userData);
    };

    // Clear user data upon logout
    const logout = () => {
        setUser(null);
    };

    // Update user data
    const updateUser = (updatedData) => {
    // Merge updates into  current user state
    setUser((prevUser) => ({ ...prevUser, ...updatedData }));
  };

    return (
        <UserContext.Provider value={{ user, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    return useContext(UserContext);
};
