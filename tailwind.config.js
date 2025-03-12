/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}", "./public/index.html"],
  darkMode: 'class', // Optional: Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        orange:"rgba(255, 91, 52, 1)",
        'orange-secondary': 'rgba(255, 91, 52, 1)',      // For buttons/accents
        green: 'rgba(52, 199, 89, 1)',     // Success states/icons
        'green-secondary': 'rgba(52, 199, 89, 1)',     // Success states/icons
        
        // Neutral colors
        'terracotta': 'rgba(204, 85, 0, 1)',          // Headings/borders
        'sage-green': 'rgba(166, 179, 143, 0.3)',     // Subtle backgrounds
        'off-black': 'rgba(34, 34, 34, 1)',           // Body text
        'off-white': 'rgba(248, 248, 248, 1)',        // Backgrounds
        
        // Optional gradient stops
        'gradient-start': 'rgba(255,91,52,1)',
        'gradient-end': 'rgba(204,85,0,1)',
      },
      boxShadow: {
        'donation-card': '0 4px 12px rgba(166, 179, 143, 0.2)', // For cards
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
