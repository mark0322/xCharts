import * as d3 from 'd3'
import { flatten } from '../../util/array'

const defaults = {
  animation: true,
  gap: 2, // block 间的间隙
  padding: {
      top: 100,
      left: 80,
      right: 150,
      bottom: 20
  },
  barColor: '#20c1bd',
  colorRange: ['#fff', '#20c1bd'], // heatmap 的颜色区间
  labelColor: '#333',
  labelFontSize: 14,
  tickColor: '#555',
  tickSize: 10
}

export default class Heatmap {
  /**
   * @param {Object} options
   * 配置项属性
   * {
   *   container: document.querySelector('#box'),  // 必须
   *   data // 可选, 亦可在 render(data) 加入 data
   *   defaults // 可选， 即覆盖 defaults 的默认参数
   * }
   *
   * @example
   * data: [
   *  {count: '64', x_category: "TPU", y_category: "住宿"}, {count: '98', x_category: "TPU", y_category: "境外度假"}, {count: '24', x_category: "TPU", y_category: "大交通"},
   *  {count: '91', x_category: "销售", y_category: "住宿"}, {count: '78', x_category: "销售", y_category: "境外度假"}, {count: '57', x_category: "销售", y_category: "大交通"},
   *  {count: '24', x_category: "客服", y_category: "住宿"}, {count: '18', x_category: "客服", y_category: "境外度假"}, {count: '94', x_category: "客服", y_category: "大交通"},
   *  {count: '124', x_category: "其他", y_category: "住宿"}, {count: '118', x_category: "其他", y_category: "境外度假"}, {count: '104', x_category: "其他", y_category: "大交通"},
   * ]
   */
  constructor(options) {
    Object.assign(this, defaults, options)

    this._init()
  }

  // 初始化：全局属性和方法
  _init() {
    const { container, padding, colorRange, animation } = this

    this.svgWidth = container.clientWidth
    this.svgHeight = container.clientHeight
    this.axisWidth = this.svgWidth - padding.left - padding.right
    this.axisHeight = this.svgHeight - padding.top - padding.bottom

    this.svg = d3
        .select(container)
        .append('svg')
        .attr('width', this.svgWidth)
        .attr('height', this.svgHeight)
    this.g = this.svg
        .append('g')
        .attr('class', 'g_wrap')
        .attr('transform', `translate(${padding.left}, ${padding.top})`)

    this.interpolateColor = d3.interpolate(...colorRange)

    this.x = d3.scaleBand().range([0, this.axisWidth])
    this.y = d3.scaleBand().range([0, this.axisHeight])

    this.t = d3.transition().duration(animation ? 800 : 0)

    this.g_axis = this.g.append('g').attr('class', 'g-warp-axis')
    this.g_heatmap_wrap = this.g.append('g').attr('class', 'g-warp-heatmap')
    this.g_topSideBar_wrap = this.g.append('g').attr('class', 'g-warp-topsidebar')
    this.g_rightSideBar_wrap = this.g.append('g').attr('class', 'g-warp-rightsidebar')
  }

  /**
   * @private
   * 对 y_category 进行 groupby,
   * 将 data 转为 绘制 heatmap 可用的数据
   * @return this.data_heatmap 全局属性
   */
  processDataForDrawHeatmap(data = this.data) {
    this.data_heatmap = d3
      .nest()
      .key(d => d.y_category)
      .entries(data)
      .map(d => d.values)
  }

  /** 
   * 指定 x / y 的 domain
   * 计算 xTicks / yTicks
   * 注：必须在 processDataForDrawHeatmap() 后执行
   */
  processScale() {
    const xTicks = this.data_heatmap[0].map(d => d.x_category)
    const yTicks = this.data_heatmap.map(d => d[0].y_category)

    const { x, y } = this
    x.domain(xTicks)
    y.domain(yTicks)
    return { x, y, xTicks, yTicks }
  }

  renderAxis() {
    const { g_axis, axisHeight, x, y, tickColor, tickSize, t } = this

    g_axis.selectAll('g').remove() // update 时，清空之前的 axis

    // define axis
    const xAxis = d3.axisBottom(x)
    const yAxis = d3.axisLeft(y)

    // draw axia
    g_axis
      .append('g')
      .attr('class', 'axis xAxis')
      .attr('transform', `translate(0, ${axisHeight})`)
      .transition(t)
      .call(xAxis)
    g_axis
      .append('g')
      .attr('class', 'axis yAxis')
      .transition(t)
      .call(yAxis)

    // axis style
    g_axis.selectAll('g.axis path').remove()
    g_axis.selectAll('g.axis g.tick line').remove()
    g_axis
      .selectAll('g.axis g.tick text')
      .attr('fill', tickColor)
      .attr('font-size', tickSize)
    g_axis.selectAll('g.yAxis-scaleBand g.tick text').attr('dx', '5')
  }

  renderHeatmap(data = this.data) {
    const { axisWidth, axisHeight, data_heatmap, gap } = this
    const { t, labelFontSize, labelColor } = this

    this.g_heatmap_wrap.select('g').remove() // update 时，清空之前的 chart
    const g_heatmap_wrap = this.g_heatmap_wrap.append('g')

    // 获取 data 中，max(count)
    const maxVal = d3.max(flatten(data), d => Number(d.count))

    const blockHeight = axisHeight / data_heatmap.length - gap
    const blockWidth = axisWidth / data_heatmap[0].length - gap
    for (let i = 0, l = data_heatmap.length; i < l; i++) {
      const g_row = g_heatmap_wrap.append('g').attr('class', 'g-row')
      const g_block = g_row
        .selectAll('g')
        .data(data_heatmap[i])
        .enter()
        .append('g')
        .attr('class', 'g-block')
        .attr('transform', (d, j) => {
            return `translate(
                ${(blockWidth + gap) * j},
                ${(blockHeight + gap) * i}
            )`;
        })

      // draw block
      g_block
        .append('rect')
        .transition(t)
        .attr('height', blockHeight)
        .attr('width', blockWidth)
        .attr('fill', d => this.interpolateColor(d.count / maxVal))

      // draw label
      g_block
        .append('text')
        .transition(t)
        .attr('x', blockWidth / 2)
        .attr('y', blockHeight / 2)
        .attr('dy', '0.5em')
        .attr('text-anchor', 'middle')
        .text(d => d.count)
        .attr('fill', labelColor)
        .attr('font-size', labelFontSize)
    }
  }

  renderTopSideBar(data = this.data) {
    const { padding, x, g_topSideBar_wrap, gap } = this
    const { barColor, labelColor, labelFontSize, t } = this

    /**
     * 获得 top side bar chart的数据
     * @return {Array}
     * @example [
     *   {x_category: 'TPU类', count: 163},
     *   {x_category: '销售类', count: 213},
     *   ...
     * ]
     */
    const data_topSide_bar = d3.nest()
      .key(d => d.x_category)
      .entries(data)
      .map(d => d.values)
      .reduce((a, v) => {
          a.push({
              x_category: v[0].x_category,
              count: d3.sum(v, d => d.count)
          })
          return a
      }, [])

    const max_count_category = d3.max(data_topSide_bar, d => d.count)
    const min_count_category = d3.min(data_topSide_bar, d => d.count)

    const y_scaleLinear_topSide = d3.scaleLinear()
      .domain([min_count_category * 0.7, max_count_category * 1.05])
      .range([0, padding.top])

    g_topSideBar_wrap.select('g').remove() // update 时，清空之前的内容

    // draw top side barChart
    const bar_wrap = g_topSideBar_wrap
      .append('g')
      .attr('transform', `translate(0, ${-padding.top - gap})`)
      .selectAll('rect')
      .data(data_topSide_bar)
      .enter()
      .append('g')
      .attr('class', 'g-topSide-singleBar')
      .attr('transform', d => {
          return `translate(${x(d.x_category)}, ${padding.top -
              y_scaleLinear_topSide(d.count)})`
      })

    bar_wrap
      .append('rect')
      .transition(t)
      .attr('width', x.bandwidth() - gap)
      .attr('height', d => y_scaleLinear_topSide(d.count))
      .attr('fill', barColor)
    bar_wrap
      .append('text')
      .text(d => d.count)
      .attr('y', '1em')
      .attr('text-anchor', 'middle')
      .attr('fill', labelColor)
      .attr('font-size', labelFontSize)
      .transition(t)
      .attr('x', x.bandwidth() / 2)
  }

  renderRightSideBar(data = this.data) {
    const { padding, y, g_rightSideBar_wrap, gap, axisWidth } = this
    const { barColor, labelColor, labelFontSize, t } = this

    /**
     *  右侧 bar chart的数据
     * @return {Array}
     * @example [
     *   {y_category: '住宿', count: 163},
     *   {y_category: '大交通', count: 213},
     *   ...
     * ]
     */
    const data_rightSide_bar = d3
      .nest()
      .key(d => d.y_category)
      .entries(data)
      .map(d => d.values)
      .reduce((a, v) => {
          a.push({
              y_category: v[0].y_category,
              count: d3.sum(v, d => d.count)
          })
          return a
      }, [])
    const max_count_BU = d3.max(data_rightSide_bar, d => d.count)
    const min_count_BU = d3.min(data_rightSide_bar, d => d.count)

    const x_scaleLinear_rightSide = d3.scaleLinear()
      .domain([min_count_BU * 0.6, max_count_BU * 1.05])
      .range([0, padding.right])

    g_rightSideBar_wrap.select('g').remove() // update 时，清空之前的内容

    // draw right side barChart
    const bar_wrap = g_rightSideBar_wrap
      .append('g')
      .attr('class', 'g-rightSide-bar')
      .attr('transform', `translate(${axisWidth}, 0)`)
      .selectAll('rect')
      .data(data_rightSide_bar)
      .enter()
      .append('g')
      .attr('class', 'g-rightSide-singleBar')
      .attr('transform', d => `translate(0, ${y(d.y_category)})`)

    bar_wrap
      .append('rect')
      .attr('fill', barColor)
      .transition(t)
      .attr('height', y.bandwidth() - gap)
      .attr('width', d => x_scaleLinear_rightSide(d.count))
    bar_wrap
      .append('text')
      .text(d => d.count)
      .attr('y', y.bandwidth() / 2)
      .attr('dy', '0.3em')
      .attr('text-anchor', 'end')
      .attr('fill', labelColor)
      .attr('font-size', labelFontSize)
      .transition(t)
      .attr('x', d => x_scaleLinear_rightSide(d.count) - 4)
  }

  renderSideBar(data = this.data) {
    this.isRenderSideBar = true
    this.renderTopSideBar(data)
    this.renderRightSideBar(data)
  }

  render(data = this.data) {
    this.processDataForDrawHeatmap(data)
    this.processScale()
    this.renderHeatmap(data)
    this.renderAxis()

    return this
  }

  update(data) {
    if (!data) throw new Error('update()中需包含新数据！')
    if (this.isRenderSideBar) {
        this.renderSideBar(data)
    }
    this.render(data)
  }
}