import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [houses, setHouses] = useState([]);
  const [activeHouseIndex, setActiveHouseIndex] = useState(0);

  // Rehydrate on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchHouses(parsedUser._id, token);
    }
  }, []);

  const fetchHouses = async (userId, token) => {
    try {
      const res = await fetch(`http://localhost:8080/api/memberships/user/${userId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const memberships = await res.json();
      if (res.ok) {
        setHouses(memberships.map(m => m.house));
      }
    } catch (err) {
      console.error("Failed to fetch houses:", err);
    }
  };

  const login = async (userData) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    await fetchHouses(userData._id, userData.token);
  };

  const joinHouse = (houseData) => {
    setHouses(prev => [...prev, houseData]);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setHouses([]);
    setActiveHouseIndex(0);
  };

  return (
    <AuthContext.Provider value={{ user, houses, activeHouseIndex, setActiveHouseIndex, login, logout, joinHouse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);