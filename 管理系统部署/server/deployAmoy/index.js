const path = require('path')
const fs = require('fs')
const fse = require('fs-extra')
const moment = require('moment')
const { argv } = require('yargs')
const { execSync } = require('child_process')

const {
  accessToken,
  timeOut,
  logTarFileName,
  deployLogUrl,
  subConfig
} = require('./config')
const {
  logger,
  formatArray,
  dingTalkNotice,
  tar,
  uploadFile,
  matchBranch,
  encode,
  requestJenkins
} = require('./utils')

let env, platform
const deployLogDest = path.resolve('deployLog')

const updateFile = ({
  name: htmlName0,
  title,
  url,
  location,
  branchInPath,
  cookieEnv
}) => {
  const [name0] = htmlName0.split('.')
  const htmlName = `${name0}${cookieEnv ? `_${cookieEnv}` : ''}.html`
  const [name] = htmlName.split('.')
  let updateItem = null
  try {
    const version = Math.random()
    const downloadLink = `${url}?v=${version}`
    logger(`--------`)
    logger(`模块【${name}】 cookieEnv 【${cookieEnv || '-'}】`)
    logger(`开始下载：\n ${downloadLink}`)
    const newContent = execSync(
      `curl -e ${downloadLink} ${
        cookieEnv ? '--cookie "dailyEnv=' + cookieEnv + '"' : ''
      } ${downloadLink}`,
      {
        encoding: 'utf8',
        maxBuffer: 1024 * 1024 * 10
      }
    )
    logger(`下载成功`)
    const newTitle = (newContent || '').split('</title>')[0].split('<title>')[1]
    logger(`资源titile：\n ${newTitle}`)
    if (newTitle !== title) {
      logger(`资源titile异常【newTitle：${newTitle}】!==【title：${title}】`)
    } else {
      logger(`读取旧版本`)
      let oldContent = ''
      try {
        oldContent = fs.readFileSync(location + htmlName, 'utf8')
      } catch (_) {
        logger(`旧版本读取失败`)
      }
      if (oldContent === newContent) {
        logger(`内容无变更`)
      } else {
        logger(`内容有变更`)
        updateItem = {
          name,
          location: location + htmlName,
          htmlStr: newContent,
          cookieEnv
        }

        if (branchInPath) {
          logger(`保存构建记录 \n`)
          const codeBranch = matchBranch(newContent, env, cookieEnv, ...branchInPath)
          const htmlString = encode(encodeURIComponent(newContent)).replace(
            /\+/g,
            '%2B'
          )
          // const execStr = requestJenkins({
          //   platform,
          //   deployEnv: env,
          //   moduleName: name0,
          //   codeBranch,
          //   htmlString
          // })
          logger(
            execSync(execStr, { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10 })
          )
        }

        try {
          const logLink = `${deployLogUrl}/${name0}?v=${version}`
          logger(`获取部署历史：\n ${logLink} \n`)
          const oldDeployLogString = execSync(`curl ${logLink}`, {
            encoding: 'utf8',
            maxBuffer: 1024 * 1024 * 1024
          })
          let deployLogObjData
          try {
            deployLogObjData = formatArray(JSON.parse(oldDeployLogString).data)
          } catch (_) {
            deployLogObjData = []
          }
          deployLogObjData.unshift({
            gmtModified: moment().valueOf(),
            htmlString: newContent
          })
          const deployLogObject = {
            ts: 0,
            code: 1,
            msg: 'success',
            data: deployLogObjData.slice(0, 200)
          }
          fs.writeFileSync(
            `${deployLogDest}/${name0}`,
            JSON.stringify(deployLogObject)
          )
        } catch (err) {
          const title = '部署历史获取失败'
          const errText = `\n ${String(err)}`
          logger(`${title}：${errText}`)
          dingTalkNotice({
            env,
            platform,
            moduleHtmlString: name,
            accessToken,
            title,
            err: errText
          })
        }
      }
    }
  } catch (err) {
    const title = '入口文件下载失败'
    const errText = `\n ${err}`
    logger(`${title}：${errText}`)
    dingTalkNotice({
      env,
      platform,
      moduleHtmlString: name,
      accessToken,
      title,
      err: errText
    })
  }
  return updateItem
}

const timeTask = async () => {
  logger(`--------------------`)
  if (fse.existsSync(deployLogDest)) {
    fse.removeSync(deployLogDest)
  }
  fse.mkdirSync(deployLogDest)
  const updateArr = []
  for (const item of subConfig) {
    const updateItem = updateFile(item)
    if (updateItem) {
      updateArr.push(updateItem)
    }
    if (item.cookieEnv) {
      const updateItem1 = updateFile({ ...item, cookieEnv: null })
      if (updateItem1) {
        updateArr.push(updateItem1)
      }
    }
  }
  const updateNameArr = []
  updateArr.forEach(({ name, location, htmlStr }) => {
    updateNameArr.push(name)
    fs.writeFileSync(location, htmlStr)
  })
  if (updateArr.length) {
    dingTalkNotice({
      env,
      platform,
      moduleHtmlString: updateNameArr.join(','),
      accessToken
    })
    try {
      logger('更新部署历史')
      const tarFilePath = await tar(deployLogDest, logTarFileName)
      await uploadFile(tarFilePath, logTarFileName)
    } catch (err) {
      const title = '部署历史更新失败'
      const errText = `\n ${String(err)}`
      logger(`${title}：${errText}`)
      dingTalkNotice({
        env,
        platform,
        moduleHtmlString: updateNameArr.join(','),
        accessToken,
        title,
        err: errText
      })
    }
  }
  logger(`更新模块：`)
  logger(updateNameArr)
  setTimeout(() => timeTask(), timeOut)
}

try {
  env = argv.env.split('-')[0]
  platform = argv.env.split(`${env}-`)[1]
} catch (e) {}
if (!(env && platform)) {
  throw '参数异常！'
} else {
  timeTask()
}