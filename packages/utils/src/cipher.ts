
interface IOption {
    mode: any,
    padding: any,
    iv: any
}

export interface EncryptionParams {
    key: string;
    iv: string;
}

class Encryption {
    private key;
    private iv;
    private encryptInstance;

    constructor(opt: EncryptionParams = { key: '', iv: '' }, encryptInstance: any) {
        const { key, iv } = opt;
        this.key = encryptInstance.enc.Utf8.parse(key);
        this.iv = encryptInstance.enc.Utf8.parse(iv);
        this.encryptInstance = encryptInstance;
    }

    get getOptions():IOption {
        return {
            mode: this.encryptInstance.mode.ECB,
            padding: this.encryptInstance.pad.Pkcs7,
            iv: this.iv
        };
    }

    encryptByAES(cipherText: string) {
        return this.encryptInstance.AES.encrypt(cipherText, this.key, this.getOptions).toString();
    }

    decryptByAES(cipherText: string) {
        return this.encryptInstance.AES.decrypt(cipherText, this.key, this.getOptions).toString(this.encryptInstance.enc.Utf8);
    }

    encryptByMd5(cipherText: string) {
        return this.encryptInstance.MD5(cipherText);
    }

    encryptBySha256(cipherText: string) {
        return this.encryptInstance.SHA256(cipherText);
    }
}

export async function use_cryptojs_module(opt: EncryptionParams = { key: '', iv: '' }) {
    const cryptoJS = await import('crypto-js');
    // 在这里可以使用 cryptoJS 对象进行操作
    // 例如，cryptoJS.SHA256()、cryptoJS.AES.encrypt() 等
    // ...
    const _enc = new Encryption(opt, cryptoJS);
    return _enc;
}
