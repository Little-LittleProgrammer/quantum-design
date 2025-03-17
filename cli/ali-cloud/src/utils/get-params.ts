import process from 'process'
import type { CodeSource } from '../types/client'

export class IParams {
    pipelineID!: number
    orgId!: string
    source!: string
    sources!: string
    modelName!: string;
    apiKey!: string
    token!: string
    constructor() {
    }

    getCurrentSourceWithMr(): CodeSource | null {
        // return {
        //     data: {
        //         branch: 'feature/作家中心支持异步导出',
        //         branchMode: false,
        //         cloneDepth: 0,
        //         codeupMrLocalId: 410,
        //         commitId: 'e77d22beccd89911878399e4ff905e8631680d1b',
        //         connection: 394291,
        //         displayName: '吴忠',
        //         displayUserEmail: 'wuzhong@qimao.com',
        //         isTrigger: true,
        //         method: 'http',
        //         password: '2451770757283c0e54156275bd29e9c5',
        //         projectId: '2835855',
        //         repo: 'https://codeup.aliyun.com/qimao/front/guanli-platform.qimao.com.git',
        //         repoUrl: 'https://packages.aliyun.com',
        //         submodule: false,
        //         userName: '5fb61742e1cf498f37f6a344',
        //         webhook: 'http://flow-openapi.aliyun.com/scm/webhook/VwzJ0mP0yJU3NgRVlaoJ',
        //     },
        //     name: 'guanli_platform_qimao_com',
        //     order: 1,
        //     sign: 'guanli_platform_qimao_com',
        //     type: 'codeup',
        // }
        if(!this.sources) {
            return null;
        }
        const sources: CodeSource[] = JSON.parse(this.sources!)
        const currentSource = sources.filter(source => source.type === 'codeup' && source.name === this.source!)
        if(currentSource.length === 1 && !!currentSource[0]?.data?.codeupMrLocalId) {
            return currentSource[0]
        }
        return null;
    }
}

export function getParams(): IParams {
    let params = new IParams()
    params.pipelineID = Number(process.env.PIPELINE_ID || 0)
    params.orgId = process.env.ORGANIZATION_ID as string
    params.source = process.env.source as string
    params.sources = process.env.SOURCES as string
    params.modelName = process.env.modelName as string
    params.apiKey = process.env.API_KEY as string
    params.token = process.env.TOKEN as string
    return params
}
