/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        institutional: {
          primary: '#18324A',      // Primary Navy
          deep: '#102A43',         // Deep Navy
          ivory: '#F7F5F0',        // Warm Ivory background
          sand: '#EDE8DE',         // Warm Sand panel/sub-surface
          saffron: '#C98219',      // Saffron Accent
          amber: '#E7A943',        // Soft Amber
          success: '#2F7658',      // Forest Success
          warning: '#B7791F',      // Ochre Warning
          critical: '#B44343',     // Institutional Crimson Critical
          text: {
            primary: '#1D2939',    // Main dark charcoal text
            secondary: '#667085',  // Subtext gray
            muted: '#98A2B3',      // Muted caption
          },
          border: '#D9D5CC',       // Warm parchment border
          surface: '#FFFFFF',      // Crisp card surface
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(16, 42, 67, 0.05)',
        'card': '0 1px 3px 0 rgba(16, 42, 67, 0.07), 0 1px 2px -1px rgba(16, 42, 67, 0.07)',
        'elevated': '0 4px 6px -1px rgba(16, 42, 67, 0.08), 0 2px 4px -2px rgba(16, 42, 67, 0.08)',
        'dropdown': '0 10px 15px -3px rgba(16, 42, 67, 0.1), 0 4px 6px -4px rgba(16, 42, 67, 0.1)',
      },
      borderRadius: {
        'gov': '4px',
        'gov-md': '6px',
        'gov-lg': '8px',
      }
    },
  },
  plugins: [],
}
