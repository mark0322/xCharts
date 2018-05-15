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

  function difference(arr1, arr2) {
    let s1 = new Set(arr1),
      s2 = new Set(arr2)
    for (let item of s2) {
      if (s1.has(item)) {
        s1.delete(item)
        s2.delete(item)
      }
    }
    return [...s1, ...s2]
  }  

  function flatArray(arr) {
    return arr.reduce((a, b) => {
      Array.isArray(b) ? a.push(...b) : a.push(b)
      return a
    }, [])
  }

  function flatDeepArray(arr) {
    const tempArr = []
    flatArray(arr)
    return tempArr
  
    function flatArray(arrSub) {
      arrSub.forEach(d => {
        Array.isArray(d) ? flatArray(d) : tempArr.push(d)
      })
    }
  }

  function intersection(arr1, arr2) {
    let result = [],
      s1 = new Set(arr1),
      s2 = new Set(arr2)
    for (let item of s2) {
      s1.has(item) && result.push(item)
    }
    return result
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
  function getLastElementForArrsOfObj(obj, targetProps = Object.keys(obj)) {
    let tempObj = {}
    for (let item of targetProps) {
      if (Array.isArray(obj[item])) {
        tempObj[item] = obj[item].slice(-1)[0]
      }
    }
    return tempObj
  }

  function getMaxForArrsOfObj(obj, targetProps = Object.keys(obj)) {
    let tempArr = []
    for (let item of targetProps) {
      if (Array.isArray(obj[item])) {
        tempArr.push(...flatDeepArray(obj[item]))
      }
    }
    return Math.max.apply(null, tempArr)
  }

  function getMinForArrsOfObj(obj, targetProps = Object.keys(obj)) {
    let tempArr = []
    for (let item of targetProps) {
      if (Array.isArray(obj[item])) {
        tempArr.push(...flatDeepArray(obj[item]))
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
    return reverse
      ? aTemp.reverse().reduce((a, b) => a + b)
      : aTemp.reduce((a, b) => a + b)
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

