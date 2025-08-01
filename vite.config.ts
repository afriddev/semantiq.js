import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss()],
  optimizeDeps: {
    exclude: ["@electric-sql/pglite"],
  },
})
  