import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.view.ts','./src/**/*.html'],
  exclude: [],
  outdir: 'styled-system',

})