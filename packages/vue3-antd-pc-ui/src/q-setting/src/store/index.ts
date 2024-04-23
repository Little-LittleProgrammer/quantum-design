import { defineStore } from 'pinia';
import { IProjectConfig } from '../type';
import { js_create_local_storage } from '@quantum-design/utils/extra';
import { isClient, js_utils_deep_merge } from '@quantum-design/utils';

export interface IFileExport {
    title?: string;
    action: string;
    message: string;
    export_url: string
}

const ls = isClient && js_create_local_storage();

// state
const createState = () => {
    const state = {
        projectConfig: ls && ls?.get('project_config') || {} as IProjectConfig
    };
    return state;
};
export type ProjectSettingState = ReturnType<typeof createState> & {
    projectConfig: IProjectConfig
}

export const state = createState();

export const useProjectSettingStore = defineStore('projectSetting', {
    state: ():ProjectSettingState => (state),
    getters: {
        getProjectConfig(state): IProjectConfig {
            return state.projectConfig || {};
        }
    },
    actions: {
        set_project_config(config: IProjectConfig) {
            this.projectConfig = js_utils_deep_merge(this.projectConfig || {}, config);
            ls && ls?.set('project_config', this.projectConfig);
        }
    }
});

