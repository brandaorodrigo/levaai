import type { ThemeConfig } from 'antd';

export const colors = {
  // Primary
  orange: '#F97316',
  orangeDark: '#EA580C',
  orangeBg: '#1A1000',
  orangeBorder: '#3D2800',
  // Backgrounds
  bg: '#0A0A0A',
  bg2: '#111111',
  bg3: '#161616',
  bg4: '#1A1A1A',
  bg5: '#1E1E1E',
  border: '#2A2A2A',
  // Text
  white: '#FFFFFF',
  gray1: '#CCCCCC',
  gray2: '#888888',
  gray3: '#555555',
  gray4: '#444444',
  // Semantic
  red: '#EF4444',
  amber: '#F59E0B',
  green: '#22C55E',
};

export const theme: ThemeConfig = {
  token: {
    colorPrimary: colors.orange,
    colorBgBase: colors.bg,
    colorTextBase: colors.white,
    colorBgContainer: colors.bg3,
    colorBgElevated: colors.bg3,
    colorBorder: colors.border,
    colorBorderSecondary: colors.border,
    colorText: colors.white,
    colorTextSecondary: colors.gray1,
    colorTextTertiary: colors.gray2,
    colorTextPlaceholder: colors.gray3,
    colorError: colors.red,
    colorSuccess: colors.green,
    colorWarning: colors.amber,
    colorInfo: colors.orange,
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    fontFamily: "'Inter', -apple-system, sans-serif",
    fontSize: 14,
  },
  components: {
    Button: {
      primaryShadow: 'none',
      defaultBg: colors.bg5,
      defaultBorderColor: colors.border,
      defaultColor: colors.white,
      colorTextDisabled: colors.gray3,
    },
    Input: {
      colorBgContainer: colors.bg4,
      activeBorderColor: colors.orange,
      hoverBorderColor: colors.orange,
    },
    Card: {
      colorBgContainer: colors.bg3,
      colorBorderSecondary: colors.border,
    },
    Modal: {
      contentBg: colors.bg3,
      headerBg: colors.bg3,
    },
    Progress: {
      defaultColor: colors.orange,
      remainingColor: colors.border,
    },
    Tag: {
      defaultBg: colors.orangeBg,
      defaultColor: colors.orange,
    },
    Form: {
      labelColor: colors.gray2,
      labelFontSize: 11,
    },
    Rate: {
      starColor: colors.amber,
      starBg: colors.border,
    },
  },
};
