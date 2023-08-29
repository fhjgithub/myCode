
import pako from 'pako'

/**
 * @description: zlib压缩
 * @param {Uint8Array} input_uint8Array unit8数组
 * @return {Uint8Array} unit8数组
 */
function deflate(input_uint8Array) {
  const output_ArrayBuffer = pako.deflate(input_uint8Array)
  return output_ArrayBuffer
}

/**
 * @description: zlib 解压缩
 * @param {Uint8Array} input_uint8Array unit8数组
 * @return {Uint8Array} unit8数组
 */
function inflate(input_uint8Array) {
  const out_uint8Array = pako.inflate(input_uint8Array)
  return out_uint8Array
}

export default {
  deflate,
  inflate
}
