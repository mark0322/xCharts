/** 
 * 装饰器模式
 */
Function.prototype.after_Decorator = function(fn) {
  const _self = this
 
  return (...args) => {
   const ret = _self(...args)
   fn(...args)
   return ret
  }
 }
 
 Function.prototype.before_Decorator = function(fn) {
  const _self = this
 
  return (...args) => {
   fn(...args)
   return ret = _self(...args)
  } 
 }
 
 
 // eg :
 function a(data) {
  log('a', data)
 }
 function b(data) {
  log('b', data)
 }
 
 a.after_Decorator((data) => log('b', data))('j**')
 // -> a j**
 // -> b j**
 
 a.before_Decorator((data) => log('b', data))('z**')
 // -> b z**
 // -> a z**