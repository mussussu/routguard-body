import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    // Use the Vercel commit SHA if available; otherwise a timestamp
    __BUILD_ID__: JSON.stringify(process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString())
  }
})
