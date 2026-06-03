import { App, Button, Card, Descriptions, Form, Input, Modal, Result, Spin, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    clienteLocalizacao,
    motoristaCancelar,
    motoristaCorridaAtiva,
    motoristaFinalizar,
    motoristaIniciar,
} from '../api';
import Mapa from '../Mapa';
import type { Localizacao, MotoristaCorridaAtiva } from '../types';
import { moeda, rotuloSituacao, rotuloTamanho } from '../util';

const MotoristaCorrida = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [dados, setDados] = useState<MotoristaCorridaAtiva | null>(null);
    const [local, setLocal] = useState<Localizacao | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [encerrada, setEncerrada] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const [cancelando, setCancelando] = useState(false);
    const [finalizando, setFinalizando] = useState(false);
    const ativoRef = useRef(true);

    useEffect(() => {
        ativoRef.current = true;
        const tick = async () => {
            try {
                const resposta = await motoristaCorridaAtiva();
                if (!ativoRef.current) {
                    return;
                }
                setDados(resposta);
                try {
                    const lista = await clienteLocalizacao(resposta.cliente.cod_cliente);
                    if (ativoRef.current) {
                        setLocal(lista[0] ?? null);
                    }
                } catch {
                    // sem localização ainda
                }
            } catch (erro) {
                const status = (erro as { response?: { status?: number } })?.response?.status;
                if (status === 404 && ativoRef.current) {
                    ativoRef.current = false;
                    setEncerrada(true);
                }
            } finally {
                setCarregando(false);
            }
        };
        tick();
        const id = window.setInterval(() => {
            if (ativoRef.current) {
                tick();
            }
        }, 4000);
        return () => {
            ativoRef.current = false;
            window.clearInterval(id);
        };
    }, []);

    const onIniciar = () => {
        if (!dados) {
            return;
        }
        setEnviando(true);
        motoristaIniciar(dados.corrida.cod_corrida)
            .then(() => message.success('Corrida iniciada'))
            .finally(() => setEnviando(false));
    };

    const onFinalizar = (values: { nme_comentario_final_motorista?: string }) => {
        if (!dados) {
            return;
        }
        setEnviando(true);
        motoristaFinalizar(dados.corrida.cod_corrida, values.nme_comentario_final_motorista)
            .then(() => {
                message.success('Corrida finalizada');
                window.location.href = '/';
            })
            .catch(() => setEnviando(false));
    };

    const onCancelar = (values: { nme_motivo_cancelamento: string }) => {
        if (!dados) {
            return;
        }
        setEnviando(true);
        motoristaCancelar(dados.corrida.cod_corrida, values.nme_motivo_cancelamento)
            .then(() => {
                message.success('Corrida cancelada');
                window.location.href = '/';
            })
            .catch(() => setEnviando(false));
    };

    if (carregando) {
        return <Spin />;
    }

    if (encerrada) {
        return (
            <Result
                extra={
                    <Button onClick={() => navigate('/')} type='primary'>
                        Voltar ao início
                    </Button>
                }
                status='info'
                subTitle='A corrida não está mais ativa.'
                title='Corrida encerrada'
            />
        );
    }

    if (!dados) {
        return <Spin />;
    }

    const { corrida, mercado, cliente } = dados;
    const situacao = corrida.cod_situacao_corrida;

    return (
        <>
            <Card style={{ marginBottom: '16px', textAlign: 'center' }}>
                <Tag color='orange'>{rotuloSituacao[situacao]}</Tag>
                <div style={{ fontSize: '22px', marginTop: '8px' }}>
                    {moeda(corrida.vlr_corrida)}
                </div>
            </Card>

            <Card style={{ marginBottom: '16px' }} title='Corrida'>
                <Descriptions column={1} size='small'>
                    <Descriptions.Item label='Mercado'>{mercado.nme_mercado}</Descriptions.Item>
                    <Descriptions.Item label='Retirar em'>
                        {mercado.nme_rua}, {mercado.nme_numero} — {mercado.nme_bairro}
                    </Descriptions.Item>
                    <Descriptions.Item label='Entregar em'>
                        {corrida.nme_rua_destino} — {corrida.nme_bairro_destino}
                    </Descriptions.Item>
                    <Descriptions.Item label='Compra'>
                        {rotuloTamanho[corrida.cod_tamanho_compra]}
                        {corrida.qtd_sacolas !== null ? ` · ${corrida.qtd_sacolas} sacolas` : ''}
                    </Descriptions.Item>
                    <Descriptions.Item label='Cliente'>{cliente.nme_cliente}</Descriptions.Item>
                    {corrida.nme_comentario_inicial_cliente && (
                        <Descriptions.Item label='Observação'>
                            {corrida.nme_comentario_inicial_cliente}
                        </Descriptions.Item>
                    )}
                </Descriptions>
                {local && (
                    <div style={{ marginTop: '12px' }}>
                        <Mapa latitude={local.vlr_latitude} longitude={local.vlr_longitude} />
                    </div>
                )}
            </Card>

            {situacao === 'motorista_aceitou' && (
                <Button block loading={enviando} onClick={onIniciar} type='primary'>
                    Iniciar corrida
                </Button>
            )}
            {situacao === 'em_andamento' && (
                <Button block onClick={() => setFinalizando(true)} type='primary'>
                    Finalizar corrida
                </Button>
            )}
            {(situacao === 'motorista_aceitou' || situacao === 'em_andamento') && (
                <Button
                    block
                    danger
                    onClick={() => setCancelando(true)}
                    style={{ marginTop: '10px' }}
                >
                    Cancelar corrida
                </Button>
            )}

            <Modal
                footer={null}
                onCancel={() => setFinalizando(false)}
                open={finalizando}
                title='Finalizar corrida'
            >
                <Form layout='vertical' onFinish={onFinalizar}>
                    <Form.Item label='Comentário' name='nme_comentario_final_motorista'>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Button block htmlType='submit' loading={enviando} type='primary'>
                        Confirmar entrega
                    </Button>
                </Form>
            </Modal>

            <Modal
                footer={null}
                onCancel={() => setCancelando(false)}
                open={cancelando}
                title='Cancelar corrida'
            >
                <Form layout='vertical' onFinish={onCancelar}>
                    <Form.Item
                        label='Motivo'
                        name='nme_motivo_cancelamento'
                        rules={[{ required: true }]}
                    >
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Button block danger htmlType='submit' loading={enviando}>
                        Confirmar cancelamento
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default MotoristaCorrida;
