// Tipos espelhando o schema do backend (levaai-poc). Os prefixos seguem a convenção
// nme_ (texto), vlr_ (valor numérico — vem como string em campos NUMERIC), cod_ (código/uuid/enum),
// qtd_ (quantidade), flg_ (booleano), url_ e dta_ (timestamp ISO).

export type SituacaoCorrida =
    | 'cliente_solicitou'
    | 'motorista_aceitou'
    | 'em_andamento'
    | 'finalizada';

export type TamanhoCompra = 'pequena' | 'media' | 'grande';

export type SituacaoMotorista = 'offline' | 'online';

export type OrigemCancelamento = 'cliente' | 'motorista';

export type Tipo = 'cliente' | 'motorista';

export interface Cliente {
    cod_cliente: string;
    nme_telefone: string;
    nme_cliente: string;
    url_foto: string | null;
    nme_rua: string;
    nme_numero: string;
    nme_bairro: string;
    nme_cidade: string;
    nme_uf: string;
    dta_criacao?: string;
}

export interface Motorista {
    cod_motorista: string;
    nme_telefone: string;
    nme_motorista: string;
    url_foto: string | null;
    nme_placa: string;
    nme_marca_veiculo: string;
    nme_modelo_veiculo: string;
    nme_cor_veiculo: string;
    cod_situacao_motorista: SituacaoMotorista;
    dta_criacao?: string;
}

export interface Mercado {
    cod_mercado: string;
    nme_mercado: string;
    nme_rua: string;
    nme_numero: string;
    nme_bairro: string;
    nme_cidade: string;
    nme_uf: string;
    vlr_latitude: number;
    vlr_longitude: number;
}

export interface Bairro {
    cod_bairro: string;
    nme_bairro: string;
    vlr_preco: string;
}

export interface Corrida {
    cod_corrida: string;
    cod_cliente: string;
    cod_motorista: string | null;
    cod_mercado: string;
    cod_bairro: string;
    nme_rua_destino: string;
    nme_bairro_destino: string;
    vlr_latitude_destino: number | null;
    vlr_longitude_destino: number | null;
    cod_tamanho_compra: TamanhoCompra;
    qtd_sacolas: number | null;
    vlr_corrida: string;
    cod_situacao_corrida: SituacaoCorrida;
    qtd_minutos_chegada: number | null;
    flg_ativa: boolean;
    nme_comentario_inicial_motorista: string | null;
    nme_comentario_inicial_cliente: string | null;
    nme_comentario_final_motorista: string | null;
    nme_comentario_final_cliente: string | null;
    vlr_avaliacao_cliente: number | null;
    nme_motivo_cancelamento: string | null;
    cod_origem_cancelamento: OrigemCancelamento | null;
    dta_criacao: string;
    dta_aceite: string | null;
    dta_inicio: string | null;
    dta_finalizacao: string | null;
    dta_cancelamento: string | null;
}

export interface Localizacao {
    vlr_latitude: number;
    vlr_longitude: number;
    dta_ultimo_ping: string;
}

// Respostas compostas

export interface ClienteCorridaAtiva {
    corrida: Corrida;
    cliente: Cliente;
    motorista: Motorista | null;
}

export interface MotoristaCorridaAtiva {
    corrida: Corrida;
    mercado: Mercado;
    cliente: Cliente;
}

export interface CorridaSolicitada {
    corrida: Corrida;
    cliente: Cliente;
    mercado: Mercado;
}

export interface ClienteHistoricoItem {
    corrida: Corrida;
    motorista: Motorista | null;
}

export interface MotoristaHistoricoItem {
    corrida: Corrida;
    cliente: Cliente;
}
