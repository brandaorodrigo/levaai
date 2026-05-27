import 'antd/dist/reset.css';
import './App.scss';
import { ConfigProvider, message, theme } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import type { Dayjs } from 'dayjs';
import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import DriverHistory from './DriverHistory';
import DriverHome from './DriverHome';
import DriverProfile from './DriverProfile';
import Fail from './Fail';
import Login from './Login';
import PassengerHistory from './PassengerHistory';
import PassengerHome from './PassengerHome';
import PassengerProfile from './PassengerProfile';
import PassengerRide from './PassengerRide';
import Template from './Template';

// types -------------------------------------------------------------------------------------------

type AuthProps = {
    accessToken: string;
    refreshToken: string;
    user: {
        fullName: string;
        id: string;
        phone: string;
        role: 'passenger' | 'driver';
    };
};

type PassengerProfileProps = {
    address: string;
    complement: string;
    confirmPassword?: string;
    email: string;
    fullName: string;
    id: string;
    neighborhood: string;
    number: string;
    password: string;
    phone: string;
    postalCode: string;
};

type DriverProfileProps = {
    averageRating: number;
    birthDate: string | Dayjs;
    cpf: string;
    email: string;
    fullName: string;
    id: string;
    licenseCategory: string;
    licenseExpiry: string | Dayjs;
    licenseNumber: string;
    memberSince: string;
    password: string;
    phone: string;
    totalRides: number;
    vehicles: {
        brand: string;
        color: string;
        id: string;
        loadCapacityKg: number;
        manufactureYear: number;
        model: string;
        plate: string;
        vehicleType: string;
    }[];
};

type CepData = {
    cep: string;
    city: string;
    full_address: string;
    neighborhood: string;
    state: string;
    address: string;
};

type PickupData = {
    id: string;
    name: string;
    type: string;
    full_address: string;
    postal_code: string;
    neighborhood: string;
    city: string;
    state: string;
    latitude: string;
    longitude: string;
    active: boolean;
    opening_hours: {
        domingo: string;
        segunda_a_sabado: string;
    };
    created_at: string;
};

export type { AuthProps, CepData, DriverProfileProps, PassengerProfileProps, PickupData };

// providers ---------------------------------------------------------------------------------------

const STORAGE_KEY = 'auth';

const authItem = window.localStorage.getItem(STORAGE_KEY);

let auth = {} as AuthProps;

if (authItem) {
    try {
        auth = JSON.parse(authItem);
    } catch {}
}

const login = async (phone: string, password: string) => {
    try {
        const user = await axios.post<{ data: AuthProps }>('/auth/login', { phone, password });
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user.data.data));
    } catch {}
};

const logout = async () => {
    window.localStorage.removeItem(STORAGE_KEY);
};

export { auth, login, logout };

// services ----------------------------------------------------------------------------------------

axios.defaults.baseURL = import.meta.env.VITE_API;

axios.interceptors.request.use(async (config) => {
    if (auth?.accessToken) {
        config.headers.Authorization = `Bearer ${auth?.accessToken}`;
    }
    // cache
    if (config?.params?.cache || config?.url?.includes('cache=true')) {
        const cache = window.sessionStorage.getItem(`cache--${config?.url}`);
        if (cache) {
            try {
                const data = JSON.parse(cache) as unknown;
                config.adapter = () =>
                    Promise.resolve<AxiosResponse>({
                        data,
                        status: 200,
                        statusText: 'OK',
                        headers: {},
                        config: config as InternalAxiosRequestConfig,
                        request: undefined,
                    });
            } catch {}
        }
    }
    return config;
});

axios.interceptors.response.use(
    async (response) => {
        if (response.status === 202) {
            return axios(response.config);
        }
        if (response?.status === 200 && typeof response?.data !== 'object') {
            response.data = {};
        }
        // cache
        if (response?.config?.params?.cache || response?.config?.url?.includes('cache=true')) {
            window.sessionStorage.setItem(
                `cache--${response?.config?.url}`,
                JSON.stringify(response?.data),
            );
        }
        return response;
    },
    async (error) => {
        const found = error?.response?.data?.error?.message;
        const text = Array.isArray(found)
            ? found.join('\n')
            : found || 'Ocorreu um erro desconhecido';
        message.error(String(text));
        throw new Error(text);
    },
);

// routes ------------------------------------------------------------------------------------------

const routes = {
    login: {} as RouteObject,
    driver: {} as RouteObject,
    passager: {} as RouteObject,
};

routes.login = {
    errorElement: <Fail />,
    element: <Template />,
    children: [
        { path: '/cadastrar/motorista', element: <DriverProfile /> },
        { path: '/cadastrar/passageiro', element: <PassengerProfile /> },
        { path: '/*', element: <Login /> },
    ],
};

routes.driver = {
    errorElement: <Fail />,
    element: <Template />,
    children: [
        { path: '/perfil', element: <DriverProfile /> },
        { path: '/historico', element: <DriverHistory /> },
        { path: '/*', element: <DriverHome /> },
    ],
};

routes.passager = {
    errorElement: <Fail />,
    element: <Template />,
    children: [
        { path: '/corrida', element: <PassengerRide /> },
        { path: '/historico', element: <PassengerHistory /> },
        { path: '/perfil', element: <PassengerProfile /> },
        { path: '/*', element: <PassengerHome /> },
    ],
};

// utils -------------------------------------------------------------------------------------------

const mask = (value: string | number, mask: string): string => {
    if (!value) {
        return '';
    }
    const numeric = String(value).replace(/\D/g, '');
    let digit = 0;
    let output = '';
    if (!numeric.length) {
        return '';
    }
    for (let i = 0; i < mask.length; i += 1) {
        if (mask.charAt(i) === '_') {
            output += numeric.charAt(digit);
            if (!numeric.charAt(digit + 1)) {
                break;
            }
            digit += 1;
        } else {
            output += mask.charAt(i);
        }
    }
    return output;
};

const normalizePhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits.length) {
        return '';
    }
    if (digits.length <= 2) {
        return `(${digits}`;
    }
    if (digits.length <= 7) {
        return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

const normalizeCpf = (value: string): string => mask(value, '___.___.___-__');

const normalizeCep = (value: string): string => mask(value, '_____-___');

export { normalizeCep, normalizeCpf, normalizePhone };

// =================================================================================================

const App: React.FC = () => {
    const router = !auth?.accessToken
        ? routes.login
        : auth?.user?.role === 'driver'
          ? routes.driver
          : routes.passager;

    return (
        <ConfigProvider
            componentSize='middle'
            form={{
                requiredMark: 'optional',
                scrollToFirstError: true,
                validateMessages: { required: '$' + '{label} obrigatório' },
            }}
            locale={ptBR}
            theme={{ algorithm: theme.darkAlgorithm }}
        >
            <RouterProvider
                router={createBrowserRouter([router], { basename: import.meta.env.BASE_URL })}
            />
        </ConfigProvider>
    );
};

export default App;
