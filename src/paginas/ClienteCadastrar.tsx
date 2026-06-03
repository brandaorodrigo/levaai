import { App, Button, Form, Input, Select } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { numerico, telefone } from '@/App';

const ClienteCadastrar = () => {
    const [form] = Form.useForm();
    const [carregando, setCarregando] = useState(false);
    const [bairros, setBairros] = useState<string[]>([]);
    const navigate = useNavigate();
    const { message } = App.useApp();

    useEffect(() => {
        axios
            .get<{ nme_bairro: string }[]>('/api/bairro')
            .then(({ data }) => setBairros(data.map((b) => b.nme_bairro)))
            .catch(() => {});
    }, []);

    const onFinish = async (values: Record<string, string>) => {
        setCarregando(true);
        try {
            await axios.post('/api/cliente/cadastrar', {
                ...values,
                nme_telefone: numerico(values.nme_telefone),
                nme_uf: values.nme_uf.toUpperCase(),
            });
            message.success('Cadastro realizado! Faça login.');
            navigate('/');
        } catch {
            setCarregando(false);
        }
    };

    return (
        <Form form={form} layout='vertical' onFinish={onFinish}>
            <Form.Item
                label='Celular'
                name='nme_telefone'
                normalize={telefone}
                rules={[{ required: true }]}
            >
                <Input inputMode='numeric' placeholder='(11) 99999-9999' />
            </Form.Item>
            <Form.Item
                label='Senha'
                name='nme_senha'
                rules={[{ required: true, min: 6, message: 'Mínimo de 6 caracteres' }]}
            >
                <Input.Password />
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
            <Form.Item label='Cidade' name='nme_cidade' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item
                label='UF'
                name='nme_uf'
                normalize={(v: string) => v.toUpperCase().slice(0, 2)}
                rules={[{ required: true, len: 2, message: 'Use a sigla com 2 letras' }]}
            >
                <Input placeholder='SP' />
            </Form.Item>
            <div style={{ height: '10px' }} />
            <Button block htmlType='submit' loading={carregando} type='primary'>
                Cadastrar
            </Button>
        </Form>
    );
};

export default ClienteCadastrar;
