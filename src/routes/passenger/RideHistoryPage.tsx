import { ShoppingOutlined } from "@ant-design/icons";
import { Card, Col, Progress, Row } from "antd";
import PageHeader from "../../components/Common/PageHeader";
import { colors } from "../../theme/theme";

const HISTORY = [
  { route: "Extra → Rua das Flores", date: "Hoje, 09:41", price: 22.5 },
  { route: "Pão de Açúcar → Av. Central", date: "Ontem, 15:20", price: 19.0 },
  { route: "Atacadão → Rua do Sol", date: "14/03, 10:05", price: 28.0 },
  { route: "Hortifruti → Bloco B", date: "12/03, 08:30", price: 15.0 },
];

export default function RideHistoryPage() {
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
            Seu recorde
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: colors.white }}>
            R$ 48,00 economizados
          </div>
          <div style={{ fontSize: 10, color: colors.gray3, marginTop: 2 }}>
            usando o Leva Aí! no lugar da Uber
          </div>
          <Progress
            percent={72}
            showInfo={false}
            strokeColor={colors.orange}
            style={{ marginTop: 8, marginBottom: 0 }}
            trailColor="#2A1800"
          />
        </Card>

        <Card
          style={{ border: `1.5px solid ${colors.orange}` }}
          styles={{ body: { padding: 12 } }}
        >
          <Row align="middle" style={{ gap: 12 }}>
            <Col>
              <div
                style={{
                  width: 38,
                  height: 38,
                  background: colors.orange,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  fontWeight: 800,
                  color: colors.white,
                }}
              >
                %
              </div>
            </Col>
            <Col flex={1}>
              <div
                style={{ fontSize: 12, fontWeight: 700, color: colors.white }}
              >
                10% off na próxima corrida!
              </div>
              <div style={{ fontSize: 10, color: colors.gray3 }}>
                Você fez 6 corridas esse mês. Ganhou!
              </div>
            </Col>
          </Row>
        </Card>

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

        {HISTORY.map((item) => (
          <Card key={item.route} styles={{ body: { padding: 12 } }}>
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
                  {item.date}
                </div>
                <div
                  style={{ fontSize: 11, fontWeight: 700, color: colors.white }}
                >
                  {item.route}
                </div>
              </Col>
              <Col>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 800,
                    color: colors.orange,
                  }}
                >
                  R$ {item.price.toFixed(2).replace(".", ",")}
                </span>
              </Col>
            </Row>
          </Card>
        ))}
      </div>
    </div>
  );
}
