import SparkMD5 from 'spark-md5'

function fileMD5(file, callback) {
  const blobSlice =
    File.prototype.slice ||
    File.prototype.mozSlice ||
    File.prototype.webkitSlice
  const chunkSize = 2097152 // Read in chunks of 2MB
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()

  fileReader.onload = function (e) {
    // console.log('read chunk nr', currentChunk + 1, 'of', chunks)
    spark.append(e.target.result) // Append array buffer
    currentChunk++

    if (currentChunk < chunks) {
      loadNext()
    } else {
      const md5 = spark.end()
      // console.log('finished loading')
      // console.info('computed hash', md5) // Compute hash
      callback(md5)
    }
  }

  fileReader.onerror = function () {
    console.warn('oops, something went wrong.')
    callback(null)
  }

  function loadNext() {
    const start = currentChunk * chunkSize
    const end = start + chunkSize >= file.size ? file.size : start + chunkSize

    fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
  }

  loadNext()
}

const parseStrToFile = (str, fileType) => {
  let idx = str.length
  const fix = fileType.match(/\/?([^/]+)$/)[1]
  const u8Arr = new Uint8Array(str.length)
  while (idx--) {
    u8Arr[idx] = str.charCodeAt(idx)
  }
  const name = Math.random().toString().slice(2).concat(`.${fix}`)
  return new window.File([u8Arr], name, {
    type: fileType,
    lastModified: new Date()
  })
}

/**
 *
 * @param {*} file 上传的文件对象
 * @param {*} uploadMode 上传文件模式
 */
const doUploadFile = ({
  request,
  file,
  group = 'test_group',
  module = 'test_module',
  uploadMode = 'CDN'
  // type
}) => {
  // type = type || 'file'
  const promUpload = new Promise((resolve, reject) => {
    fileMD5(file, md5 => {
      if (!md5) {
        console.error('cal file md5 failed!')
        reject('cal file md5 failed!')
      }
      const data = new FormData()
      data.append('file', file)
      data.append('md5', md5)
      data.append('contentType', file.type)
      data.append('group', group)
      data.append('module', module)
      data.append('fileLength', file.size)
      data.append('mode', uploadMode)
      request({
        url: `baidu/upload`,
        method: 'post',
        config: {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        },
        data
      })
        .then(res => {
          if (res && res.code === 1) {
            res.data.fileName = file.name
            res.data.fileMd5 = md5
            res.data.uid = file.uid
            res.data.size = file.size
          }
          resolve(res)
        })
        .catch(err => {
          reject(err)
        })
    })
  })
  promUpload.abort = () => {}
  return promUpload
}

export { parseStrToFile, doUploadFile }
