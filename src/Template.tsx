import { Button, Layout } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { auth, logout } from './App';
import Header from './Header';

const Template = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth || auth?.user?.role !== 'driver' || !navigator.geolocation) {
            return;
        }
        const sendLocation = () => {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                axios.patch('users/drivers/me/location', {
                    latitude: coords.latitude,
                    longitude: coords.longitude,
                });
            });
        };
        sendLocation();
        const intervalId = window.setInterval(sendLocation, 30000);
        return () => {
            window.clearInterval(intervalId);
        };
    }, [auth]);

    return (
        <Layout
            style={{
                backgroundColor: 'var(--ant-color-bg-base)',
                minHeight: '100vh',
            }}
        >
            <Layout style={{ minHeight: '100vh', width: '320px', margin: '0 auto' }}>
                <Layout.Content style={{ padding: '20px', textAlign: 'left' }}>
                    <Header />
                    <Outlet />
                </Layout.Content>
                {auth && (
                    <div style={{ textAlign: 'center', margin: '0 auto 30px auto' }}>
                        <Button onClick={() => navigate('/')} type='link'>
                            Início
                        </Button>
                        <Button onClick={() => navigate('/perfil')} type='link'>
                            Perfil
                        </Button>
                        <Button
                            onClick={() => logout().then(() => (window.location.href = '/'))}
                            type='link'
                        >
                            Sair
                        </Button>
                    </div>
                )}
                {!auth && (
                    <div style={{ textAlign: 'center', margin: '0 auto 30px auto' }}>
                        <Button onClick={() => navigate(-1)} type='link'>
                            Voltar
                        </Button>
                    </div>
                )}
            </Layout>
        </Layout>
    );
};

export default Template;
