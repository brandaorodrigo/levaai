import 'antd/dist/reset.css';
import './App.scss';
import { ConfigProvider, message, theme } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
import axios, { type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import ClienteEntrar from './ClienteEntrar';
import Erro from './Erro';
import Template from './Template';

// tokens -------------------------------------------------------------------------------------------

const token = window.localStorage.getItem('token');
const tipo = window.localStorage.getItem('tipo');

export type { tipo, token };

// axios -------------------------------------------------------------------------------------------

axios.defaults.baseURL = import.meta.env.VITE_API;

axios.interceptors.request.use(async (config) => {
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
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

// utilitario --------------------------------------------------------------------------------------

const mascara = (value: string | number, mask: string): string => {
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

const telefone = (value: string) => {
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

export { mascara, telefone };

// rotas -------------------------------------------------------------------------------------------

const publico = [
    { path: '/cadastrar', element: <ClienteCadastrar /> },
    { path: '/*', element: <ClienteEntrar /> },
    { path: '/motorista/cadastrar', element: <MotoristaCadastrar /> },
    { path: '/motorista/*', element: <MotoristaEntrar /> },
] as RouteObject[];

const cliente = [
    { path: '/atualizar', element: <ClienteAtualizar /> },
    { path: '/historico', element: <ClienteHistorico /> },
    { path: '/corrida', element: <ClienteCorrida /> },
    { path: '/*', element: <ClienteInicio /> },
] as RouteObject[];

const motorista = [
    { path: '/motorista/atualizar', element: <MotoristaAtualizar /> },
    { path: '/motorista/historico', element: <MotoristaHistorico /> },
    { path: '/motorista/corrida', element: <MotoristaCorrida /> },
    { path: '/motorista/*', element: <MotoristaInicio /> },
] as RouteObject[];

const rotas = {
    errorElement: <Erro />,
    element: <Template />,
    children: token ? (tipo === 'cliente' ? cliente : motorista) : publico,
};

// =================================================================================================

const App: React.FC = () => (
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
            router={createBrowserRouter([rotas], { basename: import.meta.env.BASE_URL })}
        />
    </ConfigProvider>
);

export default App;
