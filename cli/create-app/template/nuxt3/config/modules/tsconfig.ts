import type { INuxtConfig } from './types';

export const tsConfig:INuxtConfig = {
    typescript: {
        tsConfig: {
            include: ['node_modules/@quantum-design/types/**/*.d.ts']
        }
    }
};
