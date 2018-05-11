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

function parseStamp2Day(d) {
  let month = new Date(d).getMonth() + 1,
    day = new Date(d).getDate()
  month < 10 && (month = '0' + month)
  day < 10 && (day = '0' + day)
  return month + '-' + day
}

function chunk(arr, size = arr.length) {
  let chunkArr = []
  for (let i = 0, l = arr.length; i < l;) {
    chunkArr.push(arr.slice(i, i += size))
  }
  return chunkArr
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

function mapArray(arr, callback = d => d) {
  arr = arr.reduce((a, b) => {
    if (callback(b) !== undefined) {
      a.push(callback(b))
      return a
    }
    return a
  }, [])
  if (!arr[0]) throw new Error('输入参数有误！')
  return arr
}

function matchArrayVal(arr, matchVal, iteratee) {
  (typeof iteratee === 'function') && (arr = arr.map(iteratee))
  let sum = arr.reduce((a, b) => a + b)
  return arr.map(d => d / sum * matchVal)
}

function maxArray(arr, callback = d => d) {
  try {
    arr = mapArray(...arguments)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return Math.max.apply(null, arr)
}

function meanArray(arr, iteratee) {
  let sum = 0,
    tempArr = []
  try {
    tempArr = mapArray(...arguments)
    sum = tempArr.reduce((a, b) => a + b)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return sum / tempArr.length
}

function minArray(arr, iteratee = d => d) {
  try {
    arr = mapArray(...arguments)
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
    arr = mapArray(...arguments)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return arr.reduce((a, b) => a + b)
}

function zip() {
  let resultArr = [],
    tempArr = [...arguments],
    minLengthForTempArr = Math.min.apply(null, tempArr.map(d => d.length))

  for (let i = 0; i < minLengthForTempArr; i++) {
    resultArr.push(tempArr.map(d => d[i]))
  }

  return resultArr
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

function workFixTime(func, time = 1) {
  let i = -1
  return function() {
    if (++i < time) return func(...arguments)
  }
}

function random(start = 0, end = 1, isFloat = false) {
  (arguments.length == 1) && (end = start, start = 0)
  const interval = end - start
  return isFloat
    ? start + interval * Math.random()
    : (start + interval * Math.random()) | 0
}

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

function appendSeparator(tar, separator, step, reverse = true) {
  let aStr = reverse
    ? String(tar).split('').reverse()
    : String(tar).split(''),
    aTemp = []
  while (aStr[0]) {
    aTemp.push(...aStr.slice(0, step))
    aTemp.push(separator)
    aStr = aStr.slice(step)
  }
  aTemp.pop()
  return reverse
    ? aTemp.reverse().reduce((a, b) => a + b)
    : aTemp.reduce((a, b) => a + b)
}

function trim(s) {
  return s.replace(/^\s+ | \s+$/g, '')
}

function parseStamp2Day(d) {
  return new Date(d).getDate() + '日'
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