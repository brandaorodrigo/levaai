import { ArrowRightOutlined, RightOutlined, ShoppingOutlined, StarFilled } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Row, Switch } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../theme/theme';

export default function DriverHome() {
    const [online, setOnline] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const initials =
        user?.name
            .split(' ')
            .map((p: any) => p[0])
            .slice(0, 2)
            .join('') || 'MR';

    const mockRides = [
        {
            id: 1,
            from: 'Extra Supermercado',
            to: 'Rua das Flores',
            value: 'R$22,50',
            date: 'Hoje',
            time: '13:45',
        },
        {
            id: 2,
            from: 'Pão de Açúcar',
            to: 'Av. Central',
            value: 'R$19,00',
            date: 'Hoje',
            time: '11:20',
        },
        {
            id: 3,
            from: 'Carrefour',
            to: 'R. XV de Novembro',
            value: 'R$31,00',
            date: 'Ontem',
            time: '17:08',
        },
        {
            id: 4,
            from: 'Atacadão',
            to: 'Rua Ipiranga, 90',
            value: 'R$27,80',
            date: 'Ontem',
            time: '09:33',
        },
    ];

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) {
            return 'Bom dia';
        }
        if (h < 18) {
            return 'Boa tarde';
        }
        return 'Boa noite';
    })();

    return (
        <div className='page-container'>
            <Row
                align='middle'
                justify='space-between'
                style={{ background: '#000', padding: '20px 20px' }}
            >
                <Col onClick={() => navigate('/driver/profile')} style={{ cursor: 'pointer' }}>
                    <Row align='middle' style={{ gap: 14 }}>
                        <Col style={{ position: 'relative' }}>
                            <Avatar
                                size={52}
                                style={{
                                    background: colors.orangeBg,
                                    border: `2px solid ${colors.orange}`,
                                    color: colors.orange,
                                    fontWeight: 800,
                                    fontSize: 17,
                                }}
                            >
                                {initials}
                            </Avatar>
                            {online && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        bottom: 1,
                                        right: 1,
                                        width: 12,
                                        height: 12,
                                        background: colors.green,
                                        borderRadius: '50%',
                                        border: '2px solid #000',
                                    }}
                                />
                            )}
                        </Col>
                        <Col>
                            <div style={{ fontSize: 12, color: colors.gray3, fontWeight: 500 }}>
                                {greeting},
                            </div>
                            <Row align='middle' style={{ gap: 5 }}>
                                <Col>
                                    <div
                                        style={{
                                            fontSize: 18,
                                            fontWeight: 700,
                                            color: colors.white,
                                        }}
                                    >
                                        {user?.name.split(' ')[0]}
                                    </div>
                                </Col>
                                <Col>
                                    <RightOutlined style={{ fontSize: 11, color: colors.gray3 }} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Col>

                <Col>
                    <Row align='middle' style={{ gap: 10 }}>
                        <Col>
                            <span style={{ fontSize: 13, color: colors.gray2, fontWeight: 600 }}>
                                {online ? 'Online' : 'Offline'}
                            </span>
                        </Col>
                        <Col>
                            <Switch checked={online} onChange={setOnline} />
                        </Col>
                    </Row>
                </Col>
            </Row>

            <div
                style={{
                    flex: 1,
                    padding: 14,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    overflowY: 'auto',
                }}
            >
                <Card styles={{ body: { padding: '12px 14px' } }}>
                    <Row align='middle' style={{ gap: 10 }}>
                        <Col>
                            <span
                                style={{
                                    padding: '5px 12px',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    fontWeight: 700,
                                    background: online ? colors.orange : colors.bg5,
                                    color: online ? colors.white : colors.gray3,
                                }}
                            >
                                {online ? 'Online' : 'Offline'}
                            </span>
                        </Col>
                        <Col flex={1}>
                            <span style={{ fontSize: 11, color: colors.gray3 }}>
                                {online ? 'Aguardando solicitações...' : 'Você está offline'}
                            </span>
                        </Col>
                    </Row>
                </Card>

                <Row gutter={[8, 8]}>
                    <Col span={12}>
                        <StatCard color={colors.orange} label='Ganhos hoje' value='R$ 87' />
                    </Col>
                    <Col span={12}>
                        <StatCard label='Corridas hoje' value='4' />
                    </Col>
                    <Col span={12}>
                        <StatCard
                            color={colors.amber}
                            label='Avaliação'
                            value={
                                <>
                                    <StarFilled /> 4.9
                                </>
                            }
                        />
                    </Col>
                    <Col span={12}>
                        <StatCard color={colors.orange} label='Esta semana' value='R$ 412' />
                    </Col>
                </Row>

                <Row
                    align='middle'
                    style={{
                        background: colors.orangeBg,
                        borderRadius: 11,
                        padding: '11px 12px',
                        border: `1px solid ${colors.orangeBorder}`,
                        gap: 10,
                    }}
                >
                    <Col>
                        <ShoppingOutlined style={{ color: colors.orange, fontSize: 15 }} />
                    </Col>
                    <Col>
                        <span style={{ fontSize: 11, fontWeight: 600, color: colors.orange }}>
                            Corridas com compras pagam até 20% a mais!
                        </span>
                    </Col>
                </Row>

                <Card styles={{ body: { padding: '14px 16px' } }}>
                    <div
                        style={{
                            fontSize: 10,
                            color: colors.gray3,
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            marginBottom: 4,
                        }}
                    >
                        ÚLTIMAS CORRIDAS
                    </div>
                    {mockRides.map((ride, i) => (
                        <div key={ride.id}>
                            <Row
                                align='middle'
                                justify='space-between'
                                style={{ padding: '11px 0' }}
                            >
                                <Col flex={1} style={{ minWidth: 0 }}>
                                    <div
                                        style={{ fontSize: 10, color: colors.gray4, marginTop: 3 }}
                                    >
                                        {ride.date} • {ride.time}
                                    </div>
                                    <Row align='middle' style={{ gap: 4, flexWrap: 'nowrap' }}>
                                        <Col
                                            style={{
                                                fontWeight: 700,
                                                color: colors.white,
                                                fontSize: 11,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {ride.from}
                                        </Col>
                                        <Col style={{ flexShrink: 0 }}>
                                            <ArrowRightOutlined
                                                style={{ fontSize: 9, color: colors.gray3 }}
                                            />
                                        </Col>
                                        <Col
                                            style={{
                                                color: colors.gray2,
                                                fontSize: 11,
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}
                                        >
                                            {ride.to}
                                        </Col>
                                    </Row>
                                </Col>
                                <Col
                                    style={{
                                        color: colors.orange,
                                        fontWeight: 700,
                                        fontSize: 13,
                                        flexShrink: 0,
                                        paddingLeft: 12,
                                    }}
                                >
                                    +{ride.value}
                                </Col>
                            </Row>
                            {i < mockRides.length - 1 && (
                                <Divider style={{ margin: 0, borderColor: colors.border }} />
                            )}
                        </div>
                    ))}
                </Card>

                <Button
                    block
                    onClick={() => navigate('/driver/new-ride')}
                    style={{ marginTop: 8 }}
                    type='dashed'
                >
                    [POC] Simular nova corrida
                </Button>
            </div>
        </div>
    );
}

function StatCard({
    label,
    value,
    color = colors.white,
}: {
    label: string;
    value: React.ReactNode;
    color?: string;
}) {
    return (
        <Card styles={{ body: { padding: '10px 12px' } }}>
            <div
                style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: colors.gray3,
                    marginBottom: 3,
                }}
            >
                {label}
            </div>
            <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
        </Card>
    );
}
