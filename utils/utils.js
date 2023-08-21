/**
* @param { Promise } 传进去的请求函数
* @param { Object= } errorExt - 拓展错误对象
* @return { Promise } 返回一个Promise
*/
export function to(
  promise,
  errorExt
) {
  return promise
    .then(data => [null, data])
    .catch(err => {
      if (errorExt) {
        const parsedError = Object.assign({}, err, errorExt)
        return [parsedError, undefined]
      }

      return [err, undefined]
    })
}

export default to


// 输入去除emoji
{/* <el-input v-model.trim="roadTransport.addr" maxlength="50" placeholder @keyup.native="testEmoji"/> */}
{/* <el-input v-model.number="roadTransport.optRange" maxlength="50" placeholder @keyup.native="testEmoji"/> */}
function testEmoji() {
  const regRule = /\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g
  if (regRule.test(this.roadTransport.addr)) {
    this.roadTransport.addr = this.roadTransport.addr.replace(regRule, '')
  }
  if (regRule.test(this.roadTransport.optRange)) {
    this.roadTransport.optRange = this.roadTransport.optRange.replace(regRule, '')
  }
}
/**
 * 去除文本中的emoji
 * @param text 文本
 */
 export const filterEmoji = text => {
  return text.replace(/(^\s*)|(\s*$)/g, '').replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/ig, '')
}