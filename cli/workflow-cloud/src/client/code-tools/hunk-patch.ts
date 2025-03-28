export class CodeReviewPatch {
    commitId!: string;
    versionNo!: number;
    patchSetName!: string;
    patchSetBizId!: string;
    relatedMergeItemType!: string;
}

export class CodeReviewPatches {
    patches: CodeReviewPatch[];

    constructor(patches: CodeReviewPatch[]) {
        this.patches = patches;
    }

    fromCommitId(): string {
        return this.fromPatchSet()!.commitId;
    }

    fromPatchSet() {
        if (this.patches.length === 2) {
            return this.mergeTarget();
        }
        return this.mergeSourcesInVersionOrderDesc()[1];
    }

    fromPatchSetId(): string {
        return this.fromPatchSet()!.patchSetBizId;
    }

    toPatchSetId(): string {
        return this.mergeSourcesInVersionOrderDesc()[0]!.patchSetBizId;
    }

    toCommitId(): string {
        return this.mergeSourcesInVersionOrderDesc()[0]!.commitId;
    }

    mergeTarget(): CodeReviewPatch {
        return this.patches.filter((p) => p.relatedMergeItemType === 'MERGE_TARGET')[0] || '';
    }

    mergeSourcesInVersionOrderDesc(): CodeReviewPatch[] {
        return this.patches
            .filter((p) => p.relatedMergeItemType === 'MERGE_SOURCE')
            .sort((a, b) => a.versionNo - b.versionNo)
            .reverse();
    }
}

export class PatchDiff {
    diff!: string;
    oldPath!: string;
    newPath!: string;
    deletedFile!: boolean;
    binary!: boolean;
}

export class Hunk {
    fileName: string;
    lineNumber: number;
    diff: string;
    token: number;

    constructor(fileName: string, lineNumber: number, diff: string) {
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.diff = diff;
        this.token = this.estimateTokens(diff);
    }

    // 计算 token 数量
    private estimateTokens(text: string): number {
        // 将文本按行分割
        const lines = text.split('\n');
        let totalTokens = 0;

        for (const line of lines) {
            // 跳过空行
            if (!line.trim()) continue;

            // 处理diff标记行
            if (line.startsWith('+++') || line.startsWith('---') || line.startsWith('@@')) {
                totalTokens += 2;
                continue;
            }

            // 处理代码行
            let codeLine =
                line.startsWith('+') || line.startsWith('-')
                    ? line.slice(1) // 去除diff标记
                    : line;

            // 去除单行注释
            codeLine = codeLine.replace(/\/\/.*$/, '');
            // 去除行尾注释
            codeLine = codeLine.replace(/\/\*.*\*\//, '');

            // 跳过仅包含注释的行
            if (!codeLine.trim()) continue;

            // 按空格分割单词
            const words = codeLine.trim().split(/\s+/);

            for (const word of words) {
                // 处理驼峰命名和下划线命名
                const subWords = word
                    .split(/([A-Z][a-z]+)/)
                    .flatMap((w) => w.split('_'))
                    .filter((w) => w.length > 0);

                totalTokens += subWords.length;

                // 特殊字符和运算符各算一个token
                totalTokens += (word.match(/[!@#$%^&*()+=\-\[\]{};:'"\\|,.<>?/]/g) || []).length;
            }

            totalTokens += 1; // 行基础开销
        }

        return Math.max(1, totalTokens);
    }
}

const hunkStartReg = /@@ -(\d+),\d+ \+(\d+),\d+ @@/;

export class CompareResult {
    diffs: PatchDiff[];

    constructor(diffs: PatchDiff[]) {
        this.diffs = diffs;
    }

    getCombinedDiff(): string {
        return this.diffs
            .filter((d) => !d.binary && !d.deletedFile)
            .map((d) => d.diff)
            .join('\n');
    }

    getHunks(): Hunk[] {
        return this.diffs.flatMap((diff) => {
            const lines = diff.diff.split('\n');

            // 判断是否为新增文件（旧文件是 /dev/null）
            const isNewFile = lines[0]!.startsWith('--- /dev/null');

            // 提取文件名行
            const fileNameLine = isNewFile ? lines[1] : lines[0];

            // 提取文件名
            const fileName = fileNameLine!.replace(isNewFile ? '+++ b/' : '--- a/', '');

            // 构建 hunk 头部
            const hunkHead = lines[0] + '\n' + lines[1];

            // 获取 hunks
            return this.getHunksFromDiff(hunkHead, fileName, lines);
        });
    }

    getHunksFromDiff(hunkHead: string, fileName: string, lines: string[]): Hunk[] {
        const hunks: Hunk[] = [];

        let lineNumber = 2;
        while (lineNumber < lines.length) {
            if (lines[lineNumber]!.match(hunkStartReg)) {
                const startLine = this.getTargetFileHunkStartLine(lineNumber, lines);
                const hunkDiff = this.getHunkDiff(hunkHead, lineNumber, lines);
                hunks.push(new Hunk(fileName, startLine, hunkDiff));
            }
            lineNumber++;
        }
        return hunks;
    }

    getTargetFileHunkStartLine(lineNumber: number, lines: string[]) {
        // 这里只计算目标版本文件的行号，因为comment只会打到目标版本的文件的行上
        // 如果目标版本文件存在添加的行，则取第一个添加的行
        return (
            this.getFirstAdditionLineNumber(lineNumber, lines) ||
            // 否则如果目标版本文件存在删除的行，由于删除的行在目标版本中已经不存在了，所以取目标版本中上面的那一行
            this.getLineBeforeFirstDeletion(lineNumber, lines) ||
            // 如果上面两者都不存在，比如只删除了第一行，就即不存在添加的行，也不存在删除的行的上一行，就取hunk元数据中的目标版本文件中的第一行
            parseInt(lines[lineNumber]!.match(hunkStartReg)![2], 10)
        );
    }

    getLineBeforeFirstDeletion(lineNumber: number, lines: string[]) {
        if (lines[lineNumber + 1].startsWith('-')) {
            return null;
        }

        const hunkMatch = lines[lineNumber].match(hunkStartReg);
        let lineInCurrentHunk = parseInt(hunkMatch![2], 10);

        lineNumber++;

        while (lineNumber < lines.length && !lines[lineNumber].match(hunkStartReg)) {
            if (lines[lineNumber].startsWith('-')) {
                break;
            }
            lineInCurrentHunk++;
            lineNumber++;
        }
        if (lineNumber < lines.length && lines[lineNumber].startsWith('-')) {
            return lineInCurrentHunk - 1;
        }
        return null;
    }

    getFirstAdditionLineNumber(lineNumber: number, lines: string[]) {
        const hunkMatch = lines[lineNumber].match(hunkStartReg);
        let lineInCurrentHunk = parseInt(hunkMatch![2], 10);
        lineNumber++;

        while (lineNumber < lines.length && !lines[lineNumber].match(hunkStartReg) && !lines[lineNumber].startsWith('+')) {
            if (!lines[lineNumber].startsWith('-') && lineNumber !== lines.length - 1) {
                lineInCurrentHunk++;
            }
            lineNumber++;
        }
        if (lineNumber < lines.length && lines[lineNumber].startsWith('+')) {
            return lineInCurrentHunk;
        }
        return null;
    }

    getHunkDiff(hunkHead: string, lineNumber: number, lines: string[]) {
        let hunkDiffLines = [hunkHead, lines[lineNumber]];

        lineNumber++;
        while (lineNumber < lines.length && !lines[lineNumber].match(hunkStartReg)) {
            hunkDiffLines.push(lines[lineNumber]);
            lineNumber++;
        }
        return hunkDiffLines.join('\n');
    }
}

export class PRCompressor {
    private hunks: Hunk[];
    private deletedFiles: PatchDiff[];
    private maxTokens: number;
    public remainingHunks: Hunk[] = [];
    // 添加需要排除的文件模式
    private static readonly EXCLUDED_PATTERNS = [
        /\.lock$/,           // package-lock.json, yarn.lock 等
        /^dist\//,           // 构建输出目录
        /^build\//,          // 构建输出目录
        /\.min\.(js|css)$/, // 压缩后的文件
        /\.d\.ts$/,         // TypeScript 声明文件
        /^\.idea\//,        // IDE 配置文件
        /^\.vscode\//,      // IDE 配置文件
        /^node_modules\//,   // 依赖目录
        /\.md$/,            // markdown 文件
        /\.json$/,          // json 文件
        /\.yml$/,           // yaml 文件
        /\.yaml$/,          // yaml 文件
        /\.toml$/,          // toml 文件
        /\.png$/,           // 图片
        /\.jpg$/,           // 图片
        /\.jpeg$/,          // 图片
        /\.gif$/,           // 图片
        /\.svg$/,           // 图片
        /\.webp$/,          // 图片
        /\.bmp$/,           // 图片
        /\.tiff$/,          // 图片
        /\.ico$/,           // 图片
        /\.woff$/,          // 字体
        /\.woff2$/,         // 字体
        /\.eot$/,           // 字体
        /\.otf$/,           // 字体
        /\.ttf$/,           // 字体
    ];

    constructor(compareResult: CompareResult, maxTokens: number) {
        this.hunks = compareResult.getHunks();
        this.deletedFiles = compareResult.diffs.filter((d) => d.deletedFile) || [];
        this.maxTokens = maxTokens || 5000;
    }

    compressForAI(hunks?: Hunk[]): {
        hunks: Hunk[];
        deletedFiles: PatchDiff[];
        otherModifications: string[];
    } {
        if (hunks) {
            this.hunks = hunks;
        }
        // 1. 按语言对文件进行分组和排序
        const fileGroups = this.groupHunksByLanguage();
        // 2. 计算当前所有 hunks 的 token 数量
        let prioritizedHunks: Hunk[] = [];
        let remainingHunks: Hunk[] = [];
        let currentTokenCount = 0;

        // 3. 按优先级添加 hunks
        for (const [_, hunks] of Object.entries(fileGroups)) {
            for (const hunk of hunks) {
                const hunkTokens = hunk.token;
                if (currentTokenCount + hunkTokens <= this.maxTokens) {
                    prioritizedHunks.push(hunk);
                    currentTokenCount += hunkTokens;
                } else {
                    remainingHunks.push(hunk);
                }
            }
        }
        this.remainingHunks = remainingHunks;
        // 4. 处理剩余的修改
        const otherModifications = remainingHunks.length > 0 ? [`其他修改: ${remainingHunks.length} 个代码块未显示（已达到最大token长度）`] : [];

        return {
            hunks: prioritizedHunks,
            deletedFiles: this.deletedFiles,
            otherModifications,
        };
    }
    
    // 添加新的方法来检查文件是否应该被排除
    private shouldExcludeFile(fileName: string): boolean {
        return PRCompressor.EXCLUDED_PATTERNS.some(pattern => pattern.test(fileName));
    }

    // 按文件名分组, 并按照文件的token数量排序， 确保高token的文件排在前面
    private groupHunksByLanguage(): Record<string, Hunk[]> {
        const fileGroups: Record<string, Hunk[]> = {};

        // 按文件名分组，并排除不需要的文件
        const fileHunks: Record<string, Hunk[]> = {};
        for (const hunk of this.hunks) {
            // 添加文件排除检查
            if (this.shouldExcludeFile(hunk.fileName)) {
                continue;
            }
            if (!fileHunks[hunk.fileName]) {
                fileHunks[hunk.fileName] = [];
            }
            fileHunks[hunk.fileName].push(hunk);
        }

        // 获取文件扩展名并计算文件的token数量
        const fileTokens: Record<string, number> = {};
        for (const fileName in fileHunks) {
            fileTokens[fileName] = fileHunks[fileName].reduce((sum, hunk) => sum + hunk.token, 0);
        }
        // 按文件扩展名分组，并按token数量排序
        const filesByExt: Record<string, { name: string; tokens: number }[]> = {};
        for (const fileName in fileTokens) {
            const ext = this.getFileExtension(fileName);
            if (!filesByExt[ext]) {
                filesByExt[ext] = [];
            }
            filesByExt[ext].push({
                name: fileName,
                tokens: fileTokens[fileName],
            });
        }
        // 按照扩展名优先级和token数量排序
        for (const ext in filesByExt) {
            filesByExt[ext].sort((a, b) => b.tokens - a.tokens);
            fileGroups[ext] = filesByExt[ext].flatMap((file) => fileHunks[file.name]);
        }

        return fileGroups;
    }

    private getFileExtension(fileName: string): string {
        const parts = fileName.split('.');
        if (parts.length > 1) {
            return parts[parts.length - 1] || 'unknown';
        }
        return 'unknown';
    }

}
