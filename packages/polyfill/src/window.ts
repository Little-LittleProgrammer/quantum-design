import {isPromise} from '@quantum-design/utils';
import { checkAndAdd } from './utils';
type ResolveType<T = any> = (resolve_success_value: T) => any
type RejectType = (reject_fail_value: any) => any

type ExecutorType<T> = (resolve: ResolveType<T>, reject: RejectType) => any
class Promise<T = any> {
    status= 'pending'
    value= null
    reason= null
    onFulfilledCallback: Fn[]= []
    onRejectedCallback: Fn[]= []
    resolve: ResolveType<T>
    reject: RejectType
    constructor(executor: ExecutorType<T>) {
        this.resolve = (value: any) => {
            if (this.status === 'pending') {
                this.status = 'fulfilled';
                this.value = value;
                this.onFulfilledCallback.forEach((fn: any) => {
                    fn(this.value);
                });
            }
        };
        this.reject = (reason: any) => {
            if (this.status === 'pending') {
                this.status = 'rejected';
                this.reason = reason;
                this.onRejectedCallback.forEach((fn: any) => {
                    fn(this.reason);
                });
            }
        };
        try {
            executor(this.resolve, this.reject);
        } catch (error: any) {
            this.status = 'pending';
            // 失败则直接执行reject函数
            this.reject(error.toString());
            throw error;
        }
    }
    then(resolveInThen: ResolveType, rejectInThen: RejectType) {
        return new Promise((resolve, reject) => {
            let result;
            if (this.status === 'fulfilled') {
                result = resolveInThen(this.value);
                resolve(result);
            }
            if (this.status === 'rejected') {
                result = rejectInThen(this.reason);
                reject(result);
            }
            if (this.status === 'pending') {
                this.onFulfilledCallback.push(() => {
                    result = resolveInThen(this.value);
                    if (isPromise(result)) { // 是异步的Promise对象
                        result.then((resolveSuccess) => {
                            resolve(resolveSuccess);
                        }, (rejectSucess) => {
                            reject(rejectSucess);
                        });
                    } else {
                        resolve(result);// 如果是普通的数据,不是异步的Promise对象
                    }
                });
                this.onRejectedCallback.push(() => {
                    result = rejectInThen(this.reason);
                    reject(result);
                });
            }
        });
    }
    static all<T extends Promise[]>(promiseList: T) {
        return new Promise((resolve, reject) => {
            const n = promiseList.length;
            const resolveArray = new Array(n);
            promiseList.reduce((_resultList, curr, index) => {
                curr.then(resolveValue => {
                    prosessData(resolveValue, index);
                }, (rejectValue) => {
                    reject(rejectValue);// 任何一个promise失败,都执行reject
                    return;
                });
            }, []);

            function prosessData(resolveData: any, index: number) {
                resolveArray[index] = resolveData;
                if (n - 1 === index) {
                    resolve(resolveArray);
                }
            }
        });
    }
}

checkAndAdd(Promise);
