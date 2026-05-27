import { Button, Layout } from 'antd';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { auth, logout } from './App';
import Header from './Header';

const Template = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const lastLocationRef = useRef<{ latitude: number; longitude: number }>();

    useEffect(() => {
        if (!auth?.accessToken || !navigator.geolocation) {
            return;
        }
        const role = auth?.user?.role === 'passenger' ? 'customers' : 'drivers';
        const sendLocation = () => {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const { latitude, longitude } = coords;
                const last = lastLocationRef.current;
                if (
                    String(last?.latitude) === String(latitude) &&
                    String(last?.longitude) === String(longitude)
                ) {
                    return;
                }
                lastLocationRef.current = { latitude, longitude };
                axios.patch(`users/${role}/me/location`, {
                    latitude,
                    longitude,
                });
            });
        };
        sendLocation();
        const intervalId = window.setInterval(sendLocation, 5000);
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
                {auth?.accessToken && (
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
                {!auth?.accessToken && location.pathname !== '/' && (
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
