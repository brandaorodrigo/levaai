import { App, Button, Card, Empty, Form, Input, InputNumber, Modal, Switch, Tag } from 'antd';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { moeda, textoTamanho } from '@/App';
import Loading from '@/Loading';
import type { CorridaSolicitada, Motorista, MotoristaCorridaAtiva } from '@/types';

const MotoristaInicio = () => {
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [carregando, setCarregando] = useState(true);
    const [online, setOnline] = useState(false);
    const [alterandoStatus, setAlterandoStatus] = useState(false);
    const [solicitadas, setSolicitadas] = useState<CorridaSolicitada[]>([]);
    const [aceitar, setAceitar] = useState<CorridaSolicitada | null>(null);
    const [enviando, setEnviando] = useState(false);
    const onlineRef = useRef(false);

    // Bootstrap: corrida ativa tem prioridade; senão lê a situação atual.
    useEffect(() => {
        (async () => {
            try {
                await axios.get<MotoristaCorridaAtiva>('/api/motorista/corrida/ativa', {
                    silenciar: true,
                });
                navigate('/corrida');
                return;
            } catch {
                // 404: sem corrida ativa
            }
            try {
                const { data: motorista } = await axios.get<Motorista>('/api/motorista');
                const estaOnline = motorista.cod_situacao_motorista === 'online';
                setOnline(estaOnline);
                onlineRef.current = estaOnline;
            } finally {
                setCarregando(false);
            }
        })();
    }, []);

    // Enquanto online e sem corrida ativa, faz polling do feed de oportunidades.
    useEffect(() => {
        if (!online) {
            setSolicitadas([]);
            return;
        }
        const tick = async () => {
            try {
                const { data: lista } = await axios.get<CorridaSolicitada[]>(
                    '/api/motorista/corrida/solicitada',
                );
                if (onlineRef.current) {
                    setSolicitadas(lista);
                }
            } catch {
                // erro já exibido
            }
        };
        tick();
        const id = window.setInterval(tick, 4000);
        return () => window.clearInterval(id);
    }, [online]);

    const alternarStatus = async (valor: boolean) => {
        setAlterandoStatus(true);
        try {
            await axios.put('/api/motorista/situacao', {
                cod_situacao_motorista: valor ? 'online' : 'offline',
            });
            setOnline(valor);
            onlineRef.current = valor;
        } finally {
            setAlterandoStatus(false);
        }
    };

    const onAceitar = (values: {
        qtd_minutos_chegada: number;
        nme_comentario_inicial_motorista?: string;
    }) => {
        if (!aceitar) {
            return;
        }
        setEnviando(true);
        axios
            .post('/api/motorista/corrida/aceitar', {
                cod_corrida: aceitar.corrida.cod_corrida,
                qtd_minutos_chegada: values.qtd_minutos_chegada,
                nme_comentario_inicial_motorista: values.nme_comentario_inicial_motorista,
            })
            .then(() => {
                message.success('Corrida aceita!');
                navigate('/corrida');
            })
            .catch(() => {
                setEnviando(false);
                setAceitar(null);
            });
    };

    if (carregando) {
        return <Loading />;
    }

    return (
        <>
            <Card style={{ marginBottom: '16px' }}>
                <div
                    style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}
                >
                    <span>{online ? 'Você está online' : 'Você está offline'}</span>
                    <Switch checked={online} loading={alterandoStatus} onChange={alternarStatus} />
                </div>
            </Card>

            {!online && <Empty description='Fique online para receber corridas' />}

            {online && !solicitadas.length && <Empty description='Nenhuma corrida disponível' />}

            {online &&
                solicitadas.map(({ corrida, cliente, mercado }) => (
                    <Card
                        key={corrida.cod_corrida}
                        size='small'
                        style={{ marginBottom: '12px' }}
                        title={mercado.nme_mercado}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Tag color='blue'>{textoTamanho[corrida.cod_tamanho_compra]}</Tag>
                            <strong>{moeda(corrida.vlr_corrida)}</strong>
                        </div>
                        <div style={{ margin: '6px 0', opacity: 0.8 }}>
                            Destino: {corrida.nme_rua_destino}, {corrida.nme_bairro_destino}
                        </div>
                        {corrida.qtd_sacolas !== null && (
                            <div style={{ opacity: 0.7 }}>{corrida.qtd_sacolas} sacolas</div>
                        )}
                        {corrida.nme_comentario_inicial_cliente && (
                            <div style={{ opacity: 0.7 }}>
                                Obs.: {corrida.nme_comentario_inicial_cliente}
                            </div>
                        )}
                        <div style={{ marginTop: '4px', opacity: 0.5 }}>
                            Cliente: {cliente.nme_cliente}
                        </div>
                        <Button
                            block
                            onClick={() => setAceitar({ corrida, cliente, mercado })}
                            style={{ marginTop: '10px' }}
                            type='primary'
                        >
                            Aceitar
                        </Button>
                    </Card>
                ))}

            <Modal
                footer={null}
                onCancel={() => setAceitar(null)}
                open={Boolean(aceitar)}
                title='Aceitar corrida'
            >
                <Form layout='vertical' onFinish={onAceitar}>
                    <Form.Item
                        label='Tempo até o mercado (min)'
                        name='qtd_minutos_chegada'
                        rules={[{ required: true }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label='Comentário' name='nme_comentario_inicial_motorista'>
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Button block htmlType='submit' loading={enviando} type='primary'>
                        Confirmar
                    </Button>
                </Form>
            </Modal>
        </>
    );
};

export default MotoristaInicio;
