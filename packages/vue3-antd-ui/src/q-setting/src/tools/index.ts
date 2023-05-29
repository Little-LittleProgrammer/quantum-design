import { createLocalStorage, deep_copy, deep_merge } from '@wuefront/utils';
import { useProjectSettingStore } from '../store';
import { IProjectConfig } from '../type';

export function setup_project_conf(setting:IProjectConfig) {
    const _projectSettinglStore = useProjectSettingStore();
    const ls = createLocalStorage();
    let _projectConfig: IProjectConfig = ls.get('project_config') || {};
    const _setting = deep_copy(setting);
    _projectConfig = deep_merge(_setting, _projectConfig);
    _projectSettinglStore.set_project_config(_projectConfig);
}
