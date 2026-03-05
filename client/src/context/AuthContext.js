/**
 * AUTH CONTEXT
 * ============================================================
 * Global state management for authentication.
 * Wraps the entire app so any component can access:
 *   - user: the logged-in user object (or null)
 *   - loading: true while fetching user on app load
 *   - logout(): clears token and redirects to /login
 * ============================================================
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load, check if a JWT exists and validate it
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL || ""}/api/auth/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch {
      // Token invalid or expired — clean up
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  // Called by AuthSuccess page after OAuth redirect
  const loginWithToken = (token) => {
    localStorage.setItem("token", token);
    fetchUser(token);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => useContext(AuthContext);
