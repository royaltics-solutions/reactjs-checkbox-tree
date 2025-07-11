// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import dts from 'vite-plugin-dts'; // Importa el plugin

export default defineConfig({
	plugins: [react(),
	//UPDATE: Añadir plugin para generación de tipos .d.ts
	dts({
		// Opciones del plugin dts
		insertTypesEntry: true, // Inserta un punto de entrada de tipos en el package.json
		outputDir: 'lib', // Directorio donde se generarán los .d.ts
		exclude: ['examples'], // Excluye la carpeta 'examples' del proceso de tipado
		// Puedes configurar root, include, exclude, etc. si es necesario
	})
	],
	resolve: {
		alias: {
			'@reactjs-checkbox-tree': resolve(__dirname, './src/index.ts'),
			'@/src': resolve(__dirname, './src'),
		},
		extensions: ['.ts',],
	},
	build: {
		target: 'es2015', // o tu target deseado

		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'reactjs-checkbox-tree',
			//UPDATE: Incluir formatos ESM, CJS y UMD
			formats: ['es', 'cjs', 'umd'], // Asegúrate de incluir 'es', 'cjs', 'umd'
			fileName: (format) => {
				if (format === 'es') {
					return 'index.mjs'; // Para ESM (import)
				}
				if (format === 'cjs') {
					return 'index.js'; // Para CommonJS (require)
				}
				if (format === 'umd') {
					return 'index.umd.js'; // Para UMD (browser)
				}
				return `index.${format}.js`; // Fallback
			},
		},
		rollupOptions: {
			external: ['react', 'react-dom'], //UPDATE: React y ReactDOM están marcados como externos aquí
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
		outDir: 'lib',
		sourcemap: true,
	},
});