import { Button, Form, Input, message, Select, Skeleton, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {
    auth,
    type CepData,
    login,
    normalizeCep,
    normalizePhone,
    type PassengerProfileProps,
} from './App';

const PassengerProfile = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [posting, setPosting] = useState(false);
    const [neighborhoods, setNeighborhoods] = useState<any[]>([]);

    const onChangePostalCode = (value: string) => {
        setPosting(true);
        const cep = value.replace(/\D/g, '');
        form.setFieldsValue({ street: undefined, neighborhood: undefined });
        axios
            .get<{ data: CepData }>('/locations/cep', { params: { cep } })
            .then(({ data }) =>
                form.setFieldsValue({
                    address: data.data.address,
                    neighborhood: data.data.neighborhood,
                }),
            )
            .finally(() => setPosting(false));
    };

    useEffect(() => {
        axios
            .get<any>('/locations/allowed-neighborhoods')
            .then(({ data }) => setNeighborhoods(data.data));
        setLoading(true);
        if (!auth?.accessToken) {
            setLoading(false);
            return;
        }
        axios
            .get<{ data: PassengerProfileProps }>('/users/customers/me')
            .then(({ data }) => {
                const me = data.data;
                if (me?.phone) {
                    me.phone = normalizePhone(me.phone);
                }
                form.setFieldsValue(me);
            })
            .finally(() => setLoading(false));
    }, []);

    const onFinish = (values: PassengerProfileProps) => {
        setSubmitting(true);
        values.phone = values.phone.replace(/\D/g, '');
        if (values.phone.length !== 11) {
            message.error('Celular inválido');
            return;
        }
        if (values?.postalCode) {
            values.postalCode = values.postalCode.replace(/\D/g, '');
        }
        delete values?.confirmPassword;
        if (!auth?.accessToken) {
            axios
                .post('/auth/register/customer', values)
                .then(() => login(values.phone, values.password))
                .then(() => (window.location.href = '/'))
                .catch(() => setSubmitting(false));
        } else {
            axios
                .patch<{ data: PassengerProfileProps }>('/users/customers/me', values)
                .then(() => message.success('Dados atualizados com sucesso!'))
                .catch(() => setSubmitting(false));
        }
    };

    return (
        <>
            {!auth?.accessToken && (
                <Typography.Title level={2} style={{ marginBottom: 20 }}>
                    Cadastrar passageiro
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
                <Form.Item label='Nome completo' name='fullName' rules={[{ required: true }]}>
                    <Input maxLength={150} placeholder='Nome completo' />
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
                            <Input.Password maxLength={15} placeholder='Senha' showCount />
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
                            <Input.Password
                                maxLength={15}
                                placeholder='Confirmar senha'
                                showCount
                            />
                        </Form.Item>
                    </>
                )}
                <Form.Item label='E-mail' name='email' rules={[{ required: true, type: 'email' }]}>
                    <Input maxLength={100} placeholder='E-mail' showCount />
                </Form.Item>
                <div
                    style={{
                        margin: '0 0 15px 0',
                        fontSize: 12,
                        color: 'gray',
                        textAlign: 'center',
                        backgroundColor: '#333333',
                        padding: 6,
                        borderRadius: 6,
                    }}
                >
                    Se não souber seu CEP deixe em branco.
                </div>
                <Form.Item label='CEP' name='postalCode' normalize={normalizeCep}>
                    <Input
                        disabled={posting}
                        maxLength={10}
                        onBlur={(e) => onChangePostalCode(e.target.value)}
                        placeholder='00000-000'
                    />
                </Form.Item>
                <Form.Item label='Endereço' name='address' rules={[{ required: true }]}>
                    <Input disabled={posting} maxLength={100} placeholder='Endereço' showCount />
                </Form.Item>
                <Form.Item label='Bairro' name='neighborhood' rules={[{ required: true }]}>
                    <Select
                        options={neighborhoods.map((each: any) => ({
                            label: each.name,
                            value: each.name,
                        }))}
                        placeholder='Bairro'
                    />
                </Form.Item>
                <Form.Item label='Número' name='number' rules={[{ required: true }]}>
                    <Input maxLength={20} placeholder='Número' showCount />
                </Form.Item>
                <Form.Item label='Complemento' name='complement'>
                    <Input maxLength={100} placeholder='Apto, bloco e etc.' showCount />
                </Form.Item>
                <div style={{ height: '20px' }} />
                <Button block htmlType='submit' loading={submitting} type='primary'>
                    {auth?.accessToken ? 'Atualizar' : 'Cadastrar'}
                </Button>
            </Form>
        </>
    );
};

export default PassengerProfile;
