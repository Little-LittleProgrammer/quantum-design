export function create(o: any) {
    function F() {}
    F.prototype = o;
    return new F();
}
