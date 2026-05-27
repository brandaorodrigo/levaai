import { Button, Form, Input, message, Select, Skeleton } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeCep } from './App';

const PassengerRide = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = useState(false);
    const [pickup, setPickup] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
    const [destinations, setDestinations] = useState<any[]>([]);

    useEffect(() => {
        const fetchArray = async () => {
            const [neighborhoods, destinations, pickup, me] = await Promise.all([
                axios.get('/locations/allowed-neighborhoods').then(({ data }) => data.data),
                axios.get('/locations/destinations').then(({ data }) => data.data),
                axios.get('/locations/pickup').then(({ data }) => data.data),
                axios.get('/auth/me').then(({ data }) => data.data),
            ]);
            const address = `Endereço: ${me?.address} - Número: ${me?.number} - Complemento: ${me?.complement} - Bairro: ${me?.neighborhood} - CEP: ${me?.cep}`;
            axios.get('/locations/geocoding/foward', { params: { address } }).then(({ data }) => {
                form.setFieldsValue({
                    destinationLat: data.data.lat,
                    destinationLng: data.data.lng,
                });
            });
            form.setFieldsValue({
                destinationFullAddress: address,
                destinationPostalCode: normalizeCep(me?.postalCode),
                destinationNeighborhood: me?.neighborhood,
            });

            setDestinations(destinations);
            setNeighborhoods(neighborhoods);
            setPickup(pickup);
            setLoading(false);
        };
        fetchArray();
    }, []);

    const onFinish = (values: any) => {
        setSubmitting(true);
        /*
        {
        "originId": "123e4567-e89b-12d3-a456-426614174000",
        "destinationFullAddress": "Rua das Flores, 123 - Jardim Primavera, São Paulo - SP",
        "destinationPostalCode": "01310-100",
        "destinationNeighborhood": "Jardim Primavera",
        "destinationLat": -23.55052,
        "destinationLng": -46.633308,
        "purchaseSize": "media",
        "estimatedWeightKg": 15,
        "paymentMethod": "dinheiro",
        "needsLoadingHelp": false,
        "customerNotes": "Cuidado com os produtos frágeis"
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
            {loading && <Skeleton active paragraph={{ rows: 20, width: '100%' }} title={false} />}
            <Form
                form={form}
                layout='vertical'
                onFinish={onFinish}
                style={{ display: loading ? 'none' : 'block' }}
            >
                <Form.Item label='Origem' name='originId' rules={[{ required: true }]}>
                    <Select
                        maxLength={100}
                        options={pickup.map((each) => ({ label: each.name, value: each.id }))}
                        placeholder='Selecione onde você esta'
                    />
                </Form.Item>
                <Form.Item
                    label='Destino'
                    name='destinationFullAddress'
                    rules={[{ required: true }]}
                >
                    <Input maxLength={100} placeholder='Destino' />
                </Form.Item>
                <Form.Item
                    label='CEP'
                    name='destinationPostalCode'
                    normalize={normalizeCep}
                    rules={[{ required: true }]}
                >
                    <Input maxLength={10} placeholder='CEP' />
                </Form.Item>
                <Form.Item
                    label='Bairro'
                    name='destinationNeighborhood'
                    rules={[{ required: true }]}
                >
                    <Select
                        options={neighborhoods.map((each: any) => ({
                            label: each.name,
                            value: each.name,
                        }))}
                        placeholder='Bairro'
                    />
                </Form.Item>
                <Form.Item label='Latitude' name='destinationLat' rules={[{ required: true }]}>
                    <Input maxLength={10} placeholder='Latitude' />
                </Form.Item>
                <Form.Item label='Longitude' name='destinationLng' rules={[{ required: true }]}>
                    <Input maxLength={10} placeholder='Longitude' />
                </Form.Item>
                <Form.Item
                    label='Tamanho da compra'
                    name='purchaseSize'
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { label: 'Pequena', value: 'small' },
                            { label: 'Média', value: 'medium' },
                            { label: 'Grande', value: 'large' },
                        ]}
                        placeholder='Tamanho da compra'
                    />
                </Form.Item>
                <Form.Item
                    label='Peso estimado'
                    name='estimatedWeightKg'
                    rules={[{ required: true }]}
                >
                    <Select
                        defaultValue='5'
                        options={[
                            { label: '1 kg', value: '1' },
                            { label: '5 kg', value: '5' },
                            { label: '10 kg', value: '10' },
                            { label: '15 kg', value: '15' },
                        ]}
                        placeholder='Peso estimado'
                    />
                </Form.Item>
                <Form.Item
                    label='Método de pagamento'
                    name='needsLoadingHelp'
                    rules={[{ required: true }]}
                >
                    <Select
                        defaultValue='pix'
                        options={[
                            { label: 'Pix', value: 'pix' },
                            { label: 'Dinheiro', value: 'cash' },
                        ]}
                    />
                </Form.Item>
                <Form.Item
                    label='Precisa de ajuda para carregar'
                    name='needsLoadingHelp'
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
                <Form.Item label='Notas do cliente' name='customerNotes'>
                    <Input maxLength={100} placeholder='Notas do cliente' />
                </Form.Item>
                <Button htmlType='submit' loading={submitting} type='primary'>
                    Solicitar
                </Button>
            </Form>
        </>
    );
};

export default PassengerRide;
