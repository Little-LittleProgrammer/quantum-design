import Tag from './tag.vue';
import type {TagProps} from './tagTypes';

import { withInstall } from '@qmfront/shared/utils';
const QTag = withInstall(Tag);

export type {TagProps};
export default QTag;
