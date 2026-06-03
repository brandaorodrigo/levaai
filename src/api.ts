import { message } from 'antd';
import axios, { type AxiosRequestConfig } from 'axios';
import type {
    Bairro,
    Cliente,
    ClienteCorridaAtiva,
    ClienteHistoricoItem,
    CorridaSolicitada,
    Localizacao,
    Mercado,
    Motorista,
    MotoristaCorridaAtiva,
    MotoristaHistoricoItem,
    SituacaoMotorista,
    TamanhoCompra,
    Tipo,
} from './types';

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

// axios --------------------------------------------------------------------------------------------

// Config extra opcional: `silenciar` evita exibir toast de erro (ex.: 404 esperado no polling).
interface Config extends AxiosRequestConfig {
    silenciar?: boolean;
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
        if (!(error?.config as Config)?.silenciar) {
            message.error(texto);
        }
        return Promise.reject(error);
    },
);

// helpers de chamada
const get = <T>(url: string, config?: Config) => axios.get<T>(url, config).then((r) => r.data);
const post = <T>(url: string, body?: unknown, config?: Config) =>
    axios.post<T>(url, body, config).then((r) => r.data);
const put = <T>(url: string, body?: unknown, config?: Config) =>
    axios.put<T>(url, body, config).then((r) => r.data);

// endpoints — cliente ------------------------------------------------------------------------------

export const clienteCadastrar = (body: Record<string, unknown>) =>
    post('/api/cliente/cadastrar', body);

export const clienteEntrar = (nme_telefone: string, nme_senha: string) =>
    post<{ token: string; cliente: Cliente }>('/api/cliente/entrar', { nme_telefone, nme_senha });

export const clienteObter = () => get<Cliente>('/api/cliente');

export const clienteAtualizar = (body: Record<string, unknown>) =>
    put('/api/cliente/atualizar', body);

export const clienteEnviarLocalizacao = (vlr_latitude_atual: number, vlr_longitude_atual: number) =>
    put(
        '/api/cliente/localizacao',
        { vlr_latitude_atual, vlr_longitude_atual },
        { silenciar: true },
    );

export const clienteLocalizacao = (cod_cliente: string) =>
    get<Localizacao[]>(`/api/cliente/localizacao/${cod_cliente}`, { silenciar: true });

// endpoints — cliente / corrida

export const clienteSolicitar = (body: {
    cod_mercado: string;
    nme_rua: string;
    nme_numero: string;
    nme_bairro: string;
    nme_cidade: string;
    nme_uf: string;
    cod_tamanho_compra: TamanhoCompra;
    qtd_sacolas?: number | null;
    nme_comentario_inicial_cliente?: string | null;
}) => post('/api/cliente/corrida/solicitar', body);

export const clienteCorridaAtiva = () =>
    get<ClienteCorridaAtiva>('/api/cliente/corrida/ativa', { silenciar: true });

export const clienteCancelar = (cod_corrida: string, nme_motivo_cancelamento: string) =>
    post('/api/cliente/corrida/cancelar', { cod_corrida, nme_motivo_cancelamento });

export const clienteAvaliar = (
    cod_corrida: string,
    vlr_avaliacao_cliente: number,
    nme_comentario_final_cliente?: string | null,
) =>
    post('/api/cliente/corrida/avaliar', {
        cod_corrida,
        vlr_avaliacao_cliente,
        nme_comentario_final_cliente,
    });

export const clienteHistorico = (limite = 20, deslocamento = 0) =>
    get<ClienteHistoricoItem[]>('/api/cliente/corrida/historico', {
        params: { limite, deslocamento },
    });

// endpoints — motorista ----------------------------------------------------------------------------

export const motoristaCadastrar = (body: Record<string, unknown>) =>
    post('/api/motorista/cadastrar', body);

export const motoristaEntrar = (nme_telefone: string, nme_senha: string) =>
    post<{ token: string; motorista: Motorista }>('/api/motorista/entrar', {
        nme_telefone,
        nme_senha,
    });

export const motoristaObter = () => get<Motorista>('/api/motorista');

export const motoristaAtualizar = (body: Record<string, unknown>) =>
    put('/api/motorista/atualizar', body);

export const motoristaSituacao = (cod_situacao_motorista: SituacaoMotorista) =>
    put('/api/motorista/situacao', { cod_situacao_motorista });

export const motoristaEnviarLocalizacao = (
    vlr_latitude_atual: number,
    vlr_longitude_atual: number,
) =>
    put(
        '/api/motorista/localizacao',
        { vlr_latitude_atual, vlr_longitude_atual },
        { silenciar: true },
    );

export const motoristaLocalizacao = (cod_motorista: string) =>
    get<Localizacao[]>(`/api/motorista/localizacao/${cod_motorista}`, { silenciar: true });

// endpoints — motorista / corrida

export const motoristaSolicitadas = () =>
    get<CorridaSolicitada[]>('/api/motorista/corrida/solicitada');

export const motoristaAceitar = (
    cod_corrida: string,
    qtd_minutos_chegada: number,
    nme_comentario_inicial_motorista?: string | null,
) =>
    post('/api/motorista/corrida/aceitar', {
        cod_corrida,
        qtd_minutos_chegada,
        nme_comentario_inicial_motorista,
    });

export const motoristaCorridaAtiva = () =>
    get<MotoristaCorridaAtiva>('/api/motorista/corrida/ativa', { silenciar: true });

export const motoristaIniciar = (cod_corrida: string) =>
    post('/api/motorista/corrida/iniciar', { cod_corrida });

export const motoristaFinalizar = (
    cod_corrida: string,
    nme_comentario_final_motorista?: string | null,
) => post('/api/motorista/corrida/finalizar', { cod_corrida, nme_comentario_final_motorista });

export const motoristaCancelar = (cod_corrida: string, nme_motivo_cancelamento: string) =>
    post('/api/motorista/corrida/cancelar', { cod_corrida, nme_motivo_cancelamento });

export const motoristaHistorico = (limite = 20, deslocamento = 0) =>
    get<MotoristaHistoricoItem[]>('/api/motorista/corrida/historico', {
        params: { limite, deslocamento },
    });

// endpoints — comuns -------------------------------------------------------------------------------

export const listarMercados = () => get<Mercado[]>('/api/mercado');

export const listarBairros = (cod_mercado: string) => get<Bairro[]>(`/api/bairro/${cod_mercado}`);

// Bairros aceitos pelo sistema (distintos). Público — usado no cadastro, antes do login.
export const listarBairrosAceitos = () => get<{ nme_bairro: string }[]>('/api/bairro');
