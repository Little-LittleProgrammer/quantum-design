import { describe, it, expect } from 'vitest';
import { Encryption } from '../src/cipher';

describe('cipher.ts', () => {
    it('加密解密正常', () => {
        const cipherInstance = new Encryption({
            key: '1F1F1F1E1E1E1D1D',
            iv: '1A1A1A1B1B1B1C1C',
        });
        const _testStr = '123456789';
        expect(cipherInstance.decryptByAES(cipherInstance.encryptByAES(_testStr))).equal(_testStr);
        expect(cipherInstance.encryptByMd5(_testStr).toString() === _testStr).toBeFalsy();
        expect(cipherInstance.encryptBySha256(_testStr).toString() === _testStr).toBeFalsy();
    });

    describe('Encryption 类', () => {
        it('应该能够使用默认参数创建实例', () => {
            const cipher = new Encryption();
            expect(cipher).toBeInstanceOf(Encryption);
        });

        it('应该能够加密和解密中文字符', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text = '这是中文测试';
            const encrypted = cipher.encryptByAES(text);
            const decrypted = cipher.decryptByAES(encrypted);
            expect(decrypted).toBe(text);
        });

        it('应该能够加密和解密特殊字符', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text = '!@#$%^&*()_+-=[]{}|;:\'",.<>?/~`';
            const encrypted = cipher.encryptByAES(text);
            const decrypted = cipher.decryptByAES(encrypted);
            expect(decrypted).toBe(text);
        });

        it('应该能够加密空字符串', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text = '';
            const encrypted = cipher.encryptByAES(text);
            const decrypted = cipher.decryptByAES(encrypted);
            expect(decrypted).toBe(text);
        });

        it('应该能够加密长文本', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text = 'a'.repeat(1000);
            const encrypted = cipher.encryptByAES(text);
            const decrypted = cipher.decryptByAES(encrypted);
            expect(decrypted).toBe(text);
        });

        it('MD5 加密应该产生固定长度的哈希', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text1 = 'test';
            const text2 = 'a very long text that will be hashed';
            const hash1 = cipher.encryptByMd5(text1).toString();
            const hash2 = cipher.encryptByMd5(text2).toString();
            expect(hash1.length).toBe(hash2.length);
        });

        it('相同的文本应该产生相同的 MD5 哈希', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text = 'test123';
            const hash1 = cipher.encryptByMd5(text).toString();
            const hash2 = cipher.encryptByMd5(text).toString();
            expect(hash1).toBe(hash2);
        });

        it('不同的文本应该产生不同的 MD5 哈希', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text1 = 'test123';
            const text2 = 'test124';
            const hash1 = cipher.encryptByMd5(text1).toString();
            const hash2 = cipher.encryptByMd5(text2).toString();
            expect(hash1).not.toBe(hash2);
        });

        it('SHA256 加密应该产生固定长度的哈希', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text1 = 'test';
            const text2 = 'a very long text that will be hashed';
            const hash1 = cipher.encryptBySha256(text1).toString();
            const hash2 = cipher.encryptBySha256(text2).toString();
            expect(hash1.length).toBe(hash2.length);
            expect(hash1.length).toBeGreaterThan(0);
        });

        it('相同的文本应该产生相同的 SHA256 哈希', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text = 'test123';
            const hash1 = cipher.encryptBySha256(text).toString();
            const hash2 = cipher.encryptBySha256(text).toString();
            expect(hash1).toBe(hash2);
        });

        it('不同的文本应该产生不同的 SHA256 哈希', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text1 = 'test123';
            const text2 = 'test124';
            const hash1 = cipher.encryptBySha256(text1).toString();
            const hash2 = cipher.encryptBySha256(text2).toString();
            expect(hash1).not.toBe(hash2);
        });

        it('getOptions 应该返回正确的配置', () => {
            const cipher = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const options = cipher.getOptions;
            expect(options).toHaveProperty('mode');
            expect(options).toHaveProperty('padding');
            expect(options).toHaveProperty('iv');
        });

        it('不同的密钥应该产生不同的加密结果', () => {
            const cipher1 = new Encryption({
                key: '1F1F1F1E1E1E1D1D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const cipher2 = new Encryption({
                key: '2F2F2F2E2E2E2D2D',
                iv: '1A1A1A1B1B1B1C1C',
            });
            const text = 'test123';
            const encrypted1 = cipher1.encryptByAES(text);
            const encrypted2 = cipher2.encryptByAES(text);
            expect(encrypted1).not.toBe(encrypted2);
        });
    });
});
