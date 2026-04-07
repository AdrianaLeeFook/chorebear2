import React, { createContext, useContext, useState, useEffect } from "react";

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
  const [loadingAuth, setLoadingAuth] = useState(false);

  const fetchAndSetHouses = async (userId, token) => {
    try {
      const res = await fetch(`http://localhost:8080/api/memberships/user/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const memberships = await res.json();
      if (res.ok) {
        const fetchedHouses = memberships.map(m => m.house);
        setHouses(fetchedHouses);
        localStorage.setItem("houses", JSON.stringify(fetchedHouses));
      }
    } catch (err) {
      console.error("Failed to fetch houses:", err);
    }
  };

  const login = async (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setLoadingAuth(true);
    await fetchAndSetHouses(userData._id, userData.token);
    setLoadingAuth(false);
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

  // Exposed so Settings (and any other page) can update the user in context + localStorage
  const updateUser = (updatedFields) => {
    const updatedUser = { ...user, ...updatedFields };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const house = houses[activeHouseIndex] || null;

  return (
    <AuthContext.Provider value={{
      user, setUser, updateUser,
      houses, house, activeHouseIndex,
      setActiveHouseIndex, login, logout, joinHouse, setActiveHouse, loadingAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
