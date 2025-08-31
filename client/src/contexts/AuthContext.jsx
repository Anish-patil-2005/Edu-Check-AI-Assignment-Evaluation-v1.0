/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect ,useContext} from "react";

// Create Context
export const AuthContext = createContext();

// Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // stores {name, email, role, _id}
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Load user when token is available
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await fetch("http://localhost:8080/api/auth/me", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });

          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            logout();
          }
        } catch (err) {
          console.error("Error fetching user:", err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  // Login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () =>useContext(AuthContext);