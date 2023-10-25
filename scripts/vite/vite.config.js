import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import { resolvePackageJSON } from '../rollup/utils';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		replace({
			__DEV__: true,
			preventAssignment: true
		})
	],
	resolve: {
		alias: [
			{
				find: 'react',
				replacement: resolvePackageJSON('react')
			},
			{
				find: 'react-dom',
				replacement: resolvePackageJSON('react-dom')
			},
			{
				find: 'hostConfig',
				replacement: path.resolve(
					resolvePackageJSON('react-dom'),
					'./src/hostConfig.ts'
				)
			}
		]
	}
});
