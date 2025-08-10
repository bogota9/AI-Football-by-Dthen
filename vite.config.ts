import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Имя репозитория (у тебя AI-Football-by-Dthen)
export default defineConfig({
  base: '/AI-Football-by-Dthen/',
  plugins: [react()]
})
