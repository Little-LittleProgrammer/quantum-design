import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';

export default rollup_commpn_lib_config(
    {
        name: 'ai-core-plugins',
        input: 'src/index.ts',
    },
    {
        format: ['cjs', 'esm'],
        external: ['@ag-ui/core', 'markdown-it'],
    },
);
