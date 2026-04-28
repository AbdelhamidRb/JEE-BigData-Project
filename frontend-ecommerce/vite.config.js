import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Autorise Docker à exposer le port vers l'extérieur (0.0.0.0)
    port: 5173,
    watch: {
      usePolling: true // Obligatoire avec WSL/Docker pour que les modifications s'affichent en temps réel
    }
  }
})