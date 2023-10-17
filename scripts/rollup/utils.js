import path from 'path';
import fs from 'fs';

import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';

const packpath = path.resolve(__dirname, '../../packages');
const distpath = path.resolve(__dirname, '../../dist/node_modules');

export function resolvePackageJSON(packName, isDist) {
    if (isDist) {
        return `${distpath}/${packName}`;
    }
    return `${packpath}/${packName}`;
}

export function getPackageJSON(packName) {
    // 包路径
    const path = `${resolvePackageJSON(packName)}/package.json`;

    const str = fs.readFileSync(path, { encoding: 'utf-8' });

    return JSON.parse(str);
}

export function getBaseRollupPlugins({ alias = {
    __DEV__: true
}, typescript = {} } = {}) {
    return [replace(alias), cjs(), ts(typescript)];
}
