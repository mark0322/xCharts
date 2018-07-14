// 深拷贝对象
function deepClone(obj) {
    const result = {}
    for (let key of Object.keys(obj)) {
        let o = obj[key]
        if (o && typeof o === 'object') {
            result[key] = deepClone(o);
        } else {
            result[key] = o
        }
    }
    return result
}

export default deepClone
