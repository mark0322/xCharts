/**
 * delay func 函数的执行
 * 即 lodash 的 _.delay
 * @param {Function} func The function to delay.
 * @param {Number} time  The number of milliseconds to delay invocation.
 * @param {arguments} 可选参
 * @return timer id
 */

function delay(func, wait, ...args) {
  if (typeof func != 'function') {
    throw new TypeError('第一个参数必须是函数！');
  }
  return setTimeout(function() {
    func.apply(null, args)
  }, wait)
}