import {useProjectSetting} from './src/hooks/use-project-setting';
import {setup_project_conf} from './src/tools';
import { component_with_install } from '@quantum-design/utils';

import Setting from './src/setting.vue';

export type {IProjectConfig} from './src/type/index';

const QAntdSetting = component_with_install(Setting);

export {
    useProjectSetting,
    setup_project_conf
};

export default QAntdSetting;
