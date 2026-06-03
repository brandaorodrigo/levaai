import { Button, Divider, Form, Input } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { numerico, salvarSessao, telefone } from '@/App';

const MotoristaEntrar = () => {
    const [form] = Form.useForm();
    const [carregando, setCarregando] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values: { nme_telefone: string; nme_senha: string }) => {
        setCarregando(true);
        try {
            const { data } = await axios.post<{ token: string }>('/api/motorista/entrar', {
                nme_telefone: numerico(values.nme_telefone),
                nme_senha: values.nme_senha,
            });
            salvarSessao(data.token, 'motorista');
            window.location.href = '/';
        } catch {
            setCarregando(false);
        }
    };

    return (
        <>
            <Divider>Motorista</Divider>
            <Form form={form} layout='vertical' onFinish={onFinish}>
                <Form.Item
                    label='Celular'
                    name='nme_telefone'
                    normalize={telefone}
                    rules={[{ required: true }]}
                >
                    <Input inputMode='numeric' placeholder='(11) 99999-9999' />
                </Form.Item>
                <Form.Item label='Senha' name='nme_senha' rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <div style={{ height: '10px' }} />
                <Button block htmlType='submit' loading={carregando} type='primary'>
                    Entrar
                </Button>
            </Form>
            <Divider>ou</Divider>
            <Button block onClick={() => navigate('/motorista/cadastrar')} type='default'>
                Cadastrar como motorista
            </Button>
            <div style={{ height: '30px' }} />
            <Button block onClick={() => navigate('/')} type='link'>
                Sou cliente
            </Button>
        </>
    );
};

export default MotoristaEntrar;
