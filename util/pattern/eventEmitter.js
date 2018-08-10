/**
 * 观察者模式
 * 
 * 用法：
 * 将 eventEmitter 赋值给 window.eventEmitter 以全局调用
 * 具体用法与 node 的 events.EventEmitter() 类似
 */
const eventEmitter = {
  emitList: {},

  // 监听指定 key， 当该 key 被 emit 触发时
  // callback 中 获得 emit 发出的数据
  on(key, callback) {
    if (!this.emitList[key]) {
      this.emitList[key] = []
    }
    this.emitList[key].push(callback)
  },

  // 向所有监听了 指定 key 的 on 函数
  // 发送数据 data
  emit(key, data) {
    const callbacks = this.emitList[key]

    if (!callbacks || callbacks.length === 0) {
      return false
    }

    for (let callback of callbacks) {
      callback(data)
    }
  },

  // 移除 监听 key
  // 或 移除 指定 key 的 callback
  remove(key, callback) {
    let callbacks = this.emitList[key]

    if (!callbacks) return false

    if (!callback) {
      // 未指定 callback 时，
      // 移除 emitList[key] 中所有的 callback
      callbacks.length = 0
    } else {
      // 指定 callback 时，
      // 移除 emitList[key] 中指定的 callback
      for (let l = callbacks.length - 1; l >= 0; l--) {
        const _callback = callbacks[l]
        if (_callback === callback) {
          callbacks.splice(l, 1)
        }
      }
    }
  }
}

export default eventEmitter