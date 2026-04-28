import { LogoutOutlined, StarFilled } from "@ant-design/icons";
import { App as AntApp, Button, Card, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/theme";

export default function DriverProfile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { message, modal } = AntApp.useApp();

  const initials =
    user?.name
      .split(" ")
      .map((p: any) => p[0])
      .slice(0, 2)
      .join("") || "MR";

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
        <Card style={{ textAlign: "center" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: colors.orangeBg,
              border: `2px solid ${colors.orange}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: colors.orange,
              fontWeight: 800,
              fontSize: 22,
              margin: "0 auto 10px",
            }}
          >
            {initials}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: colors.white }}>
            {user?.name}
          </div>
          <div style={{ fontSize: 11, color: colors.amber, marginTop: 4 }}>
            <StarFilled /> 4.9 • 142 corridas
          </div>
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
            <Form.Item
              label="Celular"
              name="phone"
              style={{ marginBottom: 10 }}
            >
              <Input />
            </Form.Item>
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
              Veículo
            </span>
          }
        >
          <Form
            initialValues={{ model: "Fiat Uno 2020", plate: "ABC-1234" }}
            layout="vertical"
            requiredMark={false}
          >
            <Form.Item label="Modelo" name="model" style={{ marginBottom: 10 }}>
              <Input />
            </Form.Item>
            <Form.Item label="Placa" name="plate" style={{ marginBottom: 0 }}>
              <Input style={{ textTransform: "uppercase", fontWeight: 700 }} />
            </Form.Item>
          </Form>
        </Card>

        <Button
          block
          danger
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            marginTop: "auto",
            background: "#2D1A1A",
            borderColor: "#3D1A1A",
          }}
        >
          Sair da conta
        </Button>
      </div>
    </div>
  );
}
