import round from './round'

/** 
 * 有三种模式，为数字加上单位 (
 * 
 * 模式1: 万 / 亿    
 * eg: format('chinese', 2)(21312) -> '2.13万'
 *
 * 模式2: 千 / 百万 / 十亿
 * eg: format('chinese', 2)(21312, true) -> '21.31千'
 *
 * 模式3: K / M / B   (注：英文单位，分别代表： 千 / 百万 / 十亿)
 * eg: format('english', 2)(21312) -> '21.31K'
 */
function format(language = 'chinese', ndigits = 1) {
  const processVal = (val, units, step = 3) => {
    if (typeof val !== 'number') {
      throw new Error('val 必须是数字！')
    }

    let result = round(val, ndigits)

    // 分别获取 整数部分 ； 小数部分
    const [val_integer, val_decimal] = String(val).split('.')

    const len = val_integer.length,
      unitsIndex = (len - 1) / step | 0,
      unit = units[unitsIndex]

    if (unit) {
      const tempResult = val_integer / (10 ** (step * unitsIndex))

      result = round(tempResult, ndigits) + unit
    }

    return result
  }

  const funcs = {
    chinese(val, likeEnglish) {
      let units = [],
        step = 3

      if (likeEnglish) {
        units = ['', '千', '百万', '十亿', '十兆']
      } else {
        units = ['', '万', '亿', '兆']
        step = 4
      }
      return processVal(val, units, step)
    },
    english(val) {
      //K 千， M 百万， G 十亿, T 十兆
      const units = ['', 'K', 'M', 'G', 'T']
      return processVal(val, units)
    }
  }

  return funcs[language]
}

export default format