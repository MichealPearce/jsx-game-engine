import { defineConfig } from 'vite'
// @ts-expect-error - no types
import { resolve } from 'path'

export default defineConfig({
	resolve: {
		alias: {
			'@': resolve('src'),
		},
	},

	server: {
		port: 3000,
	},

	esbuild: {
		jsx: 'transform',
		jsxImportSource: '@',
		jsxInject: `import { jsx } from '@/jsx-runtime'`,
		jsxFactory: 'jsx.component',
		jsxFragment: 'jsx.Fragment',
	},
})
