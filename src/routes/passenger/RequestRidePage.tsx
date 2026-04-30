import {
  CheckOutlined,
  EnvironmentOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { App as AntApp, Button, Card, Col, Divider, Input, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { user } from "@/App";
import PageHeader from "../../components/Common/PageHeader";
import { colors } from "../../theme/theme";

interface Suggestion {
  id: string;
  name: string;
  address: string;
}

const BAG_OPTIONS = [
  { value: "small", label: "Pequena", sub: "Até 3 sacolas" },
  { value: "medium", label: "Média", sub: "Até 6 sacolas" },
  { value: "large", label: "Grande", sub: "6+ sacolas" },
] as const;

type BagSize = (typeof BAG_OPTIONS)[number]["value"];

const MOCK_SUGGESTIONS: Suggestion[] = [
  {
    id: "1",
    name: "Rua das Flores, 42",
    address: "Bairro Santa Cruz — Contagem, MG",
  },
  { id: "2", name: "Rua das Flores, 180", address: "Centro — Contagem, MG" },
  {
    id: "3",
    name: "Rua das Flores, 310",
    address: "Bairro Industrial — Betim, MG",
  },
];

export default function RequestRidePage() {
  const [origin] = useState<Suggestion | null>({
    id: "0",
    name: "Extra Supermercado",
    address: "Av. Brasil, 1200 — Contagem",
  });
  const [destination, setDestination] = useState<Suggestion | null>(null);
  const [query, setQuery] = useState("");
  const [bagSize, setBagSize] = useState<BagSize>("medium");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  const suggestions = query.length >= 2 ? MOCK_SUGGESTIONS : [];

  const handleRequest = async () => {
    if (!origin || !destination) {
      message.warning("Informe os endereços de saída e destino");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      message.success("Buscando motorista...");
      navigate("/passenger/track/ride_123");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader title={`Para onde, ${user?.name || "passageiro"}?`} />

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
        <Card style={{ overflow: "hidden" }} styles={{ body: { padding: 0 } }}>
          <Row
            align="middle"
            style={{
              gap: 10,
              padding: "10px 12px",
              borderBottom: `1px solid ${colors.bg5}`,
            }}
          >
            <Col>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <div
                  style={{
                    width: 9,
                    height: 9,
                    borderRadius: "50%",
                    background: colors.orange,
                  }}
                />
                <div
                  style={{ width: 1.5, height: 16, background: colors.border }}
                />
              </div>
            </Col>
            <Col flex={1}>
              <div
                style={{ fontSize: 9, color: colors.gray3, fontWeight: 600 }}
              >
                Saída
              </div>
              <div
                style={{ fontSize: 11, fontWeight: 700, color: colors.white }}
              >
                {origin?.name}
              </div>
              <div style={{ fontSize: 9, color: colors.gray3 }}>
                {origin?.address}
              </div>
            </Col>
            <Col>
              <CheckOutlined style={{ color: colors.orange, fontSize: 13 }} />
            </Col>
          </Row>

          <Row align="top" style={{ gap: 10, padding: "10px 12px" }}>
            <Col style={{ paddingTop: 12 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: colors.green,
                }}
              />
            </Col>
            <Col flex={1}>
              <div
                style={{
                  fontSize: 9,
                  color: colors.gray3,
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                Destino
              </div>
              {destination ? (
                <>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: colors.white,
                    }}
                  >
                    {destination.name}
                  </div>
                  <div style={{ fontSize: 9, color: colors.gray3 }}>
                    {destination.address}
                  </div>
                  <Button
                    onClick={() => {
                      setDestination(null);
                      setQuery("");
                    }}
                    size="small"
                    style={{
                      padding: 0,
                      height: "auto",
                      fontSize: 10,
                      color: colors.orange,
                    }}
                    type="link"
                  >
                    Alterar
                  </Button>
                </>
              ) : (
                <Input
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Digite o endereço"
                  prefix={
                    <EnvironmentOutlined style={{ color: colors.gray3 }} />
                  }
                  value={query}
                  variant="borderless"
                  style={{ padding: 0, fontSize: 13 }}
                />
              )}
            </Col>
          </Row>
        </Card>

        {!destination && suggestions.length > 0 && (
          <Card
            style={{ overflow: "hidden" }}
            styles={{ body: { padding: 0 } }}
          >
            <Row
              style={{
                padding: "8px 12px",
                borderBottom: `1px solid ${colors.bg5}`,
              }}
            >
              <Col>
                <span
                  style={{
                    fontSize: 11,
                    color: colors.gray3,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  Sugestões
                </span>
              </Col>
            </Row>

            {suggestions.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  setDestination(s);
                  setQuery("");
                }}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  cursor: "pointer",
                  background: i === 0 ? colors.orangeBg : "transparent",
                  borderBottom:
                    i < suggestions.length - 1
                      ? `1px solid ${colors.bg5}`
                      : "none",
                  border: "none",
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  textAlign: "left",
                }}
                type="button"
              >
                <EnvironmentOutlined
                  style={{
                    color: i === 0 ? colors.orange : colors.gray3,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: colors.white,
                    }}
                  >
                    {s.name}
                  </div>
                  <div style={{ fontSize: 9, color: colors.gray3 }}>
                    {s.address}
                  </div>
                </div>
              </button>
            ))}
          </Card>
        )}

        <div>
          <Row align="middle" style={{ gap: 6, marginBottom: 10 }}>
            <Col>
              <span
                style={{
                  fontSize: 12,
                  color: colors.gray3,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                TAMANHO DA COMPRA
              </span>
            </Col>
            <Col>
              <ShoppingOutlined
                style={{ fontSize: 12, color: colors.orange }}
              />
            </Col>
          </Row>
          <Row style={{ gap: 8 }}>
            {BAG_OPTIONS.map((opt) => {
              const selected = bagSize === opt.value;
              return (
                <Col flex="1" key={opt.value}>
                  <button
                    onClick={() => setBagSize(opt.value)}
                    style={{
                      width: "100%",
                      borderRadius: 8,
                      border: `${selected ? 2 : 1}px solid ${selected ? colors.orange : colors.border}`,
                      background: selected ? colors.orangeBg : colors.bg3,
                      color: selected ? colors.white : colors.gray2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 4px",
                      cursor: "pointer",
                      minHeight: 58,
                      gap: 3,
                    }}
                    type="button"
                  >
                    <span
                      style={{ fontSize: 11, fontWeight: 600, lineHeight: 1 }}
                    >
                      {opt.label}
                    </span>
                    <span
                      style={{
                        fontSize: 9,
                        fontWeight: 500,
                        opacity: selected ? 0.85 : 0.7,
                      }}
                    >
                      {opt.sub}
                    </span>
                  </button>
                </Col>
              );
            })}
          </Row>
        </div>

        {destination && (
          <>
            <Card styles={{ body: { padding: 12 } }}>
              <Row justify="space-between" style={{ marginBottom: 6 }}>
                <Col>
                  <span
                    style={{
                      fontSize: 12,
                      color: colors.white,
                      fontWeight: 600,
                    }}
                  >
                    Tempo estimado
                  </span>
                </Col>
                <Col>
                  <span
                    style={{
                      fontSize: 12,
                      color: colors.white,
                      fontWeight: 600,
                    }}
                  >
                    ~12 min
                  </span>
                </Col>
              </Row>
              <Divider style={{ margin: "8px 0" }} />
              <Row align="middle" justify="space-between">
                <Col>
                  <span
                    style={{
                      fontSize: 12,
                      color: colors.white,
                      fontWeight: 600,
                    }}
                  >
                    Valor
                  </span>
                </Col>
                <Col>
                  <span
                    style={{
                      fontSize: 12,
                      color: colors.white,
                      fontWeight: 600,
                    }}
                  >
                    R$ 22,50
                  </span>
                </Col>
              </Row>
            </Card>

            <Button
              block
              loading={loading}
              onClick={handleRequest}
              size="large"
              style={{ marginTop: "auto" }}
              type="primary"
            >
              Confirmar corrida
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
