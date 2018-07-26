/**
 * 以指定步长，为字符串添加分隔符 (如 添加千分位分隔符)
 * @param {String || Number} tar 指定需被分割的数字或字符串
 * @param {String} separator 分隔符
 * @param {Number} step 步长
 * @param {Boolean} isReverse 判断是从左或右开始计算 step
 * @return {String} 加入分隔符后的字符串
 *
 * eg appendSeparator(1234568901, '--', 3) -> '123--456--890--1'
 * eg appendSeparator(1234568901, '--', 3, true) -> '1--234--568--901'
 */

function appendSeparator(tar, separator, step, isReverse) {
  let aStr = isReverse
        ? String(tar).split('').reverse()
        : String(tar).split(''),
    aTemp = []
  for (let i = 0, l = aStr.length; i < l;) {
    aTemp.push(...aStr.slice(i, i += step))
    aTemp.push(separator)
  }
  aTemp.pop()
  return isReverse
    ? aTemp.reverse().join('')
    : aTemp.join('')
}

export default appendSeparator
