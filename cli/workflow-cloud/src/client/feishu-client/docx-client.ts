import type { IFeishuConfig } from '../../enums/default-options';
import type { FeishuDocType } from '../../types/client';
import { generateUUID } from '../../utils/tools';
import { FeishuClient } from './feishu-base-client';
import fs from 'fs-extra';
import { resolve } from 'path';

export class DocxClient extends FeishuClient {
    // TODO 支持多知识库
    private spaceName?: string; // 记录知识库名称
    private spaceId?: string; // 记录知识库 id
    constructor(config: IFeishuConfig) {
        super(config);
        this.spaceName = config.spaceName;
    }
    // 获取知识库
    async getWikiBase() {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.wiki.v2.space.list({
                params: {
                    page_size: 50,
                    lang: 'zh',
                },
            }, token);
        });
        if (!res.data || !res.data.items) {
            throw new Error('获取知识库失败');
        }
        for (const item of res.data.items) {
            if (item.name === this.spaceName) {
                this.spaceId = item.space_id;
                return item;
            }
        }
        throw new Error('获取知识库失败');
    }

    async getWikiDocs(url: string) {
        const infoArr = url.split('?')[0]?.split('/') || [];
        const node_token = infoArr.pop();
        if (!node_token) {
            throw new Error('获取文档失败');
        }
        const type = infoArr.pop() as FeishuDocType;
        const res = await this.getWikiDocsInfo(node_token, type);
        if (!res.data || !res.data.node || !res.data.node.obj_token) {
            throw new Error('获取文档失败');
        }
        const block_res = await this.getWikiDocsText(res.data.node.obj_token);
        return block_res;
    }

    /**
     * 根据 node_token 获取知识库文档信息
     * @param node_token
     * @returns
    */
    private async getWikiDocsInfo(node_token: string, type?: FeishuDocType) {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.wiki.v2.space.getNode({
                params: {
                    token: node_token,
                    obj_type: type,
                },
            }, token);
        });
        return res;
    }

    /**
     * TODO 获取知识库文档纯文本
     * @param docId
     */
    async getWikiDocsText(obj_token: string) {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.docs.v1.content.get({
                params: {
                    doc_token: obj_token,
                    doc_type: 'docx',
                    content_type: 'markdown',
                    lang: 'zh',
                },
            }, token);
        });
        if (!res.data || !res.data.content) {
            throw new Error('获取知识库失败');
        }
        return res.data.content;
    }

    /**
     * 获取知识库文档块, 飞书块
     * @param docId
     */
    private async getWikiDocsBlock(docId: string) {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.docx.v1.documentBlock.list({
                path: {
                    document_id: docId,
                },
                params: {
                    document_revision_id: -1,
                },
            }, token);
        });
        if (!res.data || !res.data.items) {
            throw new Error('获取文档失败');
        }
        return res.data.items;
    }

    async getWikiDocsChildren(block_id: string) {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.docx.v1.documentBlockChildren.list({
                path: {
                    document_block_id: block_id,
                },
            }, token);
        });
        return res;
    }

    /**
     * 创建知识库文档
     * @param title 文档标题
     * @param folder_token 文档所属文件夹 token
     */
    async createWikiDocs(title: string, folder_token?: string) {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.docx.v1.document.create({
                data: {
                    title: title,
                    folder_token: folder_token,
                },
            }, token);
        });
        return res;
    }

    /**
     * 创建知识库文档元素, 通过块创建
     * 1. 元素类型
     * 2. 元素内容
     */
    async createWikiDocsBlock(config: {
        document_id: string;
        block_id: string;
        children: Record<string, any>[];
    }) {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.docx.v1.documentBlockChildren.create({
                path: {
                    document_id: config.document_id,
                    block_id: config.block_id,
                },
                params: {
                    document_revision_id: -1,
                },
                data: {
                    children: config.children,
                    index: 0,
                },
            }, token);
        });
        return res;
    }

    /**
     * 创建知识库文档元素, 通过markdown创建
     * 1. 上传素材
     * 2. 调用创建导入任务接口
     * 3. 轮询导入任务状态
     * 4. 从云文档迁移至知识库
     * 注意：
     *  1. 需要应用获取云文档访问权限
     * @param markdown
     */
    async createWikiDocsMarkdown(markdown: string, parent_node?: string) {
        // 1. 上传素材
        const tempDir = `/tmp`;
        // 确保.tmp目录存在，如不存在则创建
        fs.ensureDirSync(tempDir);
        const tempFilePath = `${tempDir}/${generateUUID(10)}.md`;
        fs.writeFileSync(tempFilePath, markdown);
        // @issue https://github.com/larksuite/node-sdk/issues/39
        const buffer = fs.createReadStream(tempFilePath);
        // 获取文件大小
        const stats = fs.statSync(tempFilePath);
        const fileSize = stats.size;
        // 生成文件名 截取markdown 标题
        const file_name = markdown.split('\n')[0]?.replace(/# /, '') || generateUUID(10);
        // 直接使用buffer上传，不使用FormData和Blob
        const assets = await this.uploadWikiDocsAssets({
            file_name: `${file_name}.md`,
            parent_type: 'ccm_import_open',
            file: buffer,
            size: fileSize,
            extra: JSON.stringify({
                obj_type: 'docx',
                file_extension: 'md',
            }),
        });
        // 删除文件
        fs.unlinkSync(tempFilePath);
        // 2. 调用创建导入任务接口 assets.data.file_token
        const importTask = await this.createImportTask({
            file_token: assets.file_token,
            file_extension: 'md',
            file_name: `${file_name}.md`,
            type: 'docx',
            point: {
                mount_type: 1,
                mount_key: '',
            },
        });
        if (!importTask.data || !importTask.data.ticket) {
            throw new Error('创建导入任务失败');
        }
        //3. 轮询导入任务状态, 每 3 秒轮训一次，总共轮训 10次
        let count = 0;
        const getTaskRes: <T extends Record<string, any>>() => Promise<T> = () => {
            return new Promise((resolve, reject) => {
                const timer = setInterval(async() => {
                    try {
                        const taskRes = await this.getImportTask(importTask.data!.ticket!);
                        if (taskRes.code === 0) { // 成功时
                            clearInterval(timer);
                            resolve(taskRes);
                        } else { // 失败时
                            count++;
                            if (count >= 10) {
                                clearInterval(timer);
                                reject(new Error('导入任务失败'));
                            }
                        }
                    } catch (error) {
                        clearInterval(timer);
                        reject(error);
                    }
                }, 3000); // 每3秒执行一次
            });
        };
        const res = await getTaskRes();
        if (!res.data || !res.data.result) {
            throw new Error('导入任务失败');
        }
        if (!parent_node) {
            return res.data.result;
        }

        // 4. 从云文档迁移至知识库
        const moveRes = await this.removeDocsToWiki({
            parent_wiki_token: parent_node || '',
            obj_type: 'docx',
            obj_token: res.data.result.token,
        });
        return moveRes;
    }

    /**
     * 上传知识库文档素材
     * @param config
     */
    private async uploadWikiDocsAssets(config: Record<string, any>) {
        console.log('上传知识库文档素材');
        const token = await this.getTokenLark();
        const res = await this.client?.drive.v1.media.uploadAll({
            data: {
                file_name: config.file_name || generateUUID(10),
                parent_type: config.parent_type,
                parent_node: config.parent_node,
                file: config.file,
                size: config.size,
                extra: config.extra,
            },
        }, token);
        if (!res || !res.file_token) {
            throw new Error('上传失败');
        }
        return res;
    }

    /**
     * 创建导入任务
     * @param config
     */
    private async createImportTask(config: Record<string, any>) {
        console.log('创建导入任务');
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.drive.v1.importTask.create({
                data: {
                    file_extension: config.file_extension,
                    file_name: config.file_name,
                    file_token: config.file_token,
                    type: config.type,
                    point: config.point,
                },
            }, token);
        });
        return res;
    }

    /**
     * 获取导入任务
     * @param task_id
     */
    private async getImportTask(task_id: string) {
        console.log('获取导入任务');
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.drive.v1.importTask.get({
                path: {
                    ticket: task_id,
                },
            }, token);
        });
        return res;
    }

    private async removeDocsToWiki(config: {
        parent_wiki_token: string;
        obj_type: FeishuDocType;
        obj_token: string;
    }) {
        const token = await this.getTokenLark();
        const res = await this.nativeTryCatch(async() => {
            return await this.client?.wiki.v2.spaceNode.moveDocsToWiki({
                path: {
                    space_id: this.spaceId || '',
                },
                data: config,
            }, token);
        });
        return res;
    }
    // private async getWikiDocsAssets(docId: string) {

    // }
}
