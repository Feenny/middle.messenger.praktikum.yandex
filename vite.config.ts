import dns from 'dns';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy'

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
	root: resolve(__dirname, 'src'),
	// base: '/assets/',
	build: {
		outDir: '../dist',
	},
	server: {
		host: 'localhost',
		port: 3000,
	},
	plugins: [
		viteStaticCopy({
		  targets: [
			{
			  src: '/src/assets/',
			  dest: '/assets'
			}
		  ]
		})
	  ],
	publicDir: '/public/'
});

