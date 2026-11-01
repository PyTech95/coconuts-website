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
        green: {50: 'rgb(var(--green-50) / <alpha-value>)', 100: 'rgb(var(--green-100) / <alpha-value>)', 200: 'rgb(var(--green-200) / <alpha-value>)', 300: 'rgb(var(--green-300) / <alpha-value>)', 400: 'rgb(var(--green-400) / <alpha-value>)', 500: 'rgb(var(--green-500) / <alpha-value>)', 600: 'rgb(var(--green-600) / <alpha-value>)', 700: 'rgb(var(--green-700) / <alpha-value>)', 800: 'rgb(var(--green-800) / <alpha-value>)', 900: 'rgb(var(--green-900) / <alpha-value>)', 950: 'rgb(var(--green-950) / <alpha-value>)'},
        pink: {50: 'rgb(var(--pink-50) / <alpha-value>)', 100: 'rgb(var(--pink-100) / <alpha-value>)', 200: 'rgb(var(--pink-200) / <alpha-value>)', 300: 'rgb(var(--pink-300) / <alpha-value>)', 400: 'rgb(var(--pink-400) / <alpha-value>)', 500: 'rgb(var(--pink-500) / <alpha-value>)', 600: 'rgb(var(--pink-600) / <alpha-value>)', 700: 'rgb(var(--pink-700) / <alpha-value>)', 800: 'rgb(var(--pink-800) / <alpha-value>)', 900: 'rgb(var(--pink-900) / <alpha-value>)', 950: 'rgb(var(--pink-950) / <alpha-value>)'},
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