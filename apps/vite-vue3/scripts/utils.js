// 工具类
const chalk = require('chalk'); // 更改控制台文字颜色
const execa = require('execa'); // 用运行node命令
const path = require('path');

exports.bin_run = (bin, args, opts = {}) => execa(bin, args, { stdio: 'inherit', ...opts });

/**
 * node example/parse.js -a beep -b boop
    { _: [], a: 'beep', b: 'boop' }
 */
exports.get_argv = () => { // 获取 node 命令中的变量
    const argv = require('minimist')(process.argv.slice(2));
    return argv;
};

// 错误日志输出
exports.err_log = (msg) => console.error(chalk.red(msg));

exports.step = (msg) => console.info(chalk.cyan(msg));

// 获取根路径
exports.get_pkg_root = (pkg = '') => path.resolve(__dirname, '../' + pkg);
