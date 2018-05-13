/**
 * 对数组进行四舍五入 (默认四舍五入取整)
 * @param num 要四舍五入的数字
 * @param ndigits 要保留的小数位数
 */
function round(num, ndigits = 0) {
  return Math.round(num * 10 ** ndigits) / (10 ** ndigits)
}

export default round
