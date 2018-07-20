/** 
 * 设计模式 - 观察者模式
*/

export default {
  emitList: {},

  listen(key, fn) {
    if (!this.emitList[key]) this.emitList[key] = []

    this.emitList[key].push(fn)
  },

  trigger(key, ...args) {
    const fns = this.emitList[key]
    if (!fns || fns.length === 0) return false

    for (let fn of fns) {
      fn(...args)
    }
  },

  remove(key, fn) {
    const fns = this.emitList[key]

    if (!fns) return false

    // 不指定 fn 时， 清除整个 fns 数组
    if (!fn) {
      fns && (fns.length = 0)
    } else {
      for (let l = fns.length - 1; l >= 0; l--) {
        const _fn = fns[l]
        if (_fn === fn) fns.splice(l, 1)
      }
    }
  }
}