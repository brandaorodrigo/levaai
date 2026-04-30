import { Button, Card, Col, Row } from 'antd';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageHeader from '../../components/Common/PageHeader';
import PassengerRouteCard from '../../components/Common/PassengerRouteCard';
import { colors } from '../../theme/theme';

const TIME_OPTIONS = [
    { display: '5', unit: 'min', value: '5 min' },
    { display: '10', unit: 'min', value: '10 min' },
    { display: '15', unit: 'min', value: '15 min' },
    { display: '+20', unit: '', value: '+20 min' },
];

export default function InRidePage() {
    const [selectedTime, setSelectedTime] = useState('10 min');
    const navigate = useNavigate();
    const { rideId } = useParams();

    const handleNotify = () => {
        navigate(`/driver/active-ride/${rideId || 'ride_123'}`);
    };

    return (
        <div className='page-container'>
            <PageHeader
                rightContent={
                    <span style={{ fontSize: 16, fontWeight: 700, color: colors.orange }}>
                        R$ 22,50
                    </span>
                }
                showBack={false}
                title='Em corrida'
            />

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
                <PassengerRouteCard
                    destination={{
                        name: 'Rua das flores, 42',
                        address: 'Bairro Santa Cruz - Contagem',
                    }}
                    initials='JC'
                    memberSince='Cliente desde Março de 2025'
                    origin={{
                        name: 'Extra Supermercado',
                        address: 'Av. Brasil, 1200 - Contagem',
                    }}
                    passengerName='João Carlos'
                    rating={4.9}
                />

                <Row
                    align='middle'
                    justify='center'
                    style={{
                        border: `1.5px solid ${colors.orange}`,
                        borderRadius: 8,
                        padding: '12px 16px',
                    }}
                >
                    <Col>
                        <span style={{ fontSize: 11, fontWeight: 600, color: colors.orange }}>
                            Passageiro com sacolas — Até 6 sacolas
                        </span>
                    </Col>
                </Row>

                <Card styles={{ body: { padding: '14px 16px' } }}>
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 700,
                            color: colors.white,
                            marginBottom: 4,
                        }}
                    >
                        Quanto tempo você leva até o passageiro?
                    </div>
                    <div style={{ fontSize: 11, color: colors.gray3, marginBottom: 14 }}>
                        Ele será informado com o seu tempo estimado
                    </div>
                    <Row style={{ gap: 8 }}>
                        {TIME_OPTIONS.map((t) => {
                            const selected = selectedTime === t.value;
                            return (
                                <Col flex='1' key={t.value}>
                                    <button
                                        onClick={() => setSelectedTime(t.value)}
                                        style={{
                                            width: '100%',
                                            borderRadius: 8,
                                            border: `${selected ? 2 : 1}px solid ${selected ? colors.orange : colors.border}`,
                                            background: selected ? colors.orangeBg : colors.bg5,
                                            color: selected ? colors.orange : colors.gray2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            padding: '10px 4px',
                                            cursor: 'pointer',
                                            minHeight: 58,
                                        }}
                                        type='button'
                                    >
                                        <span
                                            style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}
                                        >
                                            {t.display}
                                        </span>
                                        {t.unit && (
                                            <span
                                                style={{
                                                    fontSize: 10,
                                                    fontWeight: 500,
                                                    marginTop: 3,
                                                }}
                                            >
                                                {t.unit}
                                            </span>
                                        )}
                                    </button>
                                </Col>
                            );
                        })}
                    </Row>
                </Card>

                <Button
                    block
                    onClick={handleNotify}
                    size='large'
                    style={{ fontWeight: 700, fontSize: 15 }}
                    type='primary'
                >
                    Avisar ao passageiro — Chego em {selectedTime}
                </Button>
            </div>
        </div>
    );
}
