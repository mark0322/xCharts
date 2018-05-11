/**
 * eg: random(num)  -> 随机生成 0~num 间的一个整数
 * eg: random(n1, n2) -> 随机生成 n1~n2 间的一个整数
 * eg: random(n1, n2, true) -> 随机生成 n1~n2 间的一个浮点数
 */

function random(start = 0, end = 1, isFloat = false) {
  (arguments.length == 1) && (end = start, start = 0)
  const interval = end - start
  return isFloat
    ? start + interval * Math.random()
    : (start + interval * Math.random()) | 0
}

export default random
