import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';
export default defineConfig({
  base: './',
  server: { host: '0.0.0.0', allowedHosts: ['terminal.local'] },
  plugins: [{ name: 'static-guide-icons', closeBundle() {
    cpSync(new URL('./assets/icons', import.meta.url), new URL('./dist/assets/icons', import.meta.url), { recursive: true });
  } }],
});
