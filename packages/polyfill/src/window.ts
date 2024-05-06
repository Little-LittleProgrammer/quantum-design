import { checkAndAdd } from './utils';
type ResolveType<T = any> = (resolve_success_value: T) => any
type RejectType = (reject_fail_value: any) => any

type ExecutorType<T> = (resolve: ResolveType<T>, reject: RejectType) => any

enum PromiseState {
    Pending,
    Fulfilled,
    Rejected
}

class Promise<T = any> {
    status:PromiseState= PromiseState.Pending
    value: T | null= null
    reason= null
    onFulfilledCallback: Fn[]= []
    onRejectedCallback: Fn[]= []
    resolve: ResolveType<T>
    reject: RejectType
    constructor(executor: ExecutorType<T>) {
        this.resolve = (value: T | PromiseLike<T>) => {
            if (this.status === PromiseState.Pending) {
                this.status = PromiseState.Fulfilled;
                this.value = value as T;
                this.onFulfilledCallback.forEach((fn: any) => {
                    fn(this.value);
                });
            }
        };
        this.reject = (reason: any) => {
            if (this.status === PromiseState.Pending) {
                this.status = PromiseState.Rejected;
                this.reason = reason;
                this.onRejectedCallback.forEach((fn: any) => {
                    fn(this.reason);
                });
            }
        };
        try {
            executor(this.resolve, this.reject);
        } catch (error: any) {
            this.status = PromiseState.Rejected;
            // 失败则直接执行reject函数
            this.reject(error.toString());
            throw error;
        }
    }
    then<TResult1 = T, TResult2 = never>(resolveInThen: ResolveType, rejectInThen: RejectType) {
        return new Promise((resolve, reject) => {
            const fulfilled = (value: T) => {
                try {
                    if (typeof resolveInThen === 'function') {
                        const result = resolveInThen(value);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result as TResult1);
                        }
                    } else {
                        resolve(value as unknown as TResult1);
                    }
                } catch (error) {
                    reject(error);
                }
            };

            const rejected = (reason: any) => {
                try {
                    if (typeof rejectInThen === 'function') {
                        const result = rejectInThen(reason);
                        if (result instanceof Promise) {
                            result.then(resolve, reject);
                        } else {
                            resolve(result as TResult2);
                        }
                    } else {
                        reject(reason);
                    }
                } catch (error) {
                    reject(error);
                }
            };
            let result;
            if (this.status === PromiseState.Fulfilled) {
                result = resolveInThen(this.value);
                resolve(result);
            }
            if (this.status === PromiseState.Rejected) {
                result = rejectInThen(this.reason);
                reject(result);
            }
            if (this.status === PromiseState.Pending) {
                this.onFulfilledCallback.push(fulfilled);
                this.onRejectedCallback.push(rejected);
            }
        });
    }
    cache(reject: RejectType): Promise<T> {
        return this.then(null, reject);
    }
    finily(fn: Fn): Promise<T> {
        return this.then(
            value => Promise.resolve(fn()).then(() => value),
            reason => Promise.resolve(fn()).then(() => { throw reason; })
        );
    }
    static race<T>(promises: Array<Promise<T>>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            if (!Array.isArray(promises)) {
                return reject(new TypeError('Argument is not iterable'));
            }
            for (const promise of promises) {
                promise.then(resolve, reject);
            }
        });
    }

    // 添加静态resolve方法
    static resolve<T>(value: T | PromiseLike<T>): Promise<T> {
        return new Promise<T>((resolve) => {
            resolve(value as T);
        });
    }

    // 添加静态reject方法
    static reject<T = never>(reason?: any): Promise<T> {
        return new Promise<T>((_, reject) => {
            reject(reason);
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
