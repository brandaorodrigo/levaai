import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { colors } from "../../theme/theme";

export default function PassengerRegisterStep1() {
  const navigate = useNavigate();

  const handleContinue = (values: {
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) => {
    navigate("/register/endereco", {
      state: {
        name: values.name,
        phone: values.phone,
        password: values.password,
      },
    });
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
              background: colors.border,
            }}
          />
        </div>
        <div style={{ fontSize: 11, color: colors.gray2, marginBottom: 36 }}>
          Passo 1 de 2
        </div>

        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: colors.white,
            marginBottom: 8,
          }}
        >
          Seus dados de acesso
        </div>
        <div style={{ fontSize: 13, color: colors.gray2, marginBottom: 28 }}>
          Usamos para identificar você nas corridas
        </div>

        <Form
          layout="vertical"
          onFinish={handleContinue}
          requiredMark={false}
          style={{ flex: 1, display: "flex", flexDirection: "column" }}
        >
          <Form.Item
            label="Nome completo"
            name="name"
            rules={[{ required: true, message: "Informe seu nome" }]}
            style={{ marginBottom: 14 }}
          >
            <Input autoFocus />
          </Form.Item>

          <Form.Item
            label="Celular"
            name="phone"
            rules={[{ required: true, message: "Informe seu celular" }]}
            style={{ marginBottom: 14 }}
          >
            <Input placeholder="(00) 00000-0000" />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: "Informe uma senha" }]}
            style={{ marginBottom: 14 }}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Confirmar senha"
            name="confirmPassword"
            rules={[
              { required: true, message: "Confirme sua senha" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("As senhas não coincidem"));
                },
              }),
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input.Password />
          </Form.Item>

          <div style={{ flex: 1 }} />

          <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
            <Button
              block
              htmlType="submit"
              size="large"
              style={{ height: 52, fontSize: 15, fontWeight: 700 }}
              type="primary"
            >
              Continuar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
