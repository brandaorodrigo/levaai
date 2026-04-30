import {
  ClockCircleOutlined,
  PhoneOutlined,
  ShoppingOutlined,
  StarFilled,
} from "@ant-design/icons";
import { App as AntApp, Avatar, Button, Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { colors } from "../../theme/theme";

export default function TrackRidePage() {
  const [eta, setEta] = useState(4);
  const navigate = useNavigate();
  const { message, modal } = AntApp.useApp();

  useEffect(() => {
    const t = setInterval(() => {
      setEta((prev) => (prev > 1 ? prev - 1 : prev));
    }, 60000);
    return () => clearInterval(t);
  }, []);

  const handleCancel = () => {
    modal.confirm({
      title: "Cancelar corrida?",
      content: "Cancelamentos após 2 minutos podem gerar taxa.",
      okText: "Sim, cancelar",
      cancelText: "Voltar",
      cancelButtonProps: {
        style: {
          backgroundColor: colors.orangeBg,
          borderColor: colors.orange,
          color: colors.orange,
        },
      },
      okButtonProps: {
        style: {
          background: colors.orange,
          borderColor: colors.orange,
          color: colors.white,
        },
      },
      onOk: () => {
        message.success("Corrida cancelada");
        navigate("/passenger");
      },
    });
  };

  return (
    <div className="page-container">
      <PageHeader showBack={false} title="Motorista a caminho!" />

      <div
        style={{
          flex: 1,
          padding: 14,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          overflowY: "auto",
        }}
      >
        <Row
          align="middle"
          style={{
            background: colors.orangeBg,
            border: `1px solid ${colors.orange}`,
            borderRadius: 14,
            padding: 16,
            gap: 14,
          }}
        >
          <Col>
            <div
              style={{
                width: 48,
                height: 48,
                background: colors.orange,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ClockCircleOutlined
                style={{ fontSize: 24, color: colors.white }}
              />
            </div>
          </Col>
          <Col>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.white }}>
              {eta} {eta === 1 ? "minuto" : "minutos"}
            </div>
            <div
              style={{ fontSize: 11, color: colors.orange, fontWeight: 600 }}
            >
              Motorista a caminho
            </div>
          </Col>
        </Row>

        <Card styles={{ body: { padding: 12 } }}>
          <Row align="middle" style={{ gap: 10 }}>
            <Col>
              <Avatar
                size={42}
                style={{
                  background: colors.orangeBg,
                  border: `2px solid ${colors.orange}`,
                  color: colors.orange,
                  fontWeight: 800,
                  fontSize: 14,
                }}
              >
                MR
              </Avatar>
            </Col>
            <Col flex={1}>
              <div
                style={{ fontSize: 13, fontWeight: 700, color: colors.white }}
              >
                Marcos Ribeiro
              </div>
              <div style={{ fontSize: 10, color: colors.gray3 }}>
                Fiat Uno branco • ABC-1234
              </div>
            </Col>
            <Col>
              <Row align="middle" style={{ gap: 3 }}>
                <Col>
                  <StarFilled style={{ fontSize: 12, color: colors.amber }} />
                </Col>
                <Col>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: colors.amber,
                    }}
                  >
                    4.9
                  </span>
                </Col>
              </Row>
            </Col>
            <Col>
              <Button
                icon={<PhoneOutlined style={{ color: colors.orange }} />}
                onClick={() => message.info("Ligando para o motorista...")}
                shape="circle"
                style={{
                  background: colors.bg5,
                  border: `1px solid ${colors.border}`,
                }}
              />
            </Col>
          </Row>
        </Card>

        <Card styles={{ body: { padding: 12 } }}>
          <Row align="middle" style={{ gap: 10 }}>
            <Col
              style={{
                width: 11,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: colors.orange,
                }}
              />
            </Col>
            <Col flex={1}>
              <div
                style={{ fontSize: 9, color: colors.gray3, fontWeight: 600 }}
              >
                Embarque
              </div>
              <div
                style={{ fontSize: 11, fontWeight: 600, color: colors.white }}
              >
                Extra Supermercado — Av. Brasil
              </div>
            </Col>
          </Row>

          <Row style={{ gap: 10 }}>
            <Col
              style={{
                width: 11,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 1.5,
                  height: 18,
                  background: colors.border,
                  margin: "3px 0",
                }}
              />
            </Col>
          </Row>

          <Row align="middle" style={{ gap: 10 }}>
            <Col
              style={{
                width: 11,
                flexShrink: 0,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: colors.green,
                }}
              />
            </Col>
            <Col flex={1}>
              <div
                style={{ fontSize: 9, color: colors.gray3, fontWeight: 600 }}
              >
                Destino
              </div>
              <div
                style={{ fontSize: 11, fontWeight: 600, color: colors.white }}
              >
                Rua das Flores, 42
              </div>
            </Col>
          </Row>
        </Card>

        <Row
          align="middle"
          style={{
            background: colors.orangeBg,
            border: `1px solid ${colors.orangeBorder}`,
            borderRadius: 8,
            padding: "9px 12px",
            gap: 8,
          }}
        >
          <Col>
            <ShoppingOutlined style={{ color: colors.orange }} />
          </Col>
          <Col>
            <span
              style={{ fontSize: 10, color: colors.orange, fontWeight: 600 }}
            >
              Motorista ciente das suas compras
            </span>
          </Col>
        </Row>

        <Button
          block
          danger
          onClick={handleCancel}
          size="large"
          style={{
            marginTop: "auto",
            background: "#5B3333",
            borderColor: "#EF4444",
            color: "#EF4444",
          }}
        >
          Cancelar corrida
        </Button>
      </div>
    </div>
  );
}
