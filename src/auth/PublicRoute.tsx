
import { Navigate, Outlet } from "react-router";
import { useAuth } from "./AuthContext";

export default function PublicRoute() {
  const { isAuthenticated, isCheckingAuth } = useAuth();

  if (isCheckingAuth) {
    return <p>در حال بررسی وضعیت ورود...</p>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
