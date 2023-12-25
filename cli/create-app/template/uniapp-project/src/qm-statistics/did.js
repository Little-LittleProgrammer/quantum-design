import device from '@system.device';
import MD5 from 'md5';

class DID {
    constructor() {
        this.id = 'unkown';
        this.seted = false;
    }
    getRdw(min) {
        let str = '';
        const range = min;
        const arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

        for (let i = 0; i < range; i++) {
            str += arr[Math.round(Math.random() * (arr.length - 1))];
        }
        return str;
    }
    setDid() {
        this.isSetting = true;
        return new Promise((resolve) => {
            if (this.seted === true) {
                resolve(this.id);
            }
            device.getUserId({
                success(data) {
                    // // console.log(`[DID]`,data,'下一行是随机写入id，上线记得注释掉')
                    // _this.id = did.getRdw(12)+"_rdm"
                    // // console.log(`[DID]`,did.id)
                    this.id = data.userId;

                    // 写死id，这行上线前必须注掉↓，务必仔细检查
                    // _this.id = '36cecec57756f3d11'
                    // 测试用，随机生成一个distinctid，上线要注释掉。
                    // _this.id = did.getRdw(12)+"_rdm"
                    this.did = MD5(this.id);
                },
                fail(data, code) {
                    // console.log(`[DID] handling fail, code = ${code}`);
                    // 没有拿到 androidid的情况，随机生成一个distinctid。
                    this.id = `${this.getRdw(12)}_rdm`;
                    this.did = `${MD5(this.id)}_rdm`;
                },
                complete() {
                    // console.log('[DID cpmolete]', this.id);
                    this.seted = true;
                    this.isSetting = false;
                    resolve(this.id);
                }
            });
        });
    }
    getDid() {
        return new Promise((resolve) => {
            if (this.seted === true) {
                resolve(this.id);
            } else {
                // console.log('DID else');
                return this.setDid().then((data) => {
                    resolve(data);
                });
            }
        });
    }

    init() {
        this.setDid();
    }
}

export default new DID();
