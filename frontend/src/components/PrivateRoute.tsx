import { Navigate } from "react-router-dom";
type AuthState = {
    isLoggedIn: boolean;
  };
const isAuthenticated = ():AuthState => {
  // Implement your authentication logic here (e.g., check for a token in localStorage)
  return { isLoggedIn: localStorage.getItem("token") !== null };
};
interface PrivateRouteProps {
    children: React.ReactNode;
  }
const PrivateRoute:React.FC<PrivateRouteProps> = ({ children }) => {
    const { isLoggedIn } = isAuthenticated();
    return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
