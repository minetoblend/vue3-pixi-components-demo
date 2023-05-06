import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { isCustomElement, vuePixi } from 'vue3-pixi-components/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue({
    template: {
      compilerOptions: { isCustomElement }
    }
  }),
  vuePixi()
],
})
