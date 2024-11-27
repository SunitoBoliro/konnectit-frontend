/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"TW Cen MT"', 'sans-serif'], // Added TW Cen MT font
      },
      colors: {
        navbar: '#092635', // Dark blue-green
        primary: '#1B4242', // Deep teal
        secondary: '#5C8374', // Muted green
        light: '#9EC8B9', // Soft mint
        dark: '#0A0F0F', // Additional dark shade
        accent: '#3A5F5F', // Accent color for buttons or highlights
        muted: '#C5E3DD', // Lighter muted tone for backgrounds
        error: '#D9534F', // Error message red
        success: '#5CB85C', // Success green
      },
    },
  },
  plugins: [],
};
