/**
 * Codeup Merge Request 中的补丁版本
 * 用于描述 MR 的不同版本/状态
 *
 * @example
 * ```typescript
 * const patch = new CodeReviewPatch();
 * patch.commitId = 'abc123';
 * patch.versionNo = 1;
 * patch.patchSetName = 'Patch Set 1';
 * patch.patchSetBizId = 'ps_12345';
 * patch.relatedMergeItemType = 'MERGE_SOURCE';
 * ```
 */
export class CodeReviewPatch {
    commitId!: string; // Git commit ID
    versionNo!: number; // 版本号
    patchSetName!: string; // 补丁集名称
    patchSetBizId!: string; // 补丁集业务ID
    relatedMergeItemType!: string; // 关联类型：MERGE_TARGET（目标分支）或 MERGE_SOURCE（源分支）
}

/**
 * 管理 MR 的多个补丁版本
 * 用于获取源分支和目标分支的 commit ID，以便计算差异
 *
 * @example
 * ```typescript
 * const patches = [
 *   { commitId: 'abc123', versionNo: 1, patchSetName: 'v1', patchSetBizId: 'ps_1', relatedMergeItemType: 'MERGE_SOURCE' },
 *   { commitId: 'def456', versionNo: 2, patchSetName: 'v2', patchSetBizId: 'ps_2', relatedMergeItemType: 'MERGE_SOURCE' },
 *   { commitId: 'base789', versionNo: 1, patchSetName: 'base', patchSetBizId: 'ps_base', relatedMergeItemType: 'MERGE_TARGET' },
 * ];
 * const reviewPatches = new CodeReviewPatches(patches);
 * console.log(reviewPatches.fromCommitId()); // 'abc123'
 * console.log(reviewPatches.toCommitId());   // 'def456'
 * ```
 */
export class CodeReviewPatches {
    patches: CodeReviewPatch[];

    constructor(patches: CodeReviewPatch[]) {
        this.patches = patches;
    }

    /** 获取源分支的 commit ID（比较的起点） */
    fromCommitId(): string {
        return this.fromPatchSet()!.commitId;
    }

    /**
     * 获取源分支的补丁集
     * - 如果有2个补丁，返回合并目标（目标分支）
     * - 否则返回按版本号排序后的第二个（较旧的源分支）
     */
    fromPatchSet() {
        if (this.patches.length === 2) {
            return this.mergeTarget();
        }
        return this.mergeSourcesInVersionOrderDesc()[1];
    }

    /** 获取源分支的补丁集业务ID */
    fromPatchSetId(): string {
        return this.fromPatchSet()!.patchSetBizId;
    }

    /** 获取目标分支的补丁集业务ID */
    toPatchSetId(): string {
        return this.mergeSourcesInVersionOrderDesc()[0]!.patchSetBizId;
    }

    /** 获取目标分支的 commit ID（比较的终点） */
    toCommitId(): string {
        return this.mergeSourcesInVersionOrderDesc()[0]!.commitId;
    }

    /** 获取合并目标分支（目标分支/基线） */
    mergeTarget(): CodeReviewPatch {
        return this.patches.filter((p) => p.relatedMergeItemType === 'MERGE_TARGET')[0] || '';
    }

    /**
     * 获取所有源分支补丁，按版本号降序排列
     * [0] 是最新版本（toCommitId），[1] 是较旧版本（fromCommitId）
     */
    mergeSourcesInVersionOrderDesc(): CodeReviewPatch[] {
        return this.patches
            .filter((p) => p.relatedMergeItemType === 'MERGE_SOURCE')
            .sort((a, b) => a.versionNo - b.versionNo)
            .reverse();
    }
}

/**
 * 单个文件的差异数据
 * 来自阿里云 Codeup /compares API
 *
 * @example
 * ```typescript
 * const diff = new PatchDiff();
 * diff.diff = '
    index 3e23ae4..9f8c2d1 100644              ← 文件索引和模式
    --- a/README.md                              ← 旧版本标记为 a/
    +++ b/README.md                              ← 新版本标记为 b/
    @@ -1,5 +1,6 @@                             ← 差异块头（hunk header）
    # My Project                               ← 上下文（空格开头，未变）
                                                ← 上下文
    -Version: 1.0                               ← 删除的行（减号）
    +Version: 2.0                               ← 新增的行（加号）
    +New feature added                          ← 新增的行
    This is a sample project.                  ← 上下文
 ';
 * diff.oldPath = 'src/utils.ts';
 * diff.newPath = 'src/utils.ts';
 * diff.deletedFile = false;
 * diff.binary = false;
 * ```
 */
export class PatchDiff {
    diff!: string; // Git diff 格式的差异内容
    oldPath!: string; // 旧文件路径（重命名/删除时有用）
    newPath!: string; // 新文件路径
    deletedFile!: boolean; // 是否为删除的文件
    binary!: boolean; // 是否为二进制文件
}

/**
 * 表示一个代码块（Hunk）
 * - 一个文件可能有多个 hunk（多个修改区域）
 * - 每个 hunk 包含文件名、行号、差异内容、token 估算
 *
 * @example
 * ```typescript
 * const hunk = new Hunk(
 *   'src/utils.ts',
 *   10,
 *   '@@ -8,2 +8,3 @@\n const a = 1;\n+const b = 2;'
 * );
 * console.log(hunk.fileName);   // 'src/utils.ts'
 * console.log(hunk.lineNumber); // 10
 * console.log(hunk.token);      // 估算的 token 数量
 * ```
 */
export class Hunk {
    fileName: string; // 文件名
    lineNumber: number; // 目标文件中的行号（用于添加评论）
    diff: string; // 该 hunk 的差异内容
    token: number; // 估算的 token 数量

    constructor(fileName: string, lineNumber: number, diff: string) {
        this.fileName = fileName;
        this.lineNumber = lineNumber;
        this.diff = diff;
        this.token = this.estimateTokens(diff);
    }

    /**
     * 估算文本的 token 数量
     * 采用简化算法：将文本分词后计数
     * - 驼峰命名和下划线命名会拆分计算
     * - 特殊字符单独计数
     * - 去除注释后计算
     */
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
                totalTokens += (word.match(/[!@#$%^&*()+=\-[\]{};:'"\\|,.<>?/]/g) || []).length;
            }

            totalTokens += 1; // 行基础开销
        }

        return Math.max(1, totalTokens);
    }
}

/** 匹配 Git diff 中 hunk 头部的正则：@@ -oldStart,oldCount +newStart,newCount @@ */
const hunkStartReg = /@@ -(\d+),\d+ \+(\d+),\d+ @@/;

/**
 * 比较结果管理器
 * 将 Codeup API 返回的差异数据解析为可用的 Hunk 数组
 *
 * @example
 * ```typescript
 * const diffs = [
 *   {
 *     diff: '--- a/src/utils.ts\n+++ b/src/utils.ts\n@@ -1,2 +1,3 @@\n const a = 1;\n+const b = 2;',
 *     oldPath: 'src/utils.ts',
 *     newPath: 'src/utils.ts',
 *     deletedFile: false,
 *     binary: false,
 *   },
 * ];
 * const compareResult = new CompareResult(diffs);
 * const combined = compareResult.getCombinedDiff();
 * const hunks = compareResult.getHunks();
 * ```
 */
export class CompareResult {
    diffs: PatchDiff[];

    constructor(diffs: PatchDiff[]) {
        this.diffs = diffs;
    }

    /**
     * 获取所有差异的合并字符串（过滤二进制和删除文件）
     */
    getCombinedDiff(): string {
        return this.diffs
            .filter((d) => !d.binary && !d.deletedFile)
            .map((d) => d.diff)
            .join('\n');
    }

    /**
     * 将差异解析为 Hunk 数组
     * 每个 Hunk 代表一个文件中的一个修改区域
     */
    getHunks(): Hunk[] {
        return this.diffs.flatMap((diff) => {
            const lines = diff.diff.split('\n');

            // 判断是否为新增文件（旧文件是 /dev/null）
            const isNewFile = lines[0]!.startsWith('--- /dev/null');

            // 提取文件名行
            const fileNameLine = isNewFile ? lines[1] : lines[0];

            // 提取文件名
            const fileName = fileNameLine!.replace(isNewFile ? '+++ b/' : '--- a/', '');

            // 构建 hunk 头部（包含 --- a/xxx 和 +++ b/xxx 两行）
            const hunkHead = lines[0] + '\n' + lines[1];

            // 获取 hunks
            return this.getHunksFromDiff(hunkHead, fileName, lines);
        });
    }

    /**
     * 从单个文件的 diff 中提取所有 hunk
     * @param hunkHead - hunk 头部信息
     * @param fileName - 文件名
     * @param lines - diff 的所有行
     */
    getHunksFromDiff(hunkHead: string, fileName: string, lines: string[]): Hunk[] {
        const hunks: Hunk[] = [];

        // 从第3行开始遍历（跳过 --- a/ 和 +++ b/ 头部）
        let lineNumber = 2;
        while (lineNumber < lines.length) {
            // 找到 hunk 头部 @@ -x,y +z,w @@
            if (lines[lineNumber]!.match(hunkStartReg)) {
                // 计算目标文件中的行号（用于添加评论）
                const startLine = this.getTargetFileHunkStartLine(lineNumber, lines);
                // 提取该 hunk 的差异内容
                const hunkDiff = this.getHunkDiff(hunkHead, lineNumber, lines);
                hunks.push(new Hunk(fileName, startLine, hunkDiff));
            }
            lineNumber++;
        }
        return hunks;
    }

    /**
     * 获取目标文件中的行号（评论应该添加到的位置）
     * 因为 Codeup 行内评论只能添加到目标版本文件的行上
     *
     * 优先级：
     * 1. 如果有新增行，返回第一个新增行的行号
     * 2. 否则如果有删除行，返回删除行之前的行号
     * 3. 否则返回 hunk 元数据中的起始行号
     */
    getTargetFileHunkStartLine(lineNumber: number, lines: string[]) {
        return this.getFirstAdditionLineNumber(lineNumber, lines) || this.getLineBeforeFirstDeletion(lineNumber, lines) || parseInt(lines[lineNumber]!.match(hunkStartReg)![2], 10);
    }

    /**
     * 获取第一个删除行之前的行号
     * 用于当没有新增行时，确定评论应该添加的位置
     */
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

    /**
     * 获取第一个新增行的行号
     * 这是评论的最佳位置，因为新增的行在目标文件中确实存在
     */
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

    /**
     * 提取单个 hunk 的完整差异内容
     * 包含 hunk 头部和所有变更行
     */
    getHunkDiff(hunkHead: string, lineNumber: number, lines: string[]) {
        const hunkDiffLines = [hunkHead, lines[lineNumber]];

        lineNumber++;
        while (lineNumber < lines.length && !lines[lineNumber].match(hunkStartReg)) {
            hunkDiffLines.push(lines[lineNumber]);
            lineNumber++;
        }
        return hunkDiffLines.join('\n');
    }
}

/**
 * PR 差异压缩器
 * 用于将大量代码差异压缩到 AI 允许的 token 限制内
 *
 * 核心功能：
 * 1. 过滤不需要审查的文件（构建产物、依赖、配置等）
 * 2. 按文件扩展名排序（确保重要文件优先）
 * 3. 在 token 限制内选择 hunks，剩余的标记为待处理
 *
 * @example
 * ```typescript
 * const diffs = [
 *   {
 *     diff: '--- a/src/index.ts\n+++ b/src/index.ts\n@@ -1,2 +1,3 @@\n console.log("hello");\n+console.log("world");',
 *     oldPath: 'src/index.ts',
 *     newPath: 'src/index.ts',
 *     deletedFile: false,
 *     binary: false,
 *   },
 * ];
 * const compareResult = new CompareResult(diffs);
 * const compressor = new PRCompressor(compareResult, 1000);
 * const result = compressor.compressForAI();
 * // result.hunks - 在 token 限制内的 hunks
 * // result.deletedFiles - 被删除的文件
 * // result.otherModifications - 其他修改的说明
 * // compressor.remainingHunks - 超过 token 限制的 hunks
 * ```
 */
export class PRCompressor {
    private hunks: Hunk[];
    private deletedFiles: PatchDiff[];
    private maxTokens: number;
    /** 剩余未处理的 hunks（超过 token 限制） */
    public remainingHunks: Hunk[] = [];

    /** 需要排除的文件模式（不进行 AI 审查） */
    private static readonly EXCLUDED_PATTERNS = [
        /\.lock$/, // package-lock.json, yarn.lock 等
        /^dist\//, // 构建输出目录
        /^build\//, // 构建输出目录
        /\.min\.(js|css)$/, // 压缩后的文件
        /\.d\.ts$/, // TypeScript 声明文件
        /^\.idea\//, // IDE 配置文件
        /^\.vscode\//, // IDE 配置文件
        /^node_modules\//, // 依赖目录
        /\.md$/, // markdown 文件
        /\.json$/, // json 文件
        /\.yml$/, // yaml 文件
        /\.yaml$/, // yaml 文件
        /\.toml$/, // toml 文件
        /\.png$/, // 图片
        /\.jpg$/, // 图片
        /\.jpeg$/, // 图片
        /\.gif$/, // 图片
        /\.svg$/, // 图片
        /\.webp$/, // 图片
        /\.bmp$/, // 图片
        /\.tiff$/, // 图片
        /\.ico$/, // 图片
        /\.woff$/, // 字体
        /\.woff2$/, // 字体
        /\.eot$/, // 字体
        /\.otf$/, // 字体
        /\.ttf$/, // 字体
    ];

    constructor(compareResult: CompareResult, maxTokens: number) {
        this.hunks = compareResult.getHunks();
        this.deletedFiles = compareResult.diffs.filter((d) => d.deletedFile) || [];
        this.maxTokens = maxTokens || 4000;
    }

    /**
     * 压缩差异数据，使其适合 AI 处理
     *
     * 处理流程：
     * 1. 按扩展名分组并排序
     * 2. 依次添加 hunks 直到达到 token 限制
     * 3. 超过限制的 hunks 存入 remainingHunks
     *
     * @param hunks - 可选，指定要处理的 hunks（用于处理剩余部分）
     */
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
        const prioritizedHunks: Hunk[] = [];
        const remainingHunks: Hunk[] = [];
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

    /**
     * 检查文件是否应该被排除
     * 排除规则：构建产物、依赖、配置文件、二进制文件等
     */
    private shouldExcludeFile(fileName: string): boolean {
        return PRCompressor.EXCLUDED_PATTERNS.some((pattern) => pattern.test(fileName));
    }

    /**
     * 按文件扩展名分组，并按 token 数量排序
     * 确保高 token 的文件排在前面
     *
     * 分组优先级逻辑：
     * - 代码文件（ts, js, vue, py 等）优先
     * - 同类文件按 token 数量降序
     */
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

    /** 获取文件扩展名 */
    private getFileExtension(fileName: string): string {
        const parts = fileName.split('.');
        if (parts.length > 1) {
            return parts[parts.length - 1] || 'unknown';
        }
        return 'unknown';
    }
}
