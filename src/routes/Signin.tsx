import { App as AntApp, Button, Col, Form, Input, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { colors } from "../theme/theme";
import type { UserRole } from "../types";

export default function Signin() {
  const [role, setRole] = useState<UserRole>("passenger");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { message } = AntApp.useApp();
  const navigate = useNavigate();

  const handleLogin = async (values: { phone: string; password: string }) => {
    setLoading(true);
    try {
      const user = await login(values.phone, values.password, role);
      navigate(user.role === "driver" ? "/driver" : "/passenger");
    } catch {
      message.error("Telefone ou senha inválidos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        background: "#000",
        justifyContent: "center",
        padding: "48px 28px 40px",
      }}
    >
      <Row style={{ marginBottom: 20 }}>
        <Col>
          <img
            alt="Logo"
            src="../assets/iconLevaAi.png"
            style={{ width: 100, height: 100 }}
          />
        </Col>
      </Row>

      <Row style={{ marginBottom: 6 }}>
        <Col>
          <img
            alt="Text"
            src="../assets/logoLevaAi.png"
            style={{ width: 250, height: 60 }}
          />
        </Col>
      </Row>

      <Row style={{ marginBottom: 32 }}>
        <Col>
          <span style={{ fontSize: 13, color: colors.gray3 }}>
            Você e suas compras em casa!
          </span>
        </Col>
      </Row>

      {/* Toggle de perfil */}
      <Row style={{ gap: 8, marginBottom: 16 }}>
        <Col flex="1">
          <button
            onClick={() => setRole("passenger")}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              background: role === "passenger" ? colors.orange : colors.bg3,
              border: `1px solid ${role === "passenger" ? colors.orange : colors.border}`,
              color: role === "passenger" ? colors.white : colors.gray2,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
            type="button"
          >
            Passageiro
          </button>
        </Col>
        <Col flex="1">
          <button
            onClick={() => setRole("driver")}
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: 8,
              background: role === "driver" ? colors.orange : colors.bg3,
              border: `1px solid ${role === "driver" ? colors.orange : colors.border}`,
              color: role === "driver" ? colors.white : colors.gray2,
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
            }}
            type="button"
          >
            Motorista
          </button>
        </Col>
      </Row>

      {/* Formulário */}
      <Form layout="vertical" onFinish={handleLogin} requiredMark={false}>
        <Form.Item name="phone" style={{ marginBottom: 10 }}>
          <Input
            placeholder="(24) 9999-99999"
            size="large"
            style={{ borderRadius: 10, fontSize: 14, height: 52 }}
          />
        </Form.Item>

        <Form.Item name="password" style={{ marginBottom: 8 }}>
          <Input.Password
            placeholder="Senha"
            size="large"
            style={{ borderRadius: 10, height: 52 }}
            styles={{ input: { fontSize: 14, height: "100%" } }}
          />
        </Form.Item>

        <Row justify="end" style={{ marginBottom: 24 }}>
          <Col>
            <span
              onClick={() => message.info("Funcionalidade em breve")}
              style={{
                fontSize: 12,
                color: colors.orange,
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Esqueci minha senha
            </span>
          </Col>
        </Row>

        <Form.Item style={{ marginBottom: 16 }}>
          <Button
            block
            htmlType="submit"
            loading={loading}
            size="large"
            style={{
              height: 52,
              fontSize: 16,
              fontWeight: 700,
              borderRadius: 10,
            }}
            type="primary"
          >
            Entrar
          </Button>
        </Form.Item>
      </Form>

      <Row justify="center">
        <Col>
          <span style={{ fontSize: 13, color: colors.gray3 }}>
            Não tenho conta —{" "}
            <span
              onClick={() => message.info("Funcionalidade em breve")}
              style={{
                color: colors.orange,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Cadastrar agora
            </span>
          </span>
        </Col>
      </Row>
    </div>
  );
}
