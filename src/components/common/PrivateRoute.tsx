import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import type { RootState } from "../../store/store";

export default function PrivateRoute() {
  const isAuth = useSelector((s: RootState) => s.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuth) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
