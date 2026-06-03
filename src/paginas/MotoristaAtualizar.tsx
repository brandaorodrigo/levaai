import { App, Button, Form, Input, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { getUsuario, motoristaAtualizar, motoristaObter, salvarSessao } from '../api';
import type { Motorista } from '../types';
import { telefone } from '../util';

const MotoristaAtualizar = () => {
    const [form] = Form.useForm();
    const { message } = App.useApp();
    const [carregando, setCarregando] = useState(true);
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        motoristaObter()
            .then((motorista) => form.setFieldsValue(motorista))
            .finally(() => setCarregando(false));
    }, []);

    const onFinish = async (values: Record<string, string>) => {
        setEnviando(true);
        try {
            await motoristaAtualizar(values);
            const atual = getUsuario<Motorista>();
            if (atual) {
                salvarSessao(window.localStorage.getItem('token') as string, 'motorista', {
                    ...atual,
                    ...values,
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
            <Button block htmlType='submit' loading={enviando} type='primary'>
                Salvar
            </Button>
        </Form>
    );
};

export default MotoristaAtualizar;
