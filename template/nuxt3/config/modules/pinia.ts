import { INuxtConfig } from './types';

export const piniaModules: INuxtConfig = {
    imports: {
        dirs: ['./stores']
    },
    pinia: {
        autoImports: ['defineStore', 'acceptHMRUpdate']
    }
};
