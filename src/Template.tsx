import { Button, Layout, Typography } from 'antd';
import axios from 'axios';
import { useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { type Coordenada, distancia, getTipo, getToken, limparSessao } from './App';

const MIN_METROS = 10;

const Template = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = getToken();
    const tipo = getTipo();
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
                const url =
                    tipo === 'cliente' ? '/api/cliente/localizacao' : '/api/motorista/localizacao';
                axios
                    .put(
                        url,
                        { vlr_latitude_atual: atual.lat, vlr_longitude_atual: atual.lon },
                        { silenciar: true },
                    )
                    .catch(() => {});
            });
        };
        enviar();
        const id = window.setInterval(enviar, 5000);
        return () => window.clearInterval(id);
    }, [token, tipo]);

    const sair = () => {
        limparSessao();
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
                            Início
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

export default Template;
