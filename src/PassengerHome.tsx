import { Button, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';
import { auth } from './App';

const PassengerHome = () => {
    const navigate = useNavigate();

    return (
        <>
            <Typography.Title level={4} style={{ marginBottom: 10 }}>
                Passageiro
            </Typography.Title>
            <Typography.Title level={3} style={{ marginBottom: 20 }}>
                {auth?.user?.fullName}
            </Typography.Title>
            <Button onClick={() => navigate('/corrida')} type='primary'>
                Solicitar corrida
            </Button>
        </>
    );
};

export default PassengerHome;
