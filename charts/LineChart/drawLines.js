import * as d3 from 'd3'
import zip from '../../util/array/zip'
import getMaxForArrsOfObj from '../../util/object/getMaxForArrsOfObj'
import getLastElementForArrsOfObj from '../../util/object/getLastElementForArrsOfObj'
import singletonInitTooltipWrap from '../../chart_modules/tooltip/singletonInitTooltipWrap'

function drawLines(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data || {},
    lines = options.lines || {},
    lineColor = lines.color || d3.schemeCategory10,
    axis = options.axis || {},
    padding = options.padding || {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    },
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom,
    linesName = Object.keys(data.val), // 获得每条 lien 的 name
    maxVal = getMaxForArrsOfObj(data.val), // 获得val最大值
    aDateForXAxis = data.date.map(d => parseStamp2Day(d)) // 将 x 轴 时间戳转为 可读时间

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  const // 比例尺
    x = d3.scaleBand()
      .domain(aDateForXAxis)
      .range([0, axisWidth]),
    y = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .rangeRound([axisHeight, 0]),
    z = d3.scaleOrdinal(lineColor) // 各 line 的颜色
      .domain(linesName)
  x.align(0)

  // *** BGbar 的 padding ***
  const bgBar = options.bgBar || {}
  bgBar.padding ? x.padding(bgBar.padding) : x.padding(0.5)

  try { // draw line
    // 处理数据，以符合 d3.line()
    const linePath = d3.line()
      .x(d => x(d[0]) + x.bandwidth() / 2)
      .y(d => y(d[1]))
    lines.curve && linePath.curve(d3.curveCatmullRom.alpha(0.99))
    const gWrapLines = g.append('g').attr('class', 'gWrapLines')

    // label data
    const label = lines.label || {}

    // linesName的数据：拿到 data.val 下每条线数组的最后一个元素
    const xTextVal = getLastElementForArrsOfObj(data.val)
    for (let item of linesName) { // draw lines
      gWrapLines
        .append('path')
        .attr('class', item)
        .datum(zip(aDateForXAxis, data.val[item]))
        .attr('d', linePath)
        .attr('fill', 'none')
        .attr('stroke', z(item))
        .attr('stroke-width', d => lines.width || 2)

      if (label.show) {
        gWrapLines.append('text')
          .attr('x', x(parseStamp2Day(data.date[data.date.length - 1])) + x.bandwidth() / 2)
          .attr('y', y(xTextVal[item]))
          .text(item)
          .attr('fill', z(item))
          .attr('dy', d => label.fontDy || 0)
          .attr('dx', d => label.fontDx || 0)
          .attr('font-size', d => label.fontSize || 14)
      }
    }
  } catch (e) {
    console.warn('draw line:\n', e)
  }

  try { // axis相关

    // define axis
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    // TODO 定制化，将y轴刻度取整
    yAxis.tickFormat(d3.format('.0f'))
    maxVal < 8 ? yAxis.ticks(maxVal) : yAxis.ticks(8)

    // draw axis
    const gXAxis = g.append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${axisHeight})`)
      .call(xAxis)
    const gYAxis = g.append('g')
      .attr('class', 'axis yAxis')
      .call(yAxis)

    { // axis unit
      const xAxisUnit = axis.xAxisUnit || {}
      if (xAxisUnit.name) {
        gXAxis
          .append('text')
          .text(xAxisUnit.name)
          .attr('x', axisWidth)
          .attr('y', '1.2em')
          .attr('fill', () => xAxisUnit.fontColor || 'white')
          .attr('font-size', xAxisUnit.fontSize)
          .attr('dx', xAxisUnit.fontDx)
          .attr('dy', xAxisUnit.fontDy)
      }
      const yAxisUnit = axis.yAxisUnit || {}
      if (yAxisUnit.name) {
        gYAxis
          .append('text')
          .text(yAxisUnit.name)
          .attr('y', '-0.2em')
          .attr('text-anchor', 'middle')
          .attr('fill', () => yAxisUnit.fontColor || 'white')
          .attr('font-size', yAxisUnit.fontSize)
          .attr('dx', yAxisUnit.fontDx)
          .attr('dy', yAxisUnit.fontDy)
      }
    }
  } catch (e) {
    console.warn('axis相关:\n', e)
  }

  try { // splitline相关
    const splitline = options.splitline || {}
    if (splitline.show) {
      g.append('g')
        .attr('stroke', () => splitline.color || '#ccc')
        .attr('stroke-width', () => splitline.lineWidth || 1)
        .attr('stroke-dasharray', () => splitline.dashMode ? '2 5' : 0)
        .attr('class', 'splitline')
        .selectAll('line')
        .data(() => {

          // TODO 定制化，将y轴刻度取整
          return maxVal < 8 ?
            y.ticks(maxVal).slice(1) :
            y.ticks(8).slice(1)
        })
        .enter()
        .append('line')
        .attr('x1', 0)
        .attr('y1', y)
        .attr('x2', axisWidth)
        .attr('y2', y)
    }
  } catch (e) {
    console.warn('splitline相关:\n', e)
  }

  try { // backgroundBar & tooltips
    if (bgBar) {
      const gBGbars = g.append('g').attr('class', 'bg-bars')

      // draw bgBar
      gBGbars.selectAll('rect')
        .data(data.date)
        .enter()
        .append('rect')
        .attr('x', (d, i) => x(aDateForXAxis[i]))
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('height', axisHeight)
        .attr('eventIndex', d => d)
        .attr('fill', d => bgBar.color || '#666')

      let offsetXPos = 2 // 记录 tooltips 在X轴的偏移量
        
      // 单例模式 - 渲染并获得 div - tooltipWarp
      const oTooltipWrap = tooltip_wrap()
      gBGbars.selectAll('rect')
        .data(options.aHoverData)
        .on('mouseenter', d => {
          oTooltipWrap.innerHTML = ''
          oTooltipWrap.style.display = 'block'

          try { // tooltip-innerHTML
            const tooltipWrap = d3.select(oTooltipWrap)
            tooltipWrap.append('p')
              .text(parseStamp2DayIncludeYear(d['date']))
              .attr('class', 'tooltip-date')
              .style('text-align', 'center')
  
            const tooltipsRow = tooltipWrap.append('div')
              .attr('class', 'tooltip-body')
              .selectAll('div')
              .data(Object.entries(d['list']))
              .enter()
              .append('div')
              .attr('class', 'tooltip-row')
              .style('text-align', 'left')
              .style('font-size', '14px')
  
            tooltipsRow.append('span')
              .attr('class', 'tooltip-row-dot')
              .style('background', d => z(d[0]))
              .style('width','10px')
              .style('height', '10px')
              .style('border-radius', '100%')
              .style('margin-right', '10px')
              .style('display', 'inline-block')
  
            tooltipsRow.append('span')
              .attr('class', 'tooltip-row-name')
              .text(d => d[0] + ': ')
            tooltipsRow.append('span')
              .attr('class', 'tooltip-row-val')
              .text(d => d[1])
          } catch (e) {
            console.warn('tooltip-innerHTML:\n', e)
          }

          // 鼠标进入 bgBar 时，计算初始 tooltips 在X轴的偏移量
          d3.event.offsetX > svgWidth / 2
            ? offsetXPos = -oTooltipWrap.offsetWidth - 2
            : offsetXPos = 2
        })
        .on('mousemove', () => {
          oTooltipWrap.style.left = d3.event.pageX + offsetXPos + 'px'
          oTooltipWrap.style.top = d3.event.pageY + 2 + 'px'
        })
        .on('mouseout', () => {
          oTooltipWrap.style.display = 'none'
        })
    }
  } catch (e) {
    console.warn('others - backgroundBar:\n', e)
  }

  try { // label相关

  } catch (e) {
    console.warn('label相关:\n', e)
  }

  (function others() {
    try { // axisStyle
      const gAxises = g.selectAll('.axis')
      axis.ticksColor && gAxises.selectAll('g.tick text').attr('fill', axis.ticksColor)
      if (axis.axisLineColor) {
        gAxises.selectAll('path.domain').attr('stroke', axis.axisLineColor)
        gAxises.selectAll('g.tick line').attr('stroke', axis.axisLineColor)
      }
      if (axis.xAxis) {
        if (axis.xAxis.hideLine) {
          g.select('.xAxis').selectAll('path.domain').remove()
          g.select('.xAxis').selectAll('g.tick line').remove()
        }
        axis.xAxis.hideTicks && g.select('.xAxis').selectAll('g.tick text').remove()
      }
      if (axis.yAxis) {
        if (axis.yAxis.hideLine) {
          g.select('.yAxis').selectAll('path.domain').remove()
          g.select('.yAxis').selectAll('g.tick line').remove()
        }
        axis.yAxis.hideTicks && g.select('.yAxis').selectAll('g.tick text').remove()
      }
    } catch (e) {
      console.warn('others - axisStyle:\n', e)
    }
  })()
}

// *** date function for x axis ***
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

export default drawLines

// ** 数据模板 **
// const options = {
//   data: { // 必填参
//       date: [1425331402000, 1450332152000, 1475332902000, 1500333652000, 1525334402000],
//       val: {
//           'A': [1, 2, 3, 4, 5],
//           'B': [1, 2, 1, 1, 1],
//           'C': [2, 2, 2, 2, 2],
//           'D': [6, 3, 3, 3, 3],
//           'E': [5, 4, 3, 2, 1]
//       }
//   },
//   aHoverData: [
//     {
//       date: 1425331402000,
//       list: {'A': 1, 'B': 1, 'C': 2, 'D': 6, 'E': 5}
//     },
//     {
//       date: 1450332152000,
//       list: {'A': 2, 'B': 2, 'C': 2, 'D': 3, 'E': 4}
//     },
//     {
//       date: 1475332902000,
//       list: {'A': 3, 'B': 1, 'C': 2, 'D': 3, 'E': 3}
//     },
//     {
//       date: 1500333652000,
//       list: {'A': 4, 'B': 1, 'C': 2, 'D': 3, 'E': 2}
//     },
//     {
//       date: 1525334402000,
//       list: {'A': 5, 'B': 1, 'C': 2, 'D': 3, 'E': 1}
//     },
//   ],
//   lines: { // 可选参
//       width: 2,
//       label: { // 可选参; 将num值直接显示
//           show: true,
//           fontSize: 22, // 可选参
//           fontColor: '#eee', // 可选参
//           fontDx: 3, //  可选参； 使unit沿x轴偏移
//           fontDy: -3 //  可选参； 使unit沿y轴偏移
//       },
//       curve: true,
//       // color: ['red', 'green', 'blue', 'yellow', 'black'] // 可选参， 定义每条线的颜色

//   },
//   splitline: { // 可选参
//       show: true,
//       color: '#74706d', // 可选参
//       lineWidth: 1, // 可选参
//       dashMode: true // 可选参 (默认为实线，若要虚线，设true)
//   },
//   axis: { // 可选参
//       axisLineColor: '#497197', // 可选参
//       ticksColor: '#ccc', // 可选参
//       yAxisTicksNum: 8, //  可选参， 用于设置 num 轴的 ticks 个数
//       xAxis: {
//           // hideLine: true, // 可选参
//           // hideTicks: true, // 可选参
//       },
//       yAxis: {
//           // hideLine: true, // 可选参
//           // hideTicks: true, // 可选参
//       },
//       xAxisUnit: {
//           name: 'date',
//           fontSize: 14,   // 可选参
//           fontColor: '#9ee', // 可选参
//           fontDx: 2, //  可选参； 使unit沿x轴偏移
//           fontDy: 2, //  可选参； 使unit沿y轴偏移
//       },
//       yAxisUnit: {
//           name: 'value',
//           fontSize: 14,   // 可选参
//           fontColor: '#9ee', // 可选参
//           fontDx: 10, //  可选参； 使unit沿x轴偏移
//           fontDy: 10, //  可选参； 使unit沿y轴偏移
//       }
//   },
//   tooltip: { // 可选参
//       show: true
//   },

//   // 可选参；(默认为40); 作用:设置坐标系离画布上、下、左、右侧距离
//   padding: { top: 20, left: 50, right: 20, bottom: 20 },
//   bgBar: {
//       show: true,
//       padding: 0.3, // 0~1
//       color: '#999',
//       opacity: 0.1
//   }
// }
