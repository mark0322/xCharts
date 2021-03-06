import * as d3 from 'd3'
import tooltip_wrap from '../_chart_modules/tooltip/tooltipWrap_singleton'

// default config.
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
  axis: { // ** 注： 轴 tick 和 path 样式，用 css 设置 **
    // 共有属性
    tickSize: 4, // 轴刻度的长度
    tickPadding: 8, // label 离轴的距离

    strAxis: { // dimension 轴
      ticksNum: 5
    },
    valAxis: { // measure 轴
      
    }
  },
  splitLine: {
    color: '#74706d',
    lineWidth: 1,
    dasharray: '5 5',
    opacity: 0.5,
  },
  animation: true,
  isHoriz: false, // 将 bar 设为水平
}

export default class BarChart {
  /** 
   * options 必包含以下属性：
   * {
   *  container: document.querySelector('#box'),
   *  strData: ['a', 'b', 'c'],
   *  valData: [11, 22, 33]
   * }
  */
  constructor(options) {
    Object.assign(this, defaults, options)

    this._init()
  }

  _init() {
    const { container, padding, animation, isHoriz } = this
    const { strAxisTicksNum, axisTickPadding, axisTickSize } = this
    this.svgWidth = container.clientWidth
    this.svgHeight = container.clientHeight
    this.axisWidth = this.svgWidth - padding.left - padding.right
    this.axisHeight = this.svgHeight - padding.top - padding.bottom

     // 条形图 or 柱状图
    if (isHoriz) {
      this.strScale = d3.scaleBand().range([this.axisHeight, 0])
      this.valScale = d3.scaleLinear().range([0, this.axisWidth])

      this.strAxis = d3.axisLeft(this.strScale)
        .ticks(strAxisTicksNum)
        .tickPadding(axisTickPadding)
        .tickSize(axisTickSize)
      this.valAxis = d3.axisBottom(this.valScale)
        .tickPadding(axisTickPadding)
        .tickSize(axisTickSize)
    } else {
      this.strScale = d3.scaleBand().range([0, this.axisWidth])
      this.valScale = d3.scaleLinear().range([this.axisHeight, 0])

      this.strAxis = d3.axisBottom(this.strScale)
        .ticks(strAxisTicksNum)
        .tickPadding(axisTickPadding)
        .tickSize(axisTickSize)
      this.valAxis = d3.axisLeft(this.valScale)
        .tickPadding(axisTickPadding)
        .tickSize(axisTickSize)
    }

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
    this.g = this.svg
      .append('g')
      .attr('class', 'g_wrap')
      .attr('transform', `translate(${padding.left}, ${padding.top})`)

    this.g_splitLine = this.g.append('g').attr('class', 'g-warp-splitLine')
    this.g_bars = this.g.append('g').attr('class', 'g-warp-bars')
    this.g_labels = this.g.append('g').attr('class', 'g-warp-labels')
    this.g_axis = this.g.append('g').attr('class', 'g-warp-axis')

    this.t = d3.transition().duration(animation ? 1000 : 0)
  }

  // 输出 strScale & valScale
  processScale({ strData, valData } = this) {
    let { strScale, valScale, bar } = this
    strScale.domain(strData).padding(bar.gap || 0.5)
    valScale.domain([0, d3.max(valData) * 1.1])
    return { strScale, valScale }
  }

  renderChart({ strData, valData } = this) {
    const { strScale, valScale } = this.processScale({ strData, valData })

    const { bar, axisHeight, g_bars, g_labels, t, label, isHoriz } = this

    // g wrap - bar
    const columns = g_bars.selectAll('rect').data(valData)

    // g warp - label
    const labels = g_labels
      .attr('fill', label.color || '#ccc')
      .attr('font-size', label.fontSize || 14)
      .selectAll('text').data(valData)
    
    // mappingColor: function for interpolateColor
    let interpolateColor = null

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
          .range(bar.colorRange)
        return true
      }
      return false
    }
  }

  renderAxis() {
    const { axisHeight, isHoriz, g_axis, strAxis, valAxis } = this

    g_axis.selectAll('g').remove() // update 时，清空之前的 axis

    const gXAxis = g_axis.append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${axisHeight})`)
    const gYAxis = g_axis.append('g')
      .attr('class', 'axis yAxis')

    isHoriz
      ? drawHorizontalAxis()
      : drawVerticalAxis()

    function drawHorizontalAxis() {
      gXAxis.call(valAxis)
      gYAxis.call(strAxis)
    }
    function drawVerticalAxis() {
      gXAxis.call(strAxis)
      gYAxis.call(valAxis)
    }
  }

  tooltip() {
      const oTooltipWrap = tooltip_wrap()
      const { g } = this
      const rects = g.selectAll('.g-warp-bars rect')
  
      rects
        .on('mouseenter', d => {
          oTooltipWrap.innerHTML = d
          oTooltipWrap.style.display = 'block'
        })
        .on('mousemove', () => {
          oTooltipWrap.style.left = d3.event.pageX + 2 + 'px'
          oTooltipWrap.style.top = d3.event.pageY + 2 + 'px'
        })
        .on('mouseout', () => {
          oTooltipWrap.style.display = 'none'
        })
    return this
  }

  renderSplitLine() {
    const { color, lineWidth, dasharray, opacity } = this.splitLine
    const { g_splitLine, isHoriz, axisHeight, axisWidth, valScale } = this

    const splitline = g_splitLine
      .attr('class', 'splitline')
      .attr('stroke', color || '#74706d')
      .attr('stroke-width', lineWidth || 1)
      .attr('opacity', opacity || 0.5)
      .attr('stroke-dasharray', dasharray || '5 5')
      .selectAll('line')
      .data(valScale.ticks().slice(1))

      if (isHoriz) {
        splitline
          .enter()
            .append('line')
          .merge(splitline)
            .attr('x1', valScale)
            .attr('y1', 0)
            .attr('x2', valScale)
            .attr('y2', axisHeight)
        splitline.exit().remove()
      } else {
        splitline
          .enter()
            .append('line')
          .merge(splitline)
            .attr('x1', 0)
            .attr('y1', valScale)
            .attr('x2', axisWidth)
            .attr('y2', valScale)
        splitline.exit().remove()
      }

  }

  // 初次 绘制 chart
  render({ strData, valData } = this) {
    this.renderChart({ strData, valData })
    this.renderAxis()
    this.renderSplitLine()
    return this
  }

  // 更新 chart
  update({ strData, valData } = this) {
    this.render({ strData, valData })
  }
}