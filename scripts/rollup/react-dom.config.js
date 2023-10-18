import generatePackageJson from 'rollup-plugin-generate-package-json';

import {
	resolvePackageJSON,
	getPackageJSON,
	getBaseRollupPlugins
} from './utils';

import alias from '@rollup/plugin-alias';

const { name, module } = getPackageJSON('react-dom');

// react-dom 包的路径
const pkgPath = resolvePackageJSON(name);

// react-dom 产物路径
const pkgDistPath = resolvePackageJSON(name, true);

export default [
	// react
	{
		input: `${pkgPath}/${module}`,
		output: [
			{
				file: `${pkgDistPath}/index.js`,
				name: 'ReactDOM',
				format: 'umd'
			},
			{
				file: `${pkgDistPath}/client.js`,
				name: 'client',
				format: 'umd'
			}
		],
		plugins: [
			...getBaseRollupPlugins(),
			// webpack resolve alias
			alias({
				entries: {
					hostConfig: `${pkgPath}/src/hostConfig.ts`
				}
			}),
			generatePackageJson({
				InputFolder: pkgPath,
				OutputFolder: pkgDistPath,
				baseContents: ({ description, version, ...rest }) => {
					return {
						name,
						description,
						peerDependencies: {
							react: version
						},
						version,
						main: 'index.js'
					};
				}
			})
		]
	}
];
