/// <reference types="vitest" />
import { ConfigEnv } from 'vite';
import { UserConfig } from 'vite';
import {vite_common_lib_config} from '@quantum-design-configs/vite';
import {resolve} from 'path';

export default ({ command, mode }: ConfigEnv):UserConfig => {
    const _common = vite_common_lib_config({
        entry: './index.ts',
        name: 'qComponents',
        outDir: 'dist',
        isComponentsBuild: true,
        target: 'modules',
        rollupOptions: {
            external: [
                'vue',
                'vue-router',
                '@quantum-design/shared',
                '@quantum-design/utils',
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
            ]
        },
        buildOptions: {
            cssCodeSplit: true,
            minify: true
        },
        dtsOptions: {
            entryRoot: resolve(__dirname)
        }
    });
    _common.plugins?.splice(2, 1);
    return {
        ..._common,
        css: {
            preprocessorOptions: {
                scss: {
                    additionalData: "@use 'sass:math'; @import '@quantum-design/shared/style/base/base.scss'; @import '@quantum-design/shared/style/base/mixin.scss';"
                }
            }
        },
        test: {
            environment: 'jsdom'
        }
    };
};
