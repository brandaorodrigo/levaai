import { StarFilled } from "@ant-design/icons";
import { Avatar, Card, Col, Divider, Row } from "antd";
import { colors } from "../../theme/theme";

interface Props {
  initials: string;
  passengerName: string;
  rating: number;
  memberSince: string;
  origin: { name: string; address: string };
  destination: { name: string; address: string };
}

export default function PassengerRouteCard({
  initials,
  passengerName,
  rating,
  memberSince,
  origin,
  destination,
}: Props) {
  return (
    <Card styles={{ body: { padding: "14px 16px" } }}>
      <Row align="middle" style={{ gap: 12 }}>
        <Col>
          <Avatar
            size={50}
            style={{
              background: colors.orangeBg,
              border: `2px solid ${colors.orange}`,
              color: colors.orange,
              fontWeight: 800,
              fontSize: 16,
            }}
          >
            {initials}
          </Avatar>
        </Col>
        <Col flex={1}>
          <Row align="middle" style={{ gap: 8 }}>
            <Col>
              <span style={{ fontSize: 15, fontWeight: 700, color: colors.white }}>
                {passengerName}
              </span>
            </Col>
            <Col>
              <Row align="middle" style={{ gap: 3 }}>
                <Col>
                  <StarFilled style={{ fontSize: 12, color: colors.amber }} />
                </Col>
                <Col>
                  <span style={{ fontSize: 13, fontWeight: 700, color: colors.amber }}>
                    {rating}
                  </span>
                </Col>
              </Row>
            </Col>
          </Row>
          <div style={{ fontSize: 11, color: colors.gray3, marginTop: 3 }}>
            {memberSince}
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      {/* Origin row */}
      <Row align="middle" style={{ gap: 14 }}>
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
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: colors.orange,
            }}
          />
        </Col>
        <Col flex={1}>
          <div
            style={{
              fontSize: 10,
              color: colors.gray3,
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Saída
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.white }}>
            {origin.name}
          </div>
          <div style={{ fontSize: 11, color: colors.gray3, marginTop: 2 }}>
            {origin.address}
          </div>
        </Col>
      </Row>

      {/* Connecting line */}
      <Row style={{ gap: 14 }}>
        <Col
          style={{
            width: 11,
            flexShrink: 0,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{ width: 2, height: 20, background: colors.border, margin: "4px 0" }}
          />
        </Col>
      </Row>

      {/* Destination row */}
      <Row align="middle" style={{ gap: 14 }}>
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
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: colors.green,
            }}
          />
        </Col>
        <Col flex={1}>
          <div
            style={{
              fontSize: 10,
              color: colors.gray3,
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Destino
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, color: colors.white }}>
            {destination.name}
          </div>
          <div style={{ fontSize: 11, color: colors.gray3, marginTop: 2 }}>
            {destination.address}
          </div>
        </Col>
      </Row>
    </Card>
  );
}
