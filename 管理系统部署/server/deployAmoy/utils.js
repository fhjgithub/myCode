const https = require('https')
const moment = require('moment')
const tar = require('tar')
const fse = require('fs-extra')
const request = require('request')
const fs = require('fs')

module.exports = {
  logger: function (text) {
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'), text)
  },
  formatArray: function (oldArr) {
    return Array.isArray(oldArr) ? oldArr : []
  },
  dingTalkNotice: function ({
    title = '资源更新',
    env,
    platform,
    moduleHtmlString,
    accessToken,
    err = ''
  }) {
    const data = JSON.stringify({
      msgtype: 'markdown',
      markdown: {
        title,
        text: `### 【${title}】\n - 环境：${env}\n - 平台：${platform}\n - 模块：${moduleHtmlString}${
          err ? '\n' + err : ''
        }`
      }
    })
    const req = https.request({
      port: 443,
      method: 'POST',
      hostname: 'oapi.dingtalk.com',
      path: `/robot/send?access_token=${accessToken}`,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    req.on('error', error => {
      logger(`钉钉通知失败：${error}`)
    })
    req.write(data)
    req.end()
  },
  tar: function (dest, tarFileName) {
    const filepath = `${dest}/${tarFileName}.tar.gz`
    return tar
      .c(
        {
          file: filepath,
          cwd: dest,
          gzip: true
        },
        fse.readdirSync(dest)
      )
      .then(() => filepath)
  },
  uploadFile: function (filepath, destPath) {
    const HOST = 'https://apitest.xxxxxxxx.cn'
    return new Promise((resolve, reject) => {
      request.post(
        {
          url: `${HOST}/admin2/devops/cdn/h5/1?parentPath=${destPath}`,
          formData: {
            file: fs.createReadStream(filepath)
          }
        },
        (err, response, body) => {
          if (!err && response.statusCode === 200) {
            let data
            try {
              data = JSON.parse(body)
            } catch (_) {
              data = {}
            }
            if (data.code === 1) {
              resolve(data)
            } else {
              reject(data)
            }
          } else {
            reject(err || '网络错误！')
          }
        }
      )
    })
  },
  matchBranch: (
    htmlString,
    env,
    cookieEnv,
    leftMatchingStr,
    rightMatchingStr
  ) => {
    let res
    if (leftMatchingStr && rightMatchingStr) {
      const reg = /<script.*?(?:>|\/>)/gi
      const arr = htmlString.match(reg)
      const scriptArr = Array.isArray(arr) ? arr : []
      const cur =
        scriptArr.find(
          b => b.includes(leftMatchingStr) && b.includes(rightMatchingStr)
        ) || ''
      res = cur.split(leftMatchingStr)[1].split(rightMatchingStr)[0]
    }
    if (cookieEnv) {
      res = res ? `prerelease/${res}` : '上线分支'
    } else {
      res = `${res === env ? '' : 'pre'}release/${res || env}`
    }
    return res
  },
  encode: function (str) {
    var hexIn = false
    var EncodeChars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    var out, i, len
    var c1, c2, c3
    len = str.length
    i = 0
    out = ''
    while (i < len) {
      c1 = (hexIn ? str[i++] : str.charCodeAt(i++)) & 0xff
      if (i === len) {
        out += EncodeChars.charAt(c1 >> 2)
        out += EncodeChars.charAt((c1 & 0x3) << 4)
        out += '=='
        break
      }
      c2 = hexIn ? str[i++] : str.charCodeAt(i++)
      if (i === len) {
        out += EncodeChars.charAt(c1 >> 2)
        out += EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
        out += EncodeChars.charAt((c2 & 0xf) << 2)
        out += '='
        break
      }
      c3 = hexIn ? str[i++] : str.charCodeAt(i++)
      out += EncodeChars.charAt(c1 >> 2)
      out += EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xf0) >> 4))
      out += EncodeChars.charAt(((c2 & 0xf) << 2) | ((c3 & 0xc0) >> 6))
      out += EncodeChars.charAt(c3 & 0x3f)
    }
    return out
  },
  requestJenkins: function ({
    platform,
    deployEnv,
    codeBranch,
    moduleName,
    htmlString
  }) {
    const auth = 'fhj:1126ee9312werfghnqwsdfgh345t6yu8e10305b0'
    const method = 'POST'
    const json = {
      parameter: [
        {
          name: 'platform',
          value: platform
        },
        {
          name: 'deployEnv',
          value: deployEnv || 'daily'
        },
        {
          name: 'codeBranch',
          value: codeBranch || 'release/daily'
        },
        {
          name: 'moduleName',
          value: moduleName
        },
        {
          name: 'htmlString',
          value: htmlString
        }
      ]
    }
    return `curl http://47.106.25.28/view/xxxx/job/web-buildLog/build?delay=0sec -u ${auth} -X ${method} --data 'json=${JSON.stringify(
      json
    )}'`
  }
}
