import { ConfigEnv, UserConfig } from 'vite';
import { vite_common_vue_config } from '@quantum-design-configs/vite';
import { antdCssData, baseScssFile } from './config/antd';
import { resolve } from 'path';

function pathResolve(dir: string) {
    return resolve(process.cwd(), '.', dir);
}

export default ({ command, mode, }: ConfigEnv):UserConfig => {
    const _common = vite_common_vue_config({ command, mode, }, {
        rollupOptions: {
            external: [
                'monaco-editor',
                'tinymce/tinymce',
                'tinymce/plugins/anchor',
                'tinymce/themes/silver',
                'tinymce/icons/default/icons',
                'tinymce/plugins/advlist',
                'tinymce/plugins/autolink',
                'tinymce/plugins/autosave',
                'tinymce/plugins/code',
                'tinymce/plugins/codesample',
                'tinymce/plugins/directionality',
                'tinymce/plugins/fullscreen',
                'tinymce/plugins/hr',
                'tinymce/plugins/insertdatetime',
                'tinymce/plugins/link',
                'tinymce/plugins/lists',
                'tinymce/plugins/media',
                'tinymce/plugins/nonbreaking',
                'tinymce/plugins/noneditable',
                'tinymce/plugins/pagebreak',
                'tinymce/plugins/paste',
                'tinymce/plugins/preview',
                'tinymce/plugins/print',
                'tinymce/plugins/save',
                'tinymce/plugins/searchreplace',
                'tinymce/plugins/spellchecker',
                'tinymce/plugins/tabfocus',
                'tinymce/plugins/template',
                'tinymce/plugins/textpattern',
                'tinymce/plugins/visualblocks',
                'tinymce/plugins/visualchars',
                'tinymce/plugins/wordcount'
            ],
        },
    });
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
            alias: {
                '@/': pathResolve('src') + '/',
                '#/': pathResolve('types') + '/',
            },
        },
    };
};
