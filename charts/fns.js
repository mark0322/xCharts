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

