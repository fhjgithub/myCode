import InitWebSocket from './index.js'
this.socket = new InitWebSocket({
  url: res.data.data.websocketServers[0],
  keyValue: socketToken.keyValue,
  keyIv: socketToken.keyIv,
  auth: {
    userType: 8, // 用户类型，0:乘客，1:司机，2:租户客服，3:SaaS后台或扫雷用户
    terminal: 107, // 终端类型，1:手机版，2:车机版，3:手机助手，4为H5
    keyId: socketToken.keyId, // 从鉴权服务拿到的keyId
    serverVersion: 1001003, // 服务端协议版本，当前为固定值，传1001003即可
    content: {
      keepAlive: 5000, // 心跳间隔，单位：秒
      accessToken: Cookie.replace('_yy_mtk=', '') // 从鉴权服务拿到的
    }
  }
})

this.socket.onmessage = (data) => {
  console.log('data: ', data)
}