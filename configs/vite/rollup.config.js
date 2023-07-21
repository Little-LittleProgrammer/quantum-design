import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const FormatTypes = {
    cjs: 'cjs'
};
const packageDirDist = process.env.LOCALDIR ? process.env.LOCALDIR : 'dist';
const isDeclaration = process.env.TYPES !== 'false' &&
    !(process.env.PIPELINE_NAME?.includes('生产') || process.env.PIPELINE_TAGS?.includes('生产') || process.env.PIPELINE_NAME?.includes('测试') || process.env.PIPELINE_TAGS?.includes('测试'));
const name = 'vite';
function get_common() {
    const common = {
        input: `./index.ts`,
        output: {
            banner: `/* http version: ${pkg.version} \n author: ${pkg.author} */`,
            footer: '/* join us */'
        },
        // 外部依赖，也是防止重复打包的配置
        external: [ 'vite', 'vue', '@wuefront/utils'],
        plugins: [
            typescript({
                tsconfig: './tsconfig.json',
                useTsconfigDeclarationDir: true,
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: isDeclaration,
                        declarationMap: false,
                        declarationDir: isDeclaration ? `./${packageDirDist}/types/` : undefined, // 类型声明文件的输出目录
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
    cjsPackageMin
};
const result = total;
export default [...Object.values(result)];
