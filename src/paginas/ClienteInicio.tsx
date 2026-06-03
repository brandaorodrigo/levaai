import { App, Button, Divider, Form, Input, InputNumber, Select, Spin, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Bairro, Cliente, ClienteCorridaAtiva, Mercado, TamanhoCompra } from '../types';
import { moeda } from '../util';

const ClienteInicio = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const { message } = App.useApp();
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [mercados, setMercados] = useState<Mercado[]>([]);
    const [bairros, setBairros] = useState<Bairro[]>([]);
    const [bairroCliente, setBairroCliente] = useState<string>('');

    const bairroSelecionado = Form.useWatch('nme_bairro', form);
    const preco = bairros.find((b) => b.nme_bairro === bairroSelecionado)?.vlr_preco;

    // Bootstrap: se já há corrida ativa, vai direto para o acompanhamento.
    useEffect(() => {
        (async () => {
            try {
                await axios.get<ClienteCorridaAtiva>('/api/cliente/corrida/ativa', {
                    silenciar: true,
                });
                navigate('/corrida');
                return;
            } catch {
                // 404 esperado: sem corrida ativa, segue para montar o pedido.
            }
            try {
                const [{ data: listaMercados }, { data: cliente }] = await Promise.all([
                    axios.get<Mercado[]>('/api/mercado'),
                    axios.get<Cliente>('/api/cliente'),
                ]);
                setMercados(listaMercados);
                // O bairro só é escolhido depois do mercado (depende dos bairros atendidos).
                setBairroCliente(cliente.nme_bairro);
                form.setFieldsValue({
                    nme_rua: cliente.nme_rua,
                    nme_numero: cliente.nme_numero,
                    nme_cidade: cliente.nme_cidade,
                    nme_uf: cliente.nme_uf,
                });
            } finally {
                setCarregando(false);
            }
        })();
    }, []);

    const onMercado = async (cod_mercado: string) => {
        // Troca de mercado redefine o bairro: a lista de bairros atendidos muda junto.
        form.setFieldValue('nme_bairro', undefined);
        setBairros([]);
        try {
            const { data: lista } = await axios.get<Bairro[]>(`/api/bairro/${cod_mercado}`);
            setBairros(lista);
            // Pré-seleciona o bairro do cadastro do cliente, se este mercado o atender.
            if (bairroCliente && lista.some((b) => b.nme_bairro === bairroCliente)) {
                form.setFieldValue('nme_bairro', bairroCliente);
            }
        } catch {
            // erro já exibido pelo interceptor
        }
    };

    const onFinish = async (values: {
        cod_mercado: string;
        nme_rua: string;
        nme_numero: string;
        nme_bairro: string;
        nme_cidade: string;
        nme_uf: string;
        cod_tamanho_compra: TamanhoCompra;
        qtd_sacolas?: number;
        nme_comentario_inicial_cliente?: string;
    }) => {
        setEnviando(true);
        try {
            await axios.post('/api/cliente/corrida/solicitar', {
                ...values,
                nme_uf: values.nme_uf.toUpperCase(),
            });
            message.success('Corrida solicitada!');
            navigate('/corrida');
        } catch {
            setEnviando(false);
        }
    };

    if (carregando) {
        return <Spin />;
    }

    return (
        <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item label='Mercado' name='cod_mercado' rules={[{ required: true }]}>
                <Select
                    onChange={onMercado}
                    optionFilterProp='label'
                    options={mercados.map((m) => ({
                        label: `${m.nme_mercado} — ${m.nme_bairro}`,
                        value: m.cod_mercado,
                    }))}
                    placeholder='Escolha o mercado'
                    showSearch
                />
            </Form.Item>

            <Divider>Entrega</Divider>

            <Form.Item label='Bairro de destino' name='nme_bairro' rules={[{ required: true }]}>
                <Select
                    disabled={!bairros.length}
                    optionFilterProp='label'
                    options={bairros.map((b) => ({
                        label: `${b.nme_bairro} — ${moeda(b.vlr_preco)}`,
                        value: b.nme_bairro,
                    }))}
                    placeholder={bairros.length ? 'Escolha o bairro' : 'Escolha o mercado primeiro'}
                    showSearch
                />
            </Form.Item>
            <Form.Item label='Rua' name='nme_rua' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Número' name='nme_numero' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Cidade' name='nme_cidade' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item
                label='UF'
                name='nme_uf'
                normalize={(v: string) => v.toUpperCase().slice(0, 2)}
                rules={[{ required: true, len: 2 }]}
            >
                <Input />
            </Form.Item>

            <Divider>Compra</Divider>

            <Form.Item
                label='Tamanho da compra'
                name='cod_tamanho_compra'
                rules={[{ required: true }]}
            >
                <Select
                    options={[
                        { label: 'Pequena', value: 'pequena' },
                        { label: 'Média', value: 'media' },
                        { label: 'Grande', value: 'grande' },
                    ]}
                    placeholder='Tamanho'
                />
            </Form.Item>
            <Form.Item label='Quantidade de sacolas' name='qtd_sacolas'>
                <InputNumber min={0} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label='Observação' name='nme_comentario_inicial_cliente'>
                <Input.TextArea placeholder='Ex.: troco para R$100, sem coentro...' rows={2} />
            </Form.Item>

            {preco && (
                <Typography.Title level={3} style={{ textAlign: 'center' }}>
                    Total: {moeda(preco)}
                </Typography.Title>
            )}

            <div style={{ height: '10px' }} />
            <Button block htmlType='submit' loading={enviando} type='primary'>
                Solicitar corrida
            </Button>
        </Form>
    );
};

export default ClienteInicio;
