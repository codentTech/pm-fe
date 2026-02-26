/** @type {import('tailwindcss').Config} */

// Enhanced Indigo Theme for OfficeHQ
const themeColors = {
  // Primary indigo system
  primary: {
    50: "#F0F4FF",
    100: "#E0E9FF",
    200: "#C7D6FE",
    300: "#A5B8FC",
    400: "#818CF8",
    500: "#6366F1",
    600: "#4F46E5",
    700: "#4338CA",
    800: "#3730A3",
    900: "#312E81",
    950: "#1E1B4B",
  },

  // Neutral grays
  neutral: {
    50: "#FAFAFA",
    100: "#F5F5F5",
    200: "#E5E5E5",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0A0A0A",
  },

  // Semantic colors
  success: {
    50: "#ECFDF5",
    100: "#D1FAE5",
    200: "#A7F3D0",
    500: "#10B981",
    600: "#059669",
    700: "#047857",
    800: "#065F46",
  },

  danger: {
    50: "#FEF2F2",
    100: "#FEE2E2",
    200: "#FECACA",
    500: "#EF4444",
    600: "#DC2626",
    700: "#B91C1C",
    800: "#991B1B",
  },

  warning: {
    50: "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
  },

  info: {
    50: "#EFF6FF",
    100: "#DBEAFE",
    200: "#BFDBFE",
    500: "#3B82F6",
    600: "#2563EB",
    700: "#1D4ED8",
    800: "#1E40AF",
  },
};

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],

  darkMode: "class",

  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },

    fontFamily: {
      sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      mono: ["JetBrains Mono", "Fira Code", "monospace"],
    },

    /* Typography scale - optimized for readability (fontWeight via utility classes) */
    fontSize: {
      xs: ["0.8125rem", { lineHeight: "1.375rem" }],
      sm: ["0.9375rem", { lineHeight: "1.5rem" }],
      base: ["1rem", { lineHeight: "1.625rem" }],
      lg: ["1.125rem", { lineHeight: "1.75rem" }],
      xl: ["1.25rem", { lineHeight: "1.875rem" }],
      "2xl": ["1.5rem", { lineHeight: "2rem" }],
      "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
      "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
      /* Semantic tokens - use with typography-* classes or text-* + font-* */
      "heading-1": ["1.5rem", { lineHeight: "2rem" }],
      "heading-2": ["1.25rem", { lineHeight: "1.75rem" }],
      "heading-3": ["1.125rem", { lineHeight: "1.625rem" }],
      "heading-4": ["1rem", { lineHeight: "1.5rem" }],
      body: ["0.9375rem", { lineHeight: "1.5rem" }],
      "body-sm": ["0.875rem", { lineHeight: "1.375rem" }],
      label: ["0.875rem", { lineHeight: "1.25rem" }],
      caption: ["0.8125rem", { lineHeight: "1.375rem" }],
      button: ["0.9375rem", { lineHeight: "1.25rem" }],
      table: ["0.9375rem", { lineHeight: "1.5rem" }],
    },

    extend: {
      colors: {
        primary: themeColors.primary,
        neutral: themeColors.neutral,
        success: themeColors.success,
        danger: themeColors.danger,
        warning: themeColors.warning,
        info: themeColors.info,

        // Semantic color aliases
        background: {
          primary: "#FFFFFF",
          secondary: "#F9FAFB",
          tertiary: "#F3F4F6",
        },

        border: {
          primary: "#FFFFFF",
          light: "#E5E7EB",
          medium: "#D1D5DB",
          dark: "#9CA3AF",
        },

        text: {
          primary: "#111827",
          secondary: "#374151",
          tertiary: "#6B7280",
          inverse: "#FFFFFF",
        },
      },

      spacing: {
        18: "4.5rem",
        88: "22rem",
        sidebar: "16rem",
        "sidebar-collapsed": "4rem",
      },

      boxShadow: {
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        card: "0 4px 6px -1px rgba(99, 102, 241, 0.1), 0 2px 4px -1px rgba(99, 102, 241, 0.06)",
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      },

      animation: {
        "fade-in": "fadeIn 0.2s ease-in-out",
        "slide-in": "slideIn 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
        "bounce-subtle": "bounceSubtle 2s infinite",
      },

      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        scaleIn: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },

      transitionTimingFunction: {
        "bounce-in": "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),

    function ({ addBase, addComponents, addUtilities }) {
      addBase({
        ":root": {
          "--color-primary-50": themeColors.primary[50],
          "--color-primary-100": themeColors.primary[100],
          "--color-primary-500": themeColors.primary[500],
          "--color-primary-600": themeColors.primary[600],
          "--color-primary-700": themeColors.primary[700],
          "--color-background-primary": "#FFFFFF",
          "--color-background-secondary": "#F9FAFB",
          "--color-text-primary": "#0F172A",
          "--color-text-secondary": "#334155",
          "--color-text-tertiary": "#475569",
          "--border-radius-default": "0.5rem",
          "--shadow-default":
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
        },

        html: {
          scrollBehavior: "smooth",
        },

        body: {
          backgroundColor: "#FFFFFF",
          color: "#0F172A",
          fontFamily: "Inter, system-ui, -apple-system, sans-serif",
          lineHeight: "1.6",
        },

        "*:focus-visible": {
          outline: "none",
        },
      });

      addComponents({
        ".btn": {
          "@apply inline-flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-0 disabled:opacity-50 disabled:cursor-not-allowed":
            {},
        },

        ".btn-primary": {
          "@apply btn bg-primary-600 text-white hover:bg-primary-700 shadow-sm":
            {},
        },

        ".btn-secondary": {
          "@apply btn bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50":
            {},
        },

        ".btn-ghost": {
          "@apply btn text-neutral-600 hover:bg-neutral-100": {},
        },

        ".card": {
          "@apply bg-white rounded-lg border border-neutral-200 shadow-sm": {},
        },

        ".card-header": {
          "@apply px-6 py-4 border-b border-neutral-200": {},
        },

        ".card-body": {
          "@apply px-6 py-4": {},
        },

        ".card-footer": {
          "@apply px-6 py-4 border-t border-neutral-200 bg-neutral-50": {},
        },

        ".form-input": {
          "@apply block w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-neutral-300 focus:border-neutral-400 disabled:bg-neutral-50 disabled:text-neutral-500":
            {},
        },

        ".form-label": {
          "@apply block text-sm font-medium text-neutral-800 mb-1": {},
        },

        ".form-error": {
          "@apply text-sm text-danger-600 mt-1": {},
        },

        ".badge": {
          "@apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium":
            {},
        },

        ".badge-success": {
          "@apply badge bg-success-100 text-success-800": {},
        },

        ".badge-warning": {
          "@apply badge bg-warning-100 text-warning-800": {},
        },

        ".badge-danger": {
          "@apply badge bg-danger-100 text-danger-800": {},
        },

        ".badge-info": {
          "@apply badge bg-info-100 text-info-800": {},
        },

        ".sidebar": {
          "@apply fixed inset-y-0 left-0 z-50 w-sidebar bg-white border-r border-neutral-200 transform transition-transform duration-300 ease-in-out":
            {},
        },

        ".main-content": {
          "@apply flex-1 ml-sidebar min-h-screen bg-background-secondary": {},
        },

        ".page-header": {
          "@apply bg-white border-b border-neutral-200 px-6 py-4": {},
        },

        /* Boards-list aesthetics - page header bar */
        ".page-header-bar": {
          "@apply flex items-center gap-2 bg-gradient-to-l from-indigo-100 via-white to-neutral-100 px-3 py-2 sm:gap-3 sm:px-4 sm:py-3":
            {},
        },
        ".page-header-divider": {
          "@apply h-4 w-px shrink-0 bg-indigo-600 sm:h-5": {},
        },
        ".page-header-title": {
          "@apply truncate font-bold typography-h2 text-indigo-600": {},
        },
        ".page-header-subtitle": {
          "@apply truncate typography-caption font-medium text-neutral-700": {},
        },

        /* Page separator with colored dots */
        ".page-separator": {
          "@apply flex items-center gap-1 px-3 mb-4 sm:px-4": {},
        },
        ".page-separator-line": {
          "@apply h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent":
            {},
        },
        ".page-separator-dot": {
          "@apply h-1.5 w-1.5 rounded-full bg-gradient-to-br": {},
        },

        /* Card title on gradient (white text) */
        ".card-title-gradient": {
          "@apply truncate text-lg font-extrabold text-white drop-shadow-md":
            {},
        },
        /* Card body text */
        ".card-body-text": {
          "@apply line-clamp-2 typography-body font-medium text-neutral-700":
            {},
        },
        ".card-meta-text": {
          "@apply typography-caption font-bold text-neutral-600": {},
        },

        /* Action icon buttons */
        ".action-icon-edit": {
          "@apply flex h-7 w-7 items-center justify-center rounded text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800 outline-none":
            {},
        },
        ".action-icon-delete": {
          "@apply flex h-7 w-7 items-center justify-center rounded text-danger-600 hover:bg-danger-50 hover:text-danger-700 outline-none":
            {},
        },
      });

      addUtilities({
        ".animate-fade-in": {
          animation: "fadeIn 0.2s ease-in-out",
        },

        ".animate-slide-in": {
          animation: "slideIn 0.3s ease-out",
        },

        ".scrollbar-thin": {
          "scrollbar-width": "thin",
          "scrollbar-color": "#D1D5DB #F3F4F6",
        },

        ".scrollbar-thin::-webkit-scrollbar": {
          width: "6px",
        },

        ".scrollbar-thin::-webkit-scrollbar-track": {
          "@apply bg-neutral-100": {},
        },

        ".scrollbar-thin::-webkit-scrollbar-thumb": {
          "@apply bg-neutral-300 rounded-full hover:bg-neutral-400": {},
        },
      });
    },
  ],
};

module.exports.themeColors = themeColors;
