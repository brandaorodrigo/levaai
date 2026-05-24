import { Button, Form, Input, message, Select, Typography } from 'antd';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, normalizeCep } from './App';

const PassengerRide = () => {
    const navigate = useNavigate();

    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);

    const onFinish = (values: any) => {
        setSubmitting(true);
        /*
        {
        "origin_id": "123e4567-e89b-12d3-a456-426614174000",
        "destination_full_address": "Rua das Flores, 123 - Jardim Primavera, São Paulo - SP",
        "destination_postal_code": "01310-100",
        "destination_neighborhood": "Jardim Primavera",
        "destination_lat": -23.55052,
        "destination_lng": -46.633308,
        "purchase_size": "media",
        "estimated_weight_kg": 15,
        "payment_method": "dinheiro",
        "needs_loading_help": false,
        "customer_notes": "Cuidado com os produtos frágeis"
        }
        */
        axios
            .post('/api/rides', values)
            .then(() => {
                message.success('Corrida solicitada com sucesso');
                navigate('/');
            })
            .catch(() => {
                message.error('Erro ao solicitar corrida');
            })
            .finally(() => setSubmitting(false));
    };

    return (
        <>
            <Typography.Title level={4} style={{ marginBottom: 10 }}>
                Solicitar corrida
            </Typography.Title>
            <Typography.Title level={3} style={{ marginBottom: 20 }}>
                {auth?.user?.fullName}
            </Typography.Title>
            <Form form={form} layout='vertical' onFinish={onFinish}>
                <Form.Item label='Origem' name='origin_id' rules={[{ required: true }]}>
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item
                    label='Destino'
                    name='destination_full_address'
                    rules={[{ required: true }]}
                >
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item
                    label='CEP'
                    name='destination_postal_code'
                    normalize={normalizeCep}
                    rules={[{ required: true }]}
                >
                    <Input maxLength={10} />
                </Form.Item>
                <Form.Item
                    label='Bairro'
                    name='destination_neighborhood'
                    rules={[{ required: true }]}
                >
                    <Input maxLength={100} />
                </Form.Item>
                <Form.Item label='Latitude' name='destination_lat' rules={[{ required: true }]}>
                    <Input maxLength={10} />
                </Form.Item>
                <Form.Item label='Longitude' name='destination_lng' rules={[{ required: true }]}>
                    <Input maxLength={10} />
                </Form.Item>
                <Form.Item
                    label='Tamanho da compra'
                    name='purchase_size'
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { label: 'Pequena', value: 'pequena' },
                            { label: 'Média', value: 'media' },
                            { label: 'Grande', value: 'grande' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label='Peso estimado'
                    name='estimated_weight_kg'
                    rules={[{ required: true }]}
                >
                    <Input maxLength={10} />
                </Form.Item>
                <Form.Item
                    label='Método de pagamento'
                    name='payment_method'
                    rules={[{ required: true }]}
                >
                    <Select
                        defaultValue='pix'
                        options={[
                            { label: 'Pix', value: 'pix' },
                            { label: 'Dinheiro', value: 'dinheiro' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label='Precisa de ajuda para carregar'
                    name='needs_loading_help'
                    rules={[{ required: true }]}
                >
                    <Select
                        defaultValue='false'
                        options={[
                            { label: 'Sim', value: 'true' },
                            { label: 'Não', value: 'false' },
                        ]}
                    />
                </Form.Item>
                <Form.Item label='Notas do cliente' name='customer_notes'>
                    <Input.TextArea maxLength={100} />
                </Form.Item>
                <Button htmlType='submit' loading={submitting} type='primary'>
                    Solicitar
                </Button>
            </Form>
        </>
    );
};

export default PassengerRide;
