import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './UserContext';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Equipment from './Equipment';
import Reserve from './Reserve';

function App() {
  return (
    <UserProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="/home" element={<Home/>} />
            <Route path="/equipment" element={<Equipment/>} />
            <Route path="/reserve" element={<Reserve/>} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;
