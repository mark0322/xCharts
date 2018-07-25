/** 
 * 创建格式为 YYYYMM 的 date list
 * @example 1: createDateList([2017, 2018]) ->
 * [
 *  "201701", "201702", "201703", "201704", "201705", "201706", 
 *  "201707", "201708", "201709", "201710", "201711", "201712", 
 *  "201801", "201802", "201803", "201804", "201805", "201806", 
 *  "201807", "201808", "201809", "201810", "201811", "201812"
 * ]
 *
 * @example 2: createDateList(2018, 5)  ->
 * ["201801", "201802", "201803", "201804", "201805"]
 * 
 * @param { String || Number || Array } yearList
 * @param { String || Number } maxMonth
 */
function createDateList(yearList, maxMonth = 12) {
  let result = []

  yearList = [].concat(yearList)

  for (let year of yearList) {
    year = String(year)

    const dateList = Array(parseInt(maxMonth))
      .fill(year)
      .reduce((arr, val, i) => {
        i = i < 9 ? '0' + (i + 1) : i + 1
        arr.push(val + '' + i)
        return arr
      }, [])

    result = result.concat(dateList)
  }

  return result
}

export default createDateList