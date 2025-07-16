import type { Hunk, PatchDiff, PRCompressor } from './hunk-patch';

export class AICodeReview {
    private readonly hunks: Hunk[];
    private readonly deletedFiles: PatchDiff[];
    private readonly otherModifications: string[];

    constructor(compressResult: { hunks: Hunk[]; deletedFiles: PatchDiff[]; otherModifications: string[] }) {
        this.hunks = compressResult.hunks;
        this.deletedFiles = compressResult.deletedFiles;
        this.otherModifications = compressResult.otherModifications;
    }

    async generateReviewPrompt(): Promise<string> {
        const contextParts: string[] = [];

        // 1. 添加PR概述
        contextParts.push(this.generateOverview());

        // 2. 按文件分组组织代码变更
        const fileGroups = this.groupHunksByFile();

        // 3. 生成每个文件的变更描述
        for (const [fileName, hunks] of Object.entries(fileGroups)) {
            contextParts.push(this.generateFileChangesDescription(fileName, hunks));
        }

        // 4. 添加删除文件信息
        if (this.deletedFiles.length > 0) {
            contextParts.push(this.generateDeletedFilesDescription());
        }

        // 5. 添加其他修改信息
        // if (this.otherModifications.length > 0) {
        //     contextParts.push(this.generateOtherModificationsDescription());
        // }

        // 6. 添加审查指导
        contextParts.push(this.generateReviewGuidance());

        // 7. 添加返回格式
        contextParts.push(this.generateReturnType());

        return contextParts.join('\n\n');
    }

    private generateOverview(): string {
        return `请审查以下代码变更：
- 变更涉及 ${Object.keys(this.groupHunksByFile()).length} 个文件
- 包含 ${this.hunks.length} 个代码块变更
- 删除了 ${this.deletedFiles.length} 个文件`;
    }

    private generateFileChangesDescription(fileName: string, hunks: Hunk[]): string {
        const fileExt = fileName.split('.').pop() || '';

        return `文件: ${fileName}
\`\`\`${fileExt}
${hunks.map((hunk) => `行号: ${hunk.lineNumber}, 代码: ${hunk.diff}`).join('\n\n')}
\`\`\``;
    }

    private generateDeletedFilesDescription(): string {
        return `删除的文件：
${this.deletedFiles.map((file) => `- ${file.oldPath || file.newPath}`).join('\n')}`;
    }

    private generateOtherModificationsDescription(): string {
        return `其他修改：
${this.otherModifications.join('\n')}`;
    }

    private generateReviewGuidance(): string {
        return `请重点关注以下方面：
1. 代码质量和最佳实践
2. 潜在的安全问题
4. 可维护性建议
5. 代码逻辑是否正确
6. 潜在的性能问题
7. 代码风格与规范
8. 安全隐患
9. 代码可读性

注意事项：
- 请只关注需要改进的地方，对于已经实现良好的部分无需提供正向评价
- 重点指出可能存在的问题和改进建议
- 如果代码完全符合规范且没有问题，无需回复
- 对于重复出现的问题，请使用 "重复问题：文件名:行号" 的格式进行引用，无需重复描述
- 禁止用markdown格式返回

<CURRENT_CURSOR_POSITION>
请按文件分别提供审查意见，并对较大问题给出优化代码`;
    }

    private generateReturnType(): string {
        return `请务必按照以下格式返回:
[{
    "fileName": "文件名",
    "lineNumber": "行号",
    "reviewResult": "审查意见",
    "optimizedCode": "优化代码",
    "referenceIssue": "重复问题：文件名:行号" 
}]
`;
    }

    private groupHunksByFile(): Record<string, Hunk[]> {
        const fileGroups: Record<string, Hunk[]> = {};

        for (const hunk of this.hunks) {
            if (!fileGroups[hunk.fileName]) {
                fileGroups[hunk.fileName] = [];
            }
            fileGroups[hunk.fileName].push(hunk);
        }

        return fileGroups;
    }
}
