import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505", // Deep black
        foreground: "#FAFAFA", // Soft white
        card: {
          DEFAULT: "rgba(18, 18, 18, 0.7)", // Graphite with glassmorphism
          border: "rgba(255, 255, 255, 0.1)",
        },
        primary: {
          DEFAULT: "#8B5CF6", // Neon purple
          hover: "#7C3AED",
        },
        secondary: {
          DEFAULT: "#3B82F6", // Electric blue
          hover: "#2563EB",
        },
        muted: "#666666",
        zinc: {
          950: "#050505",
          900: "#0A0A0A",
          800: "#121212",
          700: "#27272A",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "premium-gradient": "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
      },
      boxShadow: {
        'premium': '0 0 20px rgba(139, 92, 246, 0.15)',
        'premium-hover': '0 0 30px rgba(139, 92, 246, 0.25)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      }
    },
  },
  plugins: [],
};
export default config;
