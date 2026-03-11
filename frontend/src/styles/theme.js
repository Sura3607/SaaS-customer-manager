// AntD theme variables export for centralized styling
export const theme = {
  token: {
    // ===== COLORS =====
    colorPrimary: '#1976d2', // Primary blue
    colorSuccess: '#388e3c', // Success green
    colorWarning: '#f57c00', // Warning orange
    colorError: '#d32f2f', // Error red
    colorInfo: '#0097a7', // Info cyan

    // Text colors
    colorText: '#212121', // Primary text
    colorTextSecondary: '#757575', // Secondary text
    colorTextTertiary: '#bdbdbd', // Tertiary text
    colorTextQuaternary: '#e0e0e0', // Quaternary text

    // Background colors
    colorBgBase: '#ffffff',
    colorBgContainer: '#ffffff',
    colorBgElevated: '#f5f5f5',
    colorBgLayout: '#fafafa',
    colorBgBlur: 'rgba(255, 255, 255, 0.8)',

    // Border & Divider
    colorBorder: '#e0e0e0',
    colorBorderSecondary: '#f0f0f0',

    // ===== TYPOGRAPHY =====
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", sans-serif',
    fontSize: 14,
    fontSizeHeading1: 38,
    fontSizeHeading2: 30,
    fontSizeHeading3: 24,
    fontSizeHeading4: 20,
    fontSizeHeading5: 16,
    fontSizeLG: 16,
    fontSizeSM: 12,
    fontSizeXS: 12,
    lineHeight: 1.5715,
    lineHeightHeading1: 1.2,
    lineHeightHeading2: 1.35,

    // ===== SPACING & SIZING =====
    margin: 16,
    marginXS: 8,
    marginSM: 12,
    marginLG: 24,
    marginXL: 32,
    padding: 16,
    paddingXS: 8,
    paddingSM: 12,
    paddingLG: 24,
    paddingXL: 32,

    // ===== BORDER & RADIUS =====
    borderRadius: 6,
    borderRadiusLG: 8,
    borderRadiusSM: 4,
    borderRadiusXS: 2,

    // ===== SHADOWS =====
    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    boxShadowSecondary: '0 6px 16px rgba(0, 0, 0, 0.08)',

    // ===== MOTION =====
    motionUnit: 0.1,
    motionEaseInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    motionEaseIn: 'cubic-bezier(0.4, 0, 1, 1)',
    motionEaseOut: 'cubic-bezier(0, 0, 0.2, 1)',
    motionEaseInCirc: 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
    motionEaseOutCirc: 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  },

  // ===== COMPONENT-SPECIFIC OVERRIDES =====
  components: {
    Button: {
      borderRadius: 6,
      fontWeight: 500,
      controlHeight: 36,
    },
    Card: {
      borderRadius: 8,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    Modal: {
      borderRadius: 8,
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
    },
    Input: {
      borderRadius: 4,
      controlHeight: 36,
    },
    Select: {
      borderRadius: 4,
      controlHeight: 36,
    },
    DatePicker: {
      borderRadius: 4,
      controlHeight: 36,
    },
    Table: {
      headerBg: '#f5f5f5',
      headerSortActiveBg: '#f0f0f0',
      rowHoverBg: '#fafafa',
    },
    Pagination: {
      itemActiveBg: '#1976d2',
    },
    Layout: {
      siderBg: '#1f1f1f',
      headerBg: '#ffffff',
      headerHeight: 64,
      headerPadding: '0 24px',
      headerColor: '#212121',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#e3f2fd',
      itemSelectedColor: '#1976d2',
    },
    Tag: {
      borderRadiusSM: 4,
    },
    Badge: {
      borderRadiusSM: 4,
    },
  },
}

export default theme
