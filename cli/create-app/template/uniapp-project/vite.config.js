import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';

export default defineConfig({
    plugins: [uni()],
    css: {
        preprocessorOptions: {
            scss: {
                charset: false,
                additionalData:
                    '@import "./src/assets/style/mixins.scss";@import "./src/assets/style/base.scss";'
            }
        }
    }
});
