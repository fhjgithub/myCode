
import * as packet from './utils/packet'
import globalApi from '@/config/globalApi.js'

import {
  uint8ArrayToBase64,
  stringToUint8Array,
  getOSInfo,
  getClientInfo
} from './utils/index'
/** webSocket 请求封装 */
class InitWebSocket {
  constructor({ url, keyValue, keyIv, auth }) {
    const _this = this

    _this.url = url
    _this.keyValue = keyValue
    _this.keyIv = keyIv
    _this.auth = auth

    _this.msgId = 0
    _this.lockReconnect = true // 避免重连的机制
    _this.reConnectNum = 0 // 连接之后发起重连的次数

    _this.try = null // 尝试重连
    _this.heartBeatClock = null // 心跳连接的setTimeout函数

    _this.HeartCheck = {
      timeout: _this.auth.content.keepAlive * 1000,
      timeoutObj: null,
      reset: function() {
        clearTimeout(this.timeoutObj)
        this.start()
      },
      start: function() {
        this.timeoutObj && clearTimeout(this.timeoutObj)
        this.timeoutObj = setTimeout(() => {
          _this.send({}, 6)
        }, this.timeout)
      },
      stop: function() {
        this.timeoutObj && clearTimeout(this.timeoutObj)
      }
    }

    _this.initWebSocket = function() {
      _this.lockReconnect = false
      // 开启一个新的webSockt
      _this.websocket = globalApi.connectSocket({
        url: _this.url,
        success: function () {
          console.log('connect success')
        }
      }).then(task => {
        _this.websocket = task
        // 连接成功后开始鉴权
      })
      globalApi.onSocketOpen((e) => {
        _this.onlog('[webSocket.connected]')
        // 组装鉴权参数
        const content = uint8ArrayToBase64(
          packet.encode(
            JSON.stringify({
              msgId: _this.msgId, // 该条消息的ID，64位整型，由端上生成。服务端回执会带上。
              timestamp: new Date().getTime(), // 端上建连时的unix毫秒时间
              deviceToken: getClientInfo().uid, // 设备信息，要求非空。可取mac地址。
              osType: getOSInfo(), // 端上操作系统类型，0:android，1:ios，2:windows，3:mac，4:linux
              appVersion: `${getClientInfo().type}(${getClientInfo().version})`, // 客户端版本，要求非空。
              ext: null, // 扩展字段，暂时不用。
              ..._this.auth.content
            }),
            _this.keyValue,
            _this.keyIv
          )
        )
        console.log(_this.auth.content)
        const bodyBuffer = stringToUint8Array(
          JSON.stringify({ ..._this.auth, content })
        )

        _this.send(bodyBuffer, 1, true)
      })
      globalApi.onSocketMessage((e) => {
        const onmessageId = `${new Date().getTime()}_${Math.random()}`
        _this.onlog(`[webSocket.onmessage]`, { ...e, onmessageId })

        const arrayBuffer = e.data
        const [bodyBuffer, actionType] = packet.unPack(arrayBuffer)
        _this.onlog(`[webSocket.unPack]`, {
          bodyBuffer,
          actionType,
          onmessageId
        })
        const uint8Array = new Uint8Array(bodyBuffer)
        let data = packet.decode(uint8Array, _this.keyValue, _this.keyIv)
        _this.onlog(`[webSocket.decode]`, { uint8Array, onmessageId })
        try {
          data = { ...JSON.parse(data), onmessageId }
        } catch (e) {
          _this.onlog(`[webSocket.data error]`, { onmessageId })
        }
        switch (actionType) {
          case 3: // 消息下行
            _this.onlog(`[webSocket.receive]`, data)
            _this.onmessage(data)
            // 服务端下发的Type.DOWN消息，端上都要回复一条ack，里面的msgId为对应收到的消息id
            _this.send(
              {
                timestamp: new Date().getTime(), // 回执时的unix毫秒时间戳
                msgId: data.msgId, // 回执的对应消息的msgId
                bizType: data.bizType, // 回执的对应消息的bizType
                status: 1
              },
              5
            )
            break
          case 5: // 发送回执
            _this.onlog(`[webSocket.ack]`, data)
            if (data.status === 1) {
              if (data.msgId === 0) {
                _this.onlog(`[webSocket.authed]`, { onmessageId })
                _this.reConnectNum = 0
                _this.onauth()
                _this.HeartCheck.start()
              } else {
                _this.onack(data)
              }
            }
            break
          case 7: // 心跳响应
            _this.onlog(`[webSocket.pong]`, data)
            _this.HeartCheck.start()
            break
          default:
            _this.onlog(`[webSocket.actionType error]`, data)
        }
      })
      globalApi.onSocketClose((e) => {
        _this.onlog('[webSocket.close]', e)
        _this.HeartCheck.stop()
        _this.onclose(e)
        clearTimeout(_this.try)
        _this.try = setTimeout(() => {
          _this.reconnectWebSocket(e)
        }, 3000)
      })
      // 连接发生错误的回调方法
      globalApi.onSocketError((e) => {
        _this.onlog('[webSocket.error]', e)
        _this.HeartCheck.stop()
        clearTimeout(_this.try)
        _this.try = setTimeout(() => {
          _this.reconnectWebSocket(e)
        }, 3000)
      })
    }
    _this.reconnectWebSocket = function(e) {
      if (_this.lockReconnect) {
        return
      } else {
        _this.lockReconnect = true
      }
      if (_this.reConnectNum >= 1) {
        _this.onclose(e, true)
        return
      }
      _this.onlog('[webSocket.reconnecting]')
      _this.msgId = 0
      _this.reConnectNum++
      // 没连接上会一直重连，设置延迟避免请求过多
      _this.heartBeatClock && clearTimeout(this.heartBeatClock)
      _this.heartBeatClock = setTimeout(() => {
        _this.initWebSocket()
        _this.lockReconnect = false
      }, 3000)
    }
    _this.initWebSocket()
    return _this
  }
  send(data = {}, actionType, isLogin) {
    let bodyBuffer
    let sendId

    if (isLogin) {
      // 登录鉴权操作数据处理不一样
      bodyBuffer = data
    } else {
      const { sendId: sendId0, ...data0 } = data
      sendId = sendId0
      const bizData = {
        ...data0,
        msgId: actionType === 5 ? data.msgId : ++this.msgId,
        timestamp: new Date().getTime()
      }
      this.onlog(
        actionType === 6
          ? '[webSocket.ping]'
          : actionType === 2
            ? '[webSocket.send]'
            : actionType === 5
              ? '[webSocket.receiver_ack]'
              : actionType,
        { ...bizData, sendId }
      )
      bodyBuffer = packet.encode(
        JSON.stringify(bizData),
        this.keyValue,
        this.keyIv
      )
      this.onlog('[webSocket.encode]', { bodyBuffer, sendId })
    }
    const arrayBuffer = packet.pack(bodyBuffer, actionType)
    if (!isLogin) {
      this.onlog('[webSocket.pack]', { arrayBuffer, sendId })
    }

    globalApi.sendSocketMessage({data: arrayBuffer})
  }
  close() {
    this.HeartCheck.stop()
    clearTimeout(this.try)
    this.lockReconnect = true
    this.websocket.close()
  }
  onclose() {}
  onopen() {}
  onauth() {}
  onmessage() {}
  onack() {}
  onlog(msg, data = {}) {
    console.log('webSocket default logHandler')
    console.log(msg, data)
  }
}

export default InitWebSocket
