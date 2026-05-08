import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { authApi, type RemoteUser } from "../services/api";
import type { User, UserRole } from "../types";

interface RegisterData {
  name: string;
  phone: string;
  password: string;
  postalCode: string;
  address: string;
  neighborhood: string;
  number: string;
  complement?: string;
  email?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (phone: string, password: string, role: UserRole) => Promise<User>;
  logout: () => void;
  register: (data: RegisterData) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "user";

function toUser(remote: RemoteUser, token: string): User & { token: string } {
  return {
    id: remote.id,
    name: remote.fullName,
    phone: remote.phone,
    email: remote.email,
    role: remote.role === "customer" ? "passenger" : "driver",
    rating: remote.rating,
    avatar: remote.profilePhoto,
    token,
  };
}


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.token) {
          setUser(parsed);
        }
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (
    phone: string,
    password: string,
    _role: UserRole,
  ): Promise<User> => {
    const response = (await authApi.login(phone, password)) as any;
    const token: string = response?.accessToken;
    const refreshToken: string = response?.refreshToken;
    const remoteUser = response?.user;
    const mapped = { ...toUser(remoteUser, token), refreshToken };
    setUser(mapped);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapped));
    return mapped;
  };

  const register = async (data: RegisterData): Promise<User> => {
    await authApi.registerCustomer({
      fullName: data.name,
      phone: data.phone,
      password: data.password,
      postalCode: data.postalCode,
      address: data.address,
      neighborhood: data.neighborhood,
      number: data.number,
      complement: data.complement,
      email: data.email,
    });
    return login(data.phone, data.password, "passenger");
  };

  const logout = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const { refreshToken } = JSON.parse(stored);
        if (refreshToken) {
          authApi.logout(refreshToken).catch(() => {});
        }
      } catch {}
    }
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
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
