
import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
    entries: ['src/cli', 'src/tools'],
    clean: true,
    rollup: {
        inlineDependencies: true,
        esbuild: {
            target: 'node16',
            platform: 'node',
            minify: true,
        },
    },
});
