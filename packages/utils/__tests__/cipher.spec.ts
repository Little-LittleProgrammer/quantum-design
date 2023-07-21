import { describe, it, expect } from 'vitest';
import { Encryption } from '../src/cipher';

describe('cipher.ts', () => {
    it('加密解密正常', () => {
        const cipherInstance = new Encryption({
            key: '1F1F1F1E1E1E1D1D',
            iv: '1A1A1A1B1B1B1C1C'
        });
        const _testStr = '123456789';
        expect(cipherInstance.decryptByAES(cipherInstance.encryptByAES(_testStr))).equal(_testStr);
        expect(cipherInstance.encryptByMd5(_testStr).toString() === _testStr).toBeFalsy();
    });
});
