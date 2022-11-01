import Loading from './loading.vue';
import type {LoadingProps} from './loadingTypes';
import { withInstall } from '@qmfront/utils';
export type {LoadingProps};
const QLoading = withInstall(Loading);

export default QLoading;
