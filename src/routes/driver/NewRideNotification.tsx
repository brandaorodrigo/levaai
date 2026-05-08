import { App as AntApp, Button, Col, Row, Spin } from "antd";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type ApiRide, driverApi, formatCurrency, ridesApi } from "../../services/api";
import { colors } from "../../theme/theme";

export default function NewRideNotification() {
  const [countdown, setCountdown] = useState(15);
  const [accepting, setAccepting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { message } = AntApp.useApp();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ride = (location.state as { ride: ApiRide } | null)?.ride;

  useEffect(() => {
    if (countdown === 0) {
      message.warning("Tempo esgotado — corrida passada para outro motorista");
      navigate("/driver");
      return;
    }
    timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown, navigate, message]);

  const handleAccept = async () => {
    if (!ride) return;
    setAccepting(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    try {
      const vehicles = await driverApi.getVehicles();
      const active = vehicles.find((v) => v.active) ?? vehicles[0];
      if (!active) {
        message.error("Nenhum veículo cadastrado. Adicione um veículo no perfil.");
        setAccepting(false);
        return;
      }
      await ridesApi.accept(ride.id, active.id);
      message.success("Corrida aceita! Boa viagem!");
      navigate(`/driver/in-ride/${ride.id}`);
    } catch {
      message.error("Erro ao aceitar corrida. Tente novamente.");
      setAccepting(false);
    }
  };

  const handleReject = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    navigate("/driver");
  };

  if (!ride) {
    return (
      <div className="page-container">
        <Row
          align="middle"
          justify="center"
          style={{ flex: 1, padding: 32, flexDirection: "column", gap: 16 }}
        >
          <Spin size="large" />
          <span style={{ color: colors.gray3, fontSize: 13 }}>
            Carregando corrida...
          </span>
        </Row>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Row align="middle" justify="center" style={{ flex: 1, padding: 16 }}>
        <Col
          style={{
            background: colors.bg3,
            borderRadius: 20,
            width: "100%",
            maxWidth: 400,
            overflow: "hidden",
            border: `1px solid ${colors.border}`,
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)",
          }}
        >
          <Row
            align="middle"
            justify="space-between"
            style={{ background: colors.orange, padding: "14px 16px" }}
          >
            <Col style={{ fontSize: 16, fontWeight: 800, color: colors.white }}>
              Nova corrida!
            </Col>
            <Col>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: colors.white,
                  background: "rgba(0,0,0,0.2)",
                  borderRadius: 10,
                  width: 44,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {countdown}
              </div>
            </Col>
          </Row>

          <div style={{ padding: "20px 16px 16px" }}>
            <div style={{ display: "flex", gap: 14 }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flexShrink: 0,
                  paddingTop: 2,
                }}
              >
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: colors.orange,
                    flexShrink: 0,
                  }}
                />
                <div
                  style={{
                    width: 2,
                    flex: 1,
                    minHeight: 40,
                    background: colors.border,
                    margin: "6px 0",
                  }}
                />
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: colors.green,
                    flexShrink: 0,
                  }}
                />
              </div>

              <div
                style={{ flex: 1, display: "flex", flexDirection: "column", gap: 28 }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: colors.gray3,
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    Saída
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: colors.white }}
                  >
                    {ride.origin.name}
                  </div>
                  <div style={{ fontSize: 11, color: colors.gray3, marginTop: 3 }}>
                    {ride.origin.address}
                  </div>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      color: colors.gray3,
                      fontWeight: 600,
                      marginBottom: 3,
                    }}
                  >
                    Destino
                  </div>
                  <div
                    style={{ fontSize: 14, fontWeight: 700, color: colors.white }}
                  >
                    {ride.destination_full_address}
                  </div>
                  <div style={{ fontSize: 11, color: colors.gray3, marginTop: 3 }}>
                    {ride.destination_neighborhood}
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                background: colors.orangeBg,
                border: `1px solid ${colors.orangeBorder}`,
                borderRadius: 10,
                padding: "12px 14px",
                marginTop: 20,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: colors.orange }}>
                Corrida com compras
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: colors.orange,
                  opacity: 0.8,
                  marginTop: 2,
                }}
              >
                {ride.purchase_size === "small"
                  ? "Até 3 sacolas"
                  : ride.purchase_size === "large"
                  ? "6+ sacolas"
                  : "Até 6 sacolas"}
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: colors.white,
                  marginTop: 8,
                  letterSpacing: "-0.5px",
                }}
              >
                {ride.estimated_value != null
                  ? formatCurrency(ride.estimated_value)
                  : "A definir"}
              </div>
            </div>
          </div>

          <Row style={{ padding: "0 16px 16px", gap: 8 }}>
            <Col flex="1">
              <Button
                block
                disabled={accepting}
                onClick={handleReject}
                size="large"
                style={{ backgroundColor: "#555555", color: colors.white }}
              >
                Recusar
              </Button>
            </Col>
            <Col flex="1">
              <Button
                block
                loading={accepting}
                onClick={handleAccept}
                size="large"
                type="primary"
              >
                Aceitar
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}
