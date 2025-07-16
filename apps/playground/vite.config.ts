import { ConfigEnv, UserConfig } from 'vite';
import { vite_common_vue_config } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';
import { resolve } from 'path';

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode, }: ConfigEnv):UserConfig => {
    const _common = vite_common_vue_config({ command, mode, });
    return {
        ..._common,
        define: {
            cssData: antdCssData,
        },
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: baseScssFile,
                },
            },
        },
        resolve: {
            alias: [
                { find: /^@\//, replacement: pathResolve('./src/') + '/', },
                { find: /^#\//, replacement: pathResolve('./types/') + '/', },
                { find: /^@quantum-design\/hooks/, replacement: pathResolve('../../packages/hooks/') + '/', },
                { find: /^@quantum-design\/http/, replacement: pathResolve('../../packages/http/index.ts'), },
                // { find: /^@quantum-design\/shared\/enums/, replacement: pathResolve('../../packages/shared/enums/enums.ts') + '/', },
                { find: /^@quantum-design\/utils\/extra/, replacement: pathResolve('../../packages/utils/extra.ts'), },
                { find: /^@quantum-design\/utils/, replacement: pathResolve('../../packages/utils/index.ts'), },
                { find: /^@quantum-design\/vue3-antd-pc-ui/, replacement: pathResolve('../../packages/vue3-antd-pc-ui/index.ts'), },
                { find: /^@quantum-design\/vue3-pc-ui/, replacement: pathResolve('../../packages/vue3-pc-ui/index.ts'), },
                { find: /^@vue3-antd\//, replacement: pathResolve('../../packages/vue3-antd-pc-ui/src') + '/', }
            ],
        },
        plugins: [..._common.plugins?.slice(0, 2) || [], _common.plugins?.[5] || []],
    };
};
