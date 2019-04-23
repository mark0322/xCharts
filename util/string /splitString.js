/**
 * 将 字符串str 以指定 步长step 分割为对应数组
 * eg: splitString('1234567890abcde', 3)
 * -> ["123", "456", "789", "0ab", "cde"]
 */

function splitString(str, step, result=[]) {
	result.push(str.slice(0, step));
	str = str.slice(step);
	if (str.length > step) {
		result = splitString(str, step, result);
	} else {
		result.push(str);
	}
	return result;
}

export default splitString;
