import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'VueCroppa',
      formats: ['es', 'cjs'],
      fileName: (format) => (format === 'es' ? 'vue-croppa.js' : 'vue-croppa.cjs'),
    },
    rollupOptions: {
      external: ['vue'],
    },
  },
  test: {
    include: ['tests/**/*.spec.ts'],
  },
})
