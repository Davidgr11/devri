/**
 * Sistema de Temas - Devri Solutions
 *
 * Este archivo centraliza todos los colores del sitio.
 * Para cambiar el esquema de colores, simplemente modifica los valores aquí.
 */

export const theme = {
  // Colores principales
  colors: {
    // Backgrounds
    background: {
      primary: '#FFFFFF',   // Blanco
      secondary: '#000000', // Negro
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
      }
    },

    // Colores de acento (fácilmente intercambiables)
    accent: {
      // Color primario (morado claro por defecto)
      primary: {
        light: '#DDD6FE',    // Morado muy claro
        DEFAULT: '#A78BFA',  // Morado claro
        dark: '#7C3AED',     // Morado medio
        darker: '#5B21B6',   // Morado oscuro
      },
      // Color secundario (verde claro por defecto)
      secondary: {
        light: '#D1FAE5',    // Verde muy claro
        DEFAULT: '#6EE7B7',  // Verde claro
        dark: '#10B981',     // Verde medio
        darker: '#047857',   // Verde oscuro
      },
      // Color terciario (amarillo claro por defecto)
      tertiary: {
        light: '#FEF3C7',    // Amarillo muy claro
        DEFAULT: '#FCD34D',  // Amarillo claro
        dark: '#F59E0B',     // Amarillo medio
        darker: '#D97706',   // Amarillo oscuro
      }
    },

    // Estados
    status: {
      success: '#10B981',   // Verde
      error: '#EF4444',     // Rojo
      warning: '#F59E0B',   // Amarillo
      info: '#3B82F6',      // Azul
    },

    // Texto
    text: {
      primary: '#111827',    // Negro casi puro
      secondary: '#6B7280',  // Gris medio
      tertiary: '#9CA3AF',   // Gris claro
      inverse: '#FFFFFF',    // Blanco
    }
  },

  // Sombras
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  },

  // Transiciones
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Espaciado
  spacing: {
    section: {
      mobile: '4rem',   // 64px
      desktop: '6rem',  // 96px
      large: '8rem',    // 128px
    },
    container: {
      maxWidth: '1280px',
      padding: {
        mobile: '1rem',    // 16px
        tablet: '1.5rem',  // 24px
        desktop: '2rem',   // 32px
      }
    }
  },

  // Bordes
  borderRadius: {
    sm: '0.25rem',  // 4px
    base: '0.5rem', // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.5rem', // 24px
    full: '9999px',
  },

  // WhatsApp
  whatsapp: {
    green: '#25D366',
  }
} as const;

// Exportar para uso en Tailwind config
export const tailwindColors = {
  accent: {
    light: theme.colors.accent.primary.light,
    DEFAULT: theme.colors.accent.primary.DEFAULT,
    dark: theme.colors.accent.primary.dark,
    darker: theme.colors.accent.primary.darker,
  },
  secondary: {
    light: theme.colors.accent.secondary.light,
    DEFAULT: theme.colors.accent.secondary.DEFAULT,
    dark: theme.colors.accent.secondary.dark,
    darker: theme.colors.accent.secondary.darker,
  },
  tertiary: {
    light: theme.colors.accent.tertiary.light,
    DEFAULT: theme.colors.accent.tertiary.DEFAULT,
    dark: theme.colors.accent.tertiary.dark,
    darker: theme.colors.accent.tertiary.darker,
  },
  success: theme.colors.status.success,
  error: theme.colors.status.error,
  warning: theme.colors.status.warning,
  info: theme.colors.status.info,
  whatsapp: theme.colors.whatsapp.green,
};
