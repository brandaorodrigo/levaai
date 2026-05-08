import { EnvironmentFilled, PhoneOutlined } from "@ant-design/icons";
import { App as AntApp, Button, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { SiWaze } from "react-icons/si";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import PassengerRouteCard from "../../components/Common/PassengerRouteCard";
import { type ApiRide, formatCurrency, ridesApi } from "../../services/api";
import { colors } from "../../theme/theme";

export default function ActiveRidePage() {
  const [ride, setRide] = useState<ApiRide | null>(null);
  const [finishing, setFinishing] = useState(false);
  const navigate = useNavigate();
  const { rideId } = useParams<{ rideId: string }>();
  const { message } = AntApp.useApp();

  useEffect(() => {
    if (!rideId) return;
    ridesApi
      .getById(rideId)
      .then((data) => {
        setRide(data);
        ridesApi.updateStatus(rideId, "em_andamento").catch(() => {});
      })
      .catch(() => {});
  }, [rideId]);

  const openNavigation = (app: "waze" | "maps") => {
    const dest = encodeURIComponent(
      ride?.destination_full_address ?? "Destino"
    );
    const url =
      app === "waze"
        ? `https://waze.com/ul?q=${dest}`
        : `https://www.google.com/maps/dir/?api=1&destination=${dest}`;
    window.open(url, "_blank");
    message.info("Quando chegar, volte ao app para finalizar");
  };

  const handleFinish = async () => {
    if (!rideId) return;
    setFinishing(true);
    try {
      await ridesApi.updateStatus(rideId, "finalizada");
      navigate(`/driver/rate/${rideId}`);
    } catch {
      message.error("Erro ao finalizar corrida");
      setFinishing(false);
    }
  };

  const customer = ride?.customer;
  const initials =
    customer?.fullName
      ?.split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("") ?? "JC";

  const memberSince = customer?.createdAt
    ? `Cliente desde ${new Date(customer.createdAt).toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric",
      })}`
    : "Cliente";

  return (
    <div className="page-container">
      <PageHeader
        rightContent={
          <span style={{ fontSize: 16, fontWeight: 700, color: colors.orange }}>
            {ride?.estimated_value != null
              ? formatCurrency(ride.estimated_value)
              : "…"}
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
        {!ride ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Spin />
          </div>
        ) : (
          <>
            <PassengerRouteCard
              destination={{
                name: ride.destination_full_address,
                address: ride.destination_neighborhood,
              }}
              initials={initials}
              memberSince={memberSince}
              origin={{
                name: ride.origin.name,
                address: ride.origin.address,
              }}
              passengerName={customer?.fullName ?? "Passageiro"}
              rating={customer?.rating ?? 5}
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
                  {ride.purchase_size === "small"
                    ? "Passageiro com sacolas — Até 3 sacolas"
                    : ride.purchase_size === "large"
                    ? "Passageiro com sacolas — 6+ sacolas"
                    : "Passageiro com sacolas — Até 6 sacolas"}
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
                  O App vai continuar aberto no navegador. Quando chegar ao
                  destino, volte aqui para finalizar a corrida.
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
              loading={finishing}
              onClick={handleFinish}
              size="large"
              style={{ fontWeight: 700 }}
              type="primary"
            >
              Finalizar corrida
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
