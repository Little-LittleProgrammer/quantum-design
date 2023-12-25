module.exports = {
    // pm2进程管理配置
    apps: [
        {
            name: 'qm-front-nuxt',
            script: './node_modules/nuxt/bin/nuxt.js',
            watch: true,
            autorestart: true,
            args: 'start'
        }
    ]
};
