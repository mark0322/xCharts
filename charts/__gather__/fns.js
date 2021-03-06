{ // *** array ***
  function chunk(arr, size = arr.length) {
    const result = []
    for (let i = 0, l = arr.length; i < l;) {
      result.push(arr.slice(i, i += size))
    }
    return result
  }

  function difference(arr1, arr2) {
    let s1 = new Set(arr1),
      s2 = new Set(arr2)
    return [...arr1.filter(d => !s2.has(d)), ...arr2.filter(d => !s1.has(d))]
  }

  function flatten(arr) {
    return arr.reduce((a, b) => {
      Array.isArray(b) ? a.push(...b) : a.push(b)
      return a
    }, [])
  }

  function deepFlatten(arr) {
    return arr.reduce((a, v) => {
      return a.concat(Array.isArray(v) ? deepFlatten(v) : v)
    }, [])
  }

  function intersection(arr1, arr2) {
    const s2 = new Set(arr2)
    return arr1.filter(d => s2.has(d))
  }

  function matchArrayVal(arr, matchVal, iteratee) {
    (typeof iteratee === 'function') && (arr = arr.map(iteratee))
    let sum = arr.reduce((a, b) => a + b)
    return arr.map(d => d / sum * matchVal)
  }

  function sample(arr, sampleSize = 1) {
    if (sampleSize === 1) {
      return arr[random(0, arr.length, true)]
    }

    if (arr.length < sampleSize) {
      throw new Error('sampleSize > arr.length!')
    }

    const result = [],
      inputArr = JSON.parse(JSON.stringify(arr))
    while (result.length < sampleSize) {
      let i = random(0, inputArr.length, true)
      result.push(...inputArr.splice(i, 1))
    }
    return result
  }

  function zip(...args) {
    if (args.length === 0) return [];
    let result = [];
    let minLengthForTempArr = Math.min(...args.map(d => d.length));

    for (let i = 0; i < minLengthForTempArr; i++) {
        result.push(args.map(d => d[i]));
    }

    return result;
  }
}

{ // *** object ***
  function changeAttrName(obj = {}, aMatchAttr) {
    const result = deepClone(obj)
    const m = new Map(aMatchAttr)
  
    for (let attr of Object.keys(result)) {
      if (m.has(attr)) {
  
        // 新属性名
        result[m.get(attr)] = result[attr]
  
        // 删除原属性名
        delete result[attr]
      }
    }
  
    return result
  }

  function deepClone(obj) {
    const result = {}
    for (let key of Object.keys(obj)) {
        let o = obj[key]
        if (o && typeof o === 'object') {
            result[key] = deepClone(o);
        } else {
            result[key] = o
        }
    }
    return result;
  }

  function each(obj, callback) {
    for (let key of Object.keys(obj)) {
      callback(key, obj[key], obj)
    }
  }

  function extentForAttrs(obj, targetAttrs = Object.keys(obj)) {
    let array = [] 
  
    for (let attr of targetAttrs) {
      if (Array.isArray(obj[attr])) {
        array.push(...deepFlatten(obj[attr]))
      }
      if (typeof obj[attr] === 'number') {
       array.push(obj[attr])
      }
    }
  
    // 过滤非数字
    array = array.filter(d => typeof d === 'number')
  
    return [Math.min(...array), Math.max(...array)]
  }

  function getLastElementForAttrs(obj = {}, attrs = Object.keys(obj)) {
    const result = {}
  
    for (let attr of attrs) {
      if (Array.isArray(obj[attr])) {
        result[attr] = obj[attr].slice(-1)[0]
      }
    }
  
    return result
  }

  function isEqual(obj1, obj2) {
    let m1 = new Map(Object.entries(obj1)),
      m2 = new Map(Object.entries(obj2))
    if (m1.size !== m2.size) return false
    for (let key of m1.keys()) {
      if (!m2.has(key)) return false
      if (typeof m1.get(key) === 'object') {
        if(!isEqual(m1.get(key), m2.get(key))) return false
        continue
      }
      if (m1.get(key) !== m2.get(key)) return false
    }
    return true
  }

}

{ // *** function ***
  function delay(func, wait, ...args) {
    if (typeof func != 'function') {
      throw new TypeError('第一个参数必须是函数！');
    }
    return setTimeout(function() {
      func(...args)
    }, wait)
  }

  function workFixTime(func, time = 1) {
    let i = -1
    return function() {
      if (++i < time) return func(...arguments)
    }
  }

  function throttle(fn, interval = 500) {
    let timer // 定时器
    let firstTime = true // 是否是第一次调用
    return (...args) => {
      if (firstTime) { // 如果是第一次调用，不需延迟执行
        fn(...args)
        firstTime = false
        return false
      }
      if (timer) { // 如果定时器还在，说明前一次延迟执行还没有完成
        return false
      }
      timer = setTimeout(() => { // 延迟一段时间执行
        clearTimeout(timer)
        timer = null
        fn(...args)
      }, interval)
    }
  }
}

{ // *** number ***
  function random(start = 0, end = 1, isInteger) {
    (arguments.length == 1) && (end = start, start = 0)
    const interval = end - start
    return isInteger
      ? (start + interval * Math.random()) | 0
      : start + interval * Math.random()
  }
  
  function round(num, ndigits = 0) {
    return Math.round(num * 10 ** ndigits) / (10 ** ndigits)
  }

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
}

{ // *** string ***
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
  
  function trim(s) {
    return s.replace(/^\s+ | \s+$/g, '')
  }
}



function parseStamp2Day(d) {
  let month = new Date(d).getMonth() + 1,
    day = new Date(d).getDate()
  month < 10 && (month = '0' + month)
  day < 10 && (day = '0' + day)
  return month + '-' + day
}
function parseStamp2DayIncludeYear(d) {
  let month = new Date(d).getMonth() + 1,
    day = new Date(d).getDate(),
    year = new Date(d).getFullYear()
  month < 10 && (month = '0' + month)
  day < 10 && (day = '0' + day)
  return year + '-' + month + '-' + day
}
const log = console.log




/** 
 * 创建tooltip的最外层 div wrap
 * 
 * @private
 * @return div-tooltipWrap 的DOM对象
*/
const initTooltipWrap = function() {
  // tooltip 位于 body 子级
  const body = document.querySelector('body')

  const tooltipWrap = document.createElement('div')
  tooltipWrap.classList.add('stiCharts-tooltip-wrap')
  tooltipWrap.style.cssText = `
    background:rgba(0,0,0,0.7);
    border-radius: 10px;
    padding:10px 15px;
    position:fixed;
    display:none;
    z-index:9999;
    color:white;`

  body.appendChild(tooltipWrap)
  return tooltipWrap
}

/** 
 * 单例模式 - 模板
*/
const tooltip_wrap = (function(fn) {
  let instance = null
  return function() {
    return instance || (instance = fn(...arguments))
  }
})(initTooltipWrap)
