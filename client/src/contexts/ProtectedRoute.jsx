// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ children,allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />; // Not logged in
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />; // Role mismatch

  return children;
};

export default ProtectedRoute;
