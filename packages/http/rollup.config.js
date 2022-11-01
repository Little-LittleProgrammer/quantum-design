import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';

const masterVersion = require('./package.json').version;
const author = require('./package.json').author;

const FormatTypes = {
    esm: 'es',
    cjs: 'cjs',
    iife: 'iife'
};
const packageDirDist = process.env.LOCALDIR ? process.env.LOCALDIR : 'dist';
const isDeclaration = process.env.TYPES !== 'false';
const name = 'http';

function get_common() {
    const common = {
        input: `./index.ts`,
        output: {
            banner: `/* http version: ${masterVersion} \n author: ${author} */`,
            footer: '/* join us */'
        },
        // 外部依赖，也是防止重复打包的配置
        external: ['@qmfront/hooks', '@qmfront/hooks/vue', '@qmfront/shared', '@qmfront/shared/enums', '@qmfront/utils', 'axios', 'lodash-es', 'qs'],
        plugins: [
            resolve(),
            commonjs({
                exclude: 'node_modules'
            }),
            json(),
            cleanup({
                comments: 'none'
            }),
            typescript({
                tsconfig: './tsconfig.json',
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: isDeclaration,
                        declarationMap: false,
                        declarationDir: `${packageDirDist}/types/`, // 类型声明文件的输出目录
                        module: 'ES2015'
                    }
                },
                include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)']
            })
        ]
    };
    return common;
}

const common = get_common();

const esmPackageMin = {
    ...common,
    output: {
        file: `${packageDirDist}/${name}.esm.min.js`,
        format: FormatTypes.esm,
        sourcemap: false,
        ...common.output
    },
    plugins: [
        ...common.plugins,
        terser()
    ]
};

const cjsPackageMin = {
    ...common,
    output: {
        file: `${packageDirDist}/${name}.cjs.min.js`,
        format: FormatTypes.cjs,
        sourcemap: false,
        minifyInternalExports: true,
        ...common.output
    },
    plugins: [...common.plugins, terser()]
};

const total = {
    esmPackageMin,
    cjsPackageMin
};
const result = total;
export default [...Object.values(result)];
