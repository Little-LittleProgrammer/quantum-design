// 打包
const chalk = require('chalk');
const fs = require('fs-extra');

const { get_argv, bin_run, err_log, step, get_pkg_root } = require('./utils');

const _path = get_pkg_root();
run();

async function run() {
    const _argv = get_argv();
    const _param = _argv._;
    if (_param.length !== 0 && !_param.includes('php')) {
        err_log('请输入正确的参数');
        return;
    }
    console.info(chalk.yellow(`是否为前后端分离项目: ${!_param.includes('php')}`));
    build_project(_param);
}
async function build_project(_param) {
    if (_param.length === 0) {
        await bin_run('vite', ['build']);
    } else {
        await bin_run('vite', ['build']);
        await fs.mkdir(`${_path}/dist/backend/views/site`, {recursive: true});
        await fs.move(`${_path}/dist/index.html`, `${_path}/dist/backend/views/site/index.php`);
    }
    step('完成');
}
