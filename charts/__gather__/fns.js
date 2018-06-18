{ // *** array ***
  function chunk(arr, size = arr.length) {
    const result = []
    for (let i = 0, l = arr.length; i < l;) {
      result.push(arr.slice(i, i += size))
    }
    return result
  }

  function compactArray(arr, callback = d => d) {
    const is = Object.is
    arr = arr.reduce((a, b) => {
      b = callback(b)
      const isPassVal = !(is(b, undefined) || is(b, null) || is(b, NaN) || is(b, ''))
      isPassVal && a.push(b)
      return a
    }, [])
    if (arr.length == 0) throw new Error('输入参数有误！')
    return arr
  }

  function countOccurrences(arr, val) {
    return arr.reduce((a, b) => {
      return b === val ? a + 1 : a
    }, 0)
  }

  function difference(arr1, arr2) {
    let s1 = new Set(arr1),
      s2 = new Set(arr2)
    return [...arr1.filter(d => !s2.has(d)), ...arr2.filter(d => !s1.has(d))]
  }

  function flatArray(arr) {
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

  function maxArray(arr, callback = d => d) {
    try {
      arr = compactArray(...arguments)
    } catch (e) {
      throw new Error('输入参数有误！')
    }
    return Math.max.apply(null, arr)
  }

  function minArray(arr, iteratee = d => d) {
    try {
      arr = compactArray(...arguments)
    } catch (e) {
      throw new Error('输入参数有误！')
    }
    return Math.min.apply(null, arr)
  }

  function mutateAttrNameForObjOfArray(arr, aMatchAttr) {
    arr.forEach(d => mutateAttrNameForObj(d, aMatchAttr))
  }

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

  function sumArray(arr, iteratee = d => d) {
    try {
      arr = compactArray(...arguments)
    } catch (e) {
      throw new Error('输入参数有误！')
    }
    return arr.reduce((a, b) => a + b)
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

  function union(arr1, arr2) {
    return [...new Set([...arr1, ...arr2])]
  }

  function zip() {
    if (arguments.length === 0) return []
    let result = [],
      tempArr = [...arguments],
      minLengthForTempArr = Math.min.apply(null, tempArr.map(d => d.length))
  
    for (let i = 0; i < minLengthForTempArr; i++) {
      result.push(tempArr.map(d => d[i]))
    }
  
    return result
  }
}

{ // *** object ***
  function each(obj, callback) {
    for (let key of Object.keys(obj)) {
      callback.call(null, key, obj[key], obj)
    }
  }

  function getLastElementForArrsOfObj(obj, targetAttrs = Object.keys(obj)) {
    let result = {}
    for (let attr of targetAttrs) {
      if (Array.isArray(obj[attr])) {
        result[attr] = obj[attr].slice(-1)[0]
      }
    }
    return result
  }

  function getMaxForArrsOfObj(obj, targetAttrs = Object.keys(obj)) {
    let tempArr = []
    for (let attr of targetAttrs) {
      if (Array.isArray(obj[attr])) {
        tempArr.push(...deepFlatten(obj[attr]))
      }
    }
    return Math.max.apply(null, tempArr)
  }

  function getMinForArrsOfObj(obj, targetAttrs = Object.keys(obj)) {
    let tempArr = []
    for (let attr of targetAttrs) {
      if (Array.isArray(obj[attr])) {
        tempArr.push(...deepFlatten(obj[attr]))
      }
    }
    return Math.min.apply(null, tempArr)
  }

  function mutateAttrNameForObj(obj, aMatchAttr) {
    let m = new Map(aMatchAttr)
    for (let attr of Object.keys(obj)) {
      if (m.has(attr)) {
        obj[m.get(attr)] = obj[attr]
        delete obj[attr]
      }
    }
  }
}

{ // *** function ***
  function delay(func, wait, ...args) {
    if (typeof func != 'function') {
      throw new TypeError('第一个参数必须是函数！');
    }
    return setTimeout(function() {
      func.apply(null, args)
    }, wait)
  }

  function workFixTime(func, time = 1) {
    let i = -1
    return function() {
      if (++i < time) return func(...arguments)
    }
  }

  function throttle(fn, interval) {
    let __self = fn // 保存需要被延迟执行的函数引用
    let timer // 定时器
    let firstTime = true // 是否是第一次调用
    return function() {
      let args = arguments
      let __me = this
      if (firstTime) { // 如果是第一次调用，不需延迟执行
        __self.apply(__me, args)
        firstTime = false
        return false
      }
      if (timer) { // 如果定时器还在，说明前一次延迟执行还没有完成
        return false
      }
      timer = setTimeout(function() { // 延迟一段时间执行
        clearTimeout(timer)
        timer = null
        __self.apply(__me, args)
      }, interval || 500)
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
}

{ // *** string ***
  function appendSeparator(tar, separator, step, reverse) {
    let aStr = reverse
          ? String(tar).split('').reverse()
          : String(tar).split(''),
      aTemp = []
    for (let i = 0, l = aStr.length; i < l;) {
      aTemp.push(...aStr.slice(i, i += step))
      aTemp.push(separator)
    }
    aTemp.pop()
    log(aTemp, '1')
    return reverse
      ? aTemp.reverse().join('')
      : aTemp.join('')
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


const initTooltipWrap = function() {

  // 意图为 获取 Vue 的最外层 <div id='app'>
  const appWrap = document.querySelector('div')

  const tooltipWrap = document.createElement('div')
  tooltipWrap.classList.add('stiCharts-tooltip-wrap')
  tooltipWrap.style.cssText = `
    padding:10px 15px;
    background:rgba(0,0,0,0.7);
    position:fixed;
    color:white;
    border-radius: 10px;
    display:none;
    z-index:9999;`
  appWrap.appendChild(tooltipWrap)
  return tooltipWrap
}
const getSingleton = function(fn) {
  let instance = null
  return function() {
    return instance || (instance = fn(...arguments))
  }
}
const singletonInitTooltipWrap = getSingleton(initTooltipWrap)


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