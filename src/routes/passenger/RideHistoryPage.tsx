import { ShoppingOutlined } from "@ant-design/icons";
import { Card, Col, Row, Spin } from "antd";
import { useEffect, useState } from "react";
import PageHeader from "../../components/Common/PageHeader";
import { type ApiRide, formatRideDate, ridesApi } from "../../services/api";
import { colors } from "../../theme/theme";

export default function RideHistoryPage() {
  const [rides, setRides] = useState<ApiRide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ridesApi
      .myRides({ limit: 20 })
      .then((data) => {
        const list = Array.isArray(data) ? data : (data as any).data ?? [];
        setRides(list);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const completed = rides.filter((r) => r.status === "finalizada");
  const totalSpent = completed.reduce(
    (sum, r) => sum + (r.estimated_value ?? 0),
    0
  );

  return (
    <div className="page-container">
      <PageHeader title="Minhas corridas" />

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
        {completed.length > 0 && (
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
            <div
              style={{
                fontSize: 9,
                color: colors.orange,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 4,
              }}
            >
              Total em corridas
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, color: colors.white }}>
              R$ {totalSpent.toFixed(2).replace(".", ",")}
            </div>
            <div style={{ fontSize: 10, color: colors.gray3, marginTop: 2 }}>
              {completed.length} corrida{completed.length !== 1 ? "s" : ""}{" "}
              realizadas
            </div>
          </Card>
        )}

        <div
          style={{
            fontSize: 10,
            color: colors.gray3,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            marginTop: 4,
          }}
        >
          Últimas corridas
        </div>

        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: 32 }}>
            <Spin />
          </div>
        )}

        {!loading && rides.length === 0 && (
          <div
            style={{
              textAlign: "center",
              color: colors.gray3,
              fontSize: 13,
              padding: 32,
            }}
          >
            Nenhuma corrida ainda
          </div>
        )}

        {rides.map((ride) => (
          <Card key={ride.id} styles={{ body: { padding: 12 } }}>
            <Row align="middle" style={{ gap: 10 }}>
              <Col>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    background: colors.orangeBg,
                    borderRadius: 9,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ShoppingOutlined
                    style={{ color: colors.orange, fontSize: 15 }}
                  />
                </div>
              </Col>
              <Col flex={1}>
                <div style={{ fontSize: 9, color: colors.gray3 }}>
                  {formatRideDate(ride.created_at)}
                </div>
                <div
                  style={{ fontSize: 11, fontWeight: 700, color: colors.white }}
                >
                  {ride.origin.name} → {ride.destination_neighborhood}
                </div>
              </Col>
              <Col>
                {ride.estimated_value != null ? (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: colors.orange,
                    }}
                  >
                    R$ {ride.estimated_value.toFixed(2).replace(".", ",")}
                  </span>
                ) : (
                  <span style={{ fontSize: 11, color: colors.gray3 }}>
                    —
                  </span>
                )}
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}
