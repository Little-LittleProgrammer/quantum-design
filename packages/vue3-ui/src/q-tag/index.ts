import Tag from './src/tag.vue';
import type {TagProps} from './src/tagTypes';

import { withInstall } from '@wuefront/utils';
const QTag = withInstall(Tag);

export type {TagProps};
export default QTag;
