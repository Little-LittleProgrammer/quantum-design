import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: ['src/index'],
    clean: true,
    rollup: {
        inlineDependencies: true,
        esbuild: {
            target: 'node22',
            platform: 'node',
            minify: true,
        },
    },
});
