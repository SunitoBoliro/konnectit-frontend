/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        
          navbar: '#092635', // Dark blue-green
          primary: '#1B4242', // Deep teal
          secondary: '#5C8374', // Muted green
          light: '#9EC8B9', // Soft mint
        
      },
    },
  },
  plugins: [],
};
