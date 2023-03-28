import { isArray, quick_sort } from '@wuefront/utils';

/**
 *
 * @param nums [1,2,3,4,5,7,8,9]
 * @returns '1-5, 7-9'
 */
export function format_nums(nums?: number[]):string {
    if (!nums || nums.length === 0 || !isArray(nums)) {
        return '';
    }
    nums = [...new Set(quick_sort(nums))];
    let _index = 0; const _n = nums.length;
    const _res:string[] = []; let _resIndex = 0;
    for (let i = 0; i < _n; i++) {
        const _diff = nums[i] - nums[_index];
        if (_diff === i - _index) {
            if (!_res[_resIndex] && _res[_resIndex] !== '') {
                _res.push('');
            }
        } else {
            if (_index === i - 1) {
                _res[_resIndex] = nums[_index] + '';
            } else {
                _res[_resIndex] = nums[_index] + '-' + nums[i - 1];
            }
            _index = i;
            _resIndex++;
        }
        if (i === _n - 1) {
            if (_index === i) {
                _res[_resIndex] = nums[i] + '';
            } else {
                _res[_resIndex] = nums[_index] + '-' + nums[i];
            }
        }
    }
    return _res.join(',');
}

/**
 *
 * @param str '1-5, 7-8'
 * @returns [1,2,3,4,5,7.8]
 */
export function format_str(str?: string): number[] {
    if (!str) {
        return [];
    }
    if (isArray(str)) {
        return str;
    }
    const _cacheList = str.split(',').filter(num => num);
    const _usedList: number[] = [];
    for (const str of _cacheList) {
        if (str.includes('-')) {
            const _cacheList = str.split('-');
            const _start = parseInt(_cacheList[0]);
            const _end = parseInt(_cacheList[1]);
            for (let i = _start; i <= _end; i++) {
                _usedList.push(i);
            }
        } else {
            _usedList.push(parseInt(str));
        }
    }
    return _usedList;
}
/**
 *
 * @param arr1 需要去除相同的, unused
 * @param arr2 需要将相同的添加. used
 * @param arr3 对比数组
 * @returns {used, unused}
 */
export function delete_same(arr1?: number[], arr2?: number[], arr3?: number[]) { // 删除相同的数据
    if (!arr1 || !arr2 || !arr3) {
        return null;
    }
    const _cache:Record<number, number> = {};
    arr1.forEach((al) => { _cache[al] = al; });
    arr3.forEach((bl) => {
        delete _cache[bl];
        arr2.push(bl);
    });
    return {
        used: quick_sort(arr2),
        unused: Object.keys(_cache).filter(e => e != '').map(e => parseInt(e))
    };
}
