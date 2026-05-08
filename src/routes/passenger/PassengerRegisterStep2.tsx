import { App as AntApp, Button, Col, Form, Input, Row } from "antd";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { locationApi } from "../../services/api";
import { colors } from "../../theme/theme";

interface Step1Data {
  name: string;
  phone: string;
  password: string;
}

export default function PassengerRegisterStep2() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { message } = AntApp.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);

  const step1Data = (location.state as Step1Data) || {};

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length !== 8) {
      return;
    }
    setCepLoading(true);
    try {
      const cep = `${raw.slice(0, 5)}-${raw.slice(5)}`;
      const data = await locationApi.lookupCep(cep);
      form.setFieldsValue({
        street: data.street || "",
        neighborhood: data.neighborhood || "",
      });
    } catch {
      message.warning("CEP não encontrado. Preencha o endereço manualmente.");
    } finally {
      setCepLoading(false);
    }
  };

  const handleRegister = async (values: {
    cep: string;
    street: string;
    neighborhood: string;
    number: string;
    complement?: string;
  }) => {
    if (!step1Data.name || !step1Data.phone || !step1Data.password) {
      message.error("Dados incompletos. Volte ao passo 1.");
      navigate("/register");
      return;
    }
    setLoading(true);
    try {
      await register({
        name: step1Data.name,
        phone: step1Data.phone,
        password: step1Data.password,
        postalCode: values.cep.replace(/\D/g, ""),
        address: values.street,
        neighborhood: values.neighborhood,
        number: values.number,
        complement: values.complement,
      });
      navigate("/passenger", { replace: true });
    } catch {
      message.error("Erro ao criar conta. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title="Criar conta" />

      <div
        style={{
          flex: 1,
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <div
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: colors.orange,
            }}
          />
          <div
            style={{
              flex: 1,
              height: 3,
              borderRadius: 2,
              background: colors.orange,
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: colors.gray2, marginBottom: 36 }}>
          Passo 2 de 2 - Quase lá!
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: colors.white,
            marginBottom: 8,
          }}
        >
          Aonde você mora?
        </div>
        <div style={{ fontSize: 13, color: colors.gray2, marginBottom: 28 }}>
          Deixamos pré definido para você não ter que digitar sempre
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleRegister}
          requiredMark={false}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Form.Item
            label="CEP"
            name="cep"
            rules={[{ required: true, message: "Informe o CEP" }]}
            style={{ marginBottom: 14 }}
          >
            <Input
              autoFocus
              disabled={cepLoading}
              maxLength={9}
              onBlur={handleCepBlur}
              placeholder="00000-000"
            />
          </Form.Item>

          <Form.Item
            label="Endereço"
            name="street"
            rules={[{ required: true, message: "Informe o endereço" }]}
            style={{ marginBottom: 14 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Bairro"
            name="neighborhood"
            rules={[{ required: true, message: "Informe o bairro" }]}
            style={{ marginBottom: 14 }}
          >
            <Input />
          </Form.Item>

          <Row gutter={10} style={{ marginBottom: 0 }}>
            <Col span={10}>
              <Form.Item
                label="Número"
                name="number"
                rules={[{ required: true, message: "Número" }]}
                style={{ marginBottom: 0 }}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item
                label="Complemento (opcional)"
                name="complement"
                style={{ marginBottom: 0 }}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ flex: 1 }} />

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button
              block
              htmlType="submit"
              loading={loading || cepLoading}
              size="large"
              style={{ height: 52, fontSize: 15, fontWeight: 700 }}
              type="primary"
            >
              Criar minha conta!
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
