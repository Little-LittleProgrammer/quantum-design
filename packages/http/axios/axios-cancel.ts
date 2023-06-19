import type { AxiosRequestConfig, Canceler } from 'axios';
import axios from 'axios';
import { js_is_function } from '@q-front-npm/utils';

// Used to store the identification and cancellation function of each request
let pendingMap = new Map<string, Canceler>();

export const getPendingUrl = (config: AxiosRequestConfig) => [config.method, config.url].join('&');

export class AxiosCanceler {
    /**
   * 将请求添加到map中
   * @param {Object} config
   */
    addPending(config: AxiosRequestConfig) {
        this.removePending(config);
        const url = getPendingUrl(config);
        config.cancelToken =
            config.cancelToken ||
            new axios.CancelToken((cancel) => {
                if (!pendingMap.has(url)) {
                    // If there is no current request in pending, add it
                    pendingMap.set(url, cancel);
                }
            });
    }

    /**
   * @description: 取消所有的请求
   */
    removeAllPending() {
        pendingMap.forEach((cancel) => {
            cancel && js_is_function(cancel) && cancel();
        });
        pendingMap.clear();
    }

    /**
   * 取消重复的请求
   * @param {Object} config
   */
    removePending(config: AxiosRequestConfig) {
        const url = getPendingUrl(config);
        if (pendingMap.has(url)) {
            // If there is a current request identifier in pending,
            // the current request needs to be cancelled and removed
            const cancel = pendingMap.get(url);
            cancel && cancel(url);
            pendingMap.delete(url);
        }
    }

    /**
   * @description: reset
   */
    reset(): void {
        pendingMap = new Map<string, Canceler>();
    }
}
