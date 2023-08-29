
import AES from './aes'
import ZLIB from './zlib'
import {
  uint8ArrayToString,
  stringToUint8Array,
  mergeArrayBuffer
} from './index'

/**
 * @description: 字符串编码成业务二进制流
 * @param {string} utf8_str 字符串
 * @param {string} keyValue 密钥
 * @param {string} keyIv 密钥偏移量
 * @return {ArrayBuffer} 编码后的二进制流
 */
export const encode = (utf8_str, keyValue, keyIv) => {
  return AES.encrypt(
    ZLIB.deflate(stringToUint8Array(utf8_str)),
    keyValue,
    keyIv
  )
}

/**
 * @description: 业务二进制流解码成字符串
 * @param {ArrayBuffer} arrayBuffer 二进制流
 * @param {string} keyValue 密钥
 * @param {string} keyIv 密钥偏移量
 * @return {string} 解码后的字符串
 */
export const decode = (arrayBuffer, keyValue, keyIv) => {
  return uint8ArrayToString(
    ZLIB.inflate(AES.decrypt(arrayBuffer, keyValue, keyIv))
  )
}

/**
 * @description: 组装通信数据包
 * @param {ArrayBuffer} arrayBuffer 二进制流
 * @param {number} actionType
 *  通信的动作类型
    CONNECT = 1, //连接
    UP = 2, //上行业务
    DOWN = 3, //下行业务
    ACK = 5, //回执
    PING = 6, //心跳
    PONG = 7, //心跳响应
    DISCONNECT = 8 //断连
 * @return {arrayBuffer} 组装后的二进制流
 */
export const pack = (bodyBuffer, actionType) => {
  const headerBuffer = new ArrayBuffer(8)
  const headerView = new DataView(headerBuffer, 0)
  headerView.setUint32(0, bodyBuffer.byteLength, true)
  headerView.setUint8(4, actionType, true)
  return mergeArrayBuffer(headerBuffer, bodyBuffer)
}

/**
 * @description: 解析通信数据包
 * @param {ArrayBuffer} receiveBuffer 二进制流
 * @return {Array[ArrayBuffer, number]} [业务二进制流，通信的动作类型]
 */
export const unPack = receiveBuffer => {
  const headerView = new DataView(receiveBuffer, 0, 8)
  const actionType = headerView.getUint8(4, true)
  const bodyBuffer = receiveBuffer.slice(8, receiveBuffer.byteLength + 1)
  return [bodyBuffer, actionType]
}
