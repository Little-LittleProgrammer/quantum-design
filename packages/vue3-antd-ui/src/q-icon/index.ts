import { withInstall } from '@qmfront/shared/utils';
import {Icon} from './src/icon';
import IconPicker from './src/q-icon-picker.vue';

export const QIcon = withInstall(Icon);
export const QIconPicker = withInstall(IconPicker);

export * from './src/types';
