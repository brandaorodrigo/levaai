import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ActiveRidePage from "./routes/driver/ActiveRidePage";
import DriverHome from "./routes/driver/DriverHome";
import DriverProfile from "./routes/driver/DriverProfile";
import InRidePage from "./routes/driver/InRidePage";
import NewRideNotification from "./routes/driver/NewRideNotification";
import RateRidePage from "./routes/driver/RateRidePage";
import Fail from "./routes/Fail";
import PassengerHome from "./routes/passenger/PassengerHome";
import PassengerProfile from "./routes/passenger/PassengerProfile";
import RequestRidePage from "./routes/passenger/RequestRidePage";
import RideHistoryPage from "./routes/passenger/RideHistoryPage";
import TrackRidePage from "./routes/passenger/TrackRidePage";
import Signin from "./routes/Signin";

function AuthGuard() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (!user) {
    return <Navigate replace to="/login" />;
  }
  return <Outlet />;
}

function PublicRoute() {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return null;
  }
  if (user) {
    return (
      <Navigate
        replace
        to={user.role === "driver" ? "/driver" : "/passenger"}
      />
    );
  }
  return <Outlet />;
}

function RoleRedirect() {
  const { user } = useAuth();
  return (
    <Navigate replace to={user?.role === "driver" ? "/driver" : "/passenger"} />
  );
}

const routes = {
  public: {} as RouteObject,
  private: {} as RouteObject,
  login: {} as RouteObject,
};

routes.login = {
  errorElement: <Fail />,
  element: <PublicRoute />,
  children: [{ path: "/login", element: <Signin /> }],
};

routes.private = {
  errorElement: <Fail />,
  element: <AuthGuard />,
  children: [
    { index: true, element: <RoleRedirect /> },
    { path: "*", element: <RoleRedirect /> },
    { path: "/driver", element: <DriverHome /> },
    { path: "/driver/profile", element: <DriverProfile /> },
    { path: "/driver/new-ride", element: <NewRideNotification /> },
    { path: "/driver/in-ride/:rideId", element: <InRidePage /> },
    { path: "/driver/active-ride/:rideId", element: <ActiveRidePage /> },
    { path: "/driver/rate/:rideId", element: <RateRidePage /> },
    { path: "/passenger", element: <PassengerHome /> },
    { path: "/passenger/request", element: <RequestRidePage /> },
    { path: "/passenger/track/:rideId", element: <TrackRidePage /> },
    { path: "/passenger/history", element: <RideHistoryPage /> },
    { path: "/passenger/profile", element: <PassengerProfile /> },
  ],
};

export default routes;
