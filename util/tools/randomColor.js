/** 
 * 返回随机反色（默认返回 16 进制的随机颜色）
 * @param {Boolean} isRGB 当为 true 时， 返回 rgb 格式颜色
 * @return {String}
 */
function randomColor(isRGB) {
	let r = Math.random() * 256 | 0;
	let g = Math.random() * 256 | 0;
	let b = Math.random() * 256 | 0;
	if (isRGB) {
		return `rgb(${r},${g},${b})`;
	}
	r = r < 17 ? '0' + r.toString(16) : r.toString(16);
	g = g < 17 ? '0' + g.toString(16) : g.toString(16);
	b = b < 17 ? '0' + b.toString(16) : b.toString(16);
	return '#' + r + g + b;
}