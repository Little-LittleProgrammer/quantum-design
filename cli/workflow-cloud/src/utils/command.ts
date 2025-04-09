import minimist from 'minimist';
import { execSync } from 'child_process';
import fs from 'fs-extra';

function get_argv() {
    const _argv = minimist(process.argv.slice(2), { string: ['_'], });
    return _argv;
}

function bin_run_ignore(bin: string, opts = {}) {
    try {
        const _output = execSync(bin, opts);
        return _output.toString();
    } catch (error) {
        console.error(error);
    }
}

function bin_run_inherit(bin: string, opts = {}) {
    try {
        execSync(bin, { stdio: 'inherit', encoding: 'utf8', ...opts, });
    } catch (error) {
        console.error(error);
    }
}

function get_branch() {
    const branch = execSync('git branch --show-current').toString().trim();
    return branch;
}

function get_diff() {
    try {
        // 获取 git diff master并排除 pnpm-lock.yaml 和 .gitignore, package-lock.yaml, package.json, *.test.ts 文件, .changeset 文件夹
        let diff = execSync('git diff master -- . ":(exclude)pnpm-lock.yaml" ":(exclude).gitignore" ":(exclude).changeset" ":(exclude)package-lock.yaml" ":(exclude)package.json" ":(exclude)*.test.ts"').toString();
        let i = 10;
        while (diff.length > 100000) {
            diff = execSync(`git diff HEAD~${i} HEAD -- . ":(exclude)pnpm-lock.yaml" ":(exclude).gitignore" ":(exclude).changeset" ":(exclude)package-lock.yaml" ":(exclude)package.json" ":(exclude)*.test.ts"`).toString();
            i--;
        }
        return diff;
    } catch (error) {
        console.error('获取 git diff 时出错:', error);
        return '';
    }
}

function get_diff_files() {
    try {
        const diff = execSync('git diff --name-only').toString();
        return diff.split('\n');
    } catch (error) {
        console.error('获取 git diff 时出错:', error);
        return [];
    }
}

export function get_repo_info() {
    try {
        const repo = execSync('git remote get-url origin').toString();
        // 获取 repo 的 name
        const repoName = repo.split('/').pop()?.split('.').shift();
        return {
            repoName,
            repoUrl: repo,
        };
    } catch (error) {
        console.error('获取 git remote get-url origin 时出错:', error);
        return {
            repoName: '',
            repoUrl: '',
        };
    }
}

function get_change_apps(appInfo: Record<string, any>[]) {
    try {
        const diffFiles:string[] = get_diff_files();
        const diffApps = diffFiles.filter(item => item.includes('apps')).map(item => {
            return item.split('/')[1];
        });
        const appsPackage: Record<string, any>[] = [];
        diffApps.forEach(item => {
            const app = fs.readFileSync(`apps/${item}/package.json`, 'utf8');
            appsPackage.push(JSON.parse(app));
        });
        if (appsPackage.length === 0) {
            return [];
        }
        const changeApps = appInfo.filter((app) => {
            return appsPackage.some((item) => item.description.includes(app.name) || app.name.includes(item.description) || item.name.includes(app.name) || app.name.includes(item.name));
        });
        return changeApps || [];
    } catch (error) {
        console.error('获取 git diff 时出错:', error);
        return [];
    }
}

export { get_argv, bin_run_ignore, bin_run_inherit, get_branch, get_diff, get_diff_files, get_change_apps };
