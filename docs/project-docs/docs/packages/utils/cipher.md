# cipher
加密处理, 如需对重要的信息加密处理, 则可调用此方法

## 密钥配置

目录: [packages/shared/enums/cipherEnum.ts](packages/shared/enums/cipherEnum.ts)

:::tip
密钥和密钥偏移量必须是十六进制字符串
:::

## 方法

| 方法名    |                                 方法                          | 说明              |
| -------- | ------------------------------------------------------------ | ---------------- |
| encryptByAES      | `(cipherText: string) => CryptoJS.lib.CipherParams` | 加密     |
| decryptByAES   |  `(cipherText: string) => CryptoJS.lib.CipherParams`   | 解密 |
| encryptByMd5   |  `(cipherText: string) => CryptoJS.lib.CipherParams`   | md5加密 |
| encryptBySha256   |  `(cipherText: string) => CryptoJS.lib.CipherParams`   | md5加密 |

## 使用方法

```js
import { AesEncryption } from './cipher';
...
const encryption = new AesEncryption()
let a = encryption.encryptByAES('123345')
let b = encryption.decryptByAES(a)

let md5 = encryption.encryptByMd5('12345').toString()
let sha256 = encryption.encryptBySha256('12345').toString()
...
```