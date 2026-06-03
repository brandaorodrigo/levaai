import type { Cliente, Motorista, Tipo } from './types';

// sessão -------------------------------------------------------------------------------------------

const getToken = (): string | null => window.localStorage.getItem('token');
const getTipo = (): Tipo | null => window.localStorage.getItem('tipo') as Tipo | null;

const getUsuario = <T = Cliente | Motorista>(): T | null => {
    const raw = window.localStorage.getItem('usuario');
    if (!raw) {
        return null;
    }
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
};

const salvarSessao = (token: string, tipo: Tipo, usuario: unknown): void => {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('tipo', tipo);
    window.localStorage.setItem('usuario', JSON.stringify(usuario));
};

const limparSessao = (): void => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('tipo');
    window.localStorage.removeItem('usuario');
};

export { getTipo, getToken, getUsuario, limparSessao, salvarSessao };
