/**
 * 以指定步长，为字符串添加分隔符
 * @param {String || Number} val 指定需被分割的数字或字符串
 * @param {String} [separator = ','] 分隔符
 * @param {Number} [step = 3] 步长
 * @param {Boolean} [reverse = true] 判断是从左或右开始计算 step
 * @return {String}
 * 
 * 注： 默认为数字加千分位分隔符
 * eg: appendSeparator(-123456789.3333) -> "-123,456,789.3333"
 * eg: appendSeparator(1234567890)  ->  "1,234,567,890"
 *
 * 给字符串加分隔符：
 * eg: appendSeparator('abcedfg', ' | ', 2, false) -> "ab | ce | df | g"
 */
function appendSeparator(val, separator = ',', step = 3, reverse = true) {
  let sVal = String(val)

  let numSign = '' // 数字的 负数符号
  let numDecimalPart = '' // 数字的 小数位
  if (typeof val === 'number') {
    if (val < 0) { // 判断为负数
      numSign = '-'
      sVal = sVal.split('-')[1]
    }

    if (sVal.split('.')[1]) { // 判断为小数
      numDecimalPart = `.${sVal.split('.')[1]}`
      sVal = sVal.split('.')[0]
    }
  }

  let aVal = reverse
    ? sVal.split('').reverse()
    : sVal.split('')

  let aTemp = []
  for (let i = 0, l = aVal.length; i < l;) {
    aTemp.push(...aVal.slice(i, (i += step)))
    aTemp.push(separator)
  }
  aTemp.pop()

  let tempResult = reverse
    ? aTemp.reverse().join('')
    : aTemp.join('')

  return numSign + tempResult + numDecimalPart
}

export default appendSeparator