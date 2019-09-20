import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { interpolateNumber } from 'd3-interpolate';

// 默认值
const defaults = {
  fill: '#fff', // 字体颜色
  x: '0', // position - x
  y: '0', // position - y
  fontSize: 18, // 字体大小
  unit: '', // 字体后缀
  g: null, // d3-selection-g: 包裹文字的 g 标签
  duration: 1500 // 动画时间
};

// 文字动画
export default class AnimationText {
  /**
   * @type d3-selection-text
   */
  text = null;

  constructor(options) {
    Object.assign(this, defaults, options);
    this.init();
  }

  /**
   * init - <text>
   *
   * @private
   * @param {Object}
   */
  init({ g, x, y, fontSize, fill, duration } = this) {
    if (!g) throw new Error('AnimationText 必须初始化参数 g !');

    // 设动画
    this.t = transition().duration(duration);

    // 初始化文字标签
    this.text = g
      .append('text')
      .attr('fill', fill)
      .attr('font-size', fontSize)
      .attr('x', x)
      .attr('y', y)
      .attr('text-anchor', 'middle');
  }

  /**
   * render - 文字动画
   *
   * @public
   * @param {Number} val 文字动画中的文字
   * @returns {Object} this
   */
  render(val = this.val) {
    const { unit, t, text } = this;
    text
      .transition(t)
      .text(val)
      .tween('d', function () {
        const val = select(this).text();
        const i = interpolateNumber(0, val);

        // 函数每回调一次
        // 相当于动画一帧
        return t => select(this).text((i(t) | 0) + unit);
      });
    return this;
  }
}
