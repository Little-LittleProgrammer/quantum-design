const fs = require('fs-extra');
const path = require('path');
const webpack = require('webpack');
const terserPlugin = require('terser-webpack-plugin');
const compressionPlugin = require('compression-webpack-plugin');
const sentryWebpackPlugin = require('@sentry/webpack-plugin');

// cdn链接
// const cdnData = {
//     // cdn：模块名称和模块作用域命名（对应window里面挂载的变量名称）
//     externals: {
//         vue: 'Vue',
//         vuex: 'Vuex',
//         'vue-router': 'VueRouter'
//     },
//     // cdn的css链接
//     css: [],
//     // cdn的js链接
//     js: [
//         'https://cdn.staticfile.org/vue/2.6.11/vue.min.js',
//         'https://cdn.staticfile.org/vuex/3.1.2/vuex.min.js',
//         'https://cdn.staticfile.org/vue-router/3.0/vue-router.min.js'
//     ]
// }

// 获取base.scss文件
// const _antdCssStrTemp = fs.readFileSync('src/assets/style/include/base.scss', 'utf-8').toString().split('// antdend')[0].match(/\$(.*);/g).join(',').replace(/;,/g, '",').replace(/;/g, '"').replace(/: /g, '": "').replace(/\$/g, '"');
// const _antdCssData = JSON.parse('{' + _antdCssStrTemp + '}');

/* 默认
// 项目路径配置
const projectConfig = {
    projectName: '', // 项目名
    viewsDir: '' // 打包基本路径(package.json相对views文件夹)
};

projectConfig.projectName = __dirname.split('/')[__dirname.split('/').length - 1];
projectConfig.viewsDir = path.resolve('', `../../views/view.${projectConfig.projectName}`);

Object.assign(projectConfig, {
    indexPath: path.resolve(projectConfig.viewsDir, `backend/views/site/index.php`), // 项目入口文件
    outputDir: path.resolve(projectConfig.viewsDir, `backend/web`), // 项目打包输出目录
    assetsDir: 'static' // 静态文件输出目录
});

if (process.env.NODE_ENV === 'production') {
    const paths = projectConfig.viewsDir;
    const files = fs.readdirSync(paths);
    files.forEach(el => {
        if (el == 'backend') {
            fs.removeSync(path.join(paths, el));
        }
    });
}
*/

// 阿里云工作流
// 项目路径配置
const projectConfig = {
    projectName: __dirname.split('/')[__dirname.split('/').length - 1], // 项目名
    viewsDir: path.resolve('', '') // 打包基本路径(package.json相对views文件夹)
};

Object.assign(projectConfig, {
    indexPath: path.resolve(projectConfig.viewsDir, `dist/backend/views/site/index.php`), // 项目入口文件
    outputDir: path.resolve(projectConfig.viewsDir, `dist/backend/web`), // 项目打包输出目录
    assetsDir: 'static' // 静态文件输出目录
});

function resolve(dir) {
    return path.join(__dirname, dir);
}

// 多入口配置
const _pages = {
    index: {
        entry: './src/main.js',
        template: './public/index.html',
        title: 'OA',
        chunks: ['chunk-vendors', 'chunk-common', 'index']
    }
};
// 本地开发环境和测试环境打包组件库文档
if (process.env.VUE_APP_ENV == 'location' || process.env.VUE_APP_ENV == 'development') {
    _pages.docs = {
        entry: './docs/index.js',
        template: './public/index.html',
        title: 'docs',
        chunks: ['chunk-vendors', 'chunk-common', 'docs']
    };
}

// markdown解析配置
const _markOptions = {
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
        init(md) {
            // md.use(otherPlugin); // 添加 markdown-it 插件
        }
    }
};

module.exports = {
    pages: _pages,
    indexPath: projectConfig.indexPath,
    // npm run build打包输出目录
    outputDir: projectConfig.outputDir,
    // 打包静态文输出目录
    assetsDir: projectConfig.assetsDir,
    productionSourceMap: true,
    // 保存时，是否自动代码格式校验
    lintOnSave: false,
    // 定义antd-design-vue的全局基本样式
    css: {
        loaderOptions: {
            // less: {
            //     // modifyVars: {
            //     //     'primary-color': '#f00',
            //     //     'link-color': '#f00',
            //     //     'border-radius-base': '2px',
            //     // },
            //     modifyVars: _antdCssData,
            //     javascriptEnabled: true
            // }
        }
    },
    devServer: {
        host: '0.0.0.0',
        port: process.env.NODE_ENV.port, // 端口号
        disableHostCheck: true,
        https: true, // https:{type:Boolean}
        open: true, // 配置自动启动浏览器  http://XXX.XXX.X.XX:7071/rest/XXX/
        hotOnly: true, // 热更新
        proxy: {
            '/api': {
                target: 'https://infrastructure.wtzw.com',
                changeOrigin: true,
                secure: false,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    pwa: {
        name: 'vue-mange-template',
        themeColor: '#000000'
    },

    chainWebpack: (config) => {
        config.module
            .rule('dotmd')
            .test(/\.md$/)
            .use('vue-loader')
            .loader('vue-loader')
            .options({
                ...(config.module.rules.get('vue').uses.get('vue-loader').get('options') || null) // 与 vue-loader 配置保持一致
            })
            .end()
            .use('vue-dotmd-loader')
            .loader('vue-dotmd-loader')
            .options(_markOptions)
            .end();
        // 配置路径别名
        config.resolve.alias.set('@', resolve('src'));
        config.resolve.alias.set('@docs', resolve('docs'));
        // 移除 prefetch 插件  预加载
        // config.plugins.delete('prefetch');

        // 移除 preload 插件 提高资源加载的优先级
        // config.plugins.delete('preload');
        // 资源文件cdn
        // config.plugin('html').tap(args => {
        //     // 生产环境或本地需要cdn时，才注入cdn
        //     args[0].cdn = cdnData
        //     return args
        // })
        // 资源文件cdn

        /**
     * 无需使用@import在每个scss文件中引入变量或者mixin，也可以避免大量@import导致build变慢
     * sass-resources-loader 文档链接：https://github.com/shakacode/sass-resources-loader
     */
        const oneOfsMap = config.module.rule('scss').oneOfs.store;
        const sassResources = ['include/base.scss', 'include/mixin.scss']; // scss资源文件，可以在里面定义变量，mixin,全局混入样式等
        oneOfsMap.forEach(item => {
            item
                .use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: sassResources.map(file => path.resolve(__dirname, 'src/assets/style/' + file))
                })
                .end();
        });
    },
    configureWebpack: config => {
        const _plugins = [];
        if (process.env.NODE_ENV === 'production') {
            // 资源文件cdn
            // config.externals = cdnData.externals;
            // 资源文件cdn

            // 生产环境自动删除console
            _plugins.push(
                new terserPlugin({
                    terserOptions: {
                        compress: {
                            warnings: true,
                            drop_console: true,
                            drop_debugger: true,
                            pure_funcs: ['console.log'] // 移除console
                        },
                        mangle: false,
                        output: {
                            beautify: true // 压缩注释
                        }
                    },
                    sourceMap: true,
                    parallel: true
                })
            );
            _plugins.push(
                // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
                new webpack.ContextReplacementPlugin(
                    /moment[/\\]locale$/,
                    /zh-cn/
                )
            );

            _plugins.push(
                new compressionPlugin({
                    test: /\.js$|\.html$|\.css$|\.jpg$|\.jpeg$|\.png/, // 需要压缩的文件类型
                    threshold: 10240, // 归档需要进行压缩的文件大小最小值，我这个是10K以上的进行压缩
                    deleteOriginalAssets: false // 是否删除原文件
                })
            );

            // sourcemap上传
            _plugins.push(
                new sentryWebpackPlugin({
                    include: projectConfig.outputDir, // 作用的文件夹
                    release: process.env.VUE_APP_RELEASE_VERSION, // 一致的版本号
                    configFile: 'sentry.properties', // 不用改
                    ignore: ['node_modules', 'vue.config.js', 'src'],
                    // ignoreFile: '.sentrycliignore',
                    urlPrefix: `~/`, // 注意这个，上传到sentry的路径需要与网页资源文件加载的一致（～表示域名）
                    deleteAfterCompile: true
                })
            );

            config.plugins = [...config.plugins, ..._plugins];

            // 公共代码抽离
            // config.optimization = {
            //     splitChunks: {
            //         cacheGroups: {
            //             vendor: {
            //                 chunks: 'all',
            //                 test: /node_modules/,
            //                 name: 'vendor',
            //                 minChunks: 1,
            //                 maxInitialRequests: 5,
            //                 minSize: 0,
            //                 priority: 100
            //             },
            //             common: {
            //                 chunks: 'all',
            //                 test: /[\\/]src[\\/]js[\\/]/,
            //                 name: 'common',
            //                 minChunks: 2,
            //                 maxInitialRequests: 5,
            //                 minSize: 0,
            //                 priority: 60
            //             },
            //             styles: {
            //                 name: 'styles',
            //                 test: /\.(sa|sc|c)ss$/,
            //                 chunks: 'all',
            //                 enforce: true
            //             },
            //             runtimeChunk: {
            //                 name: 'manifest'
            //             }
            //         }
            //     }
            // }
        }
        // if (process.env.NODE_ENV === 'development') {}
    }
};
