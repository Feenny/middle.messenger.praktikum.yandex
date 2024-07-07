import dns from 'dns'
import { resolve } from 'path'
import { defineConfig } from 'vite'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
    root: resolve(__dirname, 'src'),
    build: {
        outDir: '../dist',
    },
    base: './',
    server: {
        host: 'localhost',
        port: 3000,
    },
    publicDir: '../public',
})
