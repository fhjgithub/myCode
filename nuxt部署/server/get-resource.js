const { execSync } = require('child_process')
const request = require('request')
let timeStamp = 0

setInterval(() => {
  request.get(
    {
      url:
        `http://cdntest.xxx.cn/timeStamp.txt?time=${Date.now()}`,
    },
    (err, response, body) => {
      try {
        const res = Number(body)
        if (err) return
        if (res && res != timeStamp) {
          execSync(`sh deploy.sh`)
          timeStamp = res
        }
      } catch (error) {}
    }
  )
}, 30000)
