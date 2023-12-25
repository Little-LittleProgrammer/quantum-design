
import { runtimeCachingList } from './constants';
const resolve = require('path').resolve;
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const path = require('path');

// 组件库文档框架配置
const docsConfig = {
    css: ['github-markdown-css/github-markdown.css', 'highlight.js/styles/color-brewer.css', 'vue-dotmd-loader/dist/css/default.css'],
    plugins: [{src: '~/docs/index', ssr: false}],
    rules: {
        test: /\.md$/,
        include: [resolve(__dirname, 'docs/md')],
        use: [ 'vue-loader', // must use vue-loader
            {
                loader: 'vue-dotmd-loader',
                options: {
                    // wrapperName: 'DemoBlock', // 定义 demo 包裹组件（请全局注册好组件），如果空则仅渲染 demo
                    // fileDemoNamePerfix: 'FileDemo', // 文件 demo 组件名前缀
                    // blockDemoNamePerfix: 'BlockCodeDemo', // 代码块 demo 组件名前缀
                    fileDemoTag: 'demo:vue',
                    blockDemoTag: 'demo:vue',
                    includeCodeTag: 'include:code', // 导入code，渲染成代码
                    includeRawTag: 'include:raw', // 导入html片段
                    dest: false, // 输出结果文件 bool 或者 function
                    // dest(code, contextPath, resourcePath) {}, // 自定义写文件
                    markdown: { // markdown-it options see: https://github.com/markdown-it/markdown-it#init-with-presets-and-options
                        options: {
                            html: true
                        },
                        notWrapper: false,
                        init (md) {
                            // md.use(otherPlugin); // 添加 markdown-it 插件
                        }
                    }
                }
            }
        ]
    },
    router: [{name: 'docs', path: '/docs', component: resolve(__dirname, 'docs/App.vue')}]
};

// nuxt配置
module.exports = {
    alias: {}, // 别名
    head: {
        title: '',
        meta: [
            { name: 'viewport', content: 'width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no,viewport-fit=cover' },
            {name: 'format-detection', content: 'telephone=no,email=no'},
            {name: 'wap-font-scale', content: 'no'},
            { hid: 'description', name: 'description', content: '' },
            { hid: 'keywords', name: 'keywords', content: '' }
        ],
        script: [
            {
                src: `/js/flexible.js`,
                type: 'text/javascript',
                charset: 'utf-8'
            }
        ]
    }, // 默认头部seo dns-prefetch等
    generate: {}, // 生产静态文件
    /*
   ** Build configuration
   */
    build: { // 打包优化
        // 根据项目重新定义 区分build环境 和 本地dev环境
        publicPath: process.env.NODE_ENV === 'production' ? 'https://cdn-front.qimao.com/ip/' : '/_nuxt/',
        productionSourceMap: true,
        babel: {
            plugins: [
                ['@babel/plugin-proposal-private-property-in-object', { 'loose': true }]
            ]
        },
        postcss: {
            plugins: {
                'postcss-pxtorem': {
                    rootValue: 75, // 根据ui根字体大小
                    propList: ['*'],
                    exclude: /(docs)|(github\-markdown)/
                }
            }
        },
        analyze: process.argv.join('').includes('analyze'), // 打包分析
        maxChunkSize: 360000,
        extractCSS: true, // 单独打包css
        optimization: {
            splitChunks: {
                cacheGroups: { // 分开打包
                    expansions: {
                        name: 'expansions',
                        test (module) {
                            return /swiper|lazyload/.test(module.context);
                        },
                        chunks: 'initial',
                        priority: 10
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        },
        // plugins: [
        //     // ...
        //     new SentryWebpackPlugin({
        //         include: '.',
        //         release: process.env.VUE_APP_RELEASE_VERSION, // 一致的版本号
        //         configFile: 'sentry.properties', // 不用改
        //         ignore: ['node_modules', 'nuxt.config.js'],
        //         urlPrefix: '~/',
        //         // ignoreFile: '.sentrycliignore',
        //         deleteAfterCompile: true
        //     })
        // ]
        extend (config, ctx) {
            config.module.rules.push(
              {
                test: /\.m?js$/,
                include: [
                  resolve('node_modules')
                ],
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              }
            );
            /** 引入打包时自动上传sourcemap的插件 */
            const { isDev, isClient } = ctx;
            if (!isDev && isClient) {
                if (isClient) config.devtool = 'hidden-source-map';
                const path = config.output.publicPath;
                config.plugins.push(
                    new SentryWebpackPlugin({
                        include: ['.nuxt/dist/client'],
                        ignore: ['node_modules', '.nuxt/dist/client/fonts', '.nuxt/dist/server'],
                        urlPrefix: path.startsWith('/') ? `~${path}` : path
                    })
                );
            }
            process.env.NODE_ENV == 'location' || process.env.NODE_ENV == 'development' ? config.module.rules.push(docsConfig.rules) : '';
            // assets images build过后按照文件夹划分，之前是都在一个目录下所有的图片
            ctx.loaders.imgUrl.name = 'img/[path][name].[hash:7].[ext]';
            ctx.loaders.imgUrl.context = path.resolve(__dirname, 'assets/images');
        }

    },
    env: {
        API_BASEURL: process.env.BASE_URL
    },
    router: {
        extendRoutes (routes, resolve) {
            // 自定义环境添加组件库文档入口页面
            routes.push(...(process.env.NODE_ENV == 'location' || process.env.NODE_ENV == 'development' ? docsConfig.router : []));
        }
    },
    server: {
        host: '0.0.0.0', // 默认localhost,
        port: 3000
    },
    /*
   ** Customize the progress-bar color
   */
    loading: false, // loading效果
    /*
   ** Modules
   */
    css: ['./assets/style/global.scss', ...(process.env.NODE_ENV == 'location' || process.env.NODE_ENV == 'development' ? docsConfig.css : [])],
    styleResources: {
        scss: ['./assets/style/include/mixin.scss', './assets/style/include/base.scss']
    },
    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '~/plugins/axios',
        '~/plugins/sentry',
        ...(process.env.NODE_ENV == 'location' || process.env.NODE_ENV == 'development' ? docsConfig.plugins : [])
    ],
    modules: [
        '@nuxtjs/pwa', // pwa + sw + workbox
        '@nuxtjs/style-resources', // css转译
        '@nuxtjs/axios', // 接口
        '@nuxtjs/proxy' // 代理
    ],
    axios: {
        proxy: true,
        prefix: '/frontapi',
        credentials: true
    },
    proxy: {
        '/frontapi': {
            target: 'https://ip-api.qimao.com',
            changOrigin: true,
            pathRewrite: {
                '^/frontapi': '/'
            }
        }
    },
    // ~/components/global目录下的组件将被默认注册为全局组件
    components: ['~/components/global'],
    pwa: {
        icon: {
            iconSrc: '/static/icon.png', // pwa添加桌面的icon
            sizes: [16, 120, 144, 152, 192, 384, 512]
        },
        manifest: { // 基本信息
            // 添加cdn后mainfest也会成为cdn，这里需要添加start_url 否则会同源警告
            lang: 'en',
            name: '七猫版权中心',
            short_name: '七猫版权中心',
            display: 'standalone',
            theme_color: '#F11010',
            start_url: 'https://ip.qimao.com'
        },
        workbox: { // sw的工具
            offlineAnalytics: true,
            runtimeCaching: runtimeCachingList.map((runtimeCaching) => ({ // 运行时缓存
                urlPattern: `${runtimeCaching}/.*`,
                handler: 'staleWhileRevalidate',
                expiration: {
                    maxAgeSeconds: 86400
                }
            }))
        }
    }
};
