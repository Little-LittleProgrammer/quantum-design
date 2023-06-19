import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const masterVersion = pkg.version;
const author = pkg.author;

const FormatTypes = {
    esm: 'es',
    cjs: 'cjs',
    iife: 'iife'
};

const packageDirDist = process.env.LOCALDIR ? process.env.LOCALDIR : 'dist';
// 阿里云自带环境
const isDeclaration = process.env.TYPES !== 'false' &&
    !(process.env.PIPELINE_NAME?.includes('生产') || process.env.PIPELINE_TAGS?.includes('生产') || process.env.PIPELINE_NAME?.includes('测试') || process.env.PIPELINE_TAGS?.includes('测试'));

export function rollup_commpn_lib_config(name, rollupOptions, version) {
    function get_common() {
        const common = {
            input: rollupOptions.input ? rollupOptions.input : `./index.ts`,
            output: {
                banner: `/*! utils version: ${version || masterVersion} \n author: ${author} */`,
                footer: '/*! join us */',
                ...rollupOptions.output
            },
            // 外部依赖，也是防止重复打包的配置
            external: [...(rollupOptions.external || [])],
            plugins: [
                resolve(),
                commonjs({
                    exclude: 'node_modules'
                }),
                json(),
                cleanup({
                    comments: 'some'
                }),
                typescript({
                    tsconfig: './tsconfig.json',
                    useTsconfigDeclarationDir: true,
                    tsconfigOverride: {
                        compilerOptions: {
                            declaration: isDeclaration,
                            declarationMap: false,
                            declarationDir: isDeclaration ? `${packageDirDist}/types/` : undefined, // 类型声明文件的输出目录
                            module: 'ES2015'
                        }
                    },
                    include: ['*.ts+(|x)', '**/*.ts+(|x)', '../**/*.ts+(|x)']
                }),
                ...(rollupOptions.plugins || [])
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
    return total;
}

