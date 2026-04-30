import { createContext, type ReactNode, useContext, useEffect, useState } from 'react';
import type { User, UserRole } from '../types';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: (phone: string, password: string, role: UserRole) => Promise<User>;
    logout: () => void;
    register: (data: Partial<User> & { password: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'leva_so_user';

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                localStorage.removeItem(STORAGE_KEY);
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (phone: string, _password: string, role: UserRole): Promise<User> => {
        // POC: mock login — integrar com backend real depois
        await new Promise((r) => setTimeout(r, 600));

        const mockUser: User =
            role === 'driver'
                ? {
                      id: 'driver_1',
                      name: 'Marcos Ribeiro',
                      phone,
                      role: 'driver',
                      rating: 4.9,
                  }
                : {
                      id: 'passenger_1',
                      name: 'João Carlos Silva',
                      phone,
                      role: 'passenger',
                      rating: 4.9,
                  };

        setUser(mockUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockUser));
        return mockUser;
    };

    const register = async (data: Partial<User> & { password: string }): Promise<User> => {
        await new Promise((r) => setTimeout(r, 600));
        const newUser: User = {
            id: `${data.role}_${Date.now()}`,
            name: data.name || '',
            phone: data.phone || '',
            email: data.email,
            role: data.role || 'passenger',
        };
        setUser(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        return newUser;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return ctx;
}
