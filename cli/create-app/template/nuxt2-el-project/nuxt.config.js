export default {
    mode: 'universal',
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: '七猫',
        htmlAttrs: {
            lang: 'en'
        },
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: '' }
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
    },
    // Global CSS: https://go.nuxtjs.dev/config-css
    css: ['element-ui/lib/theme-chalk/index.css', '@/assets/style/global.scss'],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: ['@/plugins/element-ui', '@/plugins/axios', '@/plugins/axios1', '@/plugins/route'],

    // ~/components/global目录下的组件将被默认注册为全局组件
    components: ['~/components/global'],

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: ['@nuxtjs/axios', '@nuxtjs/style-resources'],
    server: {
        host: '0.0.0.0', // 默认localhost,
        port: 3000
    },
    axios: {
        proxy: true,
        prefix: '/api'
    },
    proxy: {
        '/api': {
            target: 'https://infrastructure.wtzw.com',
            secure: false,
            pathRewrite: {
                '^/api': '',
                changeOrigin: true
            }
        }
    },
    // publicRuntimeConfig: {
    //     axios: {
    //         browserBaseURL: process.env.PUBLIC_URL // 此处填写客户端请求API的地址
    //     }
    // },
    // privateRuntimeConfig: {
    //     axios: {
    //         baseURL: process.env.PUBLIC_URL // 此处填写在服务器端请求API的地址
    //     }
    // },
    styleResources: {
        scss: ['./assets/style/include/base.scss', './assets/style/include/mixin.scss']
    },
    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        extractCSS: { allChunks: true },
        transpile: [/^element-ui/]
    }
};
