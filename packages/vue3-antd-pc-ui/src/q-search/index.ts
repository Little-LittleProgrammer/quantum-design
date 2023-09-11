import { component_with_install } from '@quantum-design/utils';
import Search from './src/search.vue';
export { find_search_route, get_net_router} from './src/search';

const QAntdSearch = component_with_install(Search);

export default QAntdSearch;
