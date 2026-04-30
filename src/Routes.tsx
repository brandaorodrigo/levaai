import { Navigate, Outlet, type RouteObject } from 'react-router-dom';
import ActiveRidePage from './routes/driver/ActiveRidePage';
import DriverHome from './routes/driver/DriverHome';
import DriverProfile from './routes/driver/DriverProfile';
import InRidePage from './routes/driver/InRidePage';
import NewRideNotification from './routes/driver/NewRideNotification';
import RateRidePage from './routes/driver/RateRidePage';
import Fail from './routes/Fail';
import Signin from './routes/Signin';

const routes = {
    public: {} as RouteObject,
    private: {} as RouteObject,
    login: {} as RouteObject,
};

routes.login = {
    errorElement: <Fail />,
    element: <Outlet />,
    children: [{ element: <Signin />, path: '/' }],
};

routes.private = {
    errorElement: <Fail />,
    element: <Outlet />,
    children: [
        { index: true, element: <Navigate replace to='/driver' /> },
        { element: <DriverHome />, path: '/driver' },
        { path: '*', element: <Navigate replace to='/driver' /> },
        { path: '/driver/profile', element: <DriverProfile /> },
        { path: '/driver/new-ride', element: <NewRideNotification /> },
        { path: '/driver/in-ride/:rideId', element: <InRidePage /> },
        { path: '/driver/active-ride/:rideId', element: <ActiveRidePage /> },
        { path: '/driver/rate/:rideId', element: <RateRidePage /> },
    ],
};

export default routes;
