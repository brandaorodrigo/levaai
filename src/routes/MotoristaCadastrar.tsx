import { App, Button, Form, Input } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { numerico, telefone } from '@/App';

const MotoristaCadastrar = () => {
    const [form] = Form.useForm();
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();
    const { message } = App.useApp();

    const onFinish = async (values: Record<string, string>) => {
        setCarregando(true);
        try {
            await axios.post('/api/motorista/cadastrar', {
                ...values,
                nme_telefone: numerico(values.nme_telefone),
            });
            message.success('Cadastro realizado! Faça login.');
            navigate('/motorista');
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
            <Form.Item label='Nome' name='nme_motorista' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Placa' name='nme_placa' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Marca' name='nme_marca_veiculo' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Modelo' name='nme_modelo_veiculo' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <Form.Item label='Cor' name='nme_cor_veiculo' rules={[{ required: true }]}>
                <Input />
            </Form.Item>
            <div style={{ height: '10px' }} />
            <Button block htmlType='submit' loading={carregando} type='primary'>
                Cadastrar
            </Button>
        </Form>
    );
};

export default MotoristaCadastrar;
