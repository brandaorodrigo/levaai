import { RightOutlined } from "@ant-design/icons";
import { Avatar, Col, Row } from "antd";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/theme";

interface Props {
  name: string;
  profilePath: string;
  rightContent?: React.ReactNode;
  online?: boolean;
}

export default function HomeHeader({ name, profilePath, rightContent, online }: Props) {
  const navigate = useNavigate();

  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Bom dia";
    if (h < 18) return "Boa tarde";
    return "Boa noite";
  })();

  return (
    <Row
      align="middle"
      justify="space-between"
      style={{ background: "#000", padding: "20px 20px" }}
    >
      <Col onClick={() => navigate(profilePath)} style={{ cursor: "pointer" }}>
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
            <div style={{ fontSize: 12, color: colors.gray3, fontWeight: 500 }}>
              {greeting},
            </div>
            <Row align="middle" style={{ gap: 5 }}>
              <Col>
                <div style={{ fontSize: 18, fontWeight: 700, color: colors.white }}>
                  {name.split(" ")[0]}
                </div>
              </Col>
              <Col>
                <RightOutlined style={{ fontSize: 11, color: colors.gray3 }} />
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>

      {rightContent && <Col>{rightContent}</Col>}
    </Row>
  );
}
