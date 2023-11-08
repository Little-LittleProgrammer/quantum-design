import { use_cryptojs_module } from './cipher';
import { js_is_null_or_undef } from './is';

interface IStorageParams {
    prefixKey: string;
    storage: Storage;
    timeout?: number | null;
    hasEncrypt: boolean
}

type Options = Partial<IStorageParams>;

const defaultCacheTime = 60 * 60 * 24 * 7;

class WebStorage {
    storage: Storage;
    hasEncrypt: boolean;
    encryption: UnwrapPromise<ReturnType<typeof use_cryptojs_module>>;
    prefixKey: string;
    timeout:number | null

    constructor(storage:Storage, prefixKey:string, hasEncrypt: boolean, encryption:UnwrapPromise<ReturnType<typeof use_cryptojs_module>>, timeout:number | null) {
        this.storage = storage;
        this.prefixKey = prefixKey;
        this.hasEncrypt = hasEncrypt;
        this.encryption = encryption;
        this.timeout = timeout;
    }

    getKey(key: string) {
        return `${this.prefixKey}_${key}`.toUpperCase();
    }

    set(key: string, value: any, expire: number | null = this.timeout) {
        const stringData = JSON.stringify({
            value,
            time: Date.now(),
            expire: !js_is_null_or_undef(expire) ? new Date().getTime() + expire * 1000 : null
        });
        const storageData = this.hasEncrypt ? this.encryption.encryptByAES(stringData) : stringData;
        this.storage.setItem(this.getKey(key), storageData);
    }

    get(key: string): any {
        const val = this.storage.getItem(this.getKey(key));
        if (!val) return null;
        try {
            const decVal = this.hasEncrypt ? this.encryption.decryptByAES(val) : val;

            const data = JSON.parse(decVal);
            const { value, expire } = data;
            if (js_is_null_or_undef(expire) || expire >= new Date().getTime()) {
                return value;
            }
            this.remove(key);
        } catch (e) {
            return null;
        }
    }

    remove(key: string) {
        this.storage.removeItem(this.getKey(key));
    }

    clear(): void {
        this.storage.clear();
    }
}

export { WebStorage};

export const js_create_storage = async({
    prefixKey = '',
    storage = localStorage,
    timeout = null,
    hasEncrypt = false
}: Options) => {
    const encryption = await use_cryptojs_module({
        key: '1F1F1F1E1E1E1D1D',
        iv: '1A1A1A1B1B1B1C1C'
    });
    return new WebStorage(storage, prefixKey, hasEncrypt, encryption, timeout);
};

const createOptions = (storage: Storage, options: Options = {}): Options => {
    return {
        // No encryption in debug mode
        hasEncrypt: false,
        storage,
        prefixKey: '',
        timeout: defaultCacheTime,
        ...options
    };
};

export const js_create_session_storage = (options: Options = {}) => {
    return js_create_storage(createOptions(sessionStorage, { ...options, prefixKey: 'session'}));
};

export const js_create_local_storage = (options: Options = {}) => {
    return js_create_storage(createOptions(localStorage, { ...options, prefixKey: 'local'}));
};
