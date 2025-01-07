import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Access the AuthContext

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  // If the user is not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/" />;
  }

  // If the user is authenticated, render the children components (like Dashboard)
  return children;
};

export default ProtectedRoute;
