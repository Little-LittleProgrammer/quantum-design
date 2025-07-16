import { CodeReviewPatches, type CodeReviewPatch, type PRCompressor } from '../client/code-tools/hunk-patch';
import CodeupClient from '../client/ali-client/codeup-client';
import { OpenAIClient } from '../client/openai-client/openai-client';
import { AICodeReview } from '../client/code-tools/code-review';
import { consoleInfo } from '../utils/question';
import { getGlobalOptions } from '../utils/question';

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
    consoleInfo('获取 crPatches 成功');
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
        const options = getGlobalOptions();
        const codeupInstance = new CodeupClient(options.aliConfig, options.gitConfig);
        const openaiInstance = new OpenAIClient(options.openaiConfig);
        await codeupInstance.getRepoInfo();
        consoleInfo('获取远程仓库信息成功');
        if (options.aliConfig?.codeupMrLocalId) {
            const mrInfo = await codeupInstance.getMergeRequestHasLocalId(options.aliConfig);
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
            const description = await openaiInstance.getMrDescription(options.gitConfig.sourceDiff!);
            consoleInfo('ai 生成 mr description 成功');
            const res = await codeupInstance.createMergeRequest(options.gitConfig.sourceBranch!, description || '');
            consoleInfo('创建 mr 成功');
            if (res.code === 200) {
                consoleInfo('MR创建成功！');
                // TODO 调用飞书 api 发送消息, const feishuClient = new FeishuClient(options.feishuConfig);
                // 调用飞书 api 创建云文档记录本次 mr(res.data.detailUrl， res.data.sourceBranch)
            } else {
                consoleInfo('MR创建失败！');
            }
        }
    } catch (error) {
        console.error('自动化流程失败:', error);
        throw error;
    }
}
