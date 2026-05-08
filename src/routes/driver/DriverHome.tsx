import {
  ArrowRightOutlined,
  RightOutlined,
  ShoppingOutlined,
  StarFilled,
} from "@ant-design/icons";
import { Avatar, Card, Col, Divider, Row, Spin, Switch } from "antd";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  type ApiRide,
  type DriverDashboard,
  driverApi,
  formatRideDate,
  ridesApi,
} from "../../services/api";
import { colors } from "../../theme/theme";

export default function DriverHome() {
  const [online, setOnline] = useState(false);
  const [dashboard, setDashboard] = useState<DriverDashboard | null>(null);
  const [recentRides, setRecentRides] = useState<ApiRide[]>([]);
  const [statusLoading, setStatusLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const shownRideRef = useRef<string | null>(null);

  const initials =
    user?.name
      .split(" ")
      .map((p: string) => p[0])
      .slice(0, 2)
      .join("") || "MR";

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) {
      return "Bom dia";
    }
    if (h < 18) {
      return "Boa tarde";
    }
    return "Boa noite";
  })();

  useEffect(() => {
    driverApi
      .dashboard()
      .then((data) => {
        setDashboard(data);
        if (data.active_ride) {
          setOnline(true);
        }
      })
      .catch(() => {});

    ridesApi
      .myRides({ limit: 5 })
      .then((data) => {
        const list = Array.isArray(data) ? data : ((data as any).data ?? []);
        setRecentRides(list.filter((r: ApiRide) => r.status === "finalizada"));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!online) {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
      return;
    }

    const checkRides = async () => {
      try {
        const rides = await ridesApi.available();
        if (rides.length > 0 && rides[0].id !== shownRideRef.current) {
          shownRideRef.current = rides[0].id;
          navigate("/driver/new-ride", { state: { ride: rides[0] } });
        }
      } catch {}
    };

    checkRides();
    pollRef.current = setInterval(checkRides, 10000);
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
      }
    };
  }, [online, navigate]);

  const handleToggleStatus = async (checked: boolean) => {
    setStatusLoading(true);
    try {
      await driverApi.setStatus(checked ? "ativo" : "inativo");
      setOnline(checked);
    } catch {
      // revert if API fails
    } finally {
      setStatusLoading(false);
    }
  };

  const today = dashboard?.today_stats;
  const week = dashboard?.week_stats;
  const rating = dashboard?.general_stats?.averageRating;

  return (
    <div className="page-container">
      <Row
        align="middle"
        justify="space-between"
        style={{ background: "#000", padding: "20px 20px" }}
      >
        <Col
          onClick={() => navigate("/driver/profile")}
          style={{ cursor: "pointer" }}
        >
          <Row align="middle" style={{ gap: 14 }}>
            <Col style={{ position: "relative" }}>
              <Avatar
                size={52}
                style={{
                  background: colors.orangeBg,
                  border: `2px solid ${colors.orange}`,
                  color: colors.orange,
                  fontWeight: 800,
                  fontSize: 17,
                }}
              >
                {initials}
              </Avatar>
              {online && (
                <div
                  style={{
                    position: "absolute",
                    bottom: 1,
                    right: 1,
                    width: 12,
                    height: 12,
                    background: colors.green,
                    borderRadius: "50%",
                    border: "2px solid #000",
                  }}
                />
              )}
            </Col>
            <Col>
              <div
                style={{ fontSize: 12, color: colors.gray3, fontWeight: 500 }}
              >
                {greeting},
              </div>
              <Row align="middle" style={{ gap: 5 }}>
                <Col>
                  <div
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: colors.white,
                    }}
                  >
                    {user?.name.split(" ")[0]}
                  </div>
                </Col>
                <Col>
                  <RightOutlined
                    style={{ fontSize: 11, color: colors.gray3 }}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>

        <Col>
          <Row align="middle" style={{ gap: 10 }}>
            <Col>
              <span
                style={{ fontSize: 13, color: colors.gray2, fontWeight: 600 }}
              >
                {online ? "Online" : "Offline"}
              </span>
            </Col>
            <Col>
              <Switch
                checked={online}
                loading={statusLoading}
                onChange={handleToggleStatus}
              />
            </Col>
          </Row>
        </Col>
      </Row>

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
        <Card styles={{ body: { padding: "12px 14px" } }}>
          <Row align="middle" style={{ gap: 10 }}>
            <Col>
              <span
                style={{
                  padding: "5px 12px",
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 700,
                  background: online ? colors.orange : colors.bg5,
                  color: online ? colors.white : colors.gray3,
                }}
              >
                {online ? "Online" : "Offline"}
              </span>
            </Col>
            <Col flex={1}>
              <span style={{ fontSize: 11, color: colors.gray3 }}>
                {online ? "Aguardando solicitações..." : "Você está offline"}
              </span>
            </Col>
          </Row>
        </Card>

        <Row gutter={[8, 8]}>
          <Col span={12}>
            <StatCard
              color={colors.orange}
              label="Ganhos hoje"
              value={
                dashboard
                  ? `R$ ${(today?.earnings ?? 0).toFixed(2).replace(".", ",")}`
                  : "—"
              }
            />
          </Col>
          <Col span={12}>
            <StatCard
              label="Corridas hoje"
              value={dashboard ? String(today?.rides ?? 0) : "—"}
            />
          </Col>
          <Col span={12}>
            <StatCard
              color={colors.amber}
              label="Avaliação"
              value={
                rating != null ? (
                  <>
                    <StarFilled /> {rating.toFixed(1)}
                  </>
                ) : (
                  "—"
                )
              }
            />
          </Col>
          <Col span={12}>
            <StatCard
              color={colors.orange}
              label="Esta semana"
              value={
                dashboard
                  ? `R$ ${(week?.earnings ?? 0).toFixed(2).replace(".", ",")}`
                  : "—"
              }
            />
          </Col>
        </Row>

        <Row
          align="middle"
          style={{
            background: colors.orangeBg,
            borderRadius: 11,
            padding: "11px 12px",
            border: `1px solid ${colors.orangeBorder}`,
            gap: 10,
          }}
        >
          <Col>
            <ShoppingOutlined style={{ color: colors.orange, fontSize: 15 }} />
          </Col>
          <Col>
            <span
              style={{ fontSize: 11, fontWeight: 600, color: colors.orange }}
            >
              Corridas com compras pagam até 20% a mais!
            </span>
          </Col>
        </Row>

        <Card styles={{ body: { padding: "14px 16px" } }}>
          <div
            style={{
              fontSize: 10,
              color: colors.gray3,
              fontWeight: 700,
              letterSpacing: "0.08em",
              marginBottom: 4,
            }}
          >
            ÚLTIMAS CORRIDAS
          </div>
          {!dashboard && (
            <div
              style={{ display: "flex", justifyContent: "center", padding: 16 }}
            >
              <Spin size="small" />
            </div>
          )}
          {dashboard && recentRides.length === 0 && (
            <div
              style={{ fontSize: 11, color: colors.gray3, padding: "8px 0" }}
            >
              Nenhuma corrida ainda
            </div>
          )}
          {recentRides.map((ride, i) => (
            <div key={ride.id}>
              <Row
                align="middle"
                justify="space-between"
                style={{ padding: "11px 0" }}
              >
                <Col flex={1} style={{ minWidth: 0 }}>
                  <div
                    style={{ fontSize: 10, color: colors.gray4, marginTop: 3 }}
                  >
                    {formatRideDate(ride.created_at)}
                  </div>
                  <Row align="middle" style={{ gap: 4, flexWrap: "nowrap" }}>
                    <Col
                      style={{
                        fontWeight: 700,
                        color: colors.white,
                        fontSize: 11,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ride.origin.name}
                    </Col>
                    <Col style={{ flexShrink: 0 }}>
                      <ArrowRightOutlined
                        style={{ fontSize: 9, color: colors.gray3 }}
                      />
                    </Col>
                    <Col
                      style={{
                        color: colors.gray2,
                        fontSize: 11,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {ride.destination_neighborhood}
                    </Col>
                  </Row>
                </Col>
                {ride.estimated_value != null && (
                  <Col
                    style={{
                      color: colors.orange,
                      fontWeight: 700,
                      fontSize: 13,
                      flexShrink: 0,
                      paddingLeft: 12,
                    }}
                  >
                    +R$ {ride.estimated_value.toFixed(2).replace(".", ",")}
                  </Col>
                )}
              </Row>
              {i < recentRides.length - 1 && (
                <Divider style={{ margin: 0, borderColor: colors.border }} />
              )}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color = colors.white,
}: {
  label: string;
  value: React.ReactNode;
  color?: string;
}) {
  return (
    <Card styles={{ body: { padding: "10px 12px" } }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: colors.gray3,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
    </Card>
  );
}
