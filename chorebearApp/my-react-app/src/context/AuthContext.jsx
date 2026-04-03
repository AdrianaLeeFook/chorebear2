import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [house, setHouse] = useState(() => {
    const saved = localStorage.getItem("house");
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed[0] : parsed;
  });

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Clear old house so new account starts fresh
    localStorage.removeItem("house");
    setHouse(null);
  };

  const joinHouse = (houseData) => {
    const single = Array.isArray(houseData) ? houseData[0] : houseData;
    setHouse(single);
    localStorage.setItem("house", JSON.stringify(single));
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("house");
    localStorage.removeItem("user");
    setUser(null);
    setHouse(null);
  };

  return (
    <AuthContext.Provider value={{ user, house, login, logout, joinHouse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);