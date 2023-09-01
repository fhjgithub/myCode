/* eslint-disable no-undef */
const intervalIds = {}

worker.onMessage(function(e) {
  switch (e.command) {
    case 'interval:start': // 开启定时器
    { const intervalId = setInterval(() => {
      worker.postMessage({
        message: 'interval:tick',
        id: e.id
      })
    }, e.interval)

    worker.postMessage({
      message: 'interval:started',
      id: e.id
    })

    intervalIds[e.id] = intervalId
    break
    }
    case 'interval:clear': // 销毁
      clearInterval(intervalIds[e.id])

      postMessage({
        message: 'interval:cleared',
        id: e.id
      })

      delete intervalIds[e.id]
      break
    case 'timeout:start': { // 开启定时器
      const intervalId = setTimeout(() => {
        worker.postMessage({
          message: 'timeout:tick',
          id: e.id
        })
      }, e.timeout)

      worker.postMessage({
        message: 'timeout:started',
        id: e.id
      })

      intervalIds[e.id] = intervalId
      break
    }
    case 'timeout:clear': { // 销毁
      clearInterval(intervalIds[e.id])

      postMessage({
        message: 'timeout:cleared',
        id: e.id
      })

      delete intervalIds[e.id]
      break
    }
  }
})
