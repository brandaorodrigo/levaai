import {
  EnvironmentOutlined,
  LoadingOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  Card,
  Col,
  Divider,
  Input,
  Row,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/Common/PageHeader";
import { useAuth } from "../../context/AuthContext";
import { customerApi, locationApi, ridesApi } from "../../services/api";
import { colors } from "../../theme/theme";

const MARKET = {
  name: "Bahamas Mix JK",
  address: "Av. JK, 879 — Francisco Bernardino",
};

interface Destination {
  id: string;
  name: string;
  address: string;
  lat?: number;
  lng?: number;
  neighborhood?: string;
}

const BAG_OPTIONS = [
  { value: "pequena", label: "Pequena", sub: "Até 3 sacolas", kg: 5 },
  { value: "media", label: "Média", sub: "Até 6 sacolas", kg: 15 },
  { value: "grande", label: "Grande", sub: "6+ sacolas", kg: 30 },
] as const;

type BagSize = (typeof BAG_OPTIONS)[number]["value"];

export default function RequestRidePage() {
  const { user } = useAuth();
  const [originId, setOriginId] = useState<string>("");
  const [destination, setDestination] = useState<Destination | null>(null);
  const [query, setQuery] = useState("");
  const [bagSize, setBagSize] = useState<BagSize>("media");
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const navigate = useNavigate();
  const { message } = AntApp.useApp();

  useEffect(() => {
    locationApi
      .getPickupLocations()
      .then((locs: any) => {
        const list: any[] = Array.isArray(locs)
          ? locs
          : (locs?.items ?? locs?.data ?? []);
        const market =
          list.find((l) => l.name?.toLowerCase().includes("bahamas")) ??
          list[0];
        if (market) setOriginId(market.id);
        else console.warn("[PICKUP] nenhum local encontrado");
      })
      .catch((e: any) => console.error("[PICKUP ERROR]", e));

    customerApi
      .me()
      .then((profile: any) => {
        const parts = [
          profile.address,
          profile.number,
          profile.complement,
        ].filter(Boolean);
        const fullAddress = parts.join(", ");
        const neighborhood = profile.neighborhood ?? "";
        if (!fullAddress) return;

        setGeocoding(true);
        locationApi
          .geocodeAddress(`${fullAddress}, ${neighborhood}, Petrópolis`)
          .then((geo) => {
            setDestination({
              id: crypto.randomUUID(),
              name: "Minha residência",
              address: `${fullAddress}${neighborhood ? ` — ${neighborhood}` : ""}`,
              lat: geo.latitude,
              lng: geo.longitude,
              neighborhood,
            });
          })
          .catch(() => {
            setDestination({
              id: crypto.randomUUID(),
              name: "Minha residência",
              address: `${fullAddress}${neighborhood ? ` — ${neighborhood}` : ""}`,
              lat: 0,
              lng: 0,
              neighborhood,
            });
          })
          .finally(() => setGeocoding(false));
      })
      .catch(() => {});
  }, []);

  const handleSelectDestination = async (name: string, address: string) => {
    setGeocoding(true);
    setQuery("");
    try {
      const geo = await locationApi.geocodeAddress(`${name}, ${address}`);
      setDestination({
        id: crypto.randomUUID(),
        name,
        address,
        lat: geo.latitude,
        lng: geo.longitude,
        neighborhood: address.split("—")[0]?.trim() ?? address,
      });
    } catch {
      setDestination({
        id: crypto.randomUUID(),
        name,
        address,
        lat: 0,
        lng: 0,
      });
    } finally {
      setGeocoding(false);
    }
  };

  const handleRequest = async () => {
    if (!destination) {
      message.warning("Informe o endereço de destino");
      return;
    }
    if (!originId) {
      message.error("Local de saída não carregado. Recarregue a página.");
      return;
    }

    const bagOpt = BAG_OPTIONS.find((b) => b.value === bagSize)!;

    setLoading(true);
    try {
      const ride = await ridesApi.create({
        origin_id: originId,
        destination_full_address: `${destination.name}, ${destination.address}`,
        destination_postal_code: "00000-000",
        destination_neighborhood: destination.neighborhood ?? "Centro",
        destination_lat: destination.lat ?? 0,
        destination_lng: destination.lng ?? 0,
        purchase_size: bagSize,
        estimated_weight_kg: bagOpt.kg,
        payment_method: "pix",
        needs_loading_help: bagOpt.value === "grande",
      });
      message.success("Buscando motorista...");
      navigate(`/passenger/track/${ride.id}`);
    } catch {
      message.error("Erro ao solicitar corrida. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <PageHeader
        title={`Para onde, ${user?.name?.split(" ")[0] ?? "passageiro"}?`}
      />

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
        {/* Origin selector */}
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
                Saída — onde você está
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: colors.white,
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                {MARKET.name}
              </div>
              <div style={{ fontSize: 10, color: colors.gray3 }}>
                {MARKET.address}
              </div>
            </Col>
          </Row>

          {/* Destination input */}
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
              {geocoding ? (
                <Spin indicator={<LoadingOutlined />} size="small" />
              ) : destination ? (
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
                  onPressEnter={() => {
                    if (query.trim().length >= 2) {
                      handleSelectDestination(query.trim(), "");
                    }
                  }}
                  placeholder="Digite o endereço de entrega"
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
                    Pagamento
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
                    Pix
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
