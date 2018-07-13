let BarChart = null;
{
  const defaults = {
    container: null, // div - wrap of the chart
    padding: { top: 40, left: 40, right: 40, bottom: 40 },
    bar: {
      color: 'steelblue',
      gap: 0.5, // 设置 bar 之间的间隙
      isMappingColor: true, // 设 bar 与 bar 间为渐变色
      colorRange: ['#117fb8', '#23ece1'],
    },
    label: {
      color: '#333',
      fontSize: 14,
      dx: '0em',
      dy: '1.5em'
    },
    axis: {
      // 共有属性
      tickSize: 4, // 轴刻度的长度
      tickPadding: 8, // label 离轴的距离

      // ** 注： 轴 tick 和 path 样式，用 css 设置 **

      strAxis: { // dimension 轴
        ticksNum: 5
      },
      valAxis: { // measure 轴
        
      }
    },
    splitLine: {

    },
    animation: true,
    // isHoriz: true, // 将 bar 设为水平
  }

  BarChart = class BarChart {
    /** 
     * options 必包含以下属性：
     * {
     *  container: document.querySelector('#box'),
     *  strData: ['a', 'b', 'c'],
     *  valData: [11, 22, 33]
     * }
    */
    constructor(options) {
      this._init(options)
    }
  
    // 初始化：全局属性和方法
    _init(options) {
      Object.assign(this, defaults, options)
  
      const {container, padding, animation, isHoriz, axis} = this
      this.svgWidth = container.clientWidth
      this.svgHeight = container.clientHeight
      this.axisWidth = this.svgWidth - padding.left - padding.right
      this.axisHeight = this.svgHeight - padding.top - padding.bottom
  
       // 条形图 or 柱状图
      if (isHoriz) {
        const strAxis = axis.strAxis || {}
  
        this.strScale = d3.scaleBand().range([this.axisHeight, 0])
        this.valScale = d3.scaleLinear().range([0, this.axisWidth])
  
        this.strAxis = d3.axisLeft(this.strScale)
          .ticks(strAxis.ticksNum || 5)
          .tickPadding(axis.tickPadding)
          .tickSize(axis.tickSize)
        this.valAxis = d3.axisBottom(this.valScale)
          .tickPadding(axis.tickPadding)
          .tickSize(axis.tickSize)
      } else {
        const strAxis = axis.strAxis || {}
  
        this.strScale = d3.scaleBand().range([0, this.axisWidth])
        this.valScale = d3.scaleLinear().range([this.axisHeight, 0])
  
        this.strAxis = d3.axisBottom(this.strScale)
          .ticks(strAxis.ticksNum || 5)
          .tickPadding(axis.tickPadding)
          .tickSize(axis.tickSize)
        this.valAxis = d3.axisLeft(this.valScale)
          .tickPadding(axis.tickPadding)
          .tickSize(axis.tickSize)
      }
  
      this.svg = d3.select(container)
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
      this.g = this.svg
        .append('g')
        .attr('class', 'g_wrap')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)
      this.g_bars = this.g.append('g').attr('class', 'g-warp-bars')
      this.g_labels = this.g.append('g').attr('class', 'g-warp-labels')
      this.g_axis = this.g.append('g').attr('class', 'g-warp-axis')
      this.t = d3.transition().duration(animation ? 800 : 0)
    }

    // 输出 strScale & valScale
    processScale({ strData, valData } = this) {
      let { strScale, valScale, bar } = this
      strScale = strScale.domain(strData).padding(bar.gap || 0.5)
      valScale = valScale.domain([0, d3.max(valData) * 1.1])
      return { strScale, valScale }
    }
  
    renderChart({ strData, valData } = this) {
      const {bar, axisWidth, axisHeight, g_bars, g_labels, t, label, isHoriz} = this
      const { strScale, valScale } = this.processScale({ strData, valData })
  
      // g wrap - bar
      const columns = g_bars.selectAll('rect').data(valData)
  
      // g warp - label
      const labels = g_labels
        .attr('fill', label.color || '#ccc')
        .attr('font-size', label.fontSize || 14)
        .selectAll('text').data(valData)
      
      // mappingColor: function for interpolateColor
      let interpolateColor = null;
  
      isHoriz
        ? drawHorizontalBar(strData)
        : drawVerticalBar(strData)
  
      // define function
      function drawVerticalBar(strData) {
        columns
          .enter()
            .append('rect')
          .merge(columns) // update
            .attr('x', (d, i) => strScale(strData[i]))
            .attr('y', valScale(0))
            .attr('width', strScale.bandwidth())
            .transition(t)
            .attr('y', valScale)
            .attr('height', d => axisHeight - valScale(d))
            .attr('fill', (d, i) => isMappingColor() ? interpolateColor(i) : bar.color || 'steelblue')
        columns.exit().remove()
  
        labels
          .enter()
            .append('text')
          .merge(labels)
            .attr('x', (d, i) => strScale(strData[i]) + strScale.bandwidth() / 2)
            .attr('y', valScale)
            .attr('text-anchor', 'middle')
            .text(d => d)
            .attr('dx', label.dx)
            .attr('dy', label.dy)
            .attr('opacity', 0)
            .transition(t)
            .attr('opacity', 1)
        labels.exit().remove() // exit
      }
      function drawHorizontalBar(strData) {
        columns
          .enter()
            .append('rect')
          .merge(columns) // update
            .attr('y', (d, i) => strScale(strData[i]))
            .attr('height', strScale.bandwidth())
            .attr('x', 0)
            .transition(t)
            .attr('width', d => valScale(d))
            .attr('fill', (d, i) => isMappingColor() ? interpolateColor(i) : bar.color || 'steelblue')
        columns.exit().remove()
  
        labels
          .enter()
            .append('text')
          .merge(labels)
            .attr('x', d => valScale(d))
            .attr('y', (d, i) => strScale(strData[i]))
            .text(d => d)
            .attr('dx', label.dx)
            .attr('dy', strScale.bandwidth() / 2)
            .attr('text-anchor', 'end')
            .attr('dominant-baseline', 'middle')
            .attr('opacity', 0)
            .transition(t)
            .attr('opacity', 1)
        labels.exit().remove() // exit
      }
  
      // 判断 bar 与 bar 间是否使用渐变色
      function isMappingColor() {
        const isMappingColor = 
          bar.isMappingColor && bar.colorRange[0] && bar.colorRange[1]
        if (isMappingColor) {
          interpolateColor = d3.scaleLinear()
            .domain([0, strData.length])
            .range([bar.colorRange[0], bar.colorRange[1]])
          return true
        }
        return false
      }
      return this
    }
  
    renderAxis({ strData, valData } = this) {
      const {axisWidth, axisHeight, isHoriz, g_axis, strAxis, valAxis, bar} = this
      const { strScale, valScale } = this.processScale({ strData, valData })

      g_axis.selectAll('g').remove() // update 时，清空之前的 axis
  
      const gXAxis = g_axis.append('g')
        .attr('class', 'axis xAxis')
        .attr('transform', `translate(0, ${axisHeight})`)
      const gYAxis = g_axis.append('g')
        .attr('class', 'axis yAxis')
  
      isHoriz
        ? drawHorizontalChart()
        : drawVerticalAxis()
  
      function drawHorizontalChart() {
        gXAxis.call(valAxis)
        gYAxis.call(strAxis)
      }
      function drawVerticalAxis() {
        gXAxis.call(strAxis)
        gYAxis.call(valAxis)
      }
      return this
    }
  
    tooltip(show = true) {
      let oDiv = document.querySelector('.bar-tooltip')
      // 单例模式：tooltip 只能绘制一次
      if (show && !this.hasTooltip) {
        this.hasTooltip = true
  
        const { container, g } = this
        oDiv = document.createElement('div')
        oDiv.classList.add('bar-tooltip')
        oDiv.style.cssText = 'padding:10px 15px;background:rgba(0,0,0,0.7);position:fixed;color:white;border-radius: 10px;display:none;'
        container.appendChild(oDiv)
        const rects = g.selectAll('.g-warp-bars rect')
  
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
      } else {
          d3.select(oDiv).remove()
      }
      return this
    }

    splitLine(show = true) {

    }
  
    // 初次 绘制 chart
    render({ strData, valData } = this) {
      this.renderChart({ strData, valData })
      this.renderAxis({ strData, valData })
      return this
    }
  
    // 更新 chart
    update({ strData, valData } = this) {
      this.render({ strData, valData })
      return this
    }
  }
}



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
      const oTooltipWrap = singletonInitTooltipWrap()
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

// --
function drawBar(container, options) {
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
          .attr('stroke', () => splitline.color || '#ccc')
          .attr('stroke-width', () => splitline.lineWidth || 1)
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
        .attr('fill', (d, i) => isMappingColor ? interpolateColor(i) : bar.color || 'steelblue')

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
          .attr('fill', () => label.fontColor || 'white')
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
          .attr('fill', () => numUnit.fontColor || 'white')
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
          .attr('fill', () => strUnit.fontColor || 'white')
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
          .attr('stroke', () => splitline.color || '#ccc')
          .attr('stroke-width', () => splitline.lineWidth || 1)
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
        .attr('fill', (d, i) => isMappingColor ? interpolateColor(i) : bar.color || 'steelblue');

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
          .attr('fill', () => label.fontColor || 'white')
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
          .attr('fill', () => numUnit.fontColor || 'white')
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
          .attr('fill', () => strUnit.fontColor || 'white')
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

// --
function drawBubbles(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data,
    bubbles = options.bubbles || {},
    padding = options.padding || { top: 0, left: 0, right: 0, bottom: 0 },
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  const pack = d3.pack()
    .padding(() => bubbles.padding || 3)
    .size([axisWidth, axisHeight])

  const root = d3.hierarchy({ children: data })
    .sum(d => Math.sqrt(d.val) + 3) // Math.sqrt(d.val) + 3目的是：当 val 为 0 时， ○ 大小适中
    .each(d => {
      d.group = d.data.groups;
    })

  const node = g.selectAll('.node')
    .data(pack(root).leaves())
    .enter()
    .append('g')
    .attr('class', 'node')
    .attr('transform', d => `translate(${d.x}, ${d.y})`)


  try { // draw bubble

    // circle
    const bubbleColor = bubbles.color || 'steelblue'
    node.append('circle')
      .attr('r', d => d.r)
      .attr('id', d => d.data.name)
      .attr('fill', d => {
        if (Array.isArray(bubbleColor)) {
          return bubbleColor[d.group]
        }
        return bubbleColor
      })

    { // label
      const label = bubbles.label || {}
      node.append('clipPath')
        .attr('id', d => 'clip-' + d.data.name)
        .append('use')
        .attr('xlink:href', d => '#' + d.data.name)

      node.append('text')
        .attr('clip-path', d => `url(#clip-${d.data.name})`)
        .attr('class', 'label')
        .selectAll('tspan')
        .data(d => [d.data.name, d.data.val])
        .enter()
        .append('tspan')
        .attr('x', 0)
        .attr('dy', (d, i) => i == 0 ? '0em' : '1.2em')
        .attr('text-anchor', 'middle')
        .text(d => d)
        .attr('font-size', (d, i) => {
          return i == 0 ? label.name.fontSize : label.val.fontSize
        })
        .attr('fill', (d, i) => {
          return i == 0 ? label.name.fontColor : label.val.fontColor
        })
        .attr('font-weight', (d, i) => {
          return i == 0 ? label.name.fontWeight : label.val.fontWeight
        })
    }

    // tooltip - title
    node.append('title')
      .text(d => d.data.name + '\n' + d.data.val)

    // border
    const border = bubbles.border || {}
    if (border.show) {
      let interpolateColor,
        isMappingColor = false

      // mapping color
      if (border.mappingColor && border.mappingColor.length == 2) {
        interpolateColor = d3.scaleLinear()
          .domain([d3.min(data, d => d.val), d3.max(data, d => d.val)])
          .range([border.mappingColor[0], border.mappingColor[1]])
        isMappingColor = true
      }

      g.selectAll('g.node circle')
        .attr('stroke', d => {
          return isMappingColor ? interpolateColor(d.data.val) : border.color
        })
        .attr('stroke-width', border.width)
    }
  } catch (e) {
    console.warn('draw bubble', e)
  }

  try { // bubble style

    // bubble 的渐变
    const gradient = bubbles.linearGradient || {}
    if (gradient.show) {

      // define gradient
      let linearGradient = g.append('g')
        .attr('class', 'linearGradient')
        .append('defs')
        .append('linearGradient')
        .attr('id', 'bubbleGradientLinear')
        .attr('x1', '50%')
        .attr('y1', '0%')
        .attr('x2', '50%')
        .attr('y2', '100%')

      linearGradient.append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color:${gradient.topColor}`)
      linearGradient.append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color:${gradient.bottomColor}`)

      g.selectAll('g.node circle')
        .attr('fill', 'url(#bubbleGradientLinear)')
    }

  } catch (e) {
    console.warn('bubble style', e)
  }
}

// --
function drawDonutsBoard(container, options) {
  container.innerHTML = ''; // 清空 容器内容
  let // *** 全局参数 ***
    data = options.data,
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    padding = options.padding || {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    },
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom,
    gap = options.donutGap,
    donutWidth = options.donutWidth,
    outerRadius,
    innerRadius,
    valLabel = options.valLabel,
    nameLabel = options.nameLabel

  // 计算 donut 的 outerRadius
  let tempOuterRadius = (axisWidth - gap * (data.length - 1)) / (data.length * 2)
  if (tempOuterRadius > axisHeight / 2) {
    outerRadius = axisHeight / 2
    innerRadius = outerRadius - donutWidth
  } else {
    outerRadius = tempOuterRadius
    innerRadius = outerRadius - donutWidth
  }

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
    .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'g_wrap')
    .attr('transform', `translate(${padding.left + outerRadius}, ${padding.top + outerRadius})`)

  const arcPath = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius)
    .cornerRadius(outerRadius - innerRadius)

  // bg donus data
  const bgDonutsData = [{
      startAngle: Math.PI * -0.75,
      endAngle: Math.PI * 0.75
    }]

  // actual donuts data - scale
  const actualScale = d3.scaleLinear()
    .domain([0, sumArray(data, d => d.val)])
    .range([-0.75, 0.75])

  // 每次循环 绘制一组 donut board
  for (let i = 0; i < data.length; i++) {
    const gBoard = g.append('g')
      .attr('class', 'gBoard')
      .attr('transform', `translate(${i * (gap + 2 * outerRadius)}, 0)`)

    // draw bgDonuts
    gBoard.selectAll('.bgDonuts')
      .data(bgDonutsData)
      .enter()
      .append('path')
      .attr('class', 'bgDonuts')
      .attr('d', d => arcPath(d))
      .attr('fill', data[i].color)
      .attr('opacity', 0.3)

    // define actual donuts data
    const actualDonutsData = [{
      startAngle: Math.PI * -0.75,
      endAngle: Math.PI * actualScale(data[i].val)
    }]

    // draw actualDonuts
    gBoard.selectAll('.actualDonuts')
      .data(actualDonutsData)
      .enter()
      .append('path')
      .attr('class', 'actualDonuts')
      .attr('d', d => arcPath(d))
      .attr('fill', data[i].color)
      .attr('opacity', 0.8)

    // text - val
    gBoard.append('text')
      .attr('class', 'donut-val')
      .text(data[i]['val'])
      .attr('text-anchor', 'middle')
      .attr('fill', valLabel.color)
      .attr('font-size', valLabel.fontSize)

    // text - name
    gBoard.append('text')
      .attr('class', 'donut-name')
      .attr('y', () => innerRadius * Math.sqrt(2) / 2)
      .text(data[i]['name'])
      .attr('text-anchor', 'middle')
      .attr('dx', nameLabel.dx)
      .attr('dy', nameLabel.dy)
      .attr('fill', nameLabel.color)
  }
}

// --
function drawTreemap(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data,
    blocks = options.blocks || {},
    padding = options.padding || {
      top: 4,
      left: 4,
      right: 4,
      bottom: 4
    },
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    axisWidth = svgWidth - padding.left - padding.right,
    axisHeight = svgHeight - padding.top - padding.bottom,
    totalVal = sumArray(data, o => o.val)

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
    .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'gWrap')
    .attr('transform', `translate(${padding.left}, ${padding.top})`)

  // 定义 blocks 相关的数据
  const
    color = blocks.color || 'steelblue',
    gap = blocks.gap || 1,
    columnsCount = blocks.columns || 3, // treemap 的列数

    // rowsCount = Math.ceil(data.length / blocks.columns), // treemap 的行数
    aChunkData = chunk(data, columnsCount) // 生成绘制 treemap 的数据

  try { // drawBlocks

    // 得到treemap每行的高
    const aEveryRowsHeight = (() => {
      let aEveryRowsTotalVal = []; // 将每行所有的 block 的 val 相加
      for (let chunkEle of aChunkData) { // 将每行所有的 block 的 val 相加
        let rowsTotalVal = sumArray(chunkEle, o => o.val)
        aEveryRowsTotalVal.push(rowsTotalVal)
      }
      return aEveryRowsTotalVal.map(d => axisHeight * d / totalVal - gap)
    })()

    // 得到treemap每块block的宽
    const aEveryBlockWidth = (arr => {
      let aTempEveryBlockWidth = []
      for (let aOneRowItems of arr) { // 以行为单位，遍历 aChunkData
        let rowsTotalVal = sumArray(aOneRowItems, o => o.val) // 一行内的 sum(blocks.val)

        // 获得一行内，每个 block 的宽
        let aOneRowWidth = aOneRowItems.map(d => axisWidth * d.val / rowsTotalVal - gap)
        aTempEveryBlockWidth.push(aOneRowWidth)
      }
      return aTempEveryBlockWidth
    })(aChunkData)

    // g-wrap-blocks
    let gRows = g.append('g').attr('class', 'g-blocks')

    // 遍历每一行
    let yPos = 0 // position-x
    for (let i = 0; i < aEveryBlockWidth.length; i++) {
      if (i > 0) {
        yPos += aEveryRowsHeight[i - 1] + gap
      }

      // 遍历一行中的每一块
      let xPos = 0 // position-y
      for (let j = 0; j < aEveryBlockWidth[i].length; j++) {
        if (j > 0) {
          xPos += aEveryBlockWidth[i][j - 1] + gap
        }

        // draw every block
        gRows.append('g')
          .attr('class', 'block')
          .attr('transform', `translate(${xPos}, ${yPos})`)
          .append('rect')
          .attr('width', aEveryBlockWidth[i][j])
          .attr('height', aEveryRowsHeight[i])
      }
    }
  } catch (e) {
    console.warn('drawBlocks', e)
  }

  { // block style and label
    const gBlocks = g.select('g.g-blocks')
      .selectAll('g.block')
      .data(data)
      .attr('eventIndex', d => d.name)

    // block color
    gBlocks
      .select('rect')
      .attr('fill', d => Array.isArray(color) ? color[d['groups']] : color)

    // block label
    const label = blocks.label || {}
    let labelStyle = o => {
      o.attr('fill', () => label.color || '#333')
        .attr('font-size', () => label.fontSize || '12')
        .attr('text-anchor', 'middle')
        .attr('x', function() {
          let rectWidth = d3.select(this.parentNode).select('rect').attr('width')
          return rectWidth / 2
        })
        .attr('y', function() {
          let rectHeight = d3.select(this.parentNode).select('rect').attr('height')
          return rectHeight / 2
        })
    }

    let names = gBlocks.append('text').text(d => d.name)
    labelStyle(names)

    let vals = gBlocks.append('text').text(d => d.val).attr('dy', '1em')
    labelStyle(vals)
  }

  { // tooltip
    const oDiv = document.createElement('div')
    oDiv.classList.add('bar-tooltip')
    oDiv.style.cssText = 'padding:10px 15px;background:rgba(0,0,0,0.7);position:fixed;color:white;border-radius: 10px;display:none;'
    container.appendChild(oDiv)
    const gBlock = d3.select(container).selectAll('g.block').data(data)

    gBlock
      .on('mouseenter', d => {
        oDiv.innerHTML = d.name + ': ' + d.val
        oDiv.style.display = 'block' // TODO hover 至文字上， 会 display = 'none'
      })
      .on('mousemove', () => {
        oDiv.style.display = 'block'
        oDiv.style.left = d3.event.pageX - oDiv.offsetWidth / 2 + 'px'
        oDiv.style.top = d3.event.pageY - oDiv.offsetHeight - 5 + 'px'
      })
      .on('mouseout', () => {
        oDiv.style.display = 'none'
      });
  }
}

// --
function drawHeatMap(container, options) {
  container.innerHTML = '' // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data || {},
    blocks = options.blocks || {},
    gap = blocks.gap,
    svgWidth = container.offsetWidth,
    svgHeight = container.offsetHeight,
    padding = options.padding || {
      top: 40,
      left: 40,
      right: 40,
      bottom: 40
    },
    axisHeight = svgHeight - padding.top - padding.bottom,
    axisWidth = svgWidth - padding.left - padding.right,
    maxVal = Math.max.apply(null, flatten(data)),
    interpolateColor = d3.interpolate(blocks['minColor'], blocks['maxColor'])

  const // 定义画布 & g_wrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  // draw blocks
  let blockHeight = axisHeight / data.length - gap
  for (let i = 0; i < data.length; i++) {
    let blockWidth = axisWidth / data[i].length - gap
    g.append('g')
      .attr('class', 'g-row')
      .selectAll('rect')
      .data(data[i])
      .enter()
      .append('rect')
      .attr('height', blockHeight)
      .attr('width', blockWidth)
      .attr('x', (d, i) => (blockWidth + gap) * i)
      .attr('y', d => (blockHeight + gap) * i)
      .attr('fill', d => interpolateColor(d / maxVal))
  }
}

// --
function drawOneLine(container, options) {
  container.innerHTML = ''; // 清空 容器内容

  const // *** 全局数据 ***
    data = options.data,
    line = options.line || { color: 'steelblue' },
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
    axisHeight = svgHeight - padding.top - padding.bottom

  data.date = data.date.map(parseStamp2Day) // parse date
  const lineData = zip(data.date, data.val) // 将数据处理成 d3.line()可用的数据

  const // 定义画布 & gWrawp
    svg = d3.select(container).append('svg')
      .attr('width', svgWidth).attr('height', svgHeight),
    g = svg.append('g').attr('class', 'gWrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

  const // 比例尺
    x = d3.scaleBand()
      .domain(data.date)
      .range([0, axisWidth])
  x.align(0)

  const
    y = d3.scaleLinear().range([axisHeight, 0])
    axis.yClamp && axis.yClamp.length === 2
      ? y.domain([axis.yClamp[0], axis.yClamp[1]])
      : y.domain([0, d3.max(data.val) * 1.1])

  try { // backgroundBar
    const bgBar = options.bgBar || {}
    if (bgBar.show) {
      bgBar.padding ? x.padding(bgBar.padding) : x.padding(0.5)
      const gBGbars = g.append('g').attr('class', 'bg-bars');

      // draw bgBar
      gBGbars
        .attr('fill', d => bgBar.color || '#666')
        .attr('fill-opacity', bgBar.opacity || 0.5)
        .selectAll('rect')
        .data(data.date)
        .enter()
        .append('rect')
        .attr('x', (d, i) => x(data.date[i]))
        .attr('y', 0)
        .attr('width', x.bandwidth())
        .attr('height', axisHeight)
    }
  } catch (e) {
    console.warn('others - backgroundBar:\n', e)
  }

  try { // draw area
    const area = options.area || {}
    if (area.show) {
      const areaPath = d3.area()
        .x(d => x(d[0]) + x.bandwidth() / 2)
        .y0(() => axisHeight)
        .y1(d => y(d[1]))
        .curve(d3.curveCatmullRom.alpha(0.99))

      g.append('path')
        .attr('class', 'area-path')
        .attr('d', areaPath(lineData))
        .attr('fill', area.color)
        .attr('fill-opacity', area.opacity)
    }

    // area 的渐变
    const gradient = area.linearGradient || {}
    if (gradient.show) {

      // define gradient
      let linearGradient = g.append('g')
        .attr('class', 'linearGradient')
        .append('defs')
        .append('linearGradient')
        .attr('id', 'gradientLinear')
        .attr('x1', '50%')
        .attr('y1', '0%')
        .attr('x2', '50%')
        .attr('y2', '100%')

      linearGradient.append('stop')
        .attr('offset', '0%')
        .attr('style', `stop-color:${gradient.topColor}`)
      linearGradient.append('stop')
        .attr('offset', '100%')
        .attr('style', `stop-color:${gradient.bottomColor}`)

      g.select('g.gWrap path.area-path')
        .attr('fill', 'url(#gradientLinear)')
    }
  } catch (e) {
    console.warn('draw area:\n', e)
  }

  try { // draw line

    // 处理数据，以符合 d3.line()
    const linePath = d3.line()
      .x(d => x(d[0]) + x.bandwidth() / 2)
      .y(d => y(d[1]))
      .curve(d3.curveCatmullRom.alpha(0.99))

    g.append('path')
      .attr('class', 'line-path')
      .datum(lineData)
      .attr('d', linePath)
      .attr('fill', 'none')
      .attr('stroke', d => line.color || 'steelblue')
      .attr('stroke-width', d => line.width || 2)
      .attr('stroke-opacity', d => line.opacity || 0.9)
  } catch (e) {
    console.warn('draw line:\n', e)
  }

  try { // axis相关

    // define axis
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    // 数值轴的 ticks 个数
    axis.yAxisTicksNum && yAxis.ticks(axis.yAxisTicksNum)

    // draw axis
    const gXAxis = g.append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${axisHeight})`)
      .call(xAxis)
    const gYAxisyAxis = g.append('g')
      .attr('class', 'axis yAxis')
      .call(yAxis)

    { // axis unit
      const xAxisUnit = axis.xAxisUnit || {};
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
      const yAxisUnit = axis.yAxisUnit || {};
      if (yAxisUnit.name) {
        gYAxisyAxis
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
    console.warn('axis相关:\n', e);
  }

  try { // splitline相关
    const splitline = options.splitline || {};
    if (splitline.show) {
      g.append('g')
        .attr('stroke', () => splitline.color || '#ccc')
        .attr('stroke-width', () => splitline.lineWidth || 1)
        .attr('stroke-dasharray', () => splitline.dashMode ? '2 5' : 0)
        .attr('class', 'splitline')
        .selectAll('line')
        .data(y.ticks(axis.yAxisTicksNum).slice(1))
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

  (function others() {

    // const tooltip = options.tooltip || {};
    // if (tooltip.show) {// tooltip 相关
    //     const oDiv = document.createElement('div');
    //     oDiv.classList.add('bar-tooltip');
    //     oDiv.style.cssText = 'padding:10px 15px;background:rgba(0,0,0,0.7);position:fixed;color:white;border-radius: 10px;display:none;'
    //     container.appendChild(oDiv);
    //     const rects = g.selectAll('.bars rect');

    //     rects
    //         .on('mousemove', d => {
    //             oDiv.style.left = d3.event.pageX + 2 + 'px';
    //             oDiv.style.top = d3.event.pageY + 2 + 'px';
    //             oDiv.innerHTML = d;
    //             oDiv.style.display = 'block';
    //         })
    //         .on('mouseout', () => oDiv.style.display = 'none');
    // }

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