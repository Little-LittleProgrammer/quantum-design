import { checkAndAdd } from './utils';

function bind(oThis: any) {
    if (typeof this !== 'function') {
        // 与 ECMAScript 5 最接近的 // 内部 IsCallable 函数
        throw new TypeError(
            'Function.prototype.bind - what is trying ' +
				'to be bound is not callable'
        );
    }
    const aArgs = Array.prototype.slice.call(arguments, 1);
    const fTpBind = this;
    const fNop = function() {};
    const fBound = function() {
        return fTpBind.apply(
            this instanceof fNop && oThis ? this : oThis,
            aArgs.concat(Array.prototype.slice.call(arguments))
        );
    };
    fNop.prototype = this.prototype;
    fBound.prototype = new fNop();
    return fBound;
}
checkAndAdd(bind, 'Function.prototype')
