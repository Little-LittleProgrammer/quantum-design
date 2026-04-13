import { rollup_commpn_lib_config } from '@quantum-design-configs/rollup';

export default rollup_commpn_lib_config(
    {
        name: 'ai-hub',
        input: 'src/index.ts',
    },
    {
        format: ['cjs', 'esm'],
        external: ['axios', 'lodash-es', 'qs', '@quantum-design/utils', '@quantum-design/shared'],
    }
);
