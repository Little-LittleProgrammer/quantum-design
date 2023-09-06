import Loading from './src/loading.vue';
import type {LoadingProps} from './src/loadingTypes';
import { component_with_install } from '@q-front-npm/utils';
export type {LoadingProps};
const QLoading = component_with_install(Loading);

export default QLoading;
