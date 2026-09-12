import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { nitro } from 'nitro/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// TanStack Start / Nitro set up multiple Vite "environments" (client + SSR)
// for the real app/build, which conflicts with Vitest's single jsdom
// environment and causes a duplicate-React "Invalid hook call" error.
// Skip them under `vitest` — build/dev/preview are untouched.
const isVitest = !!process.env.VITEST

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    tailwindcss(),
    ...(isVitest ? [] : [tanstackStart(), nitro()]),
    viteReact(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    exclude: ['node_modules/**', 'e2e/**'],
  },
})

export default config
