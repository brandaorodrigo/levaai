import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { App, Button, Card, Col, Divider, Flex, Form, Grid, Input, Row } from 'antd';
//import axios from "axios";
import { useState } from 'react';
import { FaLock, FaUser } from 'react-icons/fa';

type LoginValues = {
    username: string;
    password: string;
};

const Signin: React.FC = () => {
    const screen = Grid.useBreakpoint();
    const [loading, setLoading] = useState(false);
    const { message } = App.useApp();
    const [form] = Form.useForm();

    const onFinish = async (input: LoginValues) => {
        setLoading(true);
        try {
            // const { data } = await axios.post('/api/entrar', input);
            window.localStorage.setItem('user', JSON.stringify(input));
            window.location.href = import.meta.env.BASE_URL;
        } catch {
            message.error('USUÁRIO OU SENHA INVÁLIDOS');
        } finally {
            setLoading(false);
        }
    };

    const onGoogle = async (credentialResponse: any) => {
        const credential = credentialResponse.credential;
        const payload = JSON.parse(atob(credential.split('.')[1]));
        const email = payload.email;
        onFinish({ username: email, password: `google::${credential}` });
    };

    return (
        <Flex align='center' justify='center'>
            <Row align='middle' justify='center'>
                <Col span={24} style={{ maxWidth: '360px' }}>
                    <Form<LoginValues>
                        form={form}
                        layout='vertical'
                        onFinish={onFinish}
                        requiredMark={false}
                    >
                        <Card style={{ minWidth: screen.xl ? '250px' : 'auto', width: '100%' }}>
                            <Row gutter={[20, 20]}>
                                <Col span={24}>
                                    <Form.Item
                                        className='nolabel'
                                        label='USUÁRIO'
                                        name='username'
                                        rules={[{ required: true }]}
                                    >
                                        <Input
                                            autoComplete='username'
                                            autoFocus
                                            placeholder='USUÁRIO'
                                            prefix={<FaUser style={{ marginRight: 5 }} />}
                                            style={{ textTransform: 'lowercase' }}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item
                                        className='nolabel'
                                        label='SENHA'
                                        name='password'
                                        rules={[{ required: true }]}
                                    >
                                        <Input.Password
                                            autoComplete='current-password'
                                            placeholder='SENHA'
                                            prefix={<FaLock style={{ marginRight: 5 }} />}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Form.Item>
                                        <Button
                                            block
                                            htmlType='submit'
                                            loading={loading}
                                            type='primary'
                                        >
                                            ENTRAR
                                        </Button>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <Divider style={{ margin: 0 }}>OU</Divider>
                                </Col>
                                <Col span={24}>
                                    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE}>
                                        <GoogleLogin
                                            auto_select
                                            onError={() =>
                                                message.error('ERRO AO FAZER LOGIN COM GOOGLE')
                                            }
                                            onSuccess={onGoogle}
                                            shape='rectangular'
                                            size='large'
                                            text='signin_with'
                                            width='295px'
                                        />
                                    </GoogleOAuthProvider>
                                </Col>
                            </Row>
                        </Card>
                    </Form>
                </Col>
            </Row>
        </Flex>
    );
};

export default Signin;
