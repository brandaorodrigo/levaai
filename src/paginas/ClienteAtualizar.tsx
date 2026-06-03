import { App, Button, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { clienteAtualizar, clienteObter, getUsuario, salvarSessao } from '../api';
import type { Cliente } from '../types';
import { telefone } from '../util';

const ClienteAtualizar = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        clienteObter()
            .then((cliente) => form.setFieldsValue(cliente))
            .finally(() => setCarregando(false));
    }, []);

    const onFinish = async (values: Record<string, string>) => {
        setEnviando(true);
        try {
            const body = { ...values, nme_uf: values.nme_uf.toUpperCase() };
            await clienteAtualizar(body);
            const atual = getUsuario<Cliente>();
            if (atual) {
                salvarSessao(window.localStorage.getItem('token') as string, 'cliente', {
                    ...atual,
                    ...body,
                });
            }
            message.success('Dados atualizados');
        } finally {
            setEnviando(false);
        }
    };

    if (carregando) {
        return <Spin />;
    }

    return (
        <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item label='Celular'>
                <Input disabled value={telefone(form.getFieldValue('nme_telefone') || '')} />
            </Form.Item>
            <Form.Item label='Nome' name='nme_cliente' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Rua' name='nme_rua' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Número' name='nme_numero' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Bairro' name='nme_bairro' rules={[{ required: true }]}>
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
            <div style={{ height: '10px' }} />
            <Button block htmlType='submit' loading={enviando} type='primary'>
                Salvar
            </Button>
        </Form>
    );
};

export default ClienteAtualizar;
