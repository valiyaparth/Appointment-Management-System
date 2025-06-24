import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiReq from "@/lib/apiReq";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserDetails = async (userId) => {
    try {
      const response = await apiReq.get(
        `/applicationuser/getuserbyid/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user details:", error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);

          // Check if token is expired
          if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            logout();
            return;
          }

          const basicUserInfo = {
            id: decoded[ClaimTypes.NameIdentifier] || null,
            email: decoded[ClaimTypes.Email] || null,
            name: decoded[ClaimTypes.Name] || null,
            role: decoded[ClaimTypes.Role] || null,
            hospitalId: decoded.HospitalId || null,
          };

          // Fetch additional user details from API
          const userDetails = await fetchUserDetails(basicUserInfo.id);

          // Combine basic info with additional details
          setUser({
            ...basicUserInfo,
            ...userDetails,
          });

          setToken(storedToken);
        } catch (error) {
          console.error("Failed to initialize auth:", error);
          logout();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const handleLogin = async (jwtToken, redirectPath = "/") => {
    try {
      const decoded = jwtDecode(jwtToken);

      const basicUserInfo = {
        id: decoded[ClaimTypes.NameIdentifier] || null,
        email: decoded[ClaimTypes.Email] || null,
        name: decoded[ClaimTypes.Name] || null,
        role: decoded[ClaimTypes.Role] || null,
        hospitalId: decoded.HospitalId || null,
      };

      const userDetails = await fetchUserDetails(basicUserInfo.id);

      setUser({
        ...basicUserInfo,
        ...userDetails,
      });

      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
      navigate(redirectPath); // Use the redirectPath here
    } catch (error) {
      console.error("Failed to handle login:", error);
      toast.error(error.message);
      logout();
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider
      value={{ user, token, login: handleLogin, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Claim types constants to match your backend
const ClaimTypes = {
  NameIdentifier:
    "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
  Email: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
  Name: "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
  Role: "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
};
