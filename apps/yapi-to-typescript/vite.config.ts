import { crx } from '@crxjs/vite-plugin';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import manifest from './manifest.json';
import { antdCssData, baseScssFile } from './config/antd';

// https://vitejs.dev/config/
export default defineConfig({
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: antdCssData,
                javascriptEnabled: true
            },
            scss: {
                additionalData: baseScssFile
            }
        }
    },
    plugins: [vue(), crx({ manifest }) ]
});
