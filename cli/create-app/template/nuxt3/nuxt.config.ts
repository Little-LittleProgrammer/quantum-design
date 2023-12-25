// https://nuxt.com/docs/api/configuration/nuxt-config
import {vite_utils_wrapper_env} from '@q-front-npm-configs/vite'
import { get_modules_config } from './config/modules'
import { project_config } from './config/project-setting';
import { js_utils_deep_merge } from '@q-front-npm/utils';
export default defineNuxtConfig((() => {
    const viteEnv = vite_utils_wrapper_env(process.env);
    const _projectConfig = project_config(viteEnv)
    const _modulesConfig = get_modules_config(viteEnv)
    const _globalConfig = js_utils_deep_merge(_projectConfig, _modulesConfig)
    return _globalConfig
})())