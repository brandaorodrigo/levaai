import { Button, Layout, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { type Coordenada, distancia, tipo, token } from '@/App';

const MIN_METROS = 10;

const Tema = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const ultimaRef = useRef<Coordenada>(undefined);

    useEffect(() => {
        if (!token || !navigator.geolocation) {
            return;
        }
        const enviar = () => {
            navigator.geolocation.getCurrentPosition(({ coords }) => {
                const atual: Coordenada = { lat: coords.latitude, lon: coords.longitude };
                const ultima = ultimaRef.current;
                if (ultima && distancia(ultima, atual) < MIN_METROS) {
                    return;
                }
                ultimaRef.current = atual;
                axios.put(
                    `/api/${tipo}/localizacao`,
                    { vlr_latitude_atual: atual.lat, vlr_longitude_atual: atual.lon },
                    { silenciar: true },
                );
            });
        };
        enviar();
        const id = window.setInterval(enviar, 5000);
        return () => window.clearInterval(id);
    }, [token, tipo]);

    const sair = () => {
        window.localStorage.clear();
        window.location.href = '/';
    };

    return (
        <Layout style={{ backgroundColor: 'var(--ant-color-bg-base)', minHeight: '100vh' }}>
            <Layout style={{ margin: '0 auto', minHeight: '100vh', width: '320px' }}>
                <Layout.Content style={{ padding: '20px', textAlign: 'left' }}>
                    <Typography.Title level={2} style={{ marginBottom: '20px' }}>
                        Leva Aí!
                    </Typography.Title>
                    <Outlet />
                </Layout.Content>
                {token && (
                    <div style={{ margin: '0 auto 30px auto', textAlign: 'center' }}>
                        <Button onClick={() => navigate('/')} type='link'>
                            {tipo === 'cliente' ? 'Solicitar corrida' : 'Corridas'}
                        </Button>
                        <Button onClick={() => navigate('/historico')} type='link'>
                            Histórico
                        </Button>
                        <Button onClick={() => navigate('/atualizar')} type='link'>
                            Perfil
                        </Button>
                        <Button onClick={sair} type='link'>
                            Sair
                        </Button>
                    </div>
                )}
                {!token && location.pathname !== '/' && (
                    <div style={{ margin: '0 auto 30px auto', textAlign: 'center' }}>
                        <Button onClick={() => navigate(-1)} type='link'>
                            Voltar
                        </Button>
                    </div>
                )}
            </Layout>
        </Layout>
    );
};

export default Tema;
