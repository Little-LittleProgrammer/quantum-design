import { defHttp } from '@/http/axios';
import { ICpInfo, ICpInfoMap, ICpListHeader, ICpListReq, ICpOptionKey, ICpSelect } from './interface';

enum Api {
    partnerSelect = '/partner/select', // 筛选项 1层
    partnerList = '/partner/list', // list 1层
    partnerDetail = '/partner/detail', // detail 1层
    partnerDelete = '/partner/batch-delete', // 删除 1层
    partnerStart = '/partner/batch-start', // 开启 1层
    partnerStop = '/partner/batch-stop', // 关闭 1层
    partnerCreate = '/partner/create', // create 2层
    partnerUpdate = '/partner/update', // update 更新 2层1
}

export function api_partner_select() {
    return {
        'access_mode_list': [
            {
                'label': 'API',
                'value': 1
            },
            {
                'label': 'SDK',
                'value': 2
            },
            {
                'label': '联盟s2sbidding',
                'value': 3
            },
            {
                'label': '自运营',
                'value': 4
            }
        ],
        'second_price_type_list': [
            {
                'label': '固定',
                'value': 1
            },
            {
                'label': '比例',
                'value': 2
            }
        ],
        'settlement_mode_list': [
            {
                'label': '预付款',
                'value': 1
            },
            {
                'label': '定期结算',
                'value': 2
            }
        ],
        'partner_status_list': [
            {
                'label': '合作中',
                'value': 1
            },
            {
                'label': '暂停合作',
                'value': 2
            }
        ],
        'cooperation_mode_list': [
            {
                'label': '保价保量（PDB）',
                'value': 1
            },
            {
                'label': '保价单阶（PD）',
                'value': 2
            },
            {
                'label': '保价多阶（PD）',
                'value': 3
            },
            {
                'label': '实时竞价（RTB）',
                'value': 4
            },
            {
                'label': '联盟（ADN）',
                'value': 5
            },
            {
                'label': '兜底',
                'value': 6
            },
            {
                'label': '实时竞价（S2Sbidding）',
                'value': 7
            },
            {
                'label': '保价（PD/B）',
                'value': 8
            }
        ],
        'settlement_type_list': [
            {
                'label': '一价结算',
                'value': 1
            },
            {
                'label': '二价结算',
                'value': 2
            }
        ],
        'party_list': [
            {
                'label': '我方协议',
                'value': 1
            },
            {
                'label': '对方协议',
                'value': 2
            }
        ],
        'partner_code_list': [
            {
                'label': '穿山甲',
                'value': 1
            },
            {
                'label': '广点通/优量汇',
                'value': 2
            }
        ],
        'applist_list': [
            {
                'label': '手机百度（com.baidu.searchbox）',
                'value': 0
            },
            {
                'label': '百度极速版（com.baidu.searchbox.lite）',
                'value': 1
            },
            {
                'label': '饿了么（me.ele）',
                'value': 2
            },
            {
                'label': '唯品会（com.achievo.vipshop）',
                'value': 3
            }
        ],
        'advertiser_list': [
            {
                'label': 'csj',
                'value': 1
            },
            {
                'label': 'gdt',
                'value': 2
            },
            {
                'label': 'baidu',
                'value': 3
            }
        ],
        'render_style_list': [
            {
                'label': '开屏',
                'value': 1
            },
            {
                'label': '开屏红包雨',
                'value': 2
            },
            {
                'label': '气泡动效(开屏&插页)',
                'value': 3
            }
        ]
    };
}

export function api_partner_list(params: ICpListReq & IApiPageOption) {
    return {
        'code': 200,
        'data': {
            'list': [
                {
                    'name': '非标',
                    'partner_code': 40,
                    'access_mode': 1,
                    'factor': 10000,
                    'second_price_type': 0,
                    'second_price_value': 0,
                    'second_price_ratio': 0,
                    'settlement_mode': 2,
                    'party': 1,
                    'request_url': '',
                    'material_url': '',
                    'source_from': '非标',
                    'timeout': 0,
                    'cooperation_mode': [
                        1
                    ],
                    'partner_id': 1011,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '定期结算',
                    'party_txt': '合作中',
                    'created_at': '2024-04-07 14:46:13',
                    'updated_at': '2024-04-07 14:46:13',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 0,
                    'settlement_type_txt': '',
                    'token': '',
                    'secret': '',
                    'cooperation_mode_txt': '保价保量（PDB）',
                    'applist': null,
                    'applist_switch': 0,
                    'advertiser': 'feibiao',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                }
            ],
            'pagination': {
                'page': 1,
                'page_size': 10,
                'count': 109
            },
            'header': {
                'partner_id': '合作平台ID',
                'partner_code': '合作平台Code',
                'name': '合作平台名称',
                'access_mode_txt': '接入模式',
                'cooperation_mode_txt': '合作模式',
                'settlement_type_txt': '结算方式',
                'factor': '竞价折扣',
                'second_price_type_txt': '二价计算方式',
                'second_price_ratio': '二价结算系数',
                'created_at': '开始合作时间',
                'status_txt': '合作状态'
            }
        },
        'msg': 'success'
    };
}
