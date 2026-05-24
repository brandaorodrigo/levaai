import { Typography } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { auth } from './App';

const DriverHome = () => {
    useEffect(() => {
        axios.get('locations/destinations').then(({ data }) => {
            console.log('destinations', data);
        });

        axios.get('locations/pickups').then(({ data }) => {
            console.log('passenger pickups', data);
        });
        axios.get('locations/rides/available').then(({ data }) => {
            console.log('driver available rides', data);
        });
        axios.get('locations/rides/available-drivers').then(({ data }) => {
            console.log('passenger available drivers', data);
        });
    }, []);

    return (
        <>
            <Typography.Title level={4}>Motorista</Typography.Title>
            <Typography.Title level={3} style={{ marginBottom: 20 }}>
                {auth?.user?.fullName}
            </Typography.Title>
        </>
    );
};

export default DriverHome;
