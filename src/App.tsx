import 'antd/dist/reset.css';
import './App.scss';
import { App as AntdApp, ConfigProvider, message, theme } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
import axios from 'axios';
import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import Erro from './Erro';
import ClienteAtualizar from './paginas/ClienteAtualizar';
import ClienteCadastrar from './paginas/ClienteCadastrar';
import ClienteCorrida from './paginas/ClienteCorrida';
import ClienteEntrar from './paginas/ClienteEntrar';
import ClienteHistorico from './paginas/ClienteHistorico';
import ClienteInicio from './paginas/ClienteInicio';
import MotoristaAtualizar from './paginas/MotoristaAtualizar';
import MotoristaCadastrar from './paginas/MotoristaCadastrar';
import MotoristaCorrida from './paginas/MotoristaCorrida';
import MotoristaEntrar from './paginas/MotoristaEntrar';
import MotoristaHistorico from './paginas/MotoristaHistorico';
import MotoristaInicio from './paginas/MotoristaInicio';
import Template from './Template';
import type { SituacaoCorrida, TamanhoCompra, Tipo } from './types';

// sessão -----------------------------------------------------------------------------------------

const getToken = (): string | null => window.localStorage.getItem('token');
const getTipo = (): Tipo | null => window.localStorage.getItem('tipo') as Tipo | null;

const salvarSessao = (token: string, tipo: Tipo): void => {
    window.localStorage.setItem('token', token);
    window.localStorage.setItem('tipo', tipo);
};

const limparSessao = (): void => {
    window.localStorage.removeItem('token');
    window.localStorage.removeItem('tipo');
};

export { getTipo, getToken, limparSessao, salvarSessao };

// axios -------------------------------------------------------------------------------------------
declare module 'axios' {
    interface AxiosRequestConfig {
        silenciar?: boolean;
    }
}

axios.defaults.baseURL = import.meta.env.VITE_API;

axios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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
        return response;
    },
    (error) => {
        const status: number | undefined = error?.response?.status;
        if ((status === 401 || status === 403) && getToken()) {
            limparSessao();
            window.location.href = '/';
            return Promise.reject(error);
        }
        const data = error?.response?.data;
        const texto = typeof data?.error === 'string' ? data.error : 'Ocorreu um erro desconhecido';
        if (!error?.config?.silenciar) {
            message.error(texto);
        }
        return Promise.reject(error);
    },
);

// util --------------------------------------------------------------------------------------------

const telefone = (value: string): string => {
    const digits = String(value || '')
        .replace(/\D/g, '')
        .slice(0, 11);
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

const numerico = (value: string): string => String(value || '').replace(/\D/g, '');

const moeda = (value: string | number | null | undefined): string => {
    const numero = Number(value ?? 0);
    return numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

type Coordenada = { lat: number; lon: number };

const distancia = (a: Coordenada, b: Coordenada): number => {
    const R = 6371000; // raio da Terra em metros
    const rad = Math.PI / 180;
    const dLat = (b.lat - a.lat) * rad;
    const dLon = (b.lon - a.lon) * rad;
    const s =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
};

export { type Coordenada, distancia, moeda, numerico, telefone };

// textos ------------------------------------------------------------------------------------------

const textoTamanho: Record<TamanhoCompra, string> = {
    pequena: 'Pequena',
    media: 'Média',
    grande: 'Grande',
};

const textoSituacao: Record<SituacaoCorrida, string> = {
    cliente_solicitou: 'Procurando motorista',
    motorista_aceitou: 'Motorista a caminho',
    em_andamento: 'Corrida em andamento',
    finalizada: 'Finalizada',
};

export { textoSituacao, textoTamanho };

// rotas --------------------------------------------------------------------------------------------

const publico: RouteObject[] = [
    { path: '/cadastrar', element: <ClienteCadastrar /> },
    { path: '/motorista/cadastrar', element: <MotoristaCadastrar /> },
    { path: '/motorista/*', element: <MotoristaEntrar /> },
    { path: '/*', element: <ClienteEntrar /> },
];

const cliente: RouteObject[] = [
    { path: '/atualizar', element: <ClienteAtualizar /> },
    { path: '/historico', element: <ClienteHistorico /> },
    { path: '/corrida', element: <ClienteCorrida /> },
    { path: '/*', element: <ClienteInicio /> },
];

const motorista: RouteObject[] = [
    { path: '/atualizar', element: <MotoristaAtualizar /> },
    { path: '/historico', element: <MotoristaHistorico /> },
    { path: '/corrida', element: <MotoristaCorrida /> },
    { path: '/*', element: <MotoristaInicio /> },
];

const autenticado = getTipo() === 'cliente' ? cliente : motorista;

const rotas: RouteObject = {
    errorElement: <Erro />,
    element: <Template />,
    children: getToken() ? autenticado : publico,
};

// =================================================================================================

const App: React.FC = () => (
    <ConfigProvider
        componentSize='large'
        form={{
            requiredMark: 'optional',
            scrollToFirstError: true,
            validateMessages: { required: '$' + '{label} obrigatório' },
        }}
        locale={ptBR}
        theme={{ algorithm: theme.darkAlgorithm }}
    >
        <AntdApp>
            <RouterProvider
                router={createBrowserRouter([rotas], { basename: import.meta.env.BASE_URL })}
            />
        </AntdApp>
    </ConfigProvider>
);

export default App;
