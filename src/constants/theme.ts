export const COLORS = {
    primary: '#2563EB',
    primaryDark: '#1E40AF',
    primaryLight: '#3B82F6',

    secondary: '#10B981',
    secondaryDark: '#059669',

    danger: '#EF4444',
    dangerDark: '#DC2626',

    warning: '#F59E0B',
    warningDark: '#D97706',

    success: '#10B981',
    successDark: '#059669',

    info: '#3B82F6',
    infoDark: '#2563EB',

    gray: {
        50: '#F9FAFB',
        100: '#F3F4F6',
        200: '#E5E7EB',
        300: '#D1D5DB',
        400: '#9CA3AF',
        500: '#6B7280',
        600: '#4B5563',
        700: '#374151',
        800: '#1F2937',
        900: '#111827',
    },

    background: '#F3F4F6',
    backgroundDark: '#1F2937',

    card: '#FFFFFF',
    cardDark: '#374151',

    text: '#111827',
    textSecondary: '#6B7280',
    textDark: '#F9FAFB',

    border: '#E5E7EB',
    borderDark: '#4B5563',

    risk: {
        low: '#10B981',
        medium: '#F59E0B',
        high: '#EF4444',
        critical: '#DC2626',
    },
};

export const SIZES = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,

    fontXs: 12,
    fontSm: 14,
    fontMd: 16,
    fontLg: 18,
    fontXl: 20,
    fontXxl: 24,
    fontTitle: 28,
    fontHero: 48,

    radiusSm: 4,
    radiusMd: 8,
    radiusLg: 12,
    radiusXl: 16,
    radiusFull: 9999,

    iconSm: 16,
    iconMd: 24,
    iconLg: 32,
    iconXl: 48,
};

export const SHADOWS = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
};

export const FONTS = {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    light: 'System',
};

export default {
    COLORS,
    SIZES,
    SHADOWS,
    FONTS,
};
