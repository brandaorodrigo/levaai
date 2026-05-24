import { Typography } from 'antd';
import { user } from './App';

const DriverHome = () => {
    return (
        <>
            <Typography.Title level={4} style={{ marginBottom: 10 }}>
                Passageiro
            </Typography.Title>
            <Typography.Title level={3} style={{ marginBottom: 20 }}>
                {user?.fullName}
            </Typography.Title>
        </>
    );
};

export default DriverHome;
