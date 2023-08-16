import Theme from 'vitepress/theme'
import HighlightCode from '../components/highlight-code.vue'
import CodeVoew from '../components/code-view.vue'
import {createPinia} from 'pinia';

import '@wuefront/shared/style/antd/antd.scss';
import '@wuefront/shared/style/base/index.scss';
import './styles/var.css';
import './styles/reset.css'
import {dom_listen} from './antd/style'


export default {
    ...Theme,
    async enhanceApp(ctx) {
        Theme.enhanceApp(ctx)
        ctx.app.component('CodeView', CodeVoew)
        ctx.app.component('HighlightCode', HighlightCode)
        const store = createPinia()
        ctx.app.use(store)
        if (!import.meta.env.SSR) {
            import("ant-design-vue").then(module => {
                ctx.app.use(module.Input)
                ctx.app.use(module.Button)
                ctx.app.use(module.Card)
            })
            import("@wuefront/vue3-pc-ui").then(module => {
                ctx.app.use(module.QLoading)
                ctx.app.use(module.QTreeTable)
            })
            dom_listen()
        }
      }
  };