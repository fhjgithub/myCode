function dataURLToBlob(dataurl) {
  const arr = dataurl.split(',')
  const mime = arr[0].match(/:(.*?);/)[1]
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}

function imgQuality(imgFile, quality = 0.7, returnType = 'base64') {
  // returnType base64 或 Blob
  const imgTypes = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp'
  }

  return new Promise((resolve, reject) => {
    const myImage = document.createElement('canvas')
    const img = new Image()

    img.onload = () => {
      const width = img.width
      const height = img.height
      myImage.width = width
      myImage.height = height
      const ctx = myImage.getContext('2d')

      ctx.drawImage(img, 0, 0, width, height)
      const base64 = myImage.toDataURL(imgType, quality)
      if (returnType !== 'base64') {
        return resolve(dataURLToBlob(base64))
      }
      return resolve(base64)
    }

    img.onerror = () => {
      reject(new Error('图片加载失败！'))
    }

    let imgType = ''

    // 图片为字符串
    if (typeof imgFile === 'string') {
      const imgMatch = imgFile.match(/^data:(image\/(\w+));base64,.+/)

      if (imgMatch) {
        imgType = imgMatch && imgMatch[1]
      }

      if (!imgMatch) {
        const imgExtMatch = imgFile.match(/(\.[^.]+)$/)
        const ext = imgExtMatch && imgExtMatch[1]
        imgType = ext && imgTypes[ext] || ''
      }

      img.src = imgFile
    }

    // 图片为File对象，不支持FileList对象
    if (Object.prototype.toString.call(imgFile) === '[object File]') {
      imgType = imgFile.type
      const reader = new FileReader()
      reader.onload = (evt) => {
        img.src = evt.target.result
      }
      reader.readAsDataURL(imgFile)
    }

    if (!imgType) {
      reject(new Error('仅支持压缩图片'))
    }
  })
}

export default imgQuality
