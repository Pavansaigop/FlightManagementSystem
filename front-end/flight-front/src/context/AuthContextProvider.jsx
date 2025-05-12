// AuthContext.js
import React, {   useState } from 'react';


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // or get from localStorage/session

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
