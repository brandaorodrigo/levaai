import { EnvironmentFilled, PhoneOutlined } from "@ant-design/icons";
import { App as AntApp, Button, Col, Row } from "antd";
import { SiWaze } from "react-icons/si";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import PassengerRouteCard from "../../components/Common/PassengerRouteCard";
import { colors } from "../../theme/theme";

export default function ActiveRidePage() {
  const navigate = useNavigate();
  const { rideId } = useParams();
  const { message } = AntApp.useApp();

  const openNavigation = (app: "waze" | "maps") => {
    const dest = encodeURIComponent("Rua das Flores, 42, Contagem, MG");
    const url =
      app === "waze"
        ? `https://waze.com/ul?q=${dest}`
        : `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    window.open(url, "_blank");
    message.info("Quando chegar, volte ao app para finalizar");
  };

  const handleFinish = () => {
    navigate(`/driver/rate/${rideId || "ride_123"}`);
  };

  return (
    <div className="page-container">
      <PageHeader
        rightContent={
          <span style={{ fontSize: 16, fontWeight: 700, color: colors.orange }}>
            R$ 22,50
          </span>
        }
        showBack={false}
        title="Em corrida"
      />

      <div
        style={{
          flex: 1,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          overflowY: "auto",
        }}
      >
        <PassengerRouteCard
          destination={{
            name: "Rua das flores, 42",
            address: "Bairro Santa Cruz - Contagem",
          }}
          initials="JC"
          memberSince="Cliente desde Março de 2025"
          origin={{
            name: "Extra Supermercado",
            address: "Av. Brasil, 1200 - Contagem",
          }}
          passengerName="João Carlos"
          rating={4.9}
        />

        <Row
          align="middle"
          justify="center"
          style={{
            border: `1.5px solid ${colors.orange}`,
            borderRadius: 8,
            padding: "12px 16px",
          }}
        >
          <Col>
            <span
              style={{ fontSize: 11, fontWeight: 600, color: colors.orange }}
            >
              Passageiro com sacolas — Até 6 sacolas
            </span>
          </Col>
        </Row>

        <Button
          block
          icon={<PhoneOutlined />}
          onClick={() => message.info("Ligando...")}
          size="large"
          style={{ fontWeight: 700, fontSize: 15 }}
          type="primary"
        >
          Ligar para o passageiro
        </Button>

        <Row
          align="middle"
          justify="center"
          style={{
            border: `1.5px solid ${colors.orange}`,
            borderRadius: 8,
            padding: "12px 16px",
          }}
        >
          <Col>
            <span
              style={{ fontSize: 11, fontWeight: 600, color: colors.orange }}
            >
              O App vai continuar aberto no navegador. Quando chegar ao destino,
              volte aqui para finalizar a corrida.
            </span>
          </Col>
        </Row>

        <Col>
          <Row style={{ marginBottom: 10 }}>
            <Col>
              <span
                style={{
                  fontSize: 10,
                  color: colors.gray3,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                ABRIR NAVEGAÇÃO EM
              </span>
            </Col>
          </Row>
          <Row style={{ gap: 8 }}>
            <Col flex="1">
              <button
                onClick={() => openNavigation("waze")}
                style={{
                  width: "100%",
                  height: 88,
                  background: colors.bg3,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
                type="button"
              >
                <SiWaze color="#26C6DA" size={36} />
                <span
                  style={{ fontSize: 12, color: colors.white, fontWeight: 600 }}
                >
                  Waze
                </span>
              </button>
            </Col>
            <Col flex="1">
              <button
                onClick={() => openNavigation("maps")}
                style={{
                  width: "100%",
                  height: 88,
                  background: colors.bg3,
                  border: `1px solid ${colors.border}`,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
                type="button"
              >
                <EnvironmentFilled style={{ fontSize: 36, color: "#EA4335" }} />
                <span
                  style={{ fontSize: 12, color: colors.white, fontWeight: 600 }}
                >
                  Google Maps
                </span>
              </button>
            </Col>
          </Row>
        </Col>

        <Row align="middle" style={{ gap: 8 }}>
          <Col flex={1}>
            <div style={{ height: 1, background: colors.border }} />
          </Col>
          <Col>
            <span style={{ fontSize: 9, color: colors.gray4, fontWeight: 600 }}>
              QUANDO CHEGAR NO DESTINO
            </span>
          </Col>
          <Col flex={1}>
            <div style={{ height: 1, background: colors.border }} />
          </Col>
        </Row>

        <Button
          block
          onClick={handleFinish}
          size="large"
          style={{ fontWeight: 700 }}
          type="primary"
        >
          Finalizar corrida
        </Button>
      </div>
    </div>
  );
}
