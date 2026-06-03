import { App, Button, Card, Descriptions, Form, Input, Modal, Rate, Result, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moeda, textoSituacao } from '@/App';
import Carregando from '@/components/Carregando';
import Mapa from '@/components/Mapa';
import type { ClienteCorridaAtiva, ClienteHistoricoItem, Corrida, Localizacao } from '@/types';

const ClienteCorrida = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [dados, setDados] = useState<ClienteCorridaAtiva | null>(null);
    const [local, setLocal] = useState<Localizacao | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [encerrada, setEncerrada] = useState(false);
    const [avaliar, setAvaliar] = useState<Corrida | null>(null);
    const [cancelando, setCancelando] = useState(false);
    const [enviando, setEnviando] = useState(false);
    const ativoRef = useRef(true);

    useEffect(() => {
        ativoRef.current = true;

        const aoEncerrar = async () => {
            setEncerrada(true);
            try {
                const { data: historico } = await axios.get<ClienteHistoricoItem[]>(
                    '/api/cliente/corrida/historico',
                    { params: { limite: 1, deslocamento: 0 } },
                );
                const ultima = historico[0]?.corrida;
                if (
                    ultima &&
                    ultima.cod_situacao_corrida === 'finalizada' &&
                    ultima.vlr_avaliacao_cliente === null
                ) {
                    setAvaliar(ultima);
                }
            } catch {
                // mantém apenas o aviso de encerrada
            }
        };

        const tick = async () => {
            try {
                const { data: resposta } = await axios.get<ClienteCorridaAtiva>(
                    '/api/cliente/corrida/ativa',
                    { silenciar: true },
                );
                if (!ativoRef.current) {
                    return;
                }
                setDados(resposta);
                if (resposta.motorista) {
                    try {
                        const { data: lista } = await axios.get<Localizacao[]>(
                            `/api/motorista/localizacao/${resposta.motorista.cod_motorista}`,
                            { silenciar: true },
                        );
                        if (ativoRef.current) {
                            setLocal(lista[0] ?? null);
                        }
                    } catch {
                        // sem localização ainda
                    }
                }
            } catch (erro) {
                const status = (erro as { response?: { status?: number } })?.response?.status;
                if (status === 404 && ativoRef.current) {
                    ativoRef.current = false;
                    await aoEncerrar();
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

    const onCancelar = (values: { nme_motivo_cancelamento: string }) => {
        if (!dados) {
            return;
        }
        setEnviando(true);
        axios
            .post('/api/cliente/corrida/cancelar', {
                cod_corrida: dados.corrida.cod_corrida,
                nme_motivo_cancelamento: values.nme_motivo_cancelamento,
            })
            .then(() => {
                message.success('Corrida cancelada');
                window.location.href = '/';
            })
            .catch(() => setEnviando(false));
    };

    const onAvaliar = (values: {
        vlr_avaliacao_cliente: number;
        nme_comentario_final_cliente?: string;
    }) => {
        if (!avaliar) {
            return;
        }
        if (!values.vlr_avaliacao_cliente) {
            message.error('Escolha uma nota');
            return;
        }
        setEnviando(true);
        axios
            .post('/api/cliente/corrida/avaliar', {
                cod_corrida: avaliar.cod_corrida,
                vlr_avaliacao_cliente: values.vlr_avaliacao_cliente,
                nme_comentario_final_cliente: values.nme_comentario_final_cliente,
            })
            .then(() => {
                message.success('Obrigado pela avaliação!');
                navigate('/');
            })
            .catch(() => setEnviando(false));
    };

    if (carregando) {
        return <Carregando />;
    }

    if (encerrada) {
        if (avaliar) {
            return (
                <>
                    <Result
                        status='success'
                        subTitle='Como foi sua corrida?'
                        title='Entrega concluída'
                    />
                    <Form layout='vertical' onFinish={onAvaliar}>
                        <Form.Item
                            label='Nota'
                            name='vlr_avaliacao_cliente'
                            style={{ textAlign: 'center' }}
                        >
                            <Rate />
                        </Form.Item>
                        <Form.Item label='Comentário' name='nme_comentario_final_cliente'>
                            <Input.TextArea rows={2} />
                        </Form.Item>
                        <Button block htmlType='submit' loading={enviando} type='primary'>
                            Enviar avaliação
                        </Button>
                    </Form>
                </>
            );
        }
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
        return <Carregando />;
    }

    const { corrida, motorista } = dados;
    const podeCancelar =
        corrida.cod_situacao_corrida === 'cliente_solicitou' ||
        corrida.cod_situacao_corrida === 'motorista_aceitou';

    return (
        <>
            <Card style={{ marginBottom: '16px', textAlign: 'center' }}>
                <Tag color='orange'>{textoSituacao[corrida.cod_situacao_corrida]}</Tag>
                <div style={{ fontSize: '22px', marginTop: '8px' }}>
                    {moeda(corrida.vlr_corrida)}
                </div>
                {corrida.cod_situacao_corrida === 'cliente_solicitou' && (
                    <div style={{ marginTop: '8px', opacity: 0.7 }}>Procurando um motorista…</div>
                )}
            </Card>

            {motorista && (
                <Card style={{ marginBottom: '16px' }} title='Seu motorista'>
                    <Descriptions column={1} size='small'>
                        <Descriptions.Item label='Nome'>
                            {motorista.nme_motorista}
                        </Descriptions.Item>
                        <Descriptions.Item label='Veículo'>
                            {motorista.nme_marca_veiculo} {motorista.nme_modelo_veiculo} (
                            {motorista.nme_cor_veiculo})
                        </Descriptions.Item>
                        <Descriptions.Item label='Placa'>{motorista.nme_placa}</Descriptions.Item>
                        {corrida.qtd_minutos_chegada !== null && (
                            <Descriptions.Item label='Chega em'>
                                {corrida.qtd_minutos_chegada} min
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                    {local && (
                        <div style={{ marginTop: '12px' }}>
                            <Mapa latitude={local.vlr_latitude} longitude={local.vlr_longitude} />
                        </div>
                    )}
                </Card>
            )}

            {podeCancelar && (
                <Button
                    block
                    danger
                    loading={cancelando && enviando}
                    onClick={() => setCancelando(true)}
                >
                    Cancelar corrida
                </Button>
            )}

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

export default ClienteCorrida;
