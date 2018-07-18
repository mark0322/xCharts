import * as d3 from 'd3'
import Text from '../Text/Text'

// default config.
const defaults = {
  padding: 40,
  container: null, // options中，必填

  // 供继承 extends Text 使用
  // 避免 Text 类多绘 svg 画布
  hasSvg: true,

  name: '', // name 值
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
  animation: true
}

export default class Donut extends Text {
  constructor(options) {
    Object.assign(defaults, options)
    super(defaults)

    Object.assign(this, defaults)
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
      .attr('d', arcPath)
      .attr('fill', bgDonutColor)
      .attr('opacity', '0.3')
    
    // actucl donut
    const rate = val / maxVal
    g.append('path')
      .datum({ endAngle: Math.PI * 2 * rate })
      .attr('class', 'actual-donut')
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