import { CarOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { colors } from "../../theme/theme";

const TABS = [
  { key: "/passenger", label: "Home", Icon: HomeOutlined, exact: true },
  { key: "/passenger/history", label: "Corridas", Icon: CarOutlined, exact: false },
  { key: "/passenger/profile", label: "Perfil", Icon: UserOutlined, exact: false },
];

export default function PassengerTabBar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <Row
      style={{
        background: colors.bg3,
        borderTop: `1px solid ${colors.border}`,
        borderRadius: "20px 20px 0 0",
        padding: "10px 0 20px",
        flexShrink: 0,
      }}
    >
      {TABS.map(({ key, label, Icon, exact }) => {
        const active = exact ? pathname === key : pathname.startsWith(key);
        return (
          <Col
            flex="1"
            key={key}
            onClick={() => navigate(key)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              cursor: "pointer",
              padding: "4px 0",
            }}
          >
            <Icon
              style={{
                fontSize: 22,
                color: active ? colors.orange : colors.gray3,
              }}
            />
            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                color: active ? colors.orange : colors.gray3,
              }}
            >
              {label}
            </span>
          </Col>
        );
      })}
    </Row>
  );
}
