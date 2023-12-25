import Theme from 'vitepress/theme'
import CodeVoew from '../components/code-view.vue'

import './styles/var.css';

export default {
    ...Theme,
    enhanceApp(ctx) {
        Theme.enhanceApp(ctx)
        ctx.app.component('CodeView', CodeVoew)
      }
  };
  