/**
 * 模仿 lodash 的 _.before + _.once
 * @param {Function} func The function to restrict.
 * @param {Number} time 可选参，指定func的执行次数 @default 1
 *
 * eg
 * const show = n => console.log(n)
 * let fn = workFixTime(show, 2)
 * fn('aaa') -> 'aaa'
 * fn('bbb') -> 'bbb'
 * fn('ccc') -> nothing
 */
function workFixTime(func, time = 1) {
  let i = -1
  return function() {
    if (++i < time) return func(...arguments)
  }
}

export default workFixTime
