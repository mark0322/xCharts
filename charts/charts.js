function lines(container, options) {
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
      .curve(d3.curveCatmullRom.alpha(0.99))

    // draw lines
    const gWrapLines = g.append('g').attr('class', 'gWrapLines')

    for (let item of linesName) {
      gWrapLines
        .append('path')
        .attr('class', item)
        .datum(zip(aDateForXAxis, data.val[item]))
        .attr('d', linePath)
        .attr('fill', 'none')
        .attr('stroke', z(item))
        .attr('stroke-width', d => lines.width ? lines.width : 2)
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
          .attr('fill', () => xAxisUnit.fontColor ? xAxisUnit.fontColor : 'white')
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
          .attr('fill', () => yAxisUnit.fontColor ? yAxisUnit.fontColor : 'white')
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
        .attr('stroke', () => splitline.color ? splitline.color : '#ccc')
        .attr('stroke-width', () => splitline.lineWidth ? splitline.lineWidth : 1)
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

      // div - tooltips 框
      const oDiv = document.createElement('div')
      oDiv.classList.add('bar-tooltip')
      oDiv.style.cssText =
        `padding:10px 15px;
        background:rgba(0,0,0,0.7);
        position:fixed;
        color:white;
        border-radius: 10px;
        display:none;
        z-index:9999;`

      container.appendChild(oDiv);
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
        .attr('fill', d => bgBar.color ? bgBar.color : '#666')

      // tooltips
      // 注：需额外使用css
      let offsetXPos = 2 // 记录 tooltips 在X轴的偏移量
      gBGbars.selectAll('rect')
        .data(options.aHoverData)
        .on('mouseenter', d => {
          oDiv.innerHTML = ''
          oDiv.style.display = 'block'

          let tooltipWrap = d3.select(oDiv)
          tooltipWrap.append('p')
            .text(parseStamp2DayIncludeYear(d['date']))
            .attr('class', 'tooltip-date')

          let tooltipsRow = tooltipWrap.append('div')
            .attr('class', 'tooltip-body')
            .selectAll('div')
            .data(Object.entries(d['list']))
            .enter()
            .append('div')
            .attr('class', 'tooltip-row')

          tooltipsRow.append('span')
            .attr('class', 'tooltip-row-dot')
            .style('background', d => z(d[0]))
          tooltipsRow.append('span')
            .attr('class', 'tooltip-row-name')
            .text(d => d[0] + ': ')
          tooltipsRow.append('span')
            .attr('class', 'tooltip-row-val')
            .text(d => d[1])

          // 鼠标进入 bgBar 时，计算初始 tooltips 在X轴的偏移量
          d3.event.offsetX > svgWidth / 2 ?
            offsetXPos = -oDiv.offsetWidth - 2 :
            offsetXPos = 2
        })
        .on('mousemove', () => {
          oDiv.style.left = d3.event.pageX + offsetXPos + 'px'
          oDiv.style.top = d3.event.pageY + 2 + 'px'
        })
        .on('mouseout', () => {
          oDiv.style.display = 'none'
        })
    }
  } catch (e) {
    console.warn('others - backgroundBar:\n', e)
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

// --
function bubbles(container, options) {
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
    .padding(() => bubbles.padding ? bubbles.padding : 3)
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