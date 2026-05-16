import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  ...(isSsrBuild && {
    build: {
      rollupOptions: {
        output: { format: 'es' },
      },
    },
  }),
}))
