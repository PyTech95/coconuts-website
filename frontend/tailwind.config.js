/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        // Brand palette driven by CSS variables (editable from the admin Theme panel).
        // Light tints (50/100) are ~50% darker than Tailwind defaults.
        green: {
          50: 'rgb(var(--c-green-50) / <alpha-value>)',
          100: 'rgb(var(--c-green-100) / <alpha-value>)',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: 'rgb(var(--c-green-500) / <alpha-value>)',
          600: 'rgb(var(--c-green-600) / <alpha-value>)',
          700: 'rgb(var(--c-green-700) / <alpha-value>)',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        pink: {
          50: 'rgb(var(--c-pink-50) / <alpha-value>)',
          100: 'rgb(var(--c-pink-100) / <alpha-value>)',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: 'rgb(var(--c-pink-500) / <alpha-value>)',
          600: 'rgb(var(--c-pink-600) / <alpha-value>)',
          700: 'rgb(var(--c-pink-700) / <alpha-value>)',
          800: '#9d174d',
          900: '#831843',
          950: '#500724',
        },
        beige: 'rgb(var(--c-beige) / <alpha-value>)',
        dark: 'rgb(var(--c-dark) / <alpha-value>)',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};