import dns from 'dns';
import { resolve } from 'path';
import { defineConfig } from 'vite';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
    server: {
        open: '/',
        port: 3000,
    },
    root: resolve(__dirname, 'src'),
    build: {
        outDir: resolve(__dirname, 'dist'),
    },
    publicDir: '../public',
});
