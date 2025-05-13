import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [sensors, setSensors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRoutes, setUserRoutes] = useState([]);

  // Carrega dados do localStorage ao inicializar
  useEffect(() => {
    const loadAuthData = () => {
      try {
        const token = localStorage.getItem('token');
        const userData = JSON.parse(localStorage.getItem('user'));
        const sensorsData = JSON.parse(localStorage.getItem('sensors'));
        const userRouters = JSON.parse(localStorage.getItem('userRoutes'));
        if (token && userData) {
          setUser(userData);
          setSensors(Array.isArray(sensorsData) ? sensorsData : []);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Error loading auth data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  const login = (token, userData, sensorsData, userRoutes) => {
    // Garante que sensorsData seja um array    
    setUser(userData);
    setSensors(sensorsData);
    setUserRoutes(userRoutes);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    
    // Armazena todos os dados no localStorage
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('sensors', JSON.stringify(sensorsData));
    localStorage.setItem('userRoutes', JSON.stringify(userRoutes));
  };

  const logout = () => {
    setUser(null);
    setSensors([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sensors');
    localStorage.removeItem('userRoutes');
    delete axios.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      sensors,
      isLoading,
      userRoutes,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);