/** 
 * 利用代理模式， 避免 对象查询 出现 undefined 的情况
 * @param {Object} 要被使用的数据对象
 * @return 用代理模式包裹的 obj 对象
 * 
 * @example
 * let o = getNoUndefined_proxy({a: 11})
 * o.a    ->  11
 * o.b    ->  Proxy {}    (非 undefined,避免进一步引用，而报错)
 * o.b.b  ->  Proxy {}    (非 undefined,避免进一步引用，而报错)
 */
function getNoUndefined_proxy(obj) {
  const handler = {
    get(target, prop) {
      target[prop] = prop in target ?
        target[prop] :
        {}
      if (typeof target[prop] === 'object') {
        return new Proxy(target[prop], handler)
      }
      return target[prop]
    }
  }

  return new Proxy(obj, handler)
}

export default getNoUndefined_proxy;