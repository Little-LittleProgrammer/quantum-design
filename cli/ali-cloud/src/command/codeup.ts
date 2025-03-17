import { CodeReviewPatches, type CodeReviewPatch, type PRCompressor } from '../client/hunk-patch';
import CodeupClient from '../client/codeup-client';
import { OpenAIClient } from '../client/openai-client';
import { cliOptions } from '../enums/default-options';
import { AICodeReview } from '../client/code-review';
import { consoleInfo } from '../utils/question';

async function handleReviewByAi(compressResult: any, codeupInstance: CodeupClient, openaiInstance: OpenAIClient, crPatches: CodeReviewPatches, num: number) {
    const reviewPrompt = await new AICodeReview(compressResult).generateReviewPrompt();
    consoleInfo('生成 review prompt 成功');
    consoleInfo(`开始 ai review, 剩余 ${num} 次`);
    const reviewResult = await openaiInstance.reviewCode(reviewPrompt);
    consoleInfo('ai review 成功');
    if (Array.isArray(reviewResult?.result)) {
        consoleInfo('开始评论 mr');
        for (const result of reviewResult.result) {
            await codeupInstance.commentOnMRByJson(result, crPatches.fromPatchSetId(), crPatches.toPatchSetId());
        }
    } else {
        consoleInfo('开始评论 mr');
        await codeupInstance.commentOnMRByString(reviewResult?.result || '');
    }
}

async function handleCodeup(codeupInstance: CodeupClient, openaiInstance: OpenAIClient) {
    consoleInfo('远程 mr 信息存在');
    // 存在评论mr
    const patches: CodeReviewPatch[] = await codeupInstance.getDiffPatches();
    consoleInfo('获取 diff patches 成功');
    const crPatches = new CodeReviewPatches(patches);
    consoleInfo('获取 crPatches 成功', crPatches, crPatches.fromCommitId(), crPatches.toCommitId());
    const compareResult: PRCompressor = await codeupInstance.getDiff(crPatches.fromCommitId(), crPatches.toCommitId());
    consoleInfo('获取 compareResult 成功');
    const compressResult = compareResult.compressForAI();
    consoleInfo('压缩代码成功');
    await handleReviewByAi(compressResult, codeupInstance, openaiInstance, crPatches, compareResult.remainingHunks.length);
    while (compareResult.remainingHunks.length > 0) {
        const compressedResult = compareResult.compressForAI(compareResult.remainingHunks);
        await handleReviewByAi(compressedResult, codeupInstance, openaiInstance, crPatches, compareResult.remainingHunks.length);
    }
}

export async function executeCodeup() {
    try {
        const codeupInstance = new CodeupClient(cliOptions.token, {
            type: 'codeup',
            name: '云效代码',
            data: {
                ...cliOptions,
            } as any,
        });
        const openaiInstance = new OpenAIClient(cliOptions.apiKey!, cliOptions.modelName || 'deepseek-v3');
        await codeupInstance.getRepoInfo();
        consoleInfo('获取远程仓库信息成功');
        if (cliOptions?.codeupMrLocalId) {
            const mrInfo = await codeupInstance.getMergeRequestHasLocalId(cliOptions);
            if (mrInfo) {
                await handleCodeup(codeupInstance, openaiInstance);
            }
            return;
        }
        // 先查询 mr 是否存在
        const mrInfo = await codeupInstance.getMergeRequest();
        if (mrInfo) {
            await handleCodeup(codeupInstance, openaiInstance);
        } else {
            consoleInfo('远程 mr 信息不存在，开始创建 mr');
            // 不存在 创建 mr
            consoleInfo('开始 ai 生成 mr description');
            const description = await openaiInstance.getMrDescription(cliOptions.sourceDiff!);
            consoleInfo('ai 生成 mr description 成功');
            const res = await codeupInstance.createMergeRequest(cliOptions.sourceBranch!, description || '');
            consoleInfo('创建 mr 成功');
            if (res.code === 200) {
                console.log('MR创建成功！');
            } else {
                console.log('MR创建失败！');
            }
        }
    } catch (error) {
        console.error('自动化流程失败:', error);
        throw error;
    }
}
