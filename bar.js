import * as d3 from 'd3'

function bar(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data,
    bar = options.bar || {
      color: 'steelblue'
    },
    axis = options.axis || {},
    padding = options.padding || {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    },
    svgWidth = container.offsetWidth,
    svgHeught = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeught - padding.top - padding.bottom;

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
        .attr('width', svgWidth).attr('height', svgHeught),
    g = svg.append('g').attr('class', 'g_wrap')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)

  // 绘制 条形图 or 柱状图
  options.hori_Chart ? horizontalChart() : verticalChart()

  // ----- define function
  function verticalChart() {
    const // 比例尺
      x = d3.scaleBand()
        .domain(data.aStr)
        .range([0, axisWidth]),
      y = d3.scaleLinear()
        .domain([0, d3.max(data.aBarNum) * 1.1])
        .range([axisHeight, 0]);

    try { // splitline相关
      const splitline = options.splitline || {};
      if (splitline.show) {
        g.append('g')
          .attr('class', 'splitline')
          .attr('stroke', () => splitline.color ? splitline.color : '#ccc')
          .attr('stroke-width', () => splitline.lineWidth ? splitline.lineWidth : 1)
          .attr('stroke-dasharray', () => splitline.dashMode ? '5 5' : 0)
          .selectAll('line')
          .data(y.ticks(axis.num_TicksCount).slice(1))
          .enter()
          .append('line')
          .attr('x1', 0)
          .attr('y1', y)
          .attr('x2', axisWidth)
          .attr('y2', y)
      }
    } catch (e) {
      console.warn('verticalChart - splitline相关:\n', e)
    }

    try { // bar相关
      let interpolateColor,
        isMappingColor = false

      // mapping color
      // if (bar.mappingColor[0] && bar.mappingColor[1]) {
      //   interpolateColor = d3.scaleLinear()
      //     .domain([d3.min(data.aBarNum), d3.max(data.aBarNum)])
      //     .range([bar.mappingColor[0], bar.mappingColor[1]])
      //   isMappingColor = true;
      // }
      if (bar.mappingColor[0] && bar.mappingColor[1]) {
        interpolateColor = d3.scaleLinear()
          .domain([0, 9])
          .range([bar.mappingColor[1], bar.mappingColor[0]])
        isMappingColor = true;
      }

      // bar padding
      bar.padding ? x.padding(bar.padding) : x.padding(0.5);

      const gBars = g.append('g').attr('class', 'bars');

      // draw bar
      gBars
        .selectAll('rect')
        .data(data.aBarNum)
        .enter()
        .append('rect')
        .attr('x', (d, i) => x(data.aStr[i]))
        .attr('y', y)
        .attr('width', x.bandwidth())
        .attr('height', d => axisHeight - y(d))
        .attr('eventIndex', (d, i) => data.aStr[i])
        .attr('fill', (d, i) => isMappingColor ? interpolateColor(i) : bar.color ? bar.color : 'steelblue')

      // label
      const label = bar.label || {};
      if (label.show) {
        gBars.selectAll('text')
          .data(data.aBarNum)
          .enter()
          .append('text')
          .text(d => d)
          .attr('x', (d, i) => x(data.aStr[i]) + x.bandwidth() / 2)
          .attr('y', y)
          .attr('fill', () => label.fontColor ? label.fontColor : 'white')
          .attr('font-size', label.fontSize)
          .attr('dx', label.fontDx)
          .attr('dy', label.fontDy)
          .attr('text-anchor', 'middle');
      }
    } catch (e) {
      console.warn('verticalChart - bar相关:\n', e)
    }

    try { // axis相关

      // define axis
      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y);

      // 数值轴的 ticks 个数
      axis.num_TicksCount && yAxis.ticks(axis.num_TicksCount);

      // draw axis
      const gXAxis = g.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${axisHeight})`)
        .call(xAxis);
      const gYAxis = g.append('g')
        .attr('class', 'axis yAxis')
        .call(yAxis);

      // axis unit
      const numUnit = data.numUnit || {};
      if (numUnit.name) {
        gXAxis
          .append('text')
          .text(numUnit.name)
          .attr('x', axisWidth)
          .attr('y', '1.2em')
          .attr('fill', () => numUnit.fontColor ? numUnit.fontColor : 'white')
          .attr('font-size', numUnit.fontSize)
          .attr('dx', numUnit.fontDx)
          .attr('dy', numUnit.fontDy);
      }

      const strUnit = data.strUnit || {};
      if (strUnit.name) {
        gYAxis
          .append('text')
          .text(strUnit.name)
          .attr('y', '-0.2em')
          .attr('text-anchor', 'middle')
          .attr('fill', () => strUnit.fontColor ? strUnit.fontColor : 'white')
          .attr('font-size', strUnit.fontSize)
          .attr('dx', strUnit.fontDx)
          .attr('dy', strUnit.fontDy);
      }
    } catch (e) {
      console.warn('verticalChart - axis相关:\n', e);
    }

    try { // 当 x-marks 过多时，旋转 marks
      let totalMarksNum = data.aStr.reduce((l, r) => {
        return l + r.length
      }, 0)
      if (totalMarksNum > 50) {
        d3.select(container)
          .selectAll('g.xAxis text')
          .attr('transform', `rotate(45) translate(2, -8)`)
          .attr('text-anchor', 'start')
      }
    } catch (e) {

    }
  }

  function horizontalChart() {
    data.aBarNum.reverse() // 将数据反转，以适应 top list
    data.aStr.reverse() // 将数据反转，以适应 top list
    Array.isArray(data.aEventIndex) && data.aEventIndex.reverse() // 将数据反转，以适应 top list

    const // 比例尺
      x = d3.scaleLinear()
        .domain([0, d3.max(data.aBarNum) * 1.1])
        .range([0, axisWidth]),
      y = d3.scaleBand()
        .domain(data.aStr)
        .range([axisHeight, 0])

    try { // splitline相关
      const splitline = options.splitline || {};
      if (splitline.show) {
        g.append('g')
          .attr('stroke', () => splitline.color ? splitline.color : '#ccc')
          .attr('stroke-width', () => splitline.lineWidth ? splitline.lineWidth : 1)
          .attr('stroke-dasharray', () => splitline.dashMode ? '5 5' : 0)
          .attr('class', 'splitline')
          .selectAll('line')
          .data(x.ticks(axis.num_TicksCount).slice(1))
          .enter()
          .append('line')
          .attr('x1', x)
          .attr('y1', 0)
          .attr('x2', x)
          .attr('y2', axisHeight)
      }
    } catch (e) {
      console.warn('horizontalChart - splitline相关:\n', e)
    }

    try { // bar相关
      let interpolateColor,
        isMappingColor = false

      // mapping color
      // if (bar.mappingColor[0] && bar.mappingColor[1]) {
      //   interpolateColor = d3.scaleLinear()
      //     .domain([d3.min(data.aBarNum), d3.max(data.aBarNum)])
      //     .range([bar.mappingColor[0], bar.mappingColor[1]])
      //   isMappingColor = true;
      // }

      if (bar.mappingColor[0] && bar.mappingColor[1]) {
        interpolateColor = d3.scaleLinear()
          .domain([0, 9])
          .range([bar.mappingColor[0], bar.mappingColor[1]])
        isMappingColor = true;
      }

      // bar padding
      bar.padding ? y.padding(bar.padding) : y.padding(0.5);

      const gBars = g.append('g').attr('class', 'bars');

      // draw bar
      gBars
        .selectAll('rect')
        .data(data.aBarNum)
        .enter()
        .append('rect')
        .attr('x', 0)
        .attr('y', (d, i) => y(data.aStr[i]))
        .attr('width', x)
        .attr('height', y.bandwidth())
        .attr('eventIndex', (d, i) => {
          if (data.aEventIndex && (data.aStr.length == data.aEventIndex.length)) {
            return data.aEventIndex[i]
          }
          return data.aStr[i]
        })
        .attr('fill', (d, i) => isMappingColor ? interpolateColor(i) : bar.color ? bar.color : 'steelblue');

      // label
      const label = bar.label || {};
      if (label.show) {
        gBars.selectAll('text')
          .data(data.aBarNum)
          .enter()
          .append('text')
          .text(d => d)
          .attr('x', x)
          .attr('y', (d, i) => y(data.aStr[i]) + y.bandwidth())
          .attr('fill', () => label.fontColor ? label.fontColor : 'white')
          .attr('font-size', label.fontSize)
          .attr('dx', label.fontDx)
          .attr('dy', label.fontDy)
          .attr('text-anchor', 'start');
      }
    } catch (e) {
      console.warn('horizontalChart - bar相关:\n', e)
    }

    try { // axis相关
      // define axis
      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y);

      // 数值轴的 ticks 个数
      axis.num_TicksCount && xAxis.ticks(axis.num_TicksCount)

      // draw axis
      const gXAxis = g.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${axisHeight})`)
        .call(xAxis);
      const gYAxis = g.append('g')
        .attr('class', 'axis yAxis')
        .call(yAxis);

      // axis unit
      const numUnit = data.numUnit || {};
      if (numUnit.name) {
        gXAxis
          .append('text')
          .text(numUnit.name)
          .attr('x', axisWidth)
          .attr('y', '1.2em')
          .attr('fill', () => numUnit.fontColor ? numUnit.fontColor : 'white')
          .attr('font-size', numUnit.fontSize)
          .attr('dx', numUnit.fontDx)
          .attr('dy', numUnit.fontDy);
      }

      const strUnit = data.strUnit || {};
      if (strUnit.name) {
        gYAxis
          .append('text')
          .text(strUnit.name)
          .attr('y', '-0.2em')
          .attr('text-anchor', 'middle')
          .attr('fill', () => strUnit.fontColor ? strUnit.fontColor : 'white')
          .attr('font-size', strUnit.fontSize)
          .attr('dx', strUnit.fontDx)
          .attr('dy', strUnit.fontDy);
      }
    } catch (e) {
      console.warn('horizontalChart - axis相关:\n', e)
    }
  }

  (function others() {
    const tooltip = options.tooltip || {};
    if (tooltip.show) { // tooltip 相关
      const oDiv = document.createElement('div')
      oDiv.classList.add('bar-tooltip')
      oDiv.style.cssText = 'padding:10px 15px;background:rgba(0,0,0,0.7);position:fixed;color:white;border-radius: 10px;display:none;'
      container.appendChild(oDiv)
      const rects = g.selectAll('.bars rect')

      rects
        .on('mouseenter', d => {
          oDiv.innerHTML = d
          oDiv.style.display = 'block'
        })
        .on('mousemove', () => {
          oDiv.style.left = d3.event.pageX + 2 + 'px'
          oDiv.style.top = d3.event.pageY + 2 + 'px'
        })
        .on('mouseout', () => {
          oDiv.style.display = 'none'
        });
    }

    try { // axisStyle
      const gAxises = g.selectAll('.axis');
      axis.ticksColor && gAxises.selectAll('g.tick text').attr('fill', axis.ticksColor);
      if (axis.axisLineColor) {
        gAxises.selectAll('path.domain').attr('stroke', axis.axisLineColor);
        gAxises.selectAll('g.tick line').attr('stroke', axis.axisLineColor);
      }
      if (axis.xAxis) {
        if (axis.xAxis.hideLine) {
          g.select('.xAxis').selectAll('path.domain').remove();
          g.select('.xAxis').selectAll('g.tick line').remove();
        }
        axis.xAxis.hideTicks && g.select('.xAxis').selectAll('g.tick text').remove();
      }
      if (axis.yAxis) {
        if (axis.yAxis.hideLine) {
          g.select('.yAxis').selectAll('path.domain').remove();
          g.select('.yAxis').selectAll('g.tick line').remove();
        }
        axis.yAxis.hideTicks && g.select('.yAxis').selectAll('g.tick text').remove();
      }
    } catch (e) {
      console.warn('others - axisStyle:\n', e)
    }
  })()
}

export default bar

// *** options 模板 ***
// const options = {
//     data: {// 必填参
//         aBarNum: [247, 240, 231, 220, 211, 190, 173, 160, 153, 120], // 必填参
//         aStr: [80, 443, 'x', 22, '445', '142', '5543', '什', '32', '3360'] // 必填参

//         // aValNum: [], // (未开发)可选参； 用于生成 折线图
//         // numUnit: { // 可选参
//             // name: 'num',
//             // fontSize: 14,   // 可选参
//             // fontColor: '#9ee' // 可选参
//             // fontDx: 10, // 可选参； 使unit沿x轴偏移
//             // fontDy: 10, // 可选参； 使unit沿y轴偏移
//         // },
//         // strUnit: { // 可选参
//             // name: 'str',
//             // fontSize: 14,   // 可选参
//             // fontColor: '#9ee' // 可选参
//             // fontDx: 10, // 可选参； 使unit沿x轴偏移
//             // fontDy: 10, // 可选参； 使unit沿y轴偏移
//         // }
//     },
//     hori_Chart: true, // 可选参 (作用：将chart方向由默认纵向，变为横向)
//     bar: { // 可选参

//         // color: 'steelblue', // 可选参 (默认值为 'steelblue')

//         // 作用：将mappingColor[0]映射至val最小值；将mappingColor[1]映射至val最大值
//         mappingColor: ['#114fa8', '#23ece1'], // 可选参

//         // padding: 0.5,   // 可选参; 作用：设bar的宽度百分比；参数值为0~1;
//         label: { // 可选参; 将num值直接显示
//             show: true,
//             fontSize: 12, // 可选参
//             fontColor: '#eee', // 可选参
//             fontDx: 3, // 可选参； 使unit沿x轴偏移
//             fontDy: -3 // 可选参； 使unit沿y轴偏移
//         }
//     },
//     splitline: {// 可选参
//         show: true,
//         color: '#74706d', // 可选参
//         lineWidth: 1, // 可选参
//         dashMode: true // 可选参 (默认为实线，若要虚线，设true)
//     },
//     axis: {// 可选参
//         axisLineColor: '#497197', // 可选参
//         ticksColor: '#ccc', // 可选参
//         xAxis: {

//             // hideLine: true, // 可选参
//             // hideTicks: true // 可选参
//         },
//         yAxis: {

//             // hideLine: true, // 可选参
//             // hideTicks: true // 可选参
//         },
//         num_TicksCount: 5 // 可选参， 用于设置 num 轴的 ticks 个数
//     },
//     tooltip: { // 可选参
//         show: true
//     },

//     // 可选参；(默认为40); 作用:设置坐标系离画布上、下、左、右侧距离
//     padding: { top: 40, left: 40, right: 20, bottom: 40 }
// }
