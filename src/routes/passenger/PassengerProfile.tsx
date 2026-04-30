import { LogoutOutlined } from "@ant-design/icons";
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
} from "antd";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/theme";

export default function PassengerProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { message, modal } = AntApp.useApp();

  const initials =
    user?.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "JC";

  const handleLogout = () => {
    modal.confirm({
      title: "Sair da conta?",
      okText: "Sim, sair",
      cancelText: "Cancelar",
      onOk: () => {
        logout();
        navigate("/login");
      },
    });
  };

  return (
    <div className="page-container">
      <PageHeader
        rightContent={
          <span
            onClick={() => message.success("Salvo!")}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: colors.orange,
              cursor: "pointer",
            }}
          >
            Salvar
          </span>
        }
        title="Meu perfil"
      />

      <div
        style={{
          flex: 1,
          padding: 14,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Card>
          <Row justify="center" style={{ marginBottom: 10 }}>
            <Col>
              <Avatar
                size={64}
                style={{
                  background: colors.orangeBg,
                  border: `2px solid ${colors.orange}`,
                  color: colors.orange,
                  fontWeight: 800,
                  fontSize: 22,
                }}
              >
                {initials}
              </Avatar>
            </Col>
          </Row>
          <Row justify="center">
            <Col style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 14, fontWeight: 700, color: colors.white }}
              >
                {user?.name}
              </div>
              <div style={{ fontSize: 10, color: colors.gray3, marginTop: 2 }}>
                Cliente desde março 2025
              </div>
            </Col>
          </Row>
        </Card>

        <Card
          title={
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: colors.gray2,
              }}
            >
              Dados pessoais
            </span>
          }
        >
          <Form
            initialValues={{ name: user?.name, phone: user?.phone }}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item label="Nome" name="name" style={{ marginBottom: 10 }}>
              <Input />
            </Form.Item>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item
                  label="Celular"
                  name="phone"
                  style={{ marginBottom: 10 }}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="CPF" name="cpf" style={{ marginBottom: 10 }}>
                  <Input placeholder="000.000.000-00" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="E-mail" name="email" style={{ marginBottom: 0 }}>
              <Input placeholder="seu@email.com" />
            </Form.Item>
          </Form>
        </Card>

        <Card
          title={
            <span
              style={{
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: colors.gray2,
              }}
            >
              Endereço
            </span>
          }
        >
          <Form layout="vertical" requiredMark={false}>
            <Form.Item label="CEP" name="cep" style={{ marginBottom: 10 }}>
              <Input maxLength={9} placeholder="00000-000" />
            </Form.Item>
            <Form.Item label="Rua" name="street" style={{ marginBottom: 10 }}>
              <Input placeholder="Ex: Rua das Flores" />
            </Form.Item>
            <Row gutter={10}>
              <Col span={8}>
                <Form.Item
                  label="Número"
                  name="number"
                  style={{ marginBottom: 10 }}
                >
                  <Input placeholder="42" />
                </Form.Item>
              </Col>
              <Col span={16}>
                <Form.Item
                  label="Complemento"
                  name="complement"
                  style={{ marginBottom: 10 }}
                >
                  <Input placeholder="Apto, bloco..." />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              label="Bairro"
              name="neighborhood"
              style={{ marginBottom: 10 }}
            >
              <Input placeholder="Ex: Santa Cruz" />
            </Form.Item>
            <Row gutter={10}>
              <Col span={16}>
                <Form.Item
                  label="Cidade"
                  name="city"
                  style={{ marginBottom: 0 }}
                >
                  <Input placeholder="Contagem" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label="UF" name="state" style={{ marginBottom: 0 }}>
                  <Input maxLength={2} placeholder="MG" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Button
          block
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            background: "#5B3333",
            borderColor: "#EF4444",
            color: "#EF4444",
          }}
        >
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
