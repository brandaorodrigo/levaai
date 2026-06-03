import { App, Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { telefone } from '@/App';
import Carregando from '@/components/Carregando';
import type { Cliente } from '@/types';

const ClienteAtualizar = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);
    const [bairros, setBairros] = useState<string[]>([]);

    useEffect(() => {
        axios
            .get<Cliente>('/api/cliente')
            .then(({ data }) => form.setFieldsValue(data))
            .finally(() => setCarregando(false));
    }, []);

    useEffect(() => {
        axios
            .get<{ nme_bairro: string }[]>('/api/bairro')
            .then(({ data }) => setBairros(data.map((b) => b.nme_bairro)));
    }, []);

    const onFinish = async (values: Record<string, string>) => {
        setEnviando(true);
        try {
            const body = { ...values, nme_cidade: 'Juiz de Fora', nme_uf: 'MG' };
            await axios.put('/api/cliente/atualizar', body);
            message.success('Dados atualizados');
        } finally {
            setEnviando(false);
        }
    };

    if (carregando) {
        return <Carregando />;
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
            <Form.Item
                label='Bairro'
                name='nme_bairro'
                rules={[{ required: true }]}
                tooltip='Só atendemos os bairros listados'
            >
                <Select
                    options={bairros.map((b) => ({ label: b, value: b }))}
                    placeholder='Selecione seu bairro'
                    showSearch
                />
            </Form.Item>
            <div style={{ height: '25px' }} />
            <Button block htmlType='submit' loading={enviando} type='primary'>
                Salvar
            </Button>
        </Form>
    );
};

export default ClienteAtualizar;
