

import generatePackageJson from "rollup-plugin-generate-package-json"

import { resolvePackageJSON, getPackageJSON, getBaseRollupPlugins } from "./utils"

const { name, module } = getPackageJSON("react")

// react 包的路径
const pkgPath = resolvePackageJSON(name)

// react 产物路径
const pkgDistPath = resolvePackageJSON(name, true)

export default [
    // react
    {
        input: `${pkgPath}/${module}`,
        output: {
            file: `${pkgDistPath}/index.js`,
            name: "index.js",
            format: "umd"
        },
        plugins: [...getBaseRollupPlugins(), generatePackageJson({
            InputFolder: pkgPath,
            OutputFolder: pkgDistPath,
            baseContents: ({ name, description, version }) => ({
                name, description, version,
                main: "index.js"
            })
        })]
    },
    // jsx-runtime
    {
        input: `${pkgPath}/src/jsx.ts`,
        output: [
            // jsx-runtime
            {
                file: `${pkgDistPath}/jsx-runtime.js`,
                name: "jsx-runtime.js",
                format: "umd"

            },
            // jsx-dev-runtime
            {
                file: `${pkgDistPath}/jsx-dev-runtime.js`,
                name: "jsx-dev-runtime.js",
                format: "umd"

            }
        ],
        plugins: getBaseRollupPlugins()
    }
]