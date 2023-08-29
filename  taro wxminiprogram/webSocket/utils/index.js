
import CryptoJS from './crypto'
const { btoa } = require('./base64')/**
 * @description 基于 Uint8Array 的 ArrayBuffer 转换成字符串
 * @param {Uint8Array} array unit8数组
 * @return {string} utf8字符串
 */
export function uint8ArrayToString(array) {
  const wordArray = CryptoJS.enc.u8array.parse(array)
  const str = CryptoJS.enc.Utf8.stringify(wordArray)
  return str
  // let out, i, c
  // let char2, char3
  // const len = array.length

  // out = ''
  // i = 0

  // while (i < len) {
  //   c = array[i++]
  //   switch (c >> 4) {
  //     case 0:
  //     case 1:
  //     case 2:
  //     case 3:
  //     case 4:
  //     case 5:
  //     case 6:
  //     case 7:
  //       // 0xxxxxxx
  //       out += String.fromCharCode(c)
  //       break
  //     case 12:
  //     case 13:
  //       // 110x xxxx 10xx xxxx
  //       char2 = array[i++]
  //       out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f))
  //       break
  //     case 14:
  //       // 1110 xxxx 10xx xxxx 10xx xxxx
  //       char2 = array[i++]
  //       char3 = array[i++]
  //       out += String.fromCharCode(
  //         ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
  //       )
  //       break
  //   }
  // }

  // return out
}

/**
 * @description 字符串转换为基于 Uint8Array 的 ArrayBuffer
 * @param {string} str utf8字符串
 * @return {Uint8Array} unit8数组
 */
export function stringToUint8Array(str) {
  return new Buffer(String(str))
}

/**
 * @description base64字符串转换成基于 Uint8Array 的 ArrayBuffer
 * @param {string} base64 base64字符串
 * @return {Uint8Array} unit8数组
 */
export function base64ToUint8Array(base64) {
  return new Uint8Array(
    atob(String(base64))
      .split('')
      .map(function(c) {
        return c.charCodeAt(0)
      })
  )
}

/**
 * @description 基于 Uint8Array 的 ArrayBuffer 转换成base64字符串
 * @param {Uint8Array} array unit8数组
 * @return {string} base64字符串
 */
export function uint8ArrayToBase64(array) {
  console.log('array: ', array)
  return btoa(String.fromCharCode.apply(null, array))
}

/**
 * @description 合并多个基于 Uint8Array 的 ArrayBuffer 至同一个 ArrayBuffer 中
 * @param {...ArrayBuffer[]} arrayBuffers ArrayBuffer
 * @returns {ArrayBuffer} ArrayBuffer
 */
export function mergeArrayBuffer(...arrayBuffers) {
  let totalLength = 0
  arrayBuffers.forEach(item => {
    totalLength += item.byteLength
  })

  const result = new Uint8Array(totalLength)
  let offset = 0
  arrayBuffers.forEach(item => {
    result.set(new Uint8Array(item), offset)
    offset += item.byteLength
  })

  return result.buffer
}

/**
 * @description 获取操作系统信息
 * @returns 0:android，1:ios，2:windows，3:mac，4:linux，other
 */
export const getOSInfo = () => {
  var userAgent = navigator.userAgent
  var isAndroid =
    userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1
  if (isAndroid) return 0
  var isIphone = userAgent.indexOf('iPhone') > -1
  if (isIphone) return 1
  var isWin =
    navigator.platform === 'Win32' || navigator.platform === 'Windows'
  if (isWin) return 2
  var isMac =
    navigator.platform === 'Mac68K' ||
    navigator.platform === 'MacPPC' ||
    navigator.platform === 'Macintosh' ||
    navigator.platform === 'MacIntel'
  if (isMac) return 3
  var isLinux = String(navigator.platform).indexOf('Linux') > -1
  if (isLinux) return 4
  return 'other'
}

/**
 * @description 获取浏览器信息
 * @returns {object} {uid():浏览器指纹，type：浏览器类型，version：浏览器版本}
 */
export const getClientInfo = () => {
  const uid = () => {
    var s = []
    var hexDigits = '0123456789abcdef'
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-'

    var uuid = s.join('')

    return uuid
  }

  const explorer = window.navigator.userAgent.toLowerCase()
  let softInfo = {}
  if (explorer.indexOf('msie') >= 0) {
    // ie
    softInfo = { type: 'IE', version: explorer.match(/msie ([\d.]+)/)[1] }
  } else if (explorer.indexOf('firefox') >= 0) {
    // firefox
    softInfo = {
      type: 'Firefox',
      version: explorer.match(/firefox\/([\d.]+)/)[1]
    }
  } else if (explorer.indexOf('chrome') >= 0) {
    // Chrome
    softInfo = {
      type: 'Chrome',
      version: explorer.match(/chrome\/([\d.]+)/)[1]
    }
  } else if (explorer.indexOf('opera') >= 0) {
    // Opera
    softInfo = { type: 'Opera', version: explorer.match(/opera.([\d.]+)/)[1] }
  } else if (explorer.indexOf('Safari') >= 0) {
    // Safari
    softInfo = {
      type: 'Safari',
      version: explorer.match(/version\/([\d.]+)/)[1]
    }
  } else {
    //
    softInfo = { type: 'Unknow', version: 'Unknow' }
  }

  return { uid: uid(), ...softInfo }
}
