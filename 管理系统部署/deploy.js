const request = require('request')
const Promise = require('bluebird')
const path = require('path')
const { argv } = require('yargs')
const tar = require('tar')
const fse = require('fs-extra')
const fs = Promise.promisifyAll(require('fs'))
const log = require('./log')
const child_process = require('child_process')

const { name } = require('./package.json')

/**
 * 上传文件到oss
 * @param {string} tenantId
 * @param {string} filepath
 * @param {string} destPath
 */
function uploadH5(tenantId, filepath, destPath, isPublic) {
  const HOST = isPublic
    ? 'http://正网.publish'
    : 'https://测网.cn'
  log.info(`HOST:${HOST}`)
  return new Promise((resolve, reject) => {
    request.post(
      {
        url: `${HOST}/admin2/devops/cdn/h5/${tenantId}?parentPath=${destPath}`,
        formData: {
          file: fs.createReadStream(filepath)
        }
      },
      (err, response, body) => {
        if (!err && response.statusCode === 200) {
          const data = JSON.parse(body)
          if (data.code === 1) {
            resolve(data.data)
          } else {
            reject(data.msg)
          }
        } else {
          reject(err || '网络错误！！！')
        }
      }
    )
  })
    .then((data) => [null, data])
    .catch((err) => [err])
}

/**
 * 压缩文件
 * @param {string} dest
 * @param {string} clientType
 */
function tarFiles(dest, clientType) {
  if (!fse.pathExistsSync(dest)) {
    fse.mkdirpSync(dest)
  }
  const filepath = `${dest}/${clientType}.tar.gz`
  return tar
    .c(
      {
        file: filepath,
        cwd: dest,
        gzip: true,
        filter: (fp) => !fp.startsWith('.') && !/\.(json|md|gz)$/.test(fp)
      },
      fse.readdirSync(dest)
    )
    .then(() => filepath)
}
// 去除build/index.html 中<link rel="shortcut icon" href="//www.baidu.com/customer-daily/favicon.png"> 引入
function removeLinkFavicon(htmlName) {
  const html = fs.readFileSync(path.resolve(`build/${htmlName}.html`), {
    encoding: 'utf-8'
  })
  let currentHtml = html.replace(/<link rel="shortcut icon"[\S\s]+?>/, '')
  // 修改title -- 分享外链
  if (argv.env.includes('Share')) {
    currentHtml = currentHtml.replace(/管理系统-客户模块/, '协作平台')
  }

  fs.writeFileSync(path.resolve(`build/${htmlName}.html`), currentHtml, {
    encoding: 'utf-8'
  })
}

async function main(tenantId, output, destPath, isPublic) {
  const indexName = name.split('-').reverse()[0]
  const indexPath = output + '/index.html'
  const outIndexPath = output + `/${indexName}.html`
  child_process.execSync(`mv -f ${indexPath} ${outIndexPath}`)
  removeLinkFavicon(indexName)
  log.info('开始压缩文件...')
  const fp = await tarFiles(output, destPath.replace(/\//g, '_'))
  log.info(`压缩文件结束，文件路径：${fp}`)
  log.info('开始上传文件...')
  const [ero, res] = await uploadH5(tenantId, fp, destPath, isPublic)
  if (ero) {
    console.log('文件上传失败！！！')
    throw ero
  }
  log.info(`上传成功！！！>> 访问路径：${res}`)
}

let promiseError = ''
const ct = setInterval(() => {
  if (promiseError) {
    throw Error(promiseError)
  }
}, 300)

// FIXME: argv.output 修改为非绝对路径
const isPublic0 =['publish','pre','prepare','prepare2','tolerant'].includes(argv.env)

main(
  1, // 租户id
  path.resolve('build'), // 原文件夹
  `${name}${argv.env === 'publish' ? '' : `-${argv.env}`}`, // 线上文件夹
  isPublic0 // 区分用不同oss域名上传
)
  .then(() => {
    clearInterval(ct)
  })
  .catch((err) => {
    log.error(err)
    promiseError = err
  })
