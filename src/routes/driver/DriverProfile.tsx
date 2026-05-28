import { LogoutOutlined, StarFilled } from '@ant-design/icons';
import { App as AntApp, Button, Card, Form, Input, Spin, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { type DriverVehicle, driverApi } from '../../services/api';
import { colors } from '../../theme/theme';

const vehicleTypeLabel: Record<string, string> = {
    sedan: 'Sedan',
    suv: 'SUV',
    hatchback: 'Hatchback',
    pickup: 'Pickup',
    van: 'Van',
    truck: 'Caminhão',
    moto: 'Moto',
};

const statusColor: Record<string, string> = {
    ativo: 'green',
    pendente_aprovacao: 'orange',
    inativo: 'red',
};

const statusLabel: Record<string, string> = {
    ativo: 'Ativo',
    pendente_aprovacao: 'Aguardando aprovação',
    inativo: 'Inativo',
};

export default function DriverProfile() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { message, modal } = AntApp.useApp();
    const [vehicle, setVehicle] = useState<DriverVehicle | null>(null);
    const [vehicleLoading, setVehicleLoading] = useState(true);

    const initials =
        user?.name
            .split(' ')
            .map((p: any) => p[0])
            .slice(0, 2)
            .join('') || 'MR';

    useEffect(() => {
        driverApi
            .me()
            .then((profile) => {
                if (profile.vehicles && profile.vehicles.length > 0) {
                    setVehicle(profile.vehicles[0]);
                }
            })
            .catch(() => {})
            .finally(() => setVehicleLoading(false));
    }, []);

    const handleLogout = () => {
        modal.confirm({
            title: 'Sair da conta?',
            okText: 'Sim, sair',
            cancelText: 'Cancelar',
            onOk: () => {
                logout();
                navigate('/login');
            },
        });
    };

    return (
        <div className='page-container'>
            <PageHeader
                rightContent={
                    <span
                        onClick={() => message.success('Salvo!')}
                        style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: colors.orange,
                            cursor: 'pointer',
                        }}
                    >
                        Salvar
                    </span>
                }
                title='Meu perfil'
            />

            <div
                style={{
                    flex: 1,
                    padding: 14,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                }}
            >
                <Card style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: 64,
                            height: 64,
                            borderRadius: '50%',
                            background: colors.orangeBg,
                            border: `2px solid ${colors.orange}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors.orange,
                            fontWeight: 800,
                            fontSize: 22,
                            margin: '0 auto 10px',
                        }}
                    >
                        {initials}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: colors.white }}>
                        {user?.name}
                    </div>
                    <div style={{ fontSize: 11, color: colors.amber, marginTop: 4 }}>
                        <StarFilled /> 4.9 • 142 corridas
                    </div>
                </Card>

                <Card
                    title={
                        <span
                            style={{
                                fontSize: 11,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: colors.gray2,
                            }}
                        >
                            Dados pessoais
                        </span>
                    }
                >
                    <Form
                        initialValues={{ name: user?.name, phone: user?.phone }}
                        layout='vertical'
                        requiredMark={false}
                    >
                        <Form.Item label='Nome' name='name' style={{ marginBottom: 10 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item label='Celular' name='phone' style={{ marginBottom: 10 }}>
                            <Input />
                        </Form.Item>
                        <Form.Item label='E-mail' name='email' style={{ marginBottom: 0 }}>
                            <Input placeholder='seu@email.com' />
                        </Form.Item>
                    </Form>
                </Card>

                <Card
                    title={
                        <span
                            style={{
                                fontSize: 11,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: colors.gray2,
                            }}
                        >
                            Veículo
                        </span>
                    }
                >
                    {vehicleLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: 16 }}>
                            <Spin size='small' />
                        </div>
                    ) : vehicle ? (
                        <>
                            <div style={{ marginBottom: 14 }}>
                                <Tag color={statusColor[vehicle.status] ?? 'default'}>
                                    {statusLabel[vehicle.status] ?? vehicle.status}
                                </Tag>
                            </div>
                            <Form
                                initialValues={{
                                    brand: vehicle.brand,
                                    model: vehicle.model,
                                    color: vehicle.color,
                                    plate: vehicle.plate,
                                    manufactureYear: vehicle.manufactureYear,
                                    vehicleType: vehicle.vehicleType
                                        ? vehicleTypeLabel[vehicle.vehicleType] ?? vehicle.vehicleType
                                        : undefined,
                                    loadCapacityKg: vehicle.loadCapacityKg,
                                    volumeCapacityLiters: vehicle.volumeCapacityLiters,
                                }}
                                layout='vertical'
                                requiredMark={false}
                            >
                                <Form.Item label='Marca' name='brand' style={{ marginBottom: 10 }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label='Modelo' name='model' style={{ marginBottom: 10 }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label='Cor' name='color' style={{ marginBottom: 10 }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label='Placa' name='plate' style={{ marginBottom: 10 }}>
                                    <Input style={{ textTransform: 'uppercase', fontWeight: 700 }} />
                                </Form.Item>
                                <Form.Item label='Ano' name='manufactureYear' style={{ marginBottom: 10 }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label='Tipo' name='vehicleType' style={{ marginBottom: 10 }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label='Capacidade de carga (kg)' name='loadCapacityKg' style={{ marginBottom: 10 }}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label='Volume (litros)' name='volumeCapacityLiters' style={{ marginBottom: 0 }}>
                                    <Input />
                                </Form.Item>
                            </Form>
                        </>
                    ) : (
                        <div style={{ fontSize: 12, color: colors.gray3 }}>
                            Nenhum veículo cadastrado
                        </div>
                    )}
                </Card>

                <Button
                    block
                    danger
                    icon={<LogoutOutlined />}
                    onClick={handleLogout}
                    style={{
                        marginTop: 'auto',
                        background: '#2D1A1A',
                        borderColor: '#3D1A1A',
                    }}
                >
                    Sair da conta
                </Button>
            </div>
        </div>
    );
}
