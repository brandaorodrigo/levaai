import {
  HistoryOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../../components/Common/HomeHeader";

import { useAuth } from "../../context/AuthContext";
import { colors } from "../../theme/theme";

export default function PassengerHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="page-container">
      <HomeHeader
        name={user?.name || "Passageiro"}
        profilePath="/passenger/profile"
      />

      <div
        style={{
          flex: 1,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            background: `linear-gradient(135deg, ${colors.orange} 0%, ${colors.orangeDark} 100%)`,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Row style={{ marginBottom: 4 }}>
            <Col>
              <span
                style={{ fontSize: 20, fontWeight: 800, color: colors.white }}
              >
                Fez compras?
              </span>
            </Col>
          </Row>
          <Row style={{ marginBottom: 16 }}>
            <Col>
              <span style={{ fontSize: 12, color: colors.white, opacity: 0.9 }}>
                Chama um motorista que te espera com as sacolas
              </span>
            </Col>
          </Row>
          <Button
            block
            icon={<ShoppingOutlined />}
            onClick={() => navigate("/passenger/request")}
            size="large"
            style={{
              background: colors.white,
              color: colors.orange,
              border: "none",
              fontWeight: 800,
            }}
          >
            Chamar motorista
          </Button>
        </div>

        <Row gutter={10}>
          <Col span={12}>
            <ActionCard
              icon={
                <HistoryOutlined
                  style={{ fontSize: 22, color: colors.orange }}
                />
              }
              label="Minhas corridas"
              onClick={() => navigate("/passenger/history")}
            />
          </Col>
          <Col span={12}>
            <ActionCard
              icon={
                <UserOutlined style={{ fontSize: 22, color: colors.orange }} />
              }
              label="Meu perfil"
              onClick={() => navigate("/passenger/profile")}
            />
          </Col>
        </Row>

        <Card
          style={{ border: `1px solid ${colors.orangeBorder}` }}
          styles={{
            body: {
              background: colors.orangeBg,
              borderRadius: 12,
              padding: 14,
            },
          }}
        >
          <Row style={{ marginBottom: 4 }}>
            <Col>
              <span
                style={{
                  fontSize: 10,
                  color: colors.orange,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                Você já economizou
              </span>
            </Col>
          </Row>
          <Row>
            <Col>
              <span
                style={{ fontSize: 22, fontWeight: 800, color: colors.white }}
              >
                R$ 48,00
              </span>
            </Col>
          </Row>
          <Row style={{ marginTop: 2 }}>
            <Col>
              <span style={{ fontSize: 10, color: colors.gray3 }}>
                usando o Leva Só em 6 corridas
              </span>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
}

function ActionCard({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        background: colors.bg3,
        border: `1px solid ${colors.border}`,
        borderRadius: 12,
        padding: 16,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 10,
      }}
      type="button"
    >
      {icon}
      <span style={{ fontSize: 12, color: colors.white, fontWeight: 600 }}>
        {label}
      </span>
    </button>
  );
}
