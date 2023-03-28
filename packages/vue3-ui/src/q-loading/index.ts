import Loading from './src/loading.vue';
import type {LoadingProps} from './src/loadingTypes';
import { withInstall } from '@wuefront/utils';
export type {LoadingProps};
const QLoading = withInstall(Loading);

export default QLoading;
