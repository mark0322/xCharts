import * as d3 from 'd3'


// default config.
const defaults = {
  padding: 40,

  // name 值
  name: '',
  nameSize: 24,
  nameColor: '#aaa',
  nameDy: '0em',

  val: null, // 必填， val 值 (number 类型)
  maxVal: null, // 必填，圆环的最大值
  valUnit: '', // val 单位 (可选)
  valSize: 64,
  valColor: '#fff',
  valDy: '0.5em',

  isRoundCap: true, // 是否为圆角
  
  donutColor: '#e38', // 圆环颜色
  bgDonutColor: '#ccc', // 背景环的颜色
  hasBGDonut: true,
  thickness: 12, // 环的宽度
  container: null, // 必填
  animation: true
}

export default class Donut {
  /** 
   * 指定 container 为绘图容器， 圆环自动撑满该容器
   * @param options 中必须包含
  */
  constructor(options) {
    // mixin
    Object.assign(this, defaults, options)

    this._init()
  }

  _init() {
    const { container, animation, padding } = this

    this.svgHeight = container.clientHeight - padding * 2
    this.svgWidth = container.clientWidth - padding * 2

    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.svgWidth)
      .attr('height', this.svgHeight)
      .attr('transform', `translate(${padding}, ${padding})`)

    this.t = d3.transition().duration(animation ? 1000 : 0)
  }

  getArcPath() {
    const { svgHeight, svgWidth, thickness, isRoundCap } = this

    const outerRadius = svgHeight > svgWidth
      ? svgWidth / 2
      : svgHeight / 2
    const innerRadius = outerRadius - thickness

    const arcPath = d3.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0)
    if (isRoundCap) {
      arcPath.cornerRadius(outerRadius - innerRadius)
    }
    return arcPath
  }

  renderVal(val = this.val) {
    const { svg, svgHeight, svgWidth, t } = this
    const { valColor, valDy, valSize, valUnit } = this
    if (!val) throw new Error('未初始 val 值！')

    svg.select('g.g-val').remove()
    const g = svg.append('g')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`)
      .attr('class', 'g-val')

    g.append('text')
      .attr('fill', valColor)
      .attr('font-size', valSize)
      .attr('dy', valDy)
      .attr('text-anchor', 'middle')
      .transition(t)
      .text(val)
      .tween('d', function() {
        const val = d3.select(this).text()
        const i = d3.interpolateNumber(0, val)
        return t => {
          d3.select(this).text((i(t) | 0) + valUnit)
        }
      })

    return this
  }

  renderName() {
    const { svg, svgHeight, svgWidth, t } = this
    const { name, nameColor, nameDy, nameSize } = this
    if (!name) throw new Error('未初始 name 值！')

    svg.select('g.g-name').remove()
    const g = svg.append('g')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 4})`)
      .attr('class', 'g-name')

    g.append('text')
      .attr('fill', nameColor)
      .attr('font-size', nameSize)
      .attr('dy', nameDy)
      .attr('text-anchor', 'middle')
      .transition(t)
      .text(name)

    return this
  }

  randerDonut({ val, maxVal } = this) {
    const { getArcPath, svg, svgWidth, svgHeight, bgDonutColor, donutColor, t } = this
    if (!(val && maxVal)) throw new Error('未初始 val 或 maxVal 值！')

    const arcPath = getArcPath.call(this)

    svg.select('g.g-donut').remove()
    const g = svg.append('g')
      .attr('class', 'g-donut')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`)

    // bgdonut
    g.append('path')
      .datum({ endAngle: Math.PI * 2 })
      .attr('class', 'bg-donut')
      // .attr('d', arcPath)
      .attr('d', arcPath)
      .attr('fill', bgDonutColor)
      .attr('opacity', '0.3')
    
    // actucl donut
    const rate = val / maxVal
    g.append('path')
      .datum({ endAngle: Math.PI * 2 * rate })
      .attr('class', 'actual-donut')
      // .attr('d', arcPath)
      .attr('fill', donutColor)
      .transition(t)
      .attrTween('d', d => {
        const i = d3.interpolate(0, d.endAngle)
        return t => {
          d.endAngle = i(t)
          return arcPath(d)
        }
      })

    return this
  }

}