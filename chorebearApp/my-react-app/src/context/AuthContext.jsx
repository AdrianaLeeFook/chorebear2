import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [house, setHouse] = useState(null);

  const login = (userData) => setUser(userData);
  const logout = () => {
    setUser(null);
    setHouse(null);
  };
  const joinHouse = (houseData) => setHouse(houseData);

  return (
    <AuthContext.Provider value={{ user, house, login, logout, joinHouse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);