
import CryptoJS from './crypto'

const mode = CryptoJS.mode.CBC
const padding = CryptoJS.pad.Pkcs7

/**
 * @description: unit8数组aes解密
 * @param {Uint8Array} input_uint8Array unit8数组
 * @param {String} input_key 密钥
 * @param {String} input_iv 密钥偏移量
 * @return {Uint8Array} unit8数组
 */
function decrypt(input_uint8Array, input_key = '', input_iv = '') {
  const WordArray = CryptoJS.lib.WordArray.create(input_uint8Array)
  const Base64Str = CryptoJS.enc.Base64.stringify(WordArray)
  const key = CryptoJS.enc.Hex.parse(String(input_key))
  const iv = CryptoJS.enc.Hex.parse(String(input_iv))
  const output = CryptoJS.AES.decrypt(Base64Str, key, { iv, mode, padding })
  const output_uint8Array = CryptoJS.enc.u8array.stringify(output)
  return output_uint8Array
}

/**
 * @description: unit8数组aes加密
 * @param {Uint8Array} input_uint8Array unit8数组
 * @param {string} input_key 密钥
 * @param {string} input_iv 密钥偏移量
 * @return {Uint8Array} unit8数组
 */
function encrypt(input_uint8Array, input_key = '', input_iv = '') {
  const WordArray = CryptoJS.lib.WordArray.create(input_uint8Array)
  console.log('WordArray: ', WordArray)
  const key = CryptoJS.enc.Hex.parse(String(input_key))
  const iv = CryptoJS.enc.Hex.parse(String(input_iv))
  const libWordArray = CryptoJS.AES.encrypt(WordArray, key, {
    iv,
    mode,
    padding
  })
  const output_uint8Array = CryptoJS.enc.u8array.stringify(
    libWordArray.ciphertext
  )
  return output_uint8Array
}

export default {
  decrypt,
  encrypt
}
