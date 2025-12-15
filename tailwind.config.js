/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        fondo: {
          principal: '#0B1220',
          secundario: '#101A2E',
          panel: '#16213E',
          borde: '#1F2A44',
        },
        texto: {
          principal: '#E6EAF2',
          secundario: '#AAB4CF',
        },
        acento: {
          azul: '#4DA3FF',
          turquesa: '#5EEAD4',
        }
      },
      fontFamily: {
        serif: ['"Crimson Text"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'blur-in': 'blurIn 0.3s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        blurIn: {
          '0%': { filter: 'blur(4px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(77, 163, 255, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(77, 163, 255, 0.8)' },
        }
      }
    },
  },
  plugins: [],
}