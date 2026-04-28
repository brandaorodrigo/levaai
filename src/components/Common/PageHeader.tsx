import { ArrowLeftOutlined } from "@ant-design/icons";
import { Col, Row } from "antd";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "../../theme/theme";

interface Props {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  rightContent?: ReactNode;
  onBack?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  showBack = true,
  rightContent,
  onBack,
}: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <Row
      align="middle"
      style={{
        background: "#000",
        padding: "16px 16px 12px",
        flexShrink: 0,
        gap: 12,
      }}
    >
      {showBack && (
        <Col>
          <ArrowLeftOutlined
            onClick={handleBack}
            style={{ fontSize: 18, color: colors.gray2, cursor: "pointer" }}
          />
        </Col>
      )}
      <Col flex={1}>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.white }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 10, color: colors.gray3, marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </Col>
      {rightContent && <Col>{rightContent}</Col>}
    </Row>
  );
}
