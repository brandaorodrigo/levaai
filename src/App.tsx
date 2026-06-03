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
import { getTipo, getToken, limparSessao } from './sessao';
import Template from './Template';

// axios — regras base ------------------------------------------------------------------------------

// Config extra opcional: `silenciar` evita exibir toast de erro (ex.: 404 esperado no polling).
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
    (response) => response,
    (error) => {
        const status: number | undefined = error?.response?.status;
        // Token expirado/ausente → encerra a sessão e volta para o login.
        if (status === 401 && getToken()) {
            limparSessao();
            window.location.href = '/';
            return Promise.reject(error);
        }
        const data = error?.response?.data;
        let texto = 'Ocorreu um erro desconhecido';
        if (Array.isArray(data?.erros)) {
            // express-validator: [{ msg, path, ... }]
            texto = data.erros.map((e: { msg?: string }) => e?.msg).join('\n');
        } else if (typeof data?.erro === 'string') {
            texto = data.erro;
        } else if (typeof data?.error === 'string') {
            texto = data.error;
        }
        if (!error?.config?.silenciar) {
            message.error(texto);
        }
        return Promise.reject(error);
    },
);

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
        componentSize='middle'
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
