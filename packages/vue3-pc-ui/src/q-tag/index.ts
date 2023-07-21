import Tag from './src/tag.vue';
import type {TagProps} from './src/tagTypes';

import { component_with_install } from '@wuefront/utils';
const QTag = component_with_install(Tag);

export type {TagProps};
export default QTag;
