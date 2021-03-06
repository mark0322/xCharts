/** 
 * 责任链模式
*/
Function.prototype.after_ChainOfResponsibility = function (fn) {
  // _self 指向调用 .after_ChainOfResponsibility() 的函数本身
  const _self = this

  return (...args) => {
    const ret = _self(...args)

    if (ret === 'nextSuccessor') {
      return fn(...args)
    }

    return ret
  }

}


// eg:
function order500(orderType, pay) {
  if (orderType === 1 && pay === true) {
    log('获得100元优惠券')
  } else {
    return 'nextSuccessor'
  }
}

function order200(orderType, pay) {
  if (orderType === 2 && pay === true) {
    log('获得50元优惠券')
  } else {
    return 'nextSuccessor'
  }
}

function orderNormal(orderType, pay, stack) {
  if (stack > 0) {
    log('正常购买')
  } else {
    throw new Error('无效参数！')
  }
}

const order = order500.after_ChainOfResponsibility(order200).after_ChainOfResponsibility(orderNormal)
order(1, true, 200) // -> 获得100元优惠券
order(2, true, 200) // -> 获得50元优惠券
order(3, false, 200) // -> 正常购买
order(3, false, 0) // -> 无库存