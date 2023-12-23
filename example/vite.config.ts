import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import inspect from 'vite-plugin-inspect'
import { composeVisitors } from 'lightningcss'
import createPxToVwVisitor from 'lightningcss-plugin-px-to-viewport'

export default defineConfig({
  plugins: [vue(), inspect()],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      visitor: composeVisitors([
        createPxToVwVisitor({
          designWidth: 320,
          minPixelValue: 1,
          excludeSelectors: [{ type: 'class', name: /^mui-/ }],
        }),
      ]),
    } as any,
  },
})
