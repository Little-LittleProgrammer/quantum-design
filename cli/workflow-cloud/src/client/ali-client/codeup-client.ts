import axios, { type AxiosResponse } from 'axios';
import { BaseClient } from '../base-client';
import { CompareResult, PRCompressor } from '../code-tools/hunk-patch';
import type { ReviewResult } from '../openai-client/openai-client';
import type { IAliConfig, IGitConfig } from '../../enums/default-options';
import { get_branch, get_repo_info } from '../../utils/command';

class CodeupClient extends BaseClient {
    private repoName: string = '';
    sourceBranch: string = 'master';
    targetBranch: string = 'master';
    repoInfo: any;
    reviewerUsers: string[] = [];
    mrInfo: any;

    constructor(aliConfig: Partial<IAliConfig>, gitConfig: Partial<IGitConfig>) {
        if (!aliConfig.token) {
            throw new Error('阿里云 token 未配置');
        }
        super({
            aliToken: aliConfig.token,
        });
        if (!aliConfig.repoName) {
            const repoInfo = get_repo_info();
            aliConfig.repoName = repoInfo.repoName;
        }
        this.repoName = aliConfig.repoName || '';
        if (!gitConfig.sourceBranch) {
            const branch = get_branch();
            gitConfig.sourceBranch = branch;
        }
        this.sourceBranch = gitConfig.sourceBranch || '';
        if (gitConfig.targetBranch) {
            this.targetBranch = gitConfig.targetBranch;
        }
        if (aliConfig.reviewerUsers) {
            this.reviewerUsers = aliConfig.reviewerUsers;
        }
    }

    private async getUsersPage(page: number) {
        const url = `${this.baseUrl}/platform/organizations/${this.aliOrgId}/members?perPage=100&page=${page}`;
        const response: AxiosResponse = await axios.get(url, {
            headers: this.getAliHeaders,
        });
        return response.data;
    }

    public async getUsers() {
        const users: any[] = [];
        let page = 1;
        let condition = true;
        while (condition) {
            const response = await this.getUsersPage(page);
            users.push(...response);
            if (response.length < 100) {
                condition = false;
            }
            page++;
        }
        return users;
    }

    private async getRepoInfoPage(page: number) {
        const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories?perPage=100&page=${page}`;
        const response: AxiosResponse = await axios.get(url, {
            headers: this.getAliHeaders,
        });
        return response.data;
    }

    public async getRepoInfo() {
        let repo: any;
        for (let i = 1; i <= 5; i++) {
            const response = await this.getRepoInfoPage(i);
            repo = response.find((item: any) => item.name === this.repoName);
            if (repo) {
                break;
            }
        }
        if (!repo) {
            throw new Error('没有找到代码仓');
        }
        if (this.reviewerUsers.length > 0) {
            const users = await this.getUsers();
            this.reviewerUsers = users.filter((item: any) => this.reviewerUsers.includes(item.name));
        }
        this.repoInfo = {
            repo: repo,
            users: this.reviewerUsers.map((item: any) => item.userId),
        };
        return repo;
    }

    public async getMergeRequestHasLocalId(source?: Partial<IAliConfig>) {
        try {
            const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${source?.codeupMrLocalId}`;
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getAliHeaders,
            });
            this.mrInfo = response.data;
            return {
                code: 200,
                message: 'MR获取成功！',
                data: response.data,
            };
        } catch (error) {
            // 如果 mr 不存在，则返回 false
            return false;
        }
    }

    public async getMergeRequestList() {
        try {
            const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/changeRequests?projectIds=${this.repoInfo.repo.id}&state=opened`;
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getAliHeaders,
            });
            return response.data;
        } catch (error) {
            return [];
        }
    }

    public async getMergeRequest() {
        const mrList = await this.getMergeRequestList();
        if (mrList.length === 0) {
            return null;
        }
        const mr = mrList.find((item: any) => item.sourceBranch === this.sourceBranch);
        if (mr) {
            this.mrInfo = mr;
            return mr;
        }
        return null;
    }

    // 创建合并请求
    public async createMergeRequest(title: string, description: string) {
        const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories/${this.repoInfo.repo.id}/changeRequests`;
        try {
            const response: AxiosResponse = await axios.post(
                url,
                {
                    title,
                    // 请求 openai，根据 diff 文件获取本次 MR 的描述
                    description: `【本 MR 的描述来自大模型】\n${description}`,
                    organizationId: this.aliOrgId,
                    repositoryId: this.repoInfo.repo.id,
                    sourceBranch: this.sourceBranch,
                    sourceProjectId: this.repoInfo.repo.id,
                    targetProjectId: this.repoInfo.repo.id,
                    targetBranch: this.targetBranch,
                    reviewerUserIds: this.repoInfo.users,
                    createFrom: 'WEB',
                },
                {
                    headers: this.getAliHeaders,
                }
            );
            this.mrInfo = response.data;
            return {
                code: 200,
                message: 'MR创建成功！',
                data: response.data,
            }; // 返回响应数据
        } catch (error: any) {
            console.error('Error creating merge request:', {
                code: error.status,
                message: error.response.data.errorMessage,
            });
            // throw error; // 抛出错误，以便调用者处理
            return {
                code: error.status,
                message: error.response.data.errorMessage,
            };
        }
    }

    // 更新合并请求信息
    public async updateMergeRequest(description: string) {
        const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}`;
        const response: AxiosResponse = await axios.put(
            url,
            {
                description: `【本 MR 的描述来自大模型】\n${description}`,
            },
            {
                headers: this.getAliHeaders,
            }
        );
        return response.data;
    }

    // 获取 diff patches
    public async getDiffPatches(): Promise<any> {
        if (!this.mrInfo) {
            throw new Error('MR信息未找到');
        }
        const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}/diffs/patches`;
        try {
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getAliHeaders,
            });
            return response.data; // 返回响应数据
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }

    public async getDiff(fromCommitId: string, toCommitId: string): Promise<PRCompressor> {
        const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories/${this.repoInfo.repo.id}/compares?from=${fromCommitId}&to=${toCommitId}`;
        try {
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getAliHeaders,
            });
            const compareResult = new CompareResult(response.data.diffs);

            return new PRCompressor(compareResult, 4000); // 返回响应数据
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }

    async commentOnMRByJson(r: ReviewResult, fromPatchSetId: string, toPatchSetId: string) {
        const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}/comments`;
        try {
            if (r.reviewResult) {
                let comment = `【本评论来自大模型】\n`;
                if (r.referenceIssue) {
                    comment += `重复: ${r.referenceIssue}\n`;
                } else {
                    comment += `审查意见：${r.reviewResult}\n`;
                }
                if (r.optimizedCode) {
                    comment += `优化代码：\`${r.optimizedCode}\`\n`;
                }
                await axios.post(
                    url,
                    {
                        comment_type: 'INLINE_COMMENT',
                        content: comment,
                        file_path: r.fileName,
                        line_number: r.lineNumber,
                        from_patchset_biz_id: fromPatchSetId,
                        to_patchset_biz_id: toPatchSetId,
                        patchset_biz_id: toPatchSetId,
                        draft: false,
                        resolved: false,
                    },
                    {
                        headers: this.getAliHeaders,
                    }
                );
            }
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }

    // 容错处理：应对特殊情况，当 ai 审查结果为字符串时，直接评论
    async commentOnMRByString(comment: string) {
        const url = `${this.baseUrl}/codeup/organizations/${this.aliOrgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}/review`;
        try {
            await axios.post(url, {
                reviewComment: comment,
                reviewOpinion: 'NOT_PASS',
            }, {
                headers: this.getAliHeaders,
            });
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }
}

export default CodeupClient;
