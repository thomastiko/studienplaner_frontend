import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      vue({
        template: { transformAssetUrls }
      }),
      quasar({
        sassVariables: 'src/quasar-variables.sass'
      })
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    esbuild: {
      target: 'esnext' // Setze das Ziel für ESBuild auf die neueste Version
    },
    // Nur wenn Vite im Entwicklungsmodus ist (npm run dev)
    ...(command === 'serve' && {
      server: {
        proxy: {
          // Proxyeinstellungen für API-Anfragen während der Entwicklung
          '/api': {
            target: 'http://localhost:5000', // Ersetze dies durch die URL deines Backends in der Entwicklungsumgebung
            changeOrigin: true,
            secure: false
          }
        }
      }
    })
  }
});
