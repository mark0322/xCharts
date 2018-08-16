/** 
 * 单例模式
 * 
 * 传入的 fn 只会被调用一次
 * eg: singleton(fn)(...args)
*/
const singleton = fn => {
  let instance = null
  return (...args) => {
    return instance || (instance = fn(...args))
  }
}

export default singleton
