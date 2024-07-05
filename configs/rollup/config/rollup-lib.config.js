import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import { createRequire } from 'node:module';

const required = createRequire(import.meta.url);
const pkg = required('../package.json');

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

function isString(val){
    return toString.call(val) === `[object String]`;
}

function isObject(val) {
    return val !== null && typeof val === 'object';
}

function isArray(val) {
    return val !== null && Array.isArray(val);
}

export function rollup_commpn_lib_config(pkgList, rollupOptions, version) {
    const format = rollupOptions.format || ['cjs', 'esm'];
    const finPkgList = [];
    function get_common() {
        const prePlugins = [
            resolve(),
            commonjs({
                exclude: 'node_modules'
            }),
            json(),
            typescript({
                outputToFilesystem: false,
                tsconfig: './tsconfig.json',
                compilerOptions: {
                    declaration: isDeclaration,
                    declarationMap: false,
                    declarationDir: isDeclaration ? `${packageDirDist}/types/` : undefined, // 类型声明文件的输出目录
                    module: 'ES2020',
                    removeComments: false
                },
                sourceMap: false,
                include: ['*.ts+(|x)', '**/*.ts+(|x)'],
                exclude: ['**/*.spec.ts+(|x)', 'node_modules']
            }),
            terser({
                compress: {drop_console: true }
            })
        ];
        const nextPlugins = [...(rollupOptions.plugins || [])];
        const preObj = {};
        for (const item of prePlugins) {
            preObj[item.name] = item;
        }

        if (nextPlugins.length > 0) {
            for (const item of nextPlugins) {
                preObj[item.name] = item;
            }
        }
        const common = {
            output: {
                footer: '/*! join us */',
                generatedCode: 'es2015',
                ...rollupOptions.output
            },
            treeshake: {
                moduleSideEffects: false
            },
            // 外部依赖，也是防止重复打包的配置
            external: [...(rollupOptions.external || [])],
            plugins: Object.values(preObj)
        };
        return common;
    }
    const result = [];

    const common = get_common();
    function package_file(pkgList) {
        if (isString(pkgList)) {
            finPkgList.push({
                name: pkgList,
                input: `./index.ts`
            });
        } else if (isArray(pkgList)) {
            for (const item of pkgList) {
                finPkgList.push({
                    name: item.name,
                    input: item.input || `./index.ts`
                });
            }
        } else if (isObject(pkgList)) {
            finPkgList.push({
                name: pkgList.name,
                input: pkgList.input || `./index.ts`
            });
        }

        for (const item of finPkgList) {
            result.push(...format.map(key => {
                return {
                    ...common,
                    input: item.input,
                    output: {
                        dir: `${packageDirDist}`,
                        entryFileNames: `${item.name}.${key}.min.js`,
                        format: FormatTypes[key],
                        sourcemap: false,
                        compact: true,
                        banner: `/*! name: ${item.name} version: ${version || masterVersion} \n author: ${author} */`,
                        ...common.output
                    }
                };
            }));
        }
    }

    package_file(pkgList);
    return result;
}

