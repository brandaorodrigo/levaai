import { LogoutOutlined, StarFilled } from "@ant-design/icons";
import {
  App as AntApp,
  Avatar,
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Spin,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/Common/PageHeader";
import { useAuth } from "../context/AuthContext";
import { customerApi, driverApi, locationApi } from "../services/api";
import { colors } from "../theme/theme";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { message, modal } = AntApp.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [memberSince, setMemberSince] = useState("");
  const [rating, setRating] = useState<string | undefined>();

  const isDriver = user?.role === "driver";

  const initials =
    user?.name
      .split(" ")
      .map((p) => p[0])
      .slice(0, 2)
      .join("") || "??";

  useEffect(() => {
    const request = isDriver ? driverApi.me() : customerApi.me();
    request
      .then((data: any) => {
        form.setFieldsValue({
          name: data.fullName,
          phone: data.phone,
          email: data.email,
          cep: data.postalCode,
          street: data.address,
          neighborhood: data.neighborhood,
          number: data.number,
          complement: data.complement,
        });
        if (data.createdAt) {
          const d = new Date(data.createdAt);
          setMemberSince(
            `${isDriver ? "Motorista" : "Cliente"} desde ${d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })}`,
          );
        }
        if (data.averageRating) {
          setRating(Number(data.averageRating).toFixed(1));
        }
      })
      .catch(() => message.error("Erro ao carregar perfil"))
      .finally(() => setLoading(false));
  }, [form, message, isDriver]);

  const handleSave = async () => {
    const values = form.getFieldsValue();
    setSaving(true);
    try {
      const payload = {
        fullName: values.name,
        email: values.email,
        postalCode: values.cep?.replace(/\D/g, ""),
        address: values.street,
        neighborhood: values.neighborhood,
        number: values.number,
        complement: values.complement,
      };
      if (isDriver) {
        await driverApi.update(payload);
      } else {
        await customerApi.update(payload);
      }
      message.success("Perfil salvo!");
    } catch {
      message.error("Erro ao salvar perfil");
    } finally {
      setSaving(false);
    }
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (raw.length !== 8) return;
    setCepLoading(true);
    try {
      const cep = `${raw.slice(0, 5)}-${raw.slice(5)}`;
      const data = await locationApi.lookupCep(cep);
      form.setFieldsValue({
        street: data.street || form.getFieldValue("street"),
        neighborhood: data.neighborhood || form.getFieldValue("neighborhood"),
      });
    } catch {
      message.warning("CEP não encontrado");
    } finally {
      setCepLoading(false);
    }
  };

  const handleLogout = () => {
    modal.confirm({
      title: "Sair da conta?",
      okText: "Sim, sair",
      cancelText: "Cancelar",
      onOk: () => {
        logout();
        navigate("/login");
      },
    });
  };

  if (loading) {
    return (
      <div className="page-container">
        <PageHeader title="Meu perfil" />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Spin />
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <PageHeader
        rightContent={
          <span
            onClick={handleSave}
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: saving ? colors.gray3 : colors.orange,
              cursor: saving ? "default" : "pointer",
            }}
          >
            {saving ? "Salvando..." : "Salvar"}
          </span>
        }
        title="Meu perfil"
      />

      <Form form={form} layout="vertical" requiredMark={false}>
        <div
          style={{
            flex: 1,
            padding: 14,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <Card>
            <Row justify="center" style={{ marginBottom: 10 }}>
              <Col>
                <Avatar
                  size={64}
                  style={{
                    background: colors.orangeBg,
                    border: `2px solid ${colors.orange}`,
                    color: colors.orange,
                    fontWeight: 800,
                    fontSize: 22,
                  }}
                >
                  {initials}
                </Avatar>
              </Col>
            </Row>
            <Row justify="center">
              <Col style={{ textAlign: "center" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: colors.white }}>
                  {user?.name}
                </div>
                {rating && (
                  <div style={{ fontSize: 11, color: colors.amber, marginTop: 4 }}>
                    <StarFilled /> {rating}
                  </div>
                )}
                {memberSince && (
                  <div style={{ fontSize: 10, color: colors.gray3, marginTop: 2 }}>
                    {memberSince}
                  </div>
                )}
              </Col>
            </Row>
          </Card>

          <Card title={<SectionTitle>Dados pessoais</SectionTitle>}>
            <Form.Item label="Nome" name="name" style={{ marginBottom: 10 }}>
              <Input />
            </Form.Item>
            <Row gutter={10}>
              <Col span={12}>
                <Form.Item label="Celular" name="phone" style={{ marginBottom: 10 }}>
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="E-mail" name="email" style={{ marginBottom: 0 }}>
                  <Input placeholder="seu@email.com" />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {!isDriver && (
            <Card title={<SectionTitle>Endereço</SectionTitle>}>
              <Form.Item label="CEP" name="cep" style={{ marginBottom: 10 }}>
                <Input
                  disabled={cepLoading}
                  maxLength={9}
                  onBlur={handleCepBlur}
                  placeholder="00000-000"
                />
              </Form.Item>
              <Form.Item label="Rua" name="street" style={{ marginBottom: 10 }}>
                <Input placeholder="Ex: Rua das Flores" />
              </Form.Item>
              <Row gutter={10}>
                <Col span={8}>
                  <Form.Item label="Número" name="number" style={{ marginBottom: 10 }}>
                    <Input placeholder="42" />
                  </Form.Item>
                </Col>
                <Col span={16}>
                  <Form.Item label="Complemento" name="complement" style={{ marginBottom: 10 }}>
                    <Input placeholder="Apto, bloco..." />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item label="Bairro" name="neighborhood" style={{ marginBottom: 0 }}>
                <Input placeholder="Ex: Santa Cruz" />
              </Form.Item>
            </Card>
          )}

          <Button
            block
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            style={{
              marginTop: "auto",
              background: "#5B3333",
              borderColor: "#EF4444",
              color: "#EF4444",
            }}
          >
            Sair da conta
          </Button>
        </div>
      </Form>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        color: colors.gray2,
      }}
    >
      {children}
    </span>
  );
}
