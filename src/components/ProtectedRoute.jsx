import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const { user, expirationDate } = useAuth();
  const currDate = new Date;
  if (!user || !expirationDate ) {
    // user is not authenticated
    return <Navigate to="/" />;
  } else if (currDate.toISOString() >= expirationDate) {
    //user's session has expired so return to login page
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;