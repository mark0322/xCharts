/**
 * 相当于 lodash 的 _.before + _.once
 * @param {Function} func The function to restrict.
 * @param {Number} time 可选参，指定func的执行次数 @default 1
 * @return {Function} 指定了可执行次数的函数
 * 
 * @example
 * const show = console.log
 * let fn = workFixTime(show, 2)
 * fn('aaa') -> 'aaa'
 * fn('bbb') -> 'bbb'
 * fn('ccc') -> nothing
 */
function workFixTime(func, time = 1) {
  if (typeof func !== 'function') {
    throw new TypeError('第一个参数必须是函数！')
  }
  let i = -1
  return function() {
    if (++i < time) return func(...arguments)
  }
}

export default workFixTime
