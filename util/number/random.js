/**
 * eg: random(num)  -> 随机生成 0~num 间的一个
 * eg: random(n1, n2) -> 随机生成 n1~n2 间的一个整数
 * eg: random(n1, n2, true) -> 随机生成 n1~n2 间的一个浮点数
 */

function random(start = 0, end = 1, isInteger) {
  (arguments.length == 1) && (end = start, start = 0)
  const interval = end - start
  return isInteger
    ? (start + interval * Math.random()) | 0
    : start + interval * Math.random()
}

export default random
