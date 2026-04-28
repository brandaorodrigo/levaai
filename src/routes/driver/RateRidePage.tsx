import { App as AntApp, Avatar, Button, Card, Col, Rate, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/theme";

const LABELS = [
  "",
  "Péssimo",
  "Ruim",
  "Regular",
  "Bom passageiro",
  "Excelente!",
];

export default function RateRidePage() {
  const [rating, setRating] = useState(4);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const handleSubmit = () => {
    setSubmitted(true);
    message.success("Avaliação enviada!");
    setTimeout(() => navigate("/driver"), 1200);
  };

  return (
    <div className="page-container">
      <Row
        justify="center"
        style={{ background: "#000", padding: "14px 16px 12px" }}
      >
        <Col style={{ fontSize: 15, fontWeight: 700, color: colors.white }}>
          Corrida finalizada!
        </Col>
      </Row>

      <div
        style={{
          flex: 1,
          padding: 16,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <Card
          style={{ border: `1px solid ${colors.orangeBorder}` }}
          styles={{
            body: {
              background: colors.orangeBg,
              borderRadius: 12,
              padding: 16,
            },
          }}
        >
          <Row justify="center" style={{ marginBottom: 4 }}>
            <Col
              style={{ fontSize: 11, color: colors.orange, fontWeight: 700 }}
            >
              Você ganhou
            </Col>
          </Row>
          <Row justify="center">
            <Col
              style={{
                fontSize: 32,
                fontWeight: 900,
                color: colors.white,
                letterSpacing: "-1px",
              }}
            >
              R$ 19,12
            </Col>
          </Row>
        </Card>

        <Card
          style={{ border: `1px solid ${colors.border}` }}
          styles={{ body: { padding: 16 } }}
        >
          <Row justify="center" style={{ marginBottom: 12 }}>
            <Col>
              <Avatar
                size={50}
                style={{
                  background: colors.orangeBg,
                  border: `2px solid ${colors.orange}`,
                  color: colors.orange,
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                JC
              </Avatar>
            </Col>
          </Row>

          <Row justify="center" style={{ marginBottom: 12 }}>
            <Col style={{ textAlign: "center" }}>
              <div
                style={{ fontSize: 13, fontWeight: 700, color: colors.white }}
              >
                João Carlos
              </div>
              <div style={{ fontSize: 10, color: colors.gray3, marginTop: 2 }}>
                Como foi o passageiro?
              </div>
            </Col>
          </Row>

          <Row justify="center" style={{ marginBottom: 12 }}>
            <Col>
              <Rate
                onChange={setRating}
                style={{ fontSize: 36, color: colors.amber }}
                value={rating}
              />
            </Col>
          </Row>

          <Row justify="center">
            <Col style={{ fontSize: 11, color: colors.gray2, fontWeight: 600 }}>
              {rating} estrela{rating > 1 ? "s" : ""} — {LABELS[rating]}
            </Col>
          </Row>
        </Card>

        <Button
          loading={submitted}
          onClick={handleSubmit}
          size="large"
          style={{ marginTop: "auto" }}
          type="primary"
        >
          Enviar avaliação
        </Button>
      </div>
    </div>
  );
}
