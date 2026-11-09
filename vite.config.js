import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { getLocale } from './src/i18n.js'
import { renderSeo } from './src/seo.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
    plugins: [react(), {
      name: 'localized-development-metadata',
      apply: 'serve',
      transformIndexHtml(html, context) {
        const pathname = (context.originalUrl || context.path).split('?')[0]
        return html
          .replace('<html lang="pt-BR">', `<html lang="${getLocale(pathname).code}">`)
          .replace('<!--app-head-->', renderSeo(pathname, env.SITE_URL))
      },
    }],
  }
})
