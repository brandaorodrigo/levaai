import { Navigate, Outlet, type RouteObject } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ActiveRidePage from "./routes/driver/ActiveRidePage";
import DriverHome from "./routes/driver/DriverHome";
import InRidePage from "./routes/driver/InRidePage";
import NewRideNotification from "./routes/driver/NewRideNotification";
import RateRidePage from "./routes/driver/RateRidePage";
import Fail from "./routes/Fail";
import PassengerHome from "./routes/passenger/PassengerHome";
import PassengerRegisterStep1 from "./routes/passenger/PassengerRegisterStep1";
import PassengerRegisterStep2 from "./routes/passenger/PassengerRegisterStep2";
import RequestRidePage from "./routes/passenger/RequestRidePage";
import RideHistoryPage from "./routes/passenger/RideHistoryPage";
import TrackRidePage from "./routes/passenger/TrackRidePage";
import ProfilePage from "./routes/ProfilePage";
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
  children: [
    { path: "/login", element: <Signin /> },
    { path: "/register", element: <PassengerRegisterStep1 /> },
    { path: "/register/endereco", element: <PassengerRegisterStep2 /> },
  ],
};

routes.private = {
  errorElement: <Fail />,
  element: <AuthGuard />,
  children: [
    { index: true, element: <RoleRedirect /> },
    { path: "*", element: <RoleRedirect /> },
    { path: "/driver", element: <DriverHome /> },
    { path: "/driver/profile", element: <ProfilePage /> },
    { path: "/driver/new-ride", element: <NewRideNotification /> },
    { path: "/driver/in-ride/:rideId", element: <InRidePage /> },
    { path: "/driver/active-ride/:rideId", element: <ActiveRidePage /> },
    { path: "/driver/rate/:rideId", element: <RateRidePage /> },
    { path: "/passenger", element: <PassengerHome /> },
    { path: "/passenger/request", element: <RequestRidePage /> },
    { path: "/passenger/track/:rideId", element: <TrackRidePage /> },
    { path: "/passenger/history", element: <RideHistoryPage /> },
    { path: "/passenger/profile", element: <ProfilePage /> },
  ],
};

export default routes;
