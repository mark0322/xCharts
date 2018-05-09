/**
 * 模仿 python 的range(), 自动生成数组
 * @return {Array}
 * eg range(10) -> [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
 * eg range(10, 30, 3) -> [10, 13, 16, 19, 22, 25, 28]
*/
function range(start, stop, step = 1) {
  (arguments.length == 1) && (stop = start, start = 0)

  let i = -1,
    n = Math.max(0, Math.ceil((stop - start) / step)),
    range = new Array(n)

  while (++i < n) {
    range[i] = start + step * i
  }

  return range
}

export default range
