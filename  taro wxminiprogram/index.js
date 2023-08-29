
// 1 微信ArrayBuffer转图片
const url = 'data:image/jpg;base64,' + wx.arrayBufferToBase64(res.data)
base64src(url, (res) => {
  this.url = res
})
const base64src = (base64data, fun) => {
  const base64 = base64data // base64格式图片
  const time = new Date().getTime()
  const imgPath = wx.env.USER_DATA_PATH + '/poster' + time + 'share' + '.png'
  // 如果图片字符串不含要清空的前缀,可以不执行下行代码.
  const imageData = base64.replace(/^data:image\/\w+;base64,/, '')
  const file = wx.getFileSystemManager()
  file.writeFileSync(imgPath, imageData, 'base64')
  fun(imgPath)
}

//关键词html高亮
function keyWordHtml(str, word) {
  if (word.length > 0) {
    const newStr = str.replaceAll(
      word,
      `<span style="color: #175CE6">${word}</span>`
    )
    return `<div style="${richStyle}">${newStr}</div>`
  }
  return `<div style="${richStyle}">${str}</div>`
}

//自定义状态栏
/**
 * 获取导航栏信息
 * @typedef {Object} NavigationBarInfo
 * @property {number} statusBarHeight
 * @property {number} navBarHeight
 * @returns {NavigationBarInfo} 导航栏信息
 */
 export const getNavigationBarInfo = () => {
  const menuButtonObject = Taro.getMenuButtonBoundingClientRect() // 获取胶囊对象
  const sysInfo = Taro.getSystemInfoSync() // 获取设备系统对象
  const statusBarHeight = sysInfo.statusBarHeight // 获取状态栏高度
  const menuButtonHeight = menuButtonObject.height // 获取胶囊顶部高度
  const menuButtonTop = menuButtonObject.top // 获取胶囊距离顶部的高度
  const navBarHeight =
    statusBarHeight +
    menuButtonHeight +
    (menuButtonTop - statusBarHeight) * 2 // 计算nav导航栏的高度

  return {
    statusBarHeight,
    navBarHeight: navBarHeight + 4
  }
}
