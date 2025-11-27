import { defineBuildConfig } from 'unbuild';
import fs from 'fs';
import path from 'path';

export default defineBuildConfig({
    entries: ['src/index', 'src/postcss.config'],
    clean: true,
    declaration: true,
    rollup: {
        emitCJS: true,
        inlineDependencies: true,
    },
    hooks: {
        'build:before': () => {
            // 读取index.ts文件
            const indexPath = path.resolve(__dirname, 'src/index.template.ts');
            let content = fs.readFileSync(indexPath, 'utf8');
            let replaceContent = '';
            if (process.env.NODE_ENV === 'stub') {
                replaceContent = `packages.forEach((pkg) => {
    if (pkg.dir.includes('apps') || pkg.dir.includes('packages/vue3-antd-pc-ui') || pkg.dir.includes('packages/vue3-pc-ui') || pkg.dir.includes('packages/styles')) {
        tailwindPackages.push(path.join(pkg.dir, 'src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}'));
    }
});`;
            } else {
                replaceContent = `['./src/**/*.{vue,js,ts,jsx,tsx,html,css,scss}', './node_modules/@quantum-design/vue3-antd-pc-ui/dist/**/*.{vue,js,ts,jsx,tsx,css,scss,html}', './node_modules/@quantum-design/vue3-pc-ui/dist/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}', './node_modules/@quantum-design/styles/**/*.{css,scss}'].forEach((item) => {
    tailwindPackages.push(item);
});`;
            }

            // 替换注释并写入到临时文件用于打包
            content = content.replace('/** need-replace */', replaceContent);

            // 创建临时文件用于打包，不修改原始文件
            const tempPath = path.resolve(__dirname, 'src/index.ts');
            fs.writeFileSync(tempPath, content, 'utf8');
        },
    },
});
