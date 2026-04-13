import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';

export default rollup_commpn_lib_config(
    {
        name: 'ai-core',
        input: 'src/index.ts',
    },
    {
        external: ['@ag-ui/core'],
    },
);
