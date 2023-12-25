import statistics from '@/qm-statistics/index';

export const statisticsInit = async (params) => {
    statistics.set_para({
        qmkey: import.meta.env.VITE_QMKEY, // 4894f075f5d18bd01639b1ba9ca0c1da
        project: 'newmedia_wechat', // newmedia_wechat
        channel: 'xiongmaokanshu', // xiongmaokanshu
        server_url: 'https://drs.wtzw.com/frontend' // https://drs.wtzw.com/frontend
    });
    statistics.init(params);
};

export default statistics;
