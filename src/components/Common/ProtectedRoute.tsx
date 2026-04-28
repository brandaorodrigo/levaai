import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import type { UserRole } from "../../types";

interface Props {
  role: UserRole;
}

export default function ProtectedRoute({ role }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate replace to="/login" />;
  }
  if (user.role !== role) {
    return (
      <Navigate
        replace
        to={user.role === "driver" ? "/driver" : "/passenger"}
      />
    );
  }

  return <Outlet />;
}
