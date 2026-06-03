// Mapa simples sem dependências externas: incorpora o OpenStreetMap com um marcador.
// Usado para mostrar a posição da contraparte durante a corrida.

interface Props {
    latitude: number | null | undefined;
    longitude: number | null | undefined;
    altura?: number;
}

const Mapa = ({ latitude, longitude, altura = 180 }: Props) => {
    if (
        latitude === null ||
        latitude === undefined ||
        longitude === null ||
        longitude === undefined
    ) {
        return null;
    }
    const delta = 0.01;
    const bbox = [longitude - delta, latitude - delta, longitude + delta, latitude + delta].join(
        ',',
    );
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`;
    return (
        <iframe
            height={altura}
            src={src}
            style={{ border: '1px solid var(--ant-color-border)', borderRadius: '4px' }}
            title='mapa'
            width='100%'
        />
    );
};

export default Mapa;
