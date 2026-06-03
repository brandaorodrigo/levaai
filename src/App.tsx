import 'antd/dist/reset.css';
import './App.scss';
import './api';
import { App as AntdApp, ConfigProvider, theme } from 'antd';
import ptBR from 'antd/es/locale/pt_BR';
import { createBrowserRouter, type RouteObject, RouterProvider } from 'react-router-dom';
import { getTipo, getToken } from './api';
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
