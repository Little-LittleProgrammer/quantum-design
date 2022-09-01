import Loading from './loading.vue';
import type {LoadingProps} from './loadingTypes';
import { withInstall } from '@qmfront/shared/utils';
export type {LoadingProps};
const QLoading = withInstall(Loading);

export default QLoading;
