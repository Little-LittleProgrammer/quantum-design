import {
    green,
    magenta,
    yellow,
    blue
  } from 'kolorist'
import { PromptObject } from "prompts"

const vue3TemplateQuestion:PromptObject = {
    type: 'select',
    name: 'template',
    message: '选择你的模板',
    choices: [
        { title: magenta('vue3-antd-vite'), value: 'vue3-antd-vite' },
        { title: green('vue3-component-lib'), value: 'vue3-component-lib' },
        { title: yellow('vitepress-docs'), value: 'vitepress-docs' },
        {title: blue('uniapp'), value: 'uniapp-project' }
    ]
}
const nuxt3TemplateQuestion: PromptObject = {
    type: 'select',
    name: 'template',
    message: '选择你的模板',
    choices: [
        { title: magenta('nuxt3'), value: 'nuxt3' }
    ]
}

export {nuxt3TemplateQuestion, vue3TemplateQuestion}