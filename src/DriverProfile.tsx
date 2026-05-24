import { Button, DatePicker, Form, Input, message, Select, Skeleton, Typography } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { auth, type DriverProfileProps, login, normalizeCpf, normalizePhone } from './App';

const DriverProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (!auth?.accessToken) {
            setLoading(false);
            return;
        }
        axios
            .get<{ data: DriverProfileProps }>('/users/drivers/me')
            .then(({ data }) => {
                const me = data.data;
                if (me?.licenseExpiry) {
                    me.licenseExpiry = dayjs(me.licenseExpiry);
                }
                if (me?.birthDate) {
                    me.birthDate = dayjs(me.birthDate);
                }
                if (me?.cpf) {
                    me.cpf = normalizeCpf(me.cpf);
                }
                if (me?.phone) {
                    me.phone = normalizePhone(me.phone);
                }
                form.setFieldsValue(me);
            })
            .finally(() => setLoading(false));
    }, []);

    const onFinish = (values: DriverProfileProps) => {
        setSubmitting(true);
        values.phone = values.phone.replace(/\D/g, '');
        values.cpf = values.cpf.replace(/\D/g, '');
        values.licenseNumber = values.licenseNumber.replace(/\D/g, '');
        values.licenseExpiry = dayjs(values.licenseExpiry).format('YYYY-MM-DD');
        values.birthDate = dayjs(values.birthDate).format('YYYY-MM-DD');
        if (values.phone.length !== 11) {
            message.error('Celular inválido');
            return;
        }
        if (!auth?.accessToken) {
            axios
                .post('/auth/register/driver', values)
                .then(() => login(values.phone, values.password))
                .then(() => (window.location.href = '/'))
                .catch(() => setSubmitting(false));
        } else {
            axios
                .patch<{ data: DriverProfileProps }>('/users/drivers/me', values)
                .then(() => message.success('Dados atualizados com sucesso!'))
                .catch(() => setSubmitting(false));
        }
    };

    return (
        <>
            {!auth?.accessToken && (
                <Typography.Title level={2} style={{ marginBottom: 20 }}>
                    Cadastrar motorista
                </Typography.Title>
            )}
            {loading && <Skeleton active paragraph={{ rows: 20, width: '100%' }} title={false} />}
            <Form
                autoComplete='off'
                form={form}
                layout='vertical'
                onFinish={onFinish}
                style={{ display: loading ? 'none' : 'block' }}
            >
                <Form.Item label='Nome' name='fullName' rules={[{ required: true }]}>
                    <Input maxLength={150} />
                </Form.Item>
                <Form.Item
                    label='Celular'
                    name='phone'
                    normalize={normalizePhone}
                    rules={[{ required: true }]}
                >
                    <Input maxLength={15} placeholder='(00) 00000-0000' />
                </Form.Item>
                {!auth?.accessToken && (
                    <>
                        <Form.Item label='Senha' name='password' rules={[{ required: true }]}>
                            <Input.Password maxLength={15} showCount />
                        </Form.Item>
                        <Form.Item
                            label='Confirmar senha'
                            name='confirmPassword'
                            rules={[
                                {
                                    required: true,
                                    validator: (_, value) => {
                                        if (!value || value === form.getFieldValue('password')) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('As senhas não coincidem'));
                                    },
                                },
                            ]}
                        >
                            <Input.Password maxLength={15} showCount />
                        </Form.Item>
                    </>
                )}
                <Form.Item label='E-mail' name='email' rules={[{ required: true, type: 'email' }]}>
                    <Input maxLength={100} showCount />
                </Form.Item>
                <Form.Item label='Número da CNH' name='licenseNumber' rules={[{ required: true }]}>
                    <Input maxLength={15} showCount />
                </Form.Item>
                <Form.Item
                    label='Categoria da CNH'
                    name='licenseCategory'
                    rules={[{ required: true }]}
                >
                    <Select
                        options={[
                            { value: 'A', label: 'A' },
                            { value: 'B', label: 'B' },
                            { value: 'C', label: 'C' },
                            { value: 'D', label: 'D' },
                            { value: 'E', label: 'E' },
                        ]}
                        placeholder='Selecione'
                    />
                </Form.Item>
                <Form.Item
                    label='Data de validade da CNH'
                    name='licenseExpiry'
                    rules={[{ required: true }]}
                >
                    <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label='CPF'
                    name='cpf'
                    normalize={normalizeCpf}
                    rules={[{ required: true }]}
                >
                    <Input maxLength={14} placeholder='000.000.000-00' />
                </Form.Item>
                <Form.Item label='Data de nascimento' name='birthDate' rules={[{ required: true }]}>
                    <DatePicker format='DD/MM/YYYY' style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item
                    label='Marca do veículo'
                    name='vehicleBrand'
                    rules={[{ required: true }]}
                >
                    <Input placeholder='Marca do veículo' />
                </Form.Item>
                <Form.Item
                    label='Modelo do veículo'
                    name='vehicleModel'
                    rules={[{ required: true }]}
                >
                    <Input placeholder='Modelo do veículo' />
                </Form.Item>
                <Form.Item label='Cor do veículo' name='vehicleColor' rules={[{ required: true }]}>
                    <Input placeholder='Cor do veículo' />
                </Form.Item>
                <Form.Item
                    label='Placa do veículo'
                    name='vehiclePlate'
                    rules={[{ required: true }]}
                >
                    <Input placeholder='Placa do veículo' />
                </Form.Item>
                <div style={{ height: '20px' }} />
                <Button block htmlType='submit' loading={submitting} type='primary'>
                    {auth?.accessToken ? 'Atualizar' : 'Cadastrar'}
                </Button>
            </Form>
        </>
    );
};

export default DriverProfile;
