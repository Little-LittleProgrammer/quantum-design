import Drawer from './src/q-drawer.vue';
import { component_with_install } from '@q-front-npm/utils';

export type * from './src/type';
export { useDrawer, useDrawerInner } from './src/hooks/use-drawer';

const QAntdDrawer = component_with_install(Drawer);

export default QAntdDrawer;
