/**
 * @description 对输入变量进行校验
 * @param value 输入的字符串
 * @returns 错误信息
 */
 export const templateContentVarCheck = (value) => {
  /**
   * ：\uFF1A
   */
  const symbolReg = /^[\u4e00-\u9fa5a-zA-Z0-9,~\/\!！\n\\\uFF1A/\s/:\.\^…￥=\}_\-\(【】《》？\?\)。{，。@#\$%&\*（）\+]*$/g
  const text = value || ''
  let errMsg
  if (text) {
    // 去除变量后剩余的值
    const _val = text.replace(/(\$\{[\S\s]*?})|(#{[\S\s]*?})/g, '')
    // 对变量进行分组
    const matchText = text.match(/(\$\{[\S\s]*?})|(#{[\S\s]*?})/g)
    if (!_val) {
      errMsg = '不可支持全变量'
    } else if (!symbolReg.test(text)) {
      errMsg = '仅允许输入：中英文、数字、字符、（不支持[]￥、★以及通过按键录入的组合型特殊符号，例如^_^&、☞、√、※等，以免引起内容出现乱码。）'
    } else if (Array.isArray(matchText)) {
      matchText.forEach((ele) => {
        /** 真实变量名 */
        const varName = ele.slice(2, ele.length - 1)
        /**
         * 1、首字母必须为英文字母，只支持字母、数字和下划线组成
         * 2、不能为纯数字
         */
        if (!varName) {
          errMsg = '变量不能为空'
        } else if (varName.length > 50) {
          errMsg = `变量(${varName})长度不能超过50`
        } else if (!/[a-zA-Z]/.test(varName.charAt(0))) {
          errMsg = `变量(${varName})首字母必须为英文字母`
        } else if (!/^[a-zA-Z0-9_]+$/.test(varName)) {
          errMsg = `变量(${varName})只支持字母、数字和下划线组成`
        } else if (/^\d$/.test(varName)) {
          errMsg = `变量(${varName})不能为纯数字`
        } else if (['email', 'mobile', 'id', 'nick', 'site'].includes(varName)) {
          errMsg = `变量(${varName})不能为email、mobile、id、nick、site`
        }
      })
    }
  } else {
    errMsg = '请输入'
  }
  return errMsg
}
