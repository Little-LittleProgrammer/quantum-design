import axios, { type AxiosResponse } from 'axios';
import { AliClient } from './base-client';
import type { CodeSource } from '../types/client';
import { CompareResult, PRCompressor } from './hunk-patch';
import type { ReviewResult } from './openai-client';
import type { ICliOptions } from '../types/options';

class CodeupClient extends AliClient {
    private repoName: string = '';
    sourceBranch: string = 'master';
    targetBranch: string = 'master';
    repoInfo: any;
    reviewerUsers: string[] = [];
    mrInfo: any;

    constructor(token: string, source: CodeSource) {
        super(token);
        this.repoName = source?.data?.repoName || '';
        if (source?.data?.sourceBranch) {
            this.sourceBranch = source?.data?.sourceBranch;
        }
        if (source?.data?.targetBranch) {
            this.targetBranch = source?.data?.targetBranch;
        }
        if (source?.data?.reviewerUsers) {
            this.reviewerUsers = source?.data?.reviewerUsers;
        }
    }

    private async getUsersPage(page: number) {
        const url = `${this.baseUrl}/platform/organizations/${this.orgId}/members?perPage=100&page=${page}`;
        const response: AxiosResponse = await axios.get(url, {
            headers: this.getHeaders,
        });
        return response.data;
    }

    public async getUsers() {
        let users: any[] = [];
        let page = 1;
        while (true) {
            const response = await this.getUsersPage(page);
            users.push(...response);
            if (response.length < 100) {
                break;
            }
            page++;
        }
        return users;
    }

    private async getRepoInfoPage(page: number) {
        const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories?perPage=100&page=${page}`;
        const response: AxiosResponse = await axios.get(url, {
            headers: this.getHeaders,
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

    public async getMergeRequestHasLocalId(source?: ICliOptions) {
        try {
            const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${source?.codeupMrLocalId}`;
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getHeaders,
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
            const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/changeRequests?projectIds=${this.repoInfo.repo.id}&state=opened`;
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getHeaders,
            });
            return response.data;
        } catch (error) {
            return []
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
        const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories/${this.repoInfo.repo.id}/changeRequests`;
        try {
            const response: AxiosResponse = await axios.post(
                url,
                {
                    title,
                    // 请求 openai，根据 diff 文件获取本次 MR 的描述
                    description: `【本 MR 的描述来自大模型】\n${description}`,
                    organizationId: this.orgId,
                    repositoryId: this.repoInfo.repo.id,
                    sourceBranch: this.sourceBranch,
                    sourceProjectId: this.repoInfo.repo.id,
                    targetProjectId: this.repoInfo.repo.id,
                    targetBranch: this.targetBranch,
                    reviewerUserIds: this.repoInfo.users,
                    createFrom: 'WEB',
                },
                {
                    headers: this.getHeaders,
                },
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
        const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}`;
        const response: AxiosResponse = await axios.put(
            url,
            {
                description: `【本 MR 的描述来自大模型】\n${description}`,
            },
            {
                headers: this.getHeaders,
            },
        );
        return response.data;
    }

    // 获取 diff patches
    public async getDiffPatches(): Promise<any> {
        if (!this.mrInfo) {
            throw new Error('MR信息未找到');
        }
        const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}/diffs/patches`;
        try {
            const response: AxiosResponse = await axios.get(url, {
                headers: this.getHeaders,
            });
            return response.data; // 返回响应数据
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }

    public async getDiff(fromCommitId: string, toCommitId: string): Promise<PRCompressor> {
        const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories/${this.repoInfo.repo.id}/compares?from=${fromCommitId}&to=${toCommitId}`;
        try {
            const response: AxiosResponse = await axios.get(url, {
                headers: {
                    'Content-Type': 'application/json',
                    'x-yunxiao-token': this.token,
                },
            });
            const compareResult = new CompareResult(response.data.diffs);

            return new PRCompressor(compareResult, 5000); // 返回响应数据
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }

    async commentOnMRByJson(r: ReviewResult, fromPatchSetId: string, toPatchSetId: string) {
        const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}/comments`;
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
                        headers: this.getHeaders,
                    },
                );
            }
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }

    // 容错处理：应对特殊情况，当 ai 审查结果为字符串时，直接评论
    async commentOnMRByString(comment: string) {
        const url = `${this.baseUrl}/codeup/organizations/${this.orgId}/repositories/${this.repoInfo.repo.id}/changeRequests/${this.mrInfo.localId}/review`;
        try {
            await axios.post(url, {
                reviewComment: comment,
            }, {
                headers: this.getHeaders,
            });
        } catch (error) {
            console.error('Error fetching diff patches:', error);
            throw error; // 抛出错误，以便调用者处理
        }
    }
}

export default CodeupClient;
