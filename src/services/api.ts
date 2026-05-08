import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API,
});

api.interceptors.response.use((response) => {
    if (
        response.data &&
        typeof response.data === 'object' &&
        'success' in response.data &&
        'data' in response.data
    ) {
        response.data = response.data.data;
    }
    return response;
});

api.interceptors.request.use((config) => {
    try {
        const stored = localStorage.getItem('user');
        if (stored) {
            const { token } = JSON.parse(stored);
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            }
        }
    } catch {}
    delete config.headers.Authorization;
    return config;
});

// ── Types ──────────────────────────────────────────────────────────────────────

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: RemoteUser;
}

export interface RemoteUser {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    role: 'customer' | 'driver';
    rating?: number;
    profilePhoto?: string;
}

export interface CustomerProfile {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    postalCode?: string;
    address?: string;
    neighborhood?: string;
    number?: string;
    complement?: string;
    rating?: number;
    createdAt?: string;
}

export interface PickupLocation {
    id: string;
    name: string;
    address: string;
    city: string;
    type: string;
    latitude: number;
    longitude: number;
}

export interface CepData {
    cep: string;
    street: string;
    neighborhood: string;
    city: string;
    state: string;
    full_address: string;
}

export interface GeocodeData {
    latitude: number;
    longitude: number;
    formatted_address: string;
}

export type RideStatus =
    | 'aguardando_motorista'
    | 'motorista_a_caminho'
    | 'motorista_no_local'
    | 'em_andamento'
    | 'finalizada'
    | 'cancelada_cliente'
    | 'cancelada_motorista'
    | 'cancelada_sistema';

export interface ApiRide {
    id: string;
    status: RideStatus;
    origin: {
        id: string;
        name: string;
        address: string;
        city?: string;
    };
    destination_full_address: string;
    destination_neighborhood: string;
    destination_number?: string;
    estimated_value?: number;
    purchase_size?: string;
    needs_loading_help?: boolean;
    customer: {
        id: string;
        fullName: string;
        phone: string;
        rating?: number;
        createdAt?: string;
    };
    driver?: {
        id: string;
        fullName: string;
        phone: string;
        rating?: number;
        vehicle?: {
            id: string;
            brand: string;
            model: string;
            color: string;
            plate: string;
        };
    };
    created_at: string;
    completed_at?: string;
}

export interface DriverDashboard {
    general_stats: {
        totalRides?: number;
        averageRating?: number;
        acceptanceRate?: number;
    };
    today_stats: {
        rides: number;
        earnings: number;
        online_hours?: number;
    };
    week_stats: {
        rides: number;
        earnings: number;
    };
    month_stats: {
        rides: number;
        earnings: number;
    };
    active_ride?: ApiRide | null;
}

export interface DriverVehicle {
    id: string;
    brand: string;
    model: string;
    color: string;
    plate: string;
    status: string;
    active: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const get = <T>(url: string, params?: Record<string, unknown>) =>
    api.get<T>(url, { params }).then((r) => r.data);

const post = <T>(url: string, data?: unknown) => api.post<T>(url, data).then((r) => r.data);

const patch = <T>(url: string, data?: unknown) => api.patch<T>(url, data).then((r) => r.data);

// ── Auth ───────────────────────────────────────────────────────────────────────

export const authApi = {
    login: (phone: string, password: string) =>
        post<LoginResponse>('/api/auth/login', { phone, password }),

    registerCustomer: (data: {
        fullName: string;
        phone: string;
        password: string;
        postalCode: string;
        address: string;
        neighborhood: string;
        number: string;
        complement?: string;
        email?: string;
    }) => post('/api/auth/register/customer', data),

    logout: (refreshToken: string) => post('/api/auth/logout', { refreshToken }),
};

// ── Customer ───────────────────────────────────────────────────────────────────

export const customerApi = {
    me: () => get<CustomerProfile>('/api/users/customers/me'),

    update: (data: Partial<Omit<CustomerProfile, 'id' | 'rating' | 'createdAt'>>) =>
        patch<CustomerProfile>('/api/users/customers/me', data),
};

// ── Driver ─────────────────────────────────────────────────────────────────────

export const driverApi = {
    me: () => get<CustomerProfile>('/api/users/drivers/me'),

    update: (data: Partial<Omit<CustomerProfile, 'id' | 'rating' | 'createdAt'>>) =>
        patch<CustomerProfile>('/api/users/drivers/me', data),

    setStatus: (status: 'ativo' | 'inativo') => patch('/api/users/drivers/me/status', { status }),

    getVehicles: () => get<DriverVehicle[]>('/api/users/drivers/me/vehicles'),

    dashboard: () => get<DriverDashboard>('/api/api/stats/driver/dashboard'),
};

// ── Locations ──────────────────────────────────────────────────────────────────

export const locationApi = {
    lookupCep: (cep: string) => get<CepData>('/api/locations/cep', { cep }),

    getPickupLocations: () => get<PickupLocation[]>('/api/locations/pickup'),

    searchPickupLocations: (name: string) =>
        get<PickupLocation[]>('/api/locations/pickup/search', { name }),

    geocodeAddress: (address: string) =>
        get<GeocodeData>('/api/locations/geocoding/forward', { address }),

    getFrequentDestinations: () =>
        get<
            {
                id: string;
                full_address: string;
                neighborhood: string;
                latitude: number;
                longitude: number;
                favorite_name?: string;
            }[]
        >('/api/locations/destinations/frequent', { limit: 5 }),
};

// ── Rides ──────────────────────────────────────────────────────────────────────

export const ridesApi = {
    create: (data: {
        origin_id: string;
        destination_full_address: string;
        destination_postal_code: string;
        destination_neighborhood: string;
        destination_lat: number;
        destination_lng: number;
        purchase_size: string;
        estimated_weight_kg?: number;
        payment_method?: string;
        needs_loading_help?: boolean;
        customer_notes?: string;
    }) => post<ApiRide>('/api/api/rides', data),

    myRides: (params?: { status?: string; page?: number; limit?: number }) =>
        get<ApiRide[]>('/api/api/rides/my-rides', params as Record<string, unknown>),

    available: () => get<ApiRide[]>('/api/api/rides/available'),

    getById: (id: string) => get<ApiRide>(`/api/api/rides/${id}`),

    updateStatus: (id: string, status: RideStatus) =>
        patch(`/api/api/rides/${id}/status`, { status }),

    accept: (id: string, vehicle_id: string) => post(`/api/api/rides/${id}/accept`, { vehicle_id }),

    cancel: (id: string, reason?: string) => post(`/api/api/rides/${id}/cancel`, { reason }),
};

// ── Ratings ────────────────────────────────────────────────────────────────────

export const ratingsApi = {
    rateDriver: (rideId: string, data: { rating: number; comment?: string }) =>
        post(`/api/api/ratings/ride/${rideId}/driver`, data),

    rateCustomer: (rideId: string, data: { rating: number; comment?: string }) =>
        post(`/api/api/ratings/ride/${rideId}/customer`, data),
};

// ── Utils ──────────────────────────────────────────────────────────────────────

export function formatRideDate(iso: string): string {
    const date = new Date(iso);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const time = `${date.getHours().toString().padStart(2, '0')}:${date
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

    if (date.toDateString() === today.toDateString()) {
        return `Hoje, ${time}`;
    }
    if (date.toDateString() === yesterday.toDateString()) {
        return `Ontem, ${time}`;
    }
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
        .toString()
        .padStart(2, '0')}, ${time}`;
}

export function formatCurrency(value: number): string {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

export function rideStatusLabel(status: RideStatus): string {
    const map: Record<RideStatus, string> = {
        aguardando_motorista: 'Aguardando motorista',
        motorista_a_caminho: 'Motorista a caminho',
        motorista_no_local: 'Motorista no local',
        em_andamento: 'Em andamento',
        finalizada: 'Finalizada',
        cancelada_cliente: 'Cancelada',
        cancelada_motorista: 'Cancelada',
        cancelada_sistema: 'Cancelada',
    };
    return map[status] ?? status;
}
