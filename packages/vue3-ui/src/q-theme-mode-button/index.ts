
import ThemeModeButton from './src/themeModeButton.vue';
import type {ThemeModeTypes} from './src/themeModeButtonTypes';

export type {ThemeModeTypes};

import { withInstall } from '@wuefront/utils';

const QThemeModeButton = withInstall(ThemeModeButton);
export {QThemeModeButton as default};
