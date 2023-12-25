import {
    green,
    magenta,
    yellow,
    cyan
  } from 'kolorist'
const vue2TemplateQuestion = {
    type: 'select',
    name: 'template',
    message: '选择你的模板',
    choices: [
        { title: magenta('antd-webpack'), value: 'vue2-antd-project' },
        { title: green('el-webpack'), value: 'vue2-el-project' },
        { title: cyan('h5'), value: 'vue2-h5' },
        { title: yellow('vuepress-docs'), value: 'vuepress-docs' }
    ]
}
const nuxt2TemplateQuestion = {
    type: 'select',
    name: 'template',
    message: '选择你的模板',
    choices: [
        { title: magenta('el-project'), value: 'nuxt2-el-project' },
        { title: green('front'), value: 'nuxt2-front' },
    ]
}
export {vue2TemplateQuestion, nuxt2TemplateQuestion}