import { Button, Card, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import PassengerRouteCard from "../../components/Common/PassengerRouteCard";
import { type ApiRide, formatCurrency, ridesApi } from "../../services/api";
import { colors } from "../../theme/theme";

const TIME_OPTIONS = [
  { display: "5", unit: "min", value: "5 min" },
  { display: "10", unit: "min", value: "10 min" },
  { display: "15", unit: "min", value: "15 min" },
  { display: "+20", unit: "", value: "+20 min" },
];

export default function InRidePage() {
  const [selectedTime, setSelectedTime] = useState("10 min");
  const [ride, setRide] = useState<ApiRide | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { rideId } = useParams<{ rideId: string }>();

  useEffect(() => {
    if (!rideId) return;
    ridesApi.getById(rideId).then(setRide).catch(() => {});
  }, [rideId]);

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

  const handleNotify = async () => {
    if (!rideId) return;
    setLoading(true);
    try {
      await ridesApi.updateStatus(rideId, "motorista_no_local");
    } catch {}
    navigate(`/driver/active-ride/${rideId}`);
  };

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

            <Card styles={{ body: { padding: "14px 16px" } }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: colors.white,
                  marginBottom: 4,
                }}
              >
                Quanto tempo você leva até o passageiro?
              </div>
              <div style={{ fontSize: 11, color: colors.gray3, marginBottom: 14 }}>
                Ele será informado com o seu tempo estimado
              </div>
              <Row style={{ gap: 8 }}>
                {TIME_OPTIONS.map((t) => {
                  const selected = selectedTime === t.value;
                  return (
                    <Col flex="1" key={t.value}>
                      <button
                        onClick={() => setSelectedTime(t.value)}
                        style={{
                          width: "100%",
                          borderRadius: 8,
                          border: `${selected ? 2 : 1}px solid ${
                            selected ? colors.orange : colors.border
                          }`,
                          background: selected ? colors.orangeBg : colors.bg5,
                          color: selected ? colors.orange : colors.gray2,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px 4px",
                          cursor: "pointer",
                          minHeight: 58,
                        }}
                        type="button"
                      >
                        <span
                          style={{ fontSize: 18, fontWeight: 800, lineHeight: 1 }}
                        >
                          {t.display}
                        </span>
                        {t.unit && (
                          <span style={{ fontSize: 10, fontWeight: 500, marginTop: 3 }}>
                            {t.unit}
                          </span>
                        )}
                      </button>
                    </Col>
                  );
                })}
              </Row>
            </Card>

            <Button
              block
              loading={loading}
              onClick={handleNotify}
              size="large"
              style={{ fontWeight: 700, fontSize: 15 }}
              type="primary"
            >
              Avisar ao passageiro — Chego em {selectedTime}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
