import { fileURLToPath, URL } from 'node:url'

import { defineConfig, Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import glob from 'tiny-glob'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(), tailwindcss(), preloadTextures()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})

function preloadTextures(): Plugin {
  return {
    name: 'preload-textures',
    transformIndexHtml: {
      order: 'post',
      async handler() {
        const files = await glob('public/img/textures/**/*.png')
        return files.map(file => ({
          tag: 'link',
          attrs: {
            rel: 'preload',
            as: 'image',
            href: file.replace('public', ''),
          },
          injectTo: 'head',
        }))
      },
    },
  }
}
