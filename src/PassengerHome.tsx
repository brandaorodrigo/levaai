import { Typography } from 'antd';
import { auth } from './App';

const PassengerHome = () => {
    return (
        <>
            <Typography.Title level={4} style={{ marginBottom: 10 }}>
                Passageiro
            </Typography.Title>
            <Typography.Title level={3} style={{ marginBottom: 20 }}>
                {auth?.user?.fullName}
            </Typography.Title>
        </>
    );
};

export default PassengerHome;
