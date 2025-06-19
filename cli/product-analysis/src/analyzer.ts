import { createAliyunProvider, AliyunModels } from '@quantum-design/ai-hub';
import type { ProjectInfo, AnalysisReport } from './types';

/**
 * 项目分析器
 */
export class ProjectAnalyzer {
    private provider: any;

    constructor(apiKey: string, bailianAppId?: string) {
        this.provider = createAliyunProvider({
            apiKey,
            modelName: AliyunModels.DeepSeekV3,
            bailianAppId,
            timeout: 180000
        });
    }

    /**
   * 生成分析提示词
   */
    private generatePrompt(projectInfo: ProjectInfo): string {
        const { distFiles, viteConfig, sourceAnalysis, pnpmDependencies } = projectInfo;

        // 计算总构建大小
        const totalSize = distFiles.reduce((sum, file) => sum + file.size, 0);
        const totalSizeFormatted = this.formatBytes(totalSize);

        // 构建产物文件列表
        const fileList = distFiles
            .sort((a, b) => b.size - a.size)
            .map(file => `- ${file.path} (${file.sizeFormatted})`)
            .join('\n');

        let prompt = `
你是一名专业的前端性能优化专家，请分析以下项目的构建产物、源码结构和配置，并给出详细的性能分析报告和改进建议。

## 项目信息

### 构建产物 (总大小: ${totalSizeFormatted})
${fileList || '暂无构建产物'}

### Vite 配置
${viteConfig ? `\`\`\`typescript\n${viteConfig}\n\`\`\`` : '未找到 Vite 配置文件'}
`;

        // 添加源码分析信息
        if (sourceAnalysis) {
            prompt += `

## 源码分析

### 技术栈信息
- **框架**: ${sourceAnalysis.techStack.framework}
- **UI 组件库**: ${sourceAnalysis.techStack.uiLibrary.join(', ') || '无'}
- **状态管理**: ${sourceAnalysis.techStack.stateManagement.join(', ') || '无'}
- **路由库**: ${sourceAnalysis.techStack.router.join(', ') || '无'}
- **CSS 框架**: ${sourceAnalysis.techStack.cssFramework.join(', ') || '无'}
- **构建工具**: ${sourceAnalysis.techStack.buildTool.join(', ') || '无'}
- **开发工具**: ${sourceAnalysis.techStack.devTools.join(', ') || '无'}

### 源码目录结构
\`\`\`
src/
${sourceAnalysis.directoryTree}
\`\`\`

### 代码统计
- **总文件数**: ${sourceAnalysis.fileStats.totalFiles}
- **总代码行数**: ${sourceAnalysis.fileStats.totalLines}
- **平均文件大小**: ${this.formatBytes(sourceAnalysis.fileStats.averageFileSize)}
- **文件类型分布**: ${Object.entries(sourceAnalysis.fileStats.fileTypeCount)
        .map(([ext, count]) => `${ext}: ${count}`)
        .join(', ')}
`;

            // 添加关键文件内容
            if (sourceAnalysis.keyFiles.length > 0) {
                prompt += `\n### 关键文件内容\n`;
                sourceAnalysis.keyFiles.forEach(keyFile => {
                    prompt += `\n#### ${keyFile.description} (${keyFile.path})\n`;
                    prompt += `\`\`\`${this.getFileLanguage(keyFile.path)}\n${keyFile.content}\n\`\`\`\n`;
                });
            }
        }

        prompt += `
### PNPM 依赖树 (depth=2)
${pnpmDependencies ? `\`\`\`\n${pnpmDependencies}\n\`\`\`` : '未获取到 pnpm 依赖信息'}


## 分析要求

请从以下维度进行深入分析，并提供具体可行的优化建议：

### 1. 架构分析
- 项目技术栈选型是否合理
- 代码组织结构是否清晰
- 模块化程度和可维护性评估

### 2. 性能分析
- 构建产物大小分析，识别可能的体积优化点
- 代码分割和懒加载策略评估
- 依赖包大小分析，识别可替换或移除的包

### 3. 代码质量分析
- 代码结构和复杂度评估
- 最大文件分析，是否存在单文件过大问题
- 技术债务识别

### 4. 优化建议
- **构建优化**: 具体的构建配置优化建议
- **代码优化**: 代码结构和逻辑优化建议
- **依赖优化**: 推荐可替换的轻量级依赖，建议移除不必要的依赖，建议升级依赖包
- **性能优化**: 运行时性能优化建议

请确保建议具体可行，包含代码示例或配置示例。
`;

        return prompt;
    }

    /**
   * 获取文件语言类型
   */
    private getFileLanguage(filePath: string): string {
        const ext = filePath.split('.').pop()?.toLowerCase();
        const langMap: Record<string, string> = {
            'ts': 'typescript',
            'js': 'javascript',
            'vue': 'vue',
            'jsx': 'jsx',
            'tsx': 'tsx',
            'json': 'json',
            'css': 'css',
            'scss': 'scss',
            'sass': 'sass',
            'less': 'less'
        };
        return langMap[ext || ''] || 'text';
    }

    /**
   * 格式化字节数
   */
    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 B';
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    /**
   * 分析项目
   */
    async analyze(projectInfo: ProjectInfo): Promise<string> {
        console.log('🤖 开始 AI 分析...');

        try {
            const prompt = this.generatePrompt(projectInfo);

            const response = await this.provider.generate({
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3
            });

            const content = response.content;

            return content;
        } catch (error) {
            console.error('❌ AI 分析失败:', error.message);
            throw error;
        }
    }
}
