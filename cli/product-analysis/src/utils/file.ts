import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import type { FileInfo, ProjectInfo, SourceAnalysis, FileStats, KeyFileContent, TechStackInfo } from '../types';

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * 计算文件代码行数
 */
export async function countFileLines(filePath: string): Promise<number> {
    try {
        const content = await fs.readFile(filePath, 'utf-8');
        return content.split('\n').length;
    } catch {
        return 0;
    }
}

/**
 * 生成目录树结构, 包含文件大小和行数信息
 */
export async function generateDirectoryTree(dirPath: string, files: FileInfo[], prefix = '', maxDepth = 3, currentDepth = 0, basePath?: string): Promise<string> {
    if (currentDepth >= maxDepth || !(await fs.pathExists(dirPath))) {
        return '';
    }

    // 如果是第一次调用，设置基础路径
    if (!basePath) {
        basePath = dirPath;
    }

    const items = await fs.readdir(dirPath);
    const filteredItems = items.filter((item) => !item.startsWith('.') && !['node_modules', 'dist', 'build'].includes(item));

    let tree = '';
    for (let i = 0; i < filteredItems.length; i++) {
        const item = filteredItems[i];
        const itemPath = path.join(dirPath, item);
        const stat = await fs.stat(itemPath);
        const isLast = i === filteredItems.length - 1;
        const connector = isLast ? '└── ' : '├── ';

        if (stat.isFile()) {
            // 计算相对于 basePath 的路径
            const relativePath = path.relative(basePath, itemPath);
            const fileInfo = files.find((f) => f.path === relativePath);

            if (fileInfo) {
                // 显示文件名 + 大小 + 行数
                const sizeInfo = fileInfo.sizeFormatted;
                const linesInfo = fileInfo.lines ? `, ${fileInfo.lines} 行` : '';
                tree += `${prefix}${connector}${item} (${sizeInfo}${linesInfo})\n`;
            } else {
                // 如果找不到文件信息，只显示文件名
                tree += `${prefix}${connector}${item}\n`;
            }
        } else {
            // 目录显示名称和斜杠
            tree += `${prefix}${connector}${item}/\n`;

            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            tree += await generateDirectoryTree(itemPath, files, newPrefix, maxDepth, currentDepth + 1, basePath);
        }
    }

    return tree;
}

/**
 * 获取目录下所有文件信息（包含代码行数）
 */
export async function getDirectoryFiles(dirPath: string, basePath: string = dirPath): Promise<FileInfo[]> {
    const files: FileInfo[] = [];

    if (!(await fs.pathExists(dirPath))) {
        return files;
    }

    const items = await fs.readdir(dirPath);

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = await fs.stat(fullPath);

        if (stat.isFile()) {
            const relativePath = path.relative(basePath, fullPath);
            const lines = await countFileLines(fullPath);
            files.push({
                path: relativePath,
                size: stat.size,
                sizeFormatted: formatFileSize(stat.size),
                lines,
            });
        } else if (stat.isDirectory() && !['node_modules', '.git', 'dist', 'build'].includes(item)) {
            const subFiles = await getDirectoryFiles(fullPath, basePath);
            files.push(...subFiles);
        }
    }

    return files;
}

/**
 * 获取 pnpm 依赖信息
 */
export async function getPnpmDependencies(projectDir: string): Promise<string | undefined> {
    try {
        // 检查是否存在 pnpm-lock.yaml
        const pnpmLockPath = path.join(projectDir, '../../pnpm-lock.yaml');
        if (!(await fs.pathExists(pnpmLockPath))) {
            console.log('📦 未找到 pnpm-lock.yaml，跳过 pnpm 依赖分析');
            return undefined;
        }

        console.log('📦 正在分析 pnpm 依赖...');

        // 执行 pnpm ls --depth=2 -r 命令
        const output = execSync('pnpm ls --depth=1 -r', {
            cwd: projectDir,
            encoding: 'utf-8',
            timeout: 30000, // 30秒超时
        });

        return output;
    } catch (error) {
        console.warn('⚠️  获取 pnpm 依赖信息失败:', error.message);
        return undefined;
    }
}

/**
 * 分析技术栈
 */
export function analyzeTechStack(packageJson: any, sourceFiles: FileInfo[]): TechStackInfo {
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const fileExtensions = sourceFiles.map((f) => path.extname(f.path)).filter(Boolean);

    const techStack: TechStackInfo = {
        framework: 'Unknown',
        uiLibrary: [],
        stateManagement: [],
        router: [],
        cssFramework: [],
        buildTool: [],
        devTools: [],
    };

    // 检测框架
    if (dependencies.vue) techStack.framework = 'Vue';
    else if (dependencies.react) techStack.framework = 'React';
    else if (dependencies['@angular/core']) techStack.framework = 'Angular';
    else if (dependencies.svelte) techStack.framework = 'Svelte';

    // 检测 UI 库
    if (dependencies.antd || dependencies['ant-design-vue']) techStack.uiLibrary.push('Ant Design');
    if (dependencies['element-ui'] || dependencies['element-plus']) techStack.uiLibrary.push('Element');
    if (dependencies.quasar) techStack.uiLibrary.push('Quasar');
    if (dependencies.vuetify) techStack.uiLibrary.push('Vuetify');
    if (dependencies['@mui/material']) techStack.uiLibrary.push('Material-UI');

    // 检测状态管理
    if (dependencies.vuex) techStack.stateManagement.push('Vuex');
    if (dependencies.pinia) techStack.stateManagement.push('Pinia');
    if (dependencies.redux) techStack.stateManagement.push('Redux');
    if (dependencies.mobx) techStack.stateManagement.push('MobX');

    // 检测路由
    if (dependencies['vue-router']) techStack.router.push('Vue Router');
    if (dependencies['react-router']) techStack.router.push('React Router');

    // 检测 CSS 框架
    if (dependencies.tailwindcss) techStack.cssFramework.push('Tailwind CSS');
    if (dependencies.bootstrap) techStack.cssFramework.push('Bootstrap');
    if (dependencies.sass || dependencies.scss) techStack.cssFramework.push('Sass/SCSS');
    if (dependencies.less) techStack.cssFramework.push('Less');

    // 检测构建工具
    if (dependencies.vite) techStack.buildTool.push('Vite');
    if (dependencies.webpack) techStack.buildTool.push('Webpack');
    if (dependencies.rollup) techStack.buildTool.push('Rollup');

    // 检测开发工具
    if (dependencies.typescript) techStack.devTools.push('TypeScript');
    if (dependencies.eslint) techStack.devTools.push('ESLint');
    if (dependencies.oxlint) techStack.devTools.push('Oxlint');
    if (dependencies.prettier) techStack.devTools.push('Prettier');

    return techStack;
}

/**
 * 获取关键文件内容
 */
export async function getKeyFiles(srcPath: string): Promise<KeyFileContent[]> {
    const keyFiles: KeyFileContent[] = [];

    // 常见的关键文件路径
    const keyFilePaths = [
        { path: 'main.ts', type: 'entry' as const, description: '应用入口文件' },
        { path: 'main.js', type: 'entry' as const, description: '应用入口文件' },
        { path: 'app.vue', type: 'entry' as const, description: '根组件' },
        { path: 'App.vue', type: 'entry' as const, description: '根组件' },
        { path: 'router/index.ts', type: 'router' as const, description: '路由配置' },
        { path: 'router/index.js', type: 'router' as const, description: '路由配置' },
        { path: 'store/index.ts', type: 'store' as const, description: '状态管理' },
        { path: 'store/index.js', type: 'store' as const, description: '状态管理' },
        { path: 'utils/index.ts', type: 'util' as const, description: '工具函数' },
        { path: 'utils/index.js', type: 'util' as const, description: '工具函数' },
        { path: 'composables/index.ts', type: 'util' as const, description: 'Vue Composables' },
    ];

    for (const keyFile of keyFilePaths) {
        const fullPath = path.join(srcPath, keyFile.path);
        if (await fs.pathExists(fullPath)) {
            try {
                const content = await fs.readFile(fullPath, 'utf-8');
                // 限制内容长度，避免内容过长
                const truncatedContent = content.length > 2000 ? content.substring(0, 2000) + '\n// ... 内容被截断 ...' : content;

                keyFiles.push({
                    path: keyFile.path,
                    content: truncatedContent,
                    type: keyFile.type,
                    description: keyFile.description,
                });
            } catch (error) {
                console.warn(`无法读取文件 ${fullPath}:`, error.message);
            }
        }
    }

    return keyFiles;
}

/**
 * 分析源码目录
 */
export async function analyzeSourceDirectory(srcPath: string, packageJson: any): Promise<SourceAnalysis> {
    if (!(await fs.pathExists(srcPath))) {
        return {
            directoryTree: '源码目录不存在',
            fileStats: {
                totalFiles: 0,
                fileTypeCount: {},
                totalLines: 0,
                averageFileSize: 0,
                largestFiles: [],
            },
            keyFiles: [],
            techStack: analyzeTechStack(packageJson, []),
        };
    }

    console.log('📁 分析源码目录结构...');

    // 获取所有源码文件
    const sourceFiles = await getDirectoryFiles(srcPath);

    // 生成目录树
    const directoryTree = await generateDirectoryTree(srcPath, sourceFiles);

    // 统计文件信息
    const fileTypeCount: Record<string, number> = {};
    let totalLines = 0;
    let totalSize = 0;

    sourceFiles.forEach((file) => {
        const ext = path.extname(file.path) || 'no-ext';
        fileTypeCount[ext] = (fileTypeCount[ext] || 0) + 1;
        totalLines += file.lines || 0;
        totalSize += file.size;
    });

    const largestFiles = sourceFiles.sort((a, b) => b.size - a.size).slice(0, 10);

    const fileStats: FileStats = {
        totalFiles: sourceFiles.length,
        fileTypeCount,
        totalLines,
        averageFileSize: sourceFiles.length > 0 ? totalSize / sourceFiles.length : 0,
        largestFiles,
    };

    // 获取关键文件内容
    const keyFiles = await getKeyFiles(srcPath);

    // 分析技术栈
    const techStack = analyzeTechStack(packageJson, sourceFiles);

    return {
        directoryTree,
        fileStats,
        keyFiles,
        techStack,
    };
}

/**
 * 读取项目信息
 */
export async function readProjectInfo(projectDir: string): Promise<ProjectInfo> {
    const projectInfo: ProjectInfo = {
        packageJson: {},
        distFiles: [],
        viteConfig: undefined,
        sourceAnalysis: undefined,
        pnpmDependencies: undefined,
    };

    // 读取 package.json
    const packageJsonPath = path.join(projectDir, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
        projectInfo.packageJson = await fs.readJson(packageJsonPath);
    }

    // 读取 dist 目录文件信息
    const distPath = path.join(projectDir, 'dist');
    if (await fs.pathExists(distPath)) {
        projectInfo.distFiles = await getDirectoryFiles(distPath);
    }

    // 读取 vite.config.ts
    const viteConfigPaths = [path.join(projectDir, 'vite.config.ts'), path.join(projectDir, 'vite.config.js'), path.join(projectDir, 'vite.config.mts'), path.join(projectDir, 'vite.config.mjs')];

    for (const configPath of viteConfigPaths) {
        if (await fs.pathExists(configPath)) {
            projectInfo.viteConfig = await fs.readFile(configPath, 'utf-8');
            break;
        }
    }

    // 分析源码目录
    const srcPath = path.join(projectDir, 'src');
    projectInfo.sourceAnalysis = await analyzeSourceDirectory(srcPath, projectInfo.packageJson);

    // 获取 pnpm 依赖信息
    projectInfo.pnpmDependencies = await getPnpmDependencies(projectDir);

    return projectInfo;
}

/**
 * 写入报告文件
 */
export async function writeReport(reportPath: string, content: string): Promise<void> {
    await fs.ensureDir(path.dirname(reportPath));
    await fs.writeFile(reportPath, content, 'utf-8');
}
