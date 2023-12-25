import minimist from 'minimist'
import { execSync } from 'child_process'

function get_argv() {
    const _argv = minimist(process.argv.slice(2), { string: ['_'] });
    return _argv;
}

function bin_run_ignore(bin: string, opts = {}) {
    try {
        const _output = execSync(bin, opts);
        return _output.toString()
    } catch (error) {
        console.error(error);
    }
}

function bin_run_inherit(bin: string, opts = {}) {
    try {
        execSync(bin, { stdio: 'inherit', encoding: 'utf8', ...opts });
    } catch (error) {
        console.error(error);
    }
}

export { get_argv, bin_run_ignore, bin_run_inherit }