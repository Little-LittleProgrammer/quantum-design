<!--  -->
<template>
     <div class="login-container">
        <div class="banner ">
            <div class="banner-content layout-flex-around">
                <div class="tips-part">
                    <p>服务于DSP · 流量采买</p>
                    <p>程序化交易平台</p>
                </div>
                <div class="login-part">
                    <p class="login-title">登录</p>
                    <div class="error" v-if="data.errorFlag" >
                        <span class="error-text">
                            <q-antd-icon type="InfoCircleFilled" :style="{ color:'#E70000'}"></q-antd-icon>
                            账号或密码错误
                        </span>
                    </div>
                    <a-form layout="vertical" class="login-form" ref="ref-form" :model="data.formData">
                        <a-form-item name="account">
                            <a-input v-model="data.formData.account" size="large" placeholder="请输入手机号">
                                <template #prefix>
                                    <q-antd-icon type="UserOutlined"></q-antd-icon>
                                </template>
                            </a-input>
                        </a-form-item>
                        <a-form-item name="password">
                            <a-input v-model:value="data.formData.password" size="large" :type="data.inputType" placeholder="请输入密码">
                                <template #prefix>
                                    <q-antd-icon type="LockOutlined"></q-antd-icon>
                                </template>
                                <template #suffix>
                                    <div class="eye" @click="change_input_type">
                                        <q-antd-icon v-if="data.inputType != 'password'" type="EyeOutlined"></q-antd-icon>
                                        <q-antd-icon v-else type="EyeInvisibleOutlined"></q-antd-icon>
                                    </div>
                                </template>
                            </a-input>
                        </a-form-item>
                    </a-form>
                    <a-button size="large" class="submit-button " type="primary" @click="open_verification">登录</a-button>
                    <div class=" text-center m-t-25">
                        <a-button class="font-gray" type="link" @click="jump_page('register')">注册开户</a-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="middle">
            <div class="content">
                <p class="title">为什么选择我们</p>
                <div class="section-one">
                    <div class="box" v-for="item in data.sectionOneList" :key="item.title">
                        <template v-if="!item.arrow">
                            <img :src="item.src" alt="" srcset="">
                            <p class="detail-title">{{item.title}}</p>
                            <p class="detail-desc">{{item.desc}}</p>
                        </template>
                        <template v-else>
                            <div class="arrow"></div>
                        </template>
                    </div>
                </div>
            </div>
            <div class="content">
                <p class="title">合作流程</p>
                <div class=" section-two">
                    <div class="item" v-for="item in data.sectionTwoList" :key="item.title">
                        <template v-if="!item.arrow">
                            <img :src="item.src" alt="" srcset="">
                            <p>{{item.title}}</p>
                        </template>
                        <template v-else>
                            <div class="arrow"></div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="content">
                <p class="title">联系我们</p>
                <div class="tips">
                    <p>联系邮箱：wuxiaoyue@qimao.com</p>
                    <p>工作时间：周一至周五9:00～18:00</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang='ts' setup>
import { reactive } from 'vue';
definePageMeta({
    layout: 'login'
});
const globalStore = useGlobalStore();
const router = useRouter();
const data = reactive({
    imageData: {
        visible: false
    },
    inputType: 'password',
    formData: {
        account: '',
        password: ''
    },
    ls: null,
    errorFlag: false,
    rules: {
        account: [
            {required: true, message: '请输入手机号', trigger: 'blur'}
        ],
        password: [
            {required: true, message: '请输入密码', trigger: 'blur'}
        ]
    },
    sectionOneList: [
        {src: new URL('../../assets/image/reason_one.png', import.meta.url), title: '海量用户规模', desc: '七猫免费小说累计服务用户3.5亿，月活用户5000万，位列免费阅读行业第一梯队'},
        {src: new URL('../../assets/image/reason_two.png', import.meta.url), title: '多样化广告资源', desc: '多种广告资源位、多样广告场景，助力广告效果'},
        {src: new URL('../../assets/image/reason_three.png', import.meta.url), title: '数据透明，多维分析', desc: '全链路数据透明，出价、转化一目了然'}
    ],
    sectionTwoList: [
        {src: new URL('../../assets/image/cooperate_step_communicate.png', import.meta.url), title: '商务合作'},
        {arrow: true},
        {src: new URL('../../assets/image/cooperate_step_apply.png', import.meta.url), title: '申请开户'},
        {arrow: true},
        {src: new URL('../../assets/image/cooperate_step_examine.png', import.meta.url), title: '资质审核'},
        {arrow: true},
        {src: new URL('../../assets/image/cooperate_step_open_success.png', import.meta.url), title: '开户成功'},
        {arrow: true},
        {src: new URL('../../assets/image/cooperate_step_test.png', import.meta.url), title: '联调测试'},
        {arrow: true},
        {src: new URL('../../assets/image/cooperate_step_settlement.png', import.meta.url), title: '投放结算'}
    ]
});

function open_verification() {
    globalStore.pageLoading = true;
}

watch(() => globalStore.pageLoading, (val) => {
    if (val) {
        setTimeout(() => {
            globalStore.pageLoading = false;
        }, 2000);
    }
});

function cancel_verification() {}

function change_input_type() {
    data.inputType = data.inputType == 'password' ? '' : 'password';
}

function jump_page(page: string) {
    router.push({
        path: `/user/${page}`
    });
}

</script>
<style lang='scss' scoped>
$black-text: #000;
$gray-text: #ccc;
$login-bg: #FCC800;
$white-bg: white;
$font-size-base: 14px;
.login-container {
    @media (max-width: 1100px) {
            overflow-x: hidden;
        .tips-part {
            display: none;
        }
        .banner {
            .banner-content {
                width: 80% !important;
            }
        }
        .middle {
            .content {
                width: 80%;
            }
            .section-one {
                display: flex;
                justify-content: space-between;
                flex-direction: column
            }
            .section-two {
                 width: 68% !important;
            }
        }
        .section-two {
            flex-wrap: wrap;
        }
        .footer {
            .content {
                 width: 80%;
            }
        }

    }
    .banner {
        overflow: hidden;
        width: 100%;
        height: 460px;
        background-color: $login-bg;
        .banner-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 854px;
            margin: 0 auto;
            height: 100%;
            .tips-part {
                p:first-child {
                    font-size: 30px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: $black-text;
                    line-height: 42px;
                }
                p:last-child {
                    font-size: 50px;
                    font-family: PingFangSC-Semibold, PingFang SC;
                    font-weight: 600;
                    color: $black-text;
                    line-height: 70px;
                }
            }
            .login-part {
                width: 350px;
                padding: 30px;
                background-color: $white-bg;
                .login-title {
                    font-weight: bold;
                    font-size: $font-size-base + 4;
                    padding: $space 0;
                }
                .error {
                    background-color: #FFF8DC;
                    border: 1px solid #F2E4AC;
                    height: 24px;
                    .error-text {
                        font-size: 12px;
                        line-height: 24px;
                        color: red;
                        padding: 0 8px;
                    }
                    .tips-text {
                        font-size: 12px;
                        line-height: 24px;
                        color: #FF9E43;
                        padding: 0 8px;
                    }
                }
                .login-form {
                    margin-top: 10px;
                }
                .submit-button {
                    width: 100%;
                }
                .eye {
                    cursor: pointer;
                }
            }
        }

    }
    .middle {
        .section-one {
            display: flex;
            justify-content: space-between;
            .box {
                margin-right: 10px;
                flex: 1;
                img {
                    width: 180px;
                }
                .detail-title {
                    font-size: 18px;
                    color: $black-text;
                    line-height: 25px;
                }
                .detail-desc{
                    color: $gray-text;
                    line-height: 22px;
                    font-size: 12px;
                }
                &:last-child {
                    margin-right: 0px;
                }
            }

        }
        .section-two {
            width: 774px;
            margin: 0 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .item {
                img {
                    width: 64px;
                }
                p{
                    font-size: 16px;
                    color: $black-text;
                    line-height: 25px;
                }
            }
            .arrow {
                position: relative;
                &::before,
                &::after {
                    top: 50%;
                    left: -3px;
                    margin-top: -15px;
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 6px;
                    border: 12px solid transparent;
                    border-left-color: #eee;
                    z-index: 1;
                }
                &::before{
                    border-left-color: $white-bg;
                    left: -5px;
                    z-index: 2;
                }
            }

        }
    }
    .footer {
        .tips {
            font-size: $font-size-base;
            font-weight: 400;
            color: $black-text;
            line-height: 20px;
            padding-bottom: 50px;
        }
    }
    .content {
        width: 920px;
        margin: 0 auto;
        margin-top: 70px;
        text-align: center;
        .title {
            font-size: 26px;
            font-weight: 600;
            color: $black-text;
            line-height: 37px;
            position: relative;
            margin-bottom: 40px;
            &::after {
                content: '';
                position: absolute;
                width: 30px;
                border-bottom: 2px solid $border-color-base;
                bottom: -10px;
                left: 50%;
                margin-left: -15px;
            }
        }
    }

}
</style>
