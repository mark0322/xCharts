/** 
 * 创建tooltip的最外层 div wrap
 * @return div-tooltipWrap 的DOM对象
*/
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

// 单例模式 - 模板
const getSingleton = function(fn) {
  let instance = null
  return function() {
    return instance || (instance = fn(...arguments))
  }
}

/** 
 * 给 <div> - tooltipWrap 包装成单例模式
 * @return div-tooltipWrap 的DOM对象
*/
const singletonInitTooltipWrap = getSingleton(initTooltipWrap)

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

function getMaxForArrsOfObj(obj, targetProps = Object.keys(obj)) {
  let tempArr = []
  for (let item of targetProps) {
    if (Array.isArray(obj[item])) {
      tempArr.push(...flatDeepArray(obj[item]))
    }
  }
  return Math.max.apply(null, tempArr)
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

function zip() {
  let resultArr = [],
    tempArr = [...arguments],
    minLengthForTempArr = Math.min.apply(null, tempArr.map(d => d.length))

  for (let i = 0; i < minLengthForTempArr; i++) {
    resultArr.push(tempArr.map(d => d[i]))
  }

  return resultArr
}

function sumArray(arr, iteratee = d => d) {
  try {
    arr = mapArray(...arguments)
  } catch (e) {
    throw new Error('输入参数有误！')
  }
  return arr.reduce((a, b) => a + b)
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