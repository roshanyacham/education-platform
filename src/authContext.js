import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Initial login state

  const login = (userData) => {
    setIsLoggedIn(true); // Update state on successful login
    // You can store user data in local storage here for persistence
  };

  const logout = () => {
    setIsLoggedIn(false); // Update state on logout
    // You can remove user data from local storage here
  };

  const value = { isLoggedIn, login, logout };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
