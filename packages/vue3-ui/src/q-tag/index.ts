import Tag from './tag.vue';
import type {TagProps} from './tagTypes';

import { withInstall } from '@qmfront/utils';
const QTag = withInstall(Tag);

export type {TagProps};
export default QTag;
