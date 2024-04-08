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
            },
            {
                'label': '百青藤',
                'value': 3
            },
            {
                'label': '快手',
                'value': 4
            },
            {
                'label': '讯飞',
                'value': 5
            },
            {
                'label': 'Vivo',
                'value': 6
            },
            {
                'label': 'OPPO',
                'value': 7
            },
            {
                'label': '拼多多',
                'value': 8
            },
            {
                'label': '七猫自运营',
                'value': 9
            },
            {
                'label': '打底激励视频',
                'value': 11
            },
            {
                'label': '华为',
                'value': 12
            },
            {
                'label': '方歌',
                'value': 13
            },
            {
                'label': '泛为',
                'value': 14
            },
            {
                'label': '风尚',
                'value': 15
            },
            {
                'label': '耗彩',
                'value': 16
            },
            {
                'label': '互推',
                'value': 17
            },
            {
                'label': '爱奇艺',
                'value': 18
            },
            {
                'label': '佳投',
                'value': 19
            },
            {
                'label': '吉欣',
                'value': 20
            },
            {
                'label': '美树科技',
                'value': 21
            },
            {
                'label': '品友',
                'value': 22
            },
            {
                'label': '软告',
                'value': 23
            },
            {
                'label': '瑞狮',
                'value': 24
            },
            {
                'label': '深演',
                'value': 25
            },
            {
                'label': '旺脉',
                'value': 26
            },
            {
                'label': '小熊',
                'value': 27
            },
            {
                'label': '新数',
                'value': 28
            },
            {
                'label': '新义',
                'value': 29
            },
            {
                'label': '用增',
                'value': 30
            },
            {
                'label': '有境科技',
                'value': 31
            },
            {
                'label': '友盟',
                'value': 32
            },
            {
                'label': '阅客',
                'value': 33
            },
            {
                'label': '跃盟',
                'value': 34
            },
            {
                'label': '京东',
                'value': 35
            },
            {
                'label': '游可盈',
                'value': 36
            },
            {
                'label': '数因',
                'value': 37
            },
            {
                'label': '章鱼',
                'value': 38
            },
            {
                'label': '七猫效果（北京dsp）',
                'value': 39
            },
            {
                'label': '非标',
                'value': 40
            },
            {
                'label': '极光',
                'value': 41
            },
            {
                'label': '中元',
                'value': 42
            },
            {
                'label': '收入录入',
                'value': 43
            },
            {
                'label': '阿里tanx',
                'value': 44
            },
            {
                'label': '美团PD',
                'value': 45
            },
            {
                'label': '美团RTB',
                'value': 46
            },
            {
                'label': '2345RTB',
                'value': 47
            },
            {
                'label': '加和科技(可口可乐)',
                'value': 48
            },
            {
                'label': '舜飞',
                'value': 49
            },
            {
                'label': '京准通',
                'value': 50
            },
            {
                'label': '之行',
                'value': 51
            },
            {
                'label': '墨果',
                'value': 52
            },
            {
                'label': '中关互动',
                'value': 53
            },
            {
                'label': '力值',
                'value': 54
            },
            {
                'label': '枫岚',
                'value': 55
            },
            {
                'label': '多盟',
                'value': 56
            },
            {
                'label': '沃泓',
                'value': 57
            },
            {
                'label': '趣盟',
                'value': 58
            },
            {
                'label': '广推',
                'value': 59
            },
            {
                'label': '穿山甲游戏中心',
                'value': 60
            },
            {
                'label': '汇川',
                'value': 61
            },
            {
                'label': '中关互动SDK',
                'value': 62
            },
            {
                'label': '华为SDK',
                'value': 63
            },
            {
                'label': '启航（阿里）',
                'value': 64
            },
            {
                'label': '溢胜',
                'value': 65
            },
            {
                'label': 'adview',
                'value': 66
            },
            {
                'label': 'magic',
                'value': 67
            },
            {
                'label': '舜飞PD',
                'value': 68
            },
            {
                'label': '华为API',
                'value': 69
            },
            {
                'label': '百寻',
                'value': 70
            },
            {
                'label': '鱼传',
                'value': 71
            },
            {
                'label': 'vivoSDK',
                'value': 72
            },
            {
                'label': '泾舟科技',
                'value': 73
            },
            {
                'label': 'UGDSP',
                'value': 74
            },
            {
                'label': 'neq',
                'value': 75
            },
            {
                'label': 'tanxSDK',
                'value': 76
            },
            {
                'label': '布鲁肯',
                'value': 77
            },
            {
                'label': '小米',
                'value': 78
            },
            {
                'label': '嗨量',
                'value': 79
            },
            {
                'label': '优优',
                'value': 80
            },
            {
                'label': '鲤跃',
                'value': 81
            },
            {
                'label': 'vivo其他',
                'value': 82
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
            },
            {
                'label': '手机淘宝（com.taobao.taobao）',
                'value': 4
            },
            {
                'label': '天猫（com.tmall.wireless）',
                'value': 5
            },
            {
                'label': '淘宝特价版（com.taobao.litetao）',
                'value': 6
            },
            {
                'label': '闲鱼（com.taobao.idlefish）',
                'value': 7
            },
            {
                'label': '支付宝（com.eg.android.AlipayGphone）',
                'value': 8
            },
            {
                'label': '京东（com.jingdong.app.mall）',
                'value': 9
            },
            {
                'label': '拼多多（com.xunmeng.pinduoduo）',
                'value': 10
            },
            {
                'label': '微博（com.sina.weibo）',
                'value': 11
            },
            {
                'label': '腾讯视频（com.tencent.qqlive）',
                'value': 12
            },
            {
                'label': '腾讯新闻（com.tencent.news）',
                'value': 13
            },
            {
                'label': '爱奇艺（com.qiyi.video）',
                'value': 14
            },
            {
                'label': '58同城（com.wuba）',
                'value': 15
            },
            {
                'label': '快手（com.smile.gifmaker）',
                'value': 16
            },
            {
                'label': '抖音（com.ss.android.ugc.aweme）',
                'value': 17
            },
            {
                'label': '口碑（com.taobao.mobile.dipei）',
                'value': 18
            },
            {
                'label': '滴滴出行（com.sdu.didi.psnger）',
                'value': 19
            },
            {
                'label': '滴滴加油（com.didi.oil）',
                'value': 20
            },
            {
                'label': '花小猪（com.huaxiaozhu.driver）',
                'value': 21
            },
            {
                'label': '青桔（com.qingqikeji.blackhorse.passenger）',
                'value': 22
            },
            {
                'label': '掌上生活（com.cmbchina.ccd.pluto.cmbActivity）',
                'value': 23
            },
            {
                'label': '全民K歌（com.tencent.karaoke）',
                'value': 24
            },
            {
                'label': '美团（com.sankuai.meituan）',
                'value': 25
            },
            {
                'label': 'UC浏览器（com.UCMobile）',
                'value': 26
            },
            {
                'label': 'QQ音乐（com.tencent.qqmusic）',
                'value': 27
            },
            {
                'label': '美团优选（com.sankuai.youxuan）',
                'value': 28
            },
            {
                'label': '夸克（com.quark.browser）',
                'value': 29
            },
            {
                'label': '搜狐视频（com.sohu.sohuvideo）',
                'value': 30
            },
            {
                'label': '优酷（com.youku.phone）',
                'value': 31
            },
            {
                'label': '点淘（com.taobao.live）',
                'value': 32
            },
            {
                'label': '高德地图（com.autonavi.minimap）',
                'value': 33
            },
            {
                'label': '百度地图（com.baidu.BaiduMap）',
                'value': 34
            },
            {
                'label': '阳光惠生活（com.ebank.creditcard）',
                'value': 35
            },
            {
                'label': '马上金融（com.msxf.loan）',
                'value': 36
            },
            {
                'label': '拍拍贷借款（com.ppdai.loan）',
                'value': 37
            },
            {
                'label': '动卡空间（com.citiccard.mobilebank）',
                'value': 38
            },
            {
                'label': '还呗（com.shuhekeji）',
                'value': 39
            },
            {
                'label': '有钱花（com.duxiaoman.umoney）',
                'value': 40
            },
            {
                'label': '平安消费金融（com.pacf）',
                'value': 41
            },
            {
                'label': '360借条（com.qihoo.loan）',
                'value': 42
            },
            {
                'label': '浦大喜奔（com.spdbccc.app）',
                'value': 43
            },
            {
                'label': '买单吧（com.bankcomm.maidanba）',
                'value': 44
            },
            {
                'label': '众安小贷（com.zaxd.loan）',
                'value': 45
            },
            {
                'label': '携程金融（com.ctrip.jr）',
                'value': 46
            },
            {
                'label': '省呗（com.samoyed.credit）',
                'value': 47
            },
            {
                'label': '幻刃录（com.tencent.tmgp.jkhrl）',
                'value': 48
            },
            {
                'label': '万古至尊（com.tencent.tmgp.jkwgzz）',
                'value': 49
            },
            {
                'label': '蓝月传奇（com.tencent.lycqsh）',
                'value': 50
            },
            {
                'label': '0氪手游（com.anjiu.zero）',
                'value': 51
            },
            {
                'label': '心悦俱乐部（com.tencent.tgclub）',
                'value': 52
            },
            {
                'label': '掌上道聚城（com.tencent.djcity）',
                'value': 53
            },
            {
                'label': '小七手游（com.smwl.x7marketcp2）',
                'value': 54
            },
            {
                'label': '新仙侠手游（com.tencent.tmgp.lyjtxm）',
                'value': 55
            },
            {
                'label': '浮生为卿歌（com.GF.palacem5cncn.hwyad.hwy）',
                'value': 56
            },
            {
                'label': '天御乾坤（com.tencent.tmgp.cstyqk）',
                'value': 57
            },
            {
                'label': '奇门飞花令（com.tencent.tmgp.qimen.kiwi）',
                'value': 58
            },
            {
                'label': '锦衣寒刀（com.tencent.tmgp.lyjyhd）',
                'value': 59
            },
            {
                'label': '大卫熊英语（com.seewo.picbook.pro）',
                'value': 60
            },
            {
                'label': '小早启蒙（com.bjhl.xiaozao）',
                'value': 61
            },
            {
                'label': '鸭鸭启蒙（com.zuoyebang.yayaenglish）',
                'value': 62
            },
            {
                'label': '宝宝巴士故事（com.sinyee.babybus.story）',
                'value': 63
            },
            {
                'label': '儿童思维训练营（com.jojoread.readcamp）',
                'value': 64
            },
            {
                'label': '小狸启蒙（com.zhangmen.braintrain）',
                'value': 65
            },
            {
                'label': '帮帮识字（com.zuoyebang.bangbangshizi）',
                'value': 66
            },
            {
                'label': '年糕妈妈（com.nicomama.niangaomama）',
                'value': 67
            },
            {
                'label': '洪恩拼音（com.ihuman.pinyin）',
                'value': 68
            },
            {
                'label': '小熊美术（com.sfhc.drawing）',
                'value': 69
            },
            {
                'label': '斑马AI课（com.fenbi.android.zenglish）',
                'value': 70
            },
            {
                'label': '一起学网校（com.yqxue.yqxue）',
                'value': 71
            },
            {
                'label': '小步在家早教（com.xiaobu121.xiaobu.xiaobu_android）',
                'value': 72
            },
            {
                'label': '瓜瓜龙启蒙（com.eykid.android.ey）',
                'value': 73
            },
            {
                'label': '核桃幼儿编程（com.hetao101.scratchJr）',
                'value': 74
            },
            {
                'label': '叫叫（com.shusheng.JoJoRead）',
                'value': 75
            },
            {
                'label': '小火箭幼儿编程（cn.codemao.android.kids.lite）',
                'value': 76
            },
            {
                'label': '咕比启蒙（com.i61.ailesson）',
                'value': 77
            },
            {
                'label': '荷小鱼（com.qlchat.hexiaoyu）',
                'value': 78
            },
            {
                'label': '叽里呱啦（com.jiliguala.niuwa）',
                'value': 79
            },
            {
                'label': '小猴启蒙（com.tal.imonkey.chinese）',
                'value': 80
            },
            {
                'label': '翼支付（com.chinatelecom.bestpayclient）',
                'value': 81
            },
            {
                'label': '新氧（com.youxiang.soyoungapp）',
                'value': 82
            },
            {
                'label': '携程（ctrip.android.view）',
                'value': 83
            },
            {
                'label': '苏宁易购（com.suning.mobile.ebuy）',
                'value': 84
            },
            {
                'label': 'farfetch（com.farfetch.farfetchshop）',
                'value': 85
            },
            {
                'label': '贝壳找房（com.lianjia.beike）',
                'value': 86
            },
            {
                'label': '美团外卖（com.sankuai.meituan.takeoutnew）',
                'value': 87
            },
            {
                'label': '去哪儿（com.Qunar）',
                'value': 88
            },
            {
                'label': '网易新闻（com.netease.newsreader.activity）',
                'value': 89
            },
            {
                'label': '链家（com.homelink.android）',
                'value': 90
            },
            {
                'label': '千牛APP（com.taobao.qianniu）',
                'value': 91
            },
            {
                'label': '小红书（com.xingin.xhs）',
                'value': 92
            },
            {
                'label': '快手极速版（com.kuaishou.nebula）',
                'value': 93
            },
            {
                'label': '大众点评（com.dianping.v1）',
                'value': 94
            },
            {
                'label': '抖音极速版（com.ss.android.ugc.aweme.lite）',
                'value': 95
            },
            {
                'label': '今日头条极速版（com.ss.android.article.lite）',
                'value': 96
            },
            {
                'label': '抖音火山（com.ss.android.ugc.live）',
                'value': 97
            },
            {
                'label': 'uc浏览器极速版（com.ucmobile.lite）',
                'value': 98
            },
            {
                'label': '搜狗浏览器极速版（sogou.mobile.explorer）',
                'value': 99
            },
            {
                'label': '趣头条（com.jifen.qukan）',
                'value': 100
            },
            {
                'label': '众安保险（com.zhongan.insurance）',
                'value': 101
            },
            {
                'label': '泰康在线（cn.tk.online）',
                'value': 102
            },
            {
                'label': '平安健康保险（com.pa.health）',
                'value': 103
            },
            {
                'label': '慧择保险网（com.hzins.mobile）',
                'value': 104
            },
            {
                'label': '水滴保（com.shuidihuzhu.sdbao）',
                'value': 105
            },
            {
                'label': '天眼查（com.tianyancha.skyeye）',
                'value': 106
            },
            {
                'label': 'yy（com.duowan.mobile）',
                'value': 107
            },
            {
                'label': '安居客（com.anjuke.android.app）',
                'value': 108
            },
            {
                'label': 'b站（tv.danmaku.bili）',
                'value': 109
            },
            {
                'label': '陌陌（com.immomo.momo）',
                'value': 110
            },
            {
                'label': '斗鱼tv（air.tv.douyu.android）',
                'value': 111
            },
            {
                'label': '当当（com.dangdang.buy2）',
                'value': 112
            },
            {
                'label': '南瓜电影（cn.vcinema.cinema）',
                'value': 113
            },
            {
                'label': '网易严选（com.netease.yanxuan）',
                'value': 114
            },
            {
                'label': '京东极速（com.jd.jdlite）',
                'value': 115
            },
            {
                'label': '美团极速版（com.meituan.turbo）',
                'value': 116
            },
            {
                'label': '京东金融（com.jd.jrapp）',
                'value': 117
            },
            {
                'label': '汽车之家（com.cubic.autohome）',
                'value': 118
            },
            {
                'label': '唱吧（com.changba）',
                'value': 119
            },
            {
                'label': '一起作业（com.A17zuoye.mobile.homework）',
                'value': 120
            },
            {
                'label': '婚礼纪（me.suncloud.marrymemo）',
                'value': 121
            },
            {
                'label': '工友通（cn.szjxgs.szjob）',
                'value': 122
            },
            {
                'label': '实习僧（com.shixiseng.activity）',
                'value': 123
            },
            {
                'label': '百度大字版（com.baidu.searchbox.tomas）',
                'value': 124
            },
            {
                'label': '百度好看（com.baidu.haokan）',
                'value': 125
            },
            {
                'label': 'Boss直聘（com.hpbr.bosszhipin）',
                'value': 126
            },
            {
                'label': '小天才（com.okii.watch.adult）',
                'value': 127
            },
            {
                'label': '轻颜相机（com.gorgeous.lite）',
                'value': 128
            },
            {
                'label': '小恩爱（com.xiaoenai.app）',
                'value': 129
            },
            {
                'label': '粉笔公考（com.fenbi.android.servant）',
                'value': 130
            },
            {
                'label': 'i云保（com.zhongan.iyunbao）',
                'value': 131
            },
            {
                'label': '泰生活（com.taikang.tailife）',
                'value': 132
            },
            {
                'label': '平安普惠陆慧融（com.paem）',
                'value': 133
            },
            {
                'label': '中国人保（com.cloudpower.netsale.activity）',
                'value': 134
            },
            {
                'label': '人保寿险管家（com.picclife.smart）',
                'value': 135
            },
            {
                'label': '安逸花（com.msxf.ayh）',
                'value': 136
            },
            {
                'label': '中国人寿寿险（com.chinalife.ebz）',
                'value': 137
            },
            {
                'label': '知乎（com.zhihu.android）',
                'value': 138
            },
            {
                'label': 'QQ浏览器（com.tencent.mtt）',
                'value': 139
            },
            {
                'label': 'WiFi万能钥匙（com.snda.wifilocating）',
                'value': 140
            },
            {
                'label': '酷狗音乐（com.kugou.android）',
                'value': 141
            },
            {
                'label': '今日头条（com.ss.android.article.news）',
                'value': 142
            },
            {
                'label': '西瓜视频（com.ss.android.article.video）',
                'value': 143
            },
            {
                'label': '王者荣耀（com.tencent.tmgp.sgame）',
                'value': 144
            },
            {
                'label': '飞猪（com.taobao.trip）',
                'value': 145
            },
            {
                'label': '菜鸟（com.cainiao.wireless）',
                'value': 146
            },
            {
                'label': '钉钉（com.alibaba.android.rimet）',
                'value': 147
            },
            {
                'label': '微信（com.tencent.mm）',
                'value': 148
            },
            {
                'label': '应用宝（com.tencent.android.qqdownloader）',
                'value': 149
            },
            {
                'label': '得物（com.shizhuang.duapp）',
                'value': 150
            },
            {
                'label': '七猫（com.kmxs.reader）',
                'value': 151
            },
            {
                'label': '熊猫（com.xm.freader）',
                'value': 152
            },
            {
                'label': '星空（com.xk.qreader）',
                'value': 153
            },
            {
                'label': '茄子（com.qz.freader）',
                'value': 154
            },
            {
                'label': 'soul（cn.soulapp.android）',
                'value': 155
            },
            {
                'label': '阿里巴巴（com.alibaba.wireless）',
                'value': 156
            },
            {
                'label': '零售通（com.alibaba.wireless.lstretailer）',
                'value': 157
            },
            {
                'label': '网易考拉（com.kaola）',
                'value': 158
            },
            {
                'label': '盒马（com.wudaokou.hippo）',
                'value': 159
            },
            {
                'label': 'blued（com.soft.blued）',
                'value': 160
            },
            {
                'label': '叮咚买菜（com.yaya.zone）',
                'value': 161
            },
            {
                'label': '花小猪打车（com.huaxiaozhu.rider）',
                'value': 162
            },
            {
                'label': 'QQ（com.tencent.mobileqq）',
                'value': 163
            },
            {
                'label': '喜马拉雅（com.ximalaya.ting.android）',
                'value': 164
            },
            {
                'label': '百度网盘（com.baidu.netdisk）',
                'value': 165
            },
            {
                'label': '腾讯地图（com.tencent.map）',
                'value': 166
            },
            {
                'label': '开心消消乐（com.happyelements.AndroidAnimal）',
                'value': 167
            },
            {
                'label': '和平精英（com.tencent.tmgp.pubgmhd）',
                'value': 168
            },
            {
                'label': '扫描全能王（com.intsig.camscanner）',
                'value': 169
            },
            {
                'label': 'Keep（com.gotokeep.keep）',
                'value': 170
            },
            {
                'label': '虎牙直播（com.duowan.kiwi）',
                'value': 171
            },
            {
                'label': '金铲铲之战（com.tencent.jkchess）',
                'value': 172
            },
            {
                'label': 'WiFi万能钥匙极速版（com.snda.lantern.wifilocating）',
                'value': 173
            },
            {
                'label': '美柚（com.lingan.seeyou）',
                'value': 174
            },
            {
                'label': '百度手机助手（com.baidu.appsearch）',
                'value': 175
            },
            {
                'label': 'CAD快速看图（com.glodon.drawingexplorer）',
                'value': 176
            },
            {
                'label': '欢乐斗地主（com.qqgame.hlddz）',
                'value': 177
            },
            {
                'label': '智行火车票（com.yipiao）',
                'value': 178
            },
            {
                'label': '王者营地（com.tencent.gamehelper.smoba）',
                'value': 179
            },
            {
                'label': '英雄联盟手游（com.tencent.lolm）',
                'value': 180
            },
            {
                'label': '智联招聘（com.zhaopin.social）',
                'value': 181
            },
            {
                'label': 'JJ斗地主（cn.jj）',
                'value': 182
            },
            {
                'label': 'QQ安全中心（com.tencent.token）',
                'value': 183
            },
            {
                'label': '同程旅行（com.tongcheng.android）',
                'value': 184
            },
            {
                'label': '掌上英雄联盟（com.tencent.qt.qtl）',
                'value': 185
            },
            {
                'label': '360手机助手（com.qihoo.appstore）',
                'value': 186
            },
            {
                'label': '网易大神（com.netease.gl）',
                'value': 187
            },
            {
                'label': '米游社（com.mihoyo.hyperion）',
                'value': 188
            },
            {
                'label': '欢乐麻将全集（com.qqgame.happymj）',
                'value': 189
            },
            {
                'label': '233乐园（com.meta.box）',
                'value': 190
            },
            {
                'label': '原神（com.miHoYo.Yuanshen）',
                'value': 191
            },
            {
                'label': '穿越火线：枪战王者（com.tencent.tmgp.cf）',
                'value': 192
            },
            {
                'label': '和平营地（com.tencent.gamehelper.pg）',
                'value': 193
            },
            {
                'label': '偷星猫（com.miofun.android）',
                'value': 194
            },
            {
                'label': '同缘（com.zy.tongyuan）',
                'value': 195
            },
            {
                'label': 'taptap（com.taptap）',
                'value': 196
            },
            {
                'label': '搜狐新闻（com.sohu.newsclient）',
                'value': 197
            },
            {
                'label': '懂车帝（com.ss.android.auto）',
                'value': 198
            },
            {
                'label': '噗叽（com.kwai.thanos）',
                'value': 199
            },
            {
                'label': '每日走路（com.yt.mrzl）',
                'value': 200
            },
            {
                'label': '有柿（com.ss.android.article.search）',
                'value': 201
            },
            {
                'label': '贝乐虎儿歌（com.ubestkid.beilehu.android）',
                'value': 202
            },
            {
                'label': '快看漫画（com.kuaikan.comic）',
                'value': 203
            },
            {
                'label': 'Hello语音（com.yy.huanju）',
                'value': 204
            },
            {
                'label': '儿歌点点（com.mampod.ergedd）',
                'value': 205
            },
            {
                'label': '花椒直播（com.huajiao）',
                'value': 206
            },
            {
                'label': 'TT语音（com.yiyou.ga）',
                'value': 207
            },
            {
                'label': '爱奇艺极速版（com.qiyi.video.lite）',
                'value': 208
            },
            {
                'label': '幸福里（com.f100.android）',
                'value': 209
            },
            {
                'label': '墨迹天气（com.moji.mjweather）',
                'value': 210
            },
            {
                'label': '脉脉（com.taou.maimai）',
                'value': 211
            },
            {
                'label': '芒果TV（com.hunantv.imgo.activity）',
                'value': 212
            },
            {
                'label': '最右（cn.xiaochuankeji.tieba）',
                'value': 213
            },
            {
                'label': '伊对（me.yidui）',
                'value': 214
            },
            {
                'label': '新浪新闻（com.sina.news）',
                'value': 215
            },
            {
                'label': 'NOW直播（com.tencent.now）',
                'value': 216
            },
            {
                'label': '多多走路赚（com.shangyun.jbxns）',
                'value': 217
            },
            {
                'label': '每日充电（com.xy.mrcd）',
                'value': 218
            },
            {
                'label': '充电领宝（com.shk.cdlb）',
                'value': 219
            },
            {
                'label': '每刻充电（com.hzjl.mkcd）',
                'value': 220
            },
            {
                'label': '当准天气（com.bee.rain）',
                'value': 221
            },
            {
                'label': '番茄免费小说（com.dragon.read）',
                'value': 222
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
            },
            {
                'label': 'kuaishou',
                'value': 4
            },
            {
                'label': 'xunfei',
                'value': 5
            },
            {
                'label': 'vivo',
                'value': 6
            },
            {
                'label': 'oppo',
                'value': 7
            },
            {
                'label': 'pdd',
                'value': 8
            },
            {
                'label': 'qimao',
                'value': 9
            },
            {
                'label': '',
                'value': 11
            },
            {
                'label': 'huawei',
                'value': 12
            },
            {
                'label': 'fangge',
                'value': 13
            },
            {
                'label': 'fanwei',
                'value': 14
            },
            {
                'label': 'fengshang',
                'value': 15
            },
            {
                'label': 'haocai1',
                'value': 16
            },
            {
                'label': 'hutui',
                'value': 17
            },
            {
                'label': 'iqiyi',
                'value': 18
            },
            {
                'label': 'jiatou',
                'value': 19
            },
            {
                'label': 'jixin',
                'value': 20
            },
            {
                'label': 'meishu',
                'value': 21
            },
            {
                'label': 'pinyou',
                'value': 22
            },
            {
                'label': 'ruangao',
                'value': 23
            },
            {
                'label': 'ruishi',
                'value': 24
            },
            {
                'label': 'shenyan',
                'value': 25
            },
            {
                'label': 'wangmai',
                'value': 26
            },
            {
                'label': 'xiaoxiong',
                'value': 27
            },
            {
                'label': 'xinshu',
                'value': 28
            },
            {
                'label': 'xinyi',
                'value': 29
            },
            {
                'label': 'yongzeng',
                'value': 30
            },
            {
                'label': 'youjing',
                'value': 31
            },
            {
                'label': 'youmeng',
                'value': 32
            },
            {
                'label': 'yueke',
                'value': 33
            },
            {
                'label': 'yuemeng',
                'value': 34
            },
            {
                'label': 'jingdong',
                'value': 35
            },
            {
                'label': 'youkeying',
                'value': 36
            },
            {
                'label': 'shuyin',
                'value': 37
            },
            {
                'label': 'zhangyu',
                'value': 38
            },
            {
                'label': 'qmxiaoguo',
                'value': 39
            },
            {
                'label': 'feibiao',
                'value': 40
            },
            {
                'label': 'jiguang',
                'value': 41
            },
            {
                'label': 'zhongyuan',
                'value': 42
            },
            {
                'label': 'profit',
                'value': 43
            },
            {
                'label': 'alitanx',
                'value': 44
            },
            {
                'label': 'meituanpd',
                'value': 45
            },
            {
                'label': 'meituanrtb',
                'value': 46
            },
            {
                'label': 'rtb2345',
                'value': 47
            },
            {
                'label': 'jiahe',
                'value': 48
            },
            {
                'label': 'shunfei',
                'value': 49
            },
            {
                'label': 'jingzhuntong',
                'value': 50
            },
            {
                'label': 'zhixing',
                'value': 51
            },
            {
                'label': 'moguo',
                'value': 52
            },
            {
                'label': 'zhongguanhudong',
                'value': 53
            },
            {
                'label': 'lizhi',
                'value': 54
            },
            {
                'label': 'fenglan',
                'value': 55
            },
            {
                'label': 'duomeng',
                'value': 56
            },
            {
                'label': 'wohong',
                'value': 57
            },
            {
                'label': 'qumeng',
                'value': 58
            },
            {
                'label': 'guangtui',
                'value': 59
            },
            {
                'label': 'csjgamecenter',
                'value': 60
            },
            {
                'label': 'huichuan',
                'value': 61
            },
            {
                'label': 'zhongguansdk',
                'value': 62
            },
            {
                'label': 'huaweisdk',
                'value': 63
            },
            {
                'label': 'qihang',
                'value': 64
            },
            {
                'label': 'yisheng',
                'value': 65
            },
            {
                'label': 'adview',
                'value': 66
            },
            {
                'label': 'magic',
                'value': 67
            },
            {
                'label': 'shunfeipd',
                'value': 68
            },
            {
                'label': 'jinghong',
                'value': 69
            },
            {
                'label': 'baixun',
                'value': 70
            },
            {
                'label': 'yuchuan',
                'value': 71
            },
            {
                'label': 'vivosdk',
                'value': 72
            },
            {
                'label': 'jingzhoukeji',
                'value': 73
            },
            {
                'label': 'ugdsp',
                'value': 74
            },
            {
                'label': 'neq',
                'value': 75
            },
            {
                'label': 'tanxsdk',
                'value': 76
            },
            {
                'label': 'buluken',
                'value': 77
            },
            {
                'label': 'xiaomi',
                'value': 78
            },
            {
                'label': 'hailiang',
                'value': 79
            },
            {
                'label': 'youyou',
                'value': 80
            },
            {
                'label': 'liyue',
                'value': 81
            },
            {
                'label': 'vivoother',
                'value': 82
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
                },
                {
                    'name': '鲤跃',
                    'partner_code': 81,
                    'access_mode': 1,
                    'factor': 10000,
                    'second_price_type': 0,
                    'second_price_value': 0,
                    'second_price_ratio': 0,
                    'settlement_mode': 1,
                    'party': 1,
                    'request_url': 'http://ads.weilitoutiao.net/kuaima_ads/api/ad/get/qimao',
                    'material_url': 'http://ads.weilitoutiao.net/kuaima_ads/api/ad/get/qimao_material',
                    'source_from': '鲤跃广告',
                    'timeout': 1000,
                    'cooperation_mode': [
                        4
                    ],
                    'partner_id': 106,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '预付款',
                    'party_txt': '合作中',
                    'created_at': '2024-04-02 14:54:13',
                    'updated_at': '2024-04-03 15:29:19',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 1,
                    'settlement_type_txt': '一价结算',
                    'token': '',
                    'secret': 'dc46e610c6c5bc37024e0cee8d15d518',
                    'cooperation_mode_txt': '实时竞价（RTB）',
                    'applist': [
                        6,
                        10,
                        19,
                        138,
                        146,
                        16,
                        106,
                        9,
                        156,
                        0,
                        145,
                        2,
                        33,
                        14,
                        17,
                        4,
                        118,
                        3,
                        83,
                        11,
                        5,
                        94,
                        12,
                        150,
                        7,
                        25,
                        29,
                        26,
                        87,
                        32,
                        8
                    ],
                    'applist_switch': 1,
                    'advertiser': 'liyue',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                },
                {
                    'name': 'vivo-其他',
                    'partner_code': 82,
                    'access_mode': 1,
                    'factor': 10000,
                    'second_price_type': 0,
                    'second_price_value': 0,
                    'second_price_ratio': 0,
                    'settlement_mode': 1,
                    'party': 1,
                    'request_url': '',
                    'material_url': '',
                    'source_from': 'vivo广告',
                    'timeout': 0,
                    'cooperation_mode': [
                        2,
                        4
                    ],
                    'partner_id': 107,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '预付款',
                    'party_txt': '合作中',
                    'created_at': '2024-04-01 16:35:12',
                    'updated_at': '2024-04-01 16:35:12',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 1,
                    'settlement_type_txt': '一价结算',
                    'token': '',
                    'secret': '',
                    'cooperation_mode_txt': '保价单阶（PD）,实时竞价（RTB）',
                    'applist': null,
                    'applist_switch': 0,
                    'advertiser': 'vivoother',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                },
                {
                    'name': '分期乐',
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
                    'source_from': '分期乐',
                    'timeout': 0,
                    'cooperation_mode': [
                        1
                    ],
                    'partner_id': 1008,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '定期结算',
                    'party_txt': '合作中',
                    'created_at': '2024-04-01 13:44:07',
                    'updated_at': '2024-04-01 13:44:07',
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
                },
                {
                    'name': '优优',
                    'partner_code': 80,
                    'access_mode': 1,
                    'factor': 10000,
                    'second_price_type': 0,
                    'second_price_value': 0,
                    'second_price_ratio': 0,
                    'settlement_mode': 1,
                    'party': 1,
                    'request_url': 'http://test.adprod.cn/adx/router/V100/qimao/bid',
                    'material_url': 'http://test.adprod.cn/adx/router/V100/qimao/ad',
                    'source_from': '优优广告',
                    'timeout': 13000,
                    'cooperation_mode': [
                        4
                    ],
                    'partner_id': 105,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '预付款',
                    'party_txt': '合作中',
                    'created_at': '2024-03-26 14:06:45',
                    'updated_at': '2024-03-29 13:42:21',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 1,
                    'settlement_type_txt': '一价结算',
                    'token': '',
                    'secret': 'c3dce4579b7745cbb7ebfd5f39f09b64',
                    'cooperation_mode_txt': '实时竞价（RTB）',
                    'applist': [
                        4,
                        5,
                        25,
                        17,
                        16,
                        93,
                        0
                    ],
                    'applist_switch': 1,
                    'advertiser': 'youyou',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                },
                {
                    'name': 'tanxSDK',
                    'partner_code': 76,
                    'access_mode': 2,
                    'factor': 10000,
                    'second_price_type': 2,
                    'second_price_value': 0,
                    'second_price_ratio': 3000,
                    'settlement_mode': 2,
                    'party': 2,
                    'request_url': '',
                    'material_url': '',
                    'source_from': 'TANX广告',
                    'timeout': 1300,
                    'cooperation_mode': [
                        4
                    ],
                    'partner_id': 102,
                    'access_mode_txt': 'SDK',
                    'second_price_type_txt': '比例',
                    'settlement_mode_txt': '定期结算',
                    'party_txt': '暂停合作',
                    'created_at': '2024-03-15 14:31:06',
                    'updated_at': '2024-03-15 14:31:06',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 2,
                    'settlement_type_txt': '二价结算',
                    'token': '',
                    'secret': '',
                    'cooperation_mode_txt': '实时竞价（RTB）',
                    'applist': null,
                    'applist_switch': 0,
                    'advertiser': 'tanxsdk',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                },
                {
                    'name': '嗨量',
                    'partner_code': 79,
                    'access_mode': 1,
                    'factor': 10000,
                    'second_price_type': 0,
                    'second_price_value': 0,
                    'second_price_ratio': 0,
                    'settlement_mode': 1,
                    'party': 2,
                    'request_url': 'http://adx-test.halomobi.com/bid/media/qimao',
                    'material_url': 'http://adx-test.halomobi.com/bid/media/qimao/ad',
                    'source_from': '嗨量广告',
                    'timeout': 1200,
                    'cooperation_mode': [
                        4
                    ],
                    'partner_id': 104,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '预付款',
                    'party_txt': '暂停合作',
                    'created_at': '2024-03-06 20:29:16',
                    'updated_at': '2024-03-28 19:52:18',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 1,
                    'settlement_type_txt': '一价结算',
                    'token': '',
                    'secret': 'c89ca807913bb3be',
                    'cooperation_mode_txt': '实时竞价（RTB）',
                    'applist': [
                        8,
                        9,
                        4,
                        10,
                        94,
                        32,
                        17,
                        87,
                        25,
                        117,
                        92,
                        16,
                        93,
                        14,
                        3,
                        83,
                        19,
                        2,
                        5,
                        7,
                        142,
                        143,
                        33,
                        118,
                        84,
                        26,
                        90,
                        86,
                        138,
                        110,
                        126,
                        145,
                        31,
                        198,
                        15,
                        13,
                        119,
                        171,
                        107,
                        97,
                        139,
                        109,
                        18,
                        82,
                        96,
                        141,
                        11,
                        12,
                        125,
                        155,
                        95,
                        42,
                        0,
                        211,
                        27,
                        88,
                        197,
                        164,
                        170,
                        24,
                        100,
                        89,
                        112,
                        30,
                        108,
                        34,
                        148,
                        163,
                        149,
                        6
                    ],
                    'applist_switch': 1,
                    'advertiser': 'hailiang',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                },
                {
                    'name': '小米小米',
                    'partner_code': 78,
                    'access_mode': 1,
                    'factor': 10000,
                    'second_price_type': 0,
                    'second_price_value': 0,
                    'second_price_ratio': 0,
                    'settlement_mode': 1,
                    'party': 2,
                    'request_url': 'http://api.ad.xiaomi.com/u/api/bidding/v3',
                    'material_url': '',
                    'source_from': '小米广告',
                    'timeout': 1300,
                    'cooperation_mode': [
                        4
                    ],
                    'partner_id': 103,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '预付款',
                    'party_txt': '暂停合作',
                    'created_at': '2024-02-29 19:13:38',
                    'updated_at': '2024-03-05 16:44:47',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 1,
                    'settlement_type_txt': '一价结算',
                    'token': '',
                    'secret': '',
                    'cooperation_mode_txt': '实时竞价（RTB）',
                    'applist': null,
                    'applist_switch': 0,
                    'advertiser': 'xiaomi',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                },
                {
                    'name': '启航mock',
                    'partner_code': 64,
                    'access_mode': 1,
                    'factor': 9000,
                    'second_price_type': 2,
                    'second_price_value': 0,
                    'second_price_ratio': 3000,
                    'settlement_mode': 2,
                    'party': 2,
                    'request_url': 'http://106.14.177.222:8989/mock/qihangProto',
                    'material_url': '',
                    'source_from': '启航mock',
                    'timeout': 1200,
                    'cooperation_mode': [
                        4
                    ],
                    'partner_id': 1003,
                    'access_mode_txt': 'API',
                    'second_price_type_txt': '比例',
                    'settlement_mode_txt': '定期结算',
                    'party_txt': '暂停合作',
                    'created_at': '2024-01-29 19:47:00',
                    'updated_at': '2024-01-29 20:07:38',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 2,
                    'settlement_type_txt': '二价结算',
                    'token': '',
                    'secret': 'fPujwEIJpxkdjQFm',
                    'cooperation_mode_txt': '实时竞价（RTB）',
                    'applist': null,
                    'applist_switch': 0,
                    'advertiser': 'qihang',
                    'render_style': 1,
                    'deeplink_prefix_list': null
                },
                {
                    'name': 'tanx SDK',
                    'partner_code': 76,
                    'access_mode': 2,
                    'factor': 10000,
                    'second_price_type': 0,
                    'second_price_value': 0,
                    'second_price_ratio': 0,
                    'settlement_mode': 1,
                    'party': 2,
                    'request_url': '',
                    'material_url': '',
                    'source_from': 'tanx广告',
                    'timeout': 0,
                    'cooperation_mode': [
                        4
                    ],
                    'partner_id': 1002,
                    'access_mode_txt': 'SDK',
                    'second_price_type_txt': '',
                    'settlement_mode_txt': '预付款',
                    'party_txt': '暂停合作',
                    'created_at': '2024-01-23 15:31:48',
                    'updated_at': '2024-01-23 15:31:48',
                    'deleted_at': '',
                    'status': 1,
                    'status_txt': '合作中',
                    'settlement_type': 1,
                    'settlement_type_txt': '一价结算',
                    'token': '',
                    'secret': '',
                    'cooperation_mode_txt': '实时竞价（RTB）',
                    'applist': null,
                    'applist_switch': 0,
                    'advertiser': 'tanxsdk',
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
