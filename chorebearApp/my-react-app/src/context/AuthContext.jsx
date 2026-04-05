import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [houses, setHouses] = useState(() => {
    const saved = localStorage.getItem("houses");
    return saved ? JSON.parse(saved) : [];
  });

  const [activeHouseIndex, setActiveHouseIndex] = useState(0);

  const login = (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Clear houses on new login
    setHouses([]);
    localStorage.removeItem("houses");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("houses");
    localStorage.removeItem("user");
    setUser(null);
    setHouses([]);
    setActiveHouseIndex(0);
  };

  const joinHouse = (houseData) => {
    setHouses(prev => {
      // Prevent duplicates
      const exists = prev.find(h => h._id === houseData._id);
      if (exists) return prev;
      const updated = [...prev, houseData];
      localStorage.setItem("houses", JSON.stringify(updated));
      return updated;
    });
  };

  const setActiveHouse = (house) => {
    const idx = houses.findIndex(h => h._id === house._id);
    if (idx !== -1) setActiveHouseIndex(idx);
    else {
      joinHouse(house);
      setActiveHouseIndex(houses.length);
    }
  };

  // Convenience getter for current house
  const house = houses[activeHouseIndex] || null;

  return (
    <AuthContext.Provider value={{ 
      user, houses, house, activeHouseIndex, 
      setActiveHouseIndex, login, logout, joinHouse, setActiveHouse 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);