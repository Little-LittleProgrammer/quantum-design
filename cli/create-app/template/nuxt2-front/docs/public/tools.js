export function query_to_bind_url(data){
    const _queryData = data;
    const _querysArr = [];
    for (const i in _queryData) {
        _querysArr.push(i + '=' + _queryData[i]);
    }
    const _querysStr = _querysArr.join('&');
    window.history.replaceState(null, null, 'docs?' + _querysStr);
}