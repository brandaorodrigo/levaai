import { Outlet, type RouteObject } from 'react-router-dom';
import Fail from './routes/Fail';
import Signin from './routes/Signin';
import Start from './routes/Start';

const routes = {
    public: {} as RouteObject,
    private: {} as RouteObject,
    login: {} as RouteObject,
};

routes.login = {
    errorElement: <Fail />,
    element: <Outlet />,
    children: [{ element: <Signin />, path: '*' }],
};

routes.private = {
    errorElement: <Fail />,
    element: <Outlet />,
    children: [{ element: <Start />, path: '*' }],
};

export default routes;
