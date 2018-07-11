/**
 * 节流函数
 * @param {Function} fn
 * @param {Number} interval
 */

function throttle(fn, interval = 500) {
  let timer // 定时器
  let firstTime = true // 是否是第一次调用
  return (...args) => {
    if (firstTime) { // 如果是第一次调用，不需延迟执行
      fn(...args)
      firstTime = false
      return false
    }
    if (timer) { // 如果定时器还在，说明前一次延迟执行还没有完成
      return false
    }
    timer = setTimeout(() => { // 延迟一段时间执行
      clearTimeout(timer)
      timer = null
      fn(...args)
    }, interval)
  }
}
export default throttle