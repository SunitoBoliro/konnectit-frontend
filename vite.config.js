import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // esbuild: {
  //   target: 'esnext', // Use 'esnext' to support top-level await
  // },
})
