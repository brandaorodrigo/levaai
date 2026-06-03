import { Button, Result } from 'antd';

const Falha = () => (
    <Result
        extra={
            <Button href='/' type='primary'>
                Voltar ao início
            </Button>
        }
        status='error'
        subTitle='Algo deu errado nesta tela.'
        title='Erro'
    />
);

export default Falha;
