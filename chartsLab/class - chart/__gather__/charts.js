// --
function oneLine(container, options) {
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
        .attr('fill', d => bgBar.color ? bgBar.color : '#666')
        .attr('fill-opacity', bgBar.opacity ? bgBar.opacity : 0.5)
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
      .attr('stroke', d => line.color ? line.color : 'steelblue')
      .attr('stroke-width', d => line.width ? line.width : 2)
      .attr('stroke-opacity', d => line.opacity ? line.opacity : 0.9)
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
          .attr('fill', () => xAxisUnit.fontColor ? xAxisUnit.fontColor : 'white')
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
          .attr('fill', () => yAxisUnit.fontColor ? yAxisUnit.fontColor : 'white')
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
        .attr('stroke', () => splitline.color ? splitline.color : '#ccc')
        .attr('stroke-width', () => splitline.lineWidth ? splitline.lineWidth : 1)
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