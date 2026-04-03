import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  
  const [house, setHouses] = useState(() => {
  const saved = localStorage.getItem("house");
  return saved ? JSON.parse(saved) : null;
});

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
    setHouses(houseData);
    localStorage.setItem("house", JSON.stringify(houseData));
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("house");
    localStorage.removeItem("user");
    setUser(null);
    setHouses([]);
  };

  return (
    <AuthContext.Provider value={{ user, house, login, logout, joinHouse }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);