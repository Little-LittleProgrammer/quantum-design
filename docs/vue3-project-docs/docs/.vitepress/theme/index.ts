import Theme from 'vitepress/theme'
import HighlightCode from '../components/highlight-code.vue'
import CodeVoew from '../components/code-view.vue'
import { createPinia } from 'pinia'

import '@wuefront/shared/style/base/index.scss'; 
import '@wuefront/shared/style/antd/antd.scss';
import './styles/var.css';
import './styles/reset.css'

const store = createPinia()

export default {
    ...Theme,
    enhanceApp(ctx) {
        Theme.enhanceApp(ctx)
        ctx.app.component('CodeView', CodeVoew)
        ctx.app.component('HighlightCode', HighlightCode)
        ctx.app.use(store)
      }
  };
  