import { Button, Divider, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { telefone } from './App';

const ClienteEntrar = () => {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        values.phone = values.phone.replace(/\D/g, '');
        if (values.phone.length !== 11) {
            message.error('Celular inválido');
            return;
        }
        setSubmitting(true);
        login(values.phone, values.password)
            .then(() => (window.location.href = '/'))
            .finally(() => setSubmitting(false));
    };

    return (
        <>
            <Form form={form} layout='vertical' onFinish={onFinish}>
                <Form.Item
                    label='Celular'
                    name='nme_telefone'
                    normalize={telefone}
                    rules={[{ required: true }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item label='Senha' name='nme_senha' rules={[{ required: true }]}>
                    <Input.Password />
                </Form.Item>
                <div style={{ height: '10px' }} />
                <Button block htmlType='submit' loading={submitting} type='primary'>
                    Entrar
                </Button>
            </Form>
            <Divider>Ou</Divider>
            <Button block htmlType='button' onClick={() => navigate('/cadastrar')} type='default'>
                Cadastrar
            </Button>
            <div style={{ height: '30px' }} />
            <Button
                block
                htmlType='button'
                onClick={() => navigate('/motorista/cadastrar')}
                type='link'
            >
                Cadastrar como motorista
            </Button>
        </>
    );
};

export default ClienteEntrar;
