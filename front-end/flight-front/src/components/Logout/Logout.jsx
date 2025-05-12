// src/pages/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Logout = () => {
    const navigate = useNavigate(); // Get the navigate function
const logouts= () => {
    // Remove token from localStorage
    localStorage.removeItem('token');

    // Clear user from context

    // Redirect to login page
    navigate('/', { replace: true });
};
  return (
    <div className="flex items-center justify-center h-screen text-lg text-gray-700">
        <button onClick={logouts}>LogOut</button>
    </div>
  );
};

export default Logout;
