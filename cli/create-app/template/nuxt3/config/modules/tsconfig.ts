import type { INuxtConfig } from './types';

export const tsConfig:INuxtConfig = {
    typescript: {
        tsConfig: {
            include: ['node_modules/@q-front-npm/types/**/*.d.ts']
        }
    }
};
