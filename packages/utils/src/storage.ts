import { defaultCacheTime } from '@wuefront/shared/enums';
import { AesEncryption } from './cipher';
import { isNullOrUnDef } from './is';

interface IStorageParams {
    prefixKey: string;
    storage: Storage;
    timeout?: number | null;
    hasEncrypt: boolean
}

type Options = Partial<IStorageParams>;

class WebStorage {
    storage: Storage;
    hasEncrypt: boolean;
    encryption: AesEncryption;
    prefixKey: string;
    timeout:number | null

    constructor(storage:Storage, prefixKey:string, hasEncrypt: boolean, encryption:AesEncryption, timeout:number | null) {
        this.storage = storage;
        this.prefixKey = prefixKey;
        this.hasEncrypt = hasEncrypt;
        this.encryption = encryption;
        this.timeout = timeout
    }

    getKey(key: string) {
        return `${this.prefixKey}_${key}`.toUpperCase();
    }

    set(key: string, value: any, expire: number | null = this.timeout) {
        const stringData = JSON.stringify({
            value,
            time: Date.now(),
            expire: !isNullOrUnDef(expire) ? new Date().getTime() + expire * 1000 : null
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
            if (isNullOrUnDef(expire) || expire >= new Date().getTime()) {
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
};

export { WebStorage}

export const createStorage = ({
    prefixKey = '',
    storage = localStorage,
    timeout = null,
    hasEncrypt = false
}: Options) => {
    const encryption = new AesEncryption();
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

export const createSessionStorage = (options: Options = {}) => {
    return createStorage(createOptions(sessionStorage, { ...options, prefixKey: 'session'}));
};

export const createLocalStorage = (options: Options = {}) => {
    return createStorage(createOptions(localStorage, { ...options, prefixKey: 'local'}));
};
