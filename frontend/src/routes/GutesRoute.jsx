import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext.jsx";

const GuestRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    const redirectPath = location.state?.from?.pathname || "/";
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default GuestRoute;
