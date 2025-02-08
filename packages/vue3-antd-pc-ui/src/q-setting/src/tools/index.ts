import { js_utils_deep_copy, js_utils_deep_merge } from '@quantum-design/utils';
import { useProjectSettingStore } from '../store';
import type { IProjectConfig } from '../type';
import { js_create_local_storage } from '@quantum-design/utils/extra';

export function setup_project_conf(setting:IProjectConfig) {
    const _projectSettinglStore = useProjectSettingStore();
    const ls = js_create_local_storage();
    let _projectConfig: IProjectConfig = ls?.get('project_config') || {};
    const _setting = js_utils_deep_copy(setting);
    _projectConfig = js_utils_deep_merge(_setting, _projectConfig);
    _projectSettinglStore.set_project_config(_projectConfig);
}
