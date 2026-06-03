import { Button, Card, Empty, Rate, Tag } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { moeda, textoSituacao, textoTamanho } from '@/App';
import Carregando from '@/components/Carregando';
import type { ClienteHistoricoItem } from '@/types';

const LIMITE = 20;

const ClienteHistorico = () => {
    const [itens, setItens] = useState<ClienteHistoricoItem[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [fim, setFim] = useState(false);

    const carregar = async (deslocamento: number) => {
        try {
            const { data: lote } = await axios.get<ClienteHistoricoItem[]>(
                '/api/cliente/corrida/historico',
                { params: { limite: LIMITE, deslocamento } },
            );
            setItens((atual) => (deslocamento === 0 ? lote : [...atual, ...lote]));
            setFim(lote.length < LIMITE);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        carregar(0);
    }, []);

    if (carregando) {
        return <Carregando />;
    }

    if (!itens.length) {
        return <Empty description='Nenhuma corrida ainda' />;
    }

    return (
        <>
            {itens.map(({ corrida, motorista }) => (
                <Card key={corrida.cod_corrida} size='small' style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>{dayjs(corrida.dta_criacao).format('DD/MM/YYYY HH:mm')}</span>
                        <strong>{moeda(corrida.vlr_corrida)}</strong>
                    </div>
                    <div style={{ margin: '6px 0' }}>
                        <Tag color={corrida.cod_origem_cancelamento ? 'red' : 'green'}>
                            {corrida.cod_origem_cancelamento
                                ? 'Cancelada'
                                : textoSituacao[corrida.cod_situacao_corrida]}
                        </Tag>
                    </div>
                    <div style={{ opacity: 0.8 }}>
                        {corrida.nme_bairro_destino} · compra{' '}
                        {textoTamanho[corrida.cod_tamanho_compra]}
                    </div>
                    {motorista && (
                        <div style={{ opacity: 0.6 }}>Motorista: {motorista.nme_motorista}</div>
                    )}
                    {corrida.vlr_avaliacao_cliente !== null && (
                        <Rate disabled value={corrida.vlr_avaliacao_cliente} />
                    )}
                </Card>
            ))}
            {!fim && (
                <Button block onClick={() => carregar(itens.length)} type='default'>
                    Carregar mais
                </Button>
            )}
        </>
    );
};

export default ClienteHistorico;
