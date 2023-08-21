
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
