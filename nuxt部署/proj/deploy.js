const path = require("path");
const request = require("request");
const Promise = require("bluebird");
const { argv } = require("yargs");
const tar = require("tar");
const fse = require("fs-extra");
const fs = Promise.promisifyAll(require("fs"));
const log = require("./log");
const { name } = require("./package.json");

/**
 * 上传文件到oss
 * @param {string} tenantId
 * @param {string} filepath
 * @param {string} destPath
 */
function uploadH5(tenantId, filepath, destPath, isPublic) {
  const HOST = isPublic
    ? "http://publish"
    : "https://apitest.cn";
  log.info(`HOST:${HOST}`);
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
          const data = JSON.parse(body);
          if (data.code === 1) {
            resolve(data.data);
          } else {
            reject(data.msg);
          }
        } else {
          reject(err || "网络错误！！！");
        }
      }
    );
  })
    .then(data => [null, data])
    .catch(err => [err]);
}

/**
 * 压缩文件
 * @param {string} dest
 * @param {string} clientType
 */
function tarFiles(dest, clientType) {
  if (!fse.pathExistsSync(dest)) {
    fse.mkdirpSync(dest);
  }
  fs.writeFileSync(path.join(__dirname, "/timeStamp.txt"), String(Date.now()));
  const filepath = `${dest}/${clientType}.tar.gz`;
  return tar
    .c(
      {
        file: filepath,
        cwd: dest,
        gzip: true,
        filter: fp => {
          return [
            ".nuxt",
            "nuxt.config.js",
            "package-lock.json",
            "package.json",
            "static"
          ].some(v => {
            return fp.startsWith(v);
          });
        }
      },
      fse.readdirSync(dest)
    )
    .then(value => {
      const fp = `${dest}/${clientType}wrapper.tar.gz`;
      return tar
        .c(
          {
            file: fp,
            cwd: dest,
            gzip: true,
            filter: f => /\.(txt)$/.test(f) || f.endsWith(`${argv.env}.tar.gz`)
          },
          fse.readdirSync(dest)
        )
        .then(() => {
          return fp;
        });
    });
}

async function main(tenantId, output, destPath, isPublic) {
  log.info("开始压缩文件...");
  const fp = await tarFiles(output, destPath.replace(/\//g, "_"));
  log.info(`压缩文件结束，文件路径：${fp}`);
  log.info("开始上传文件...");
  const [ero, res] = await uploadH5(tenantId, fp, destPath, isPublic);
  if (ero) {
    console.log("文件上传失败！！！");
    throw ero;
  }
  log.info(`上传成功！！！>> 访问路径：${res}`);
}

let promiseError = "";
const ct = setInterval(() => {
  if (promiseError) {
    throw new Error(promiseError);
  }
}, 300);

// FIXME: argv.output 修改为非绝对路径
const isPublic0 = ["publish", "prepare"].includes(argv.env);

main(
  1, // tenant id
  path.resolve(__dirname), // 原文件夹
  `${name}${`-${argv.env}`}`, // 线上文件夹
  isPublic0 // 区分oss域名上传
)
  .then(() => {
    clearInterval(ct);
  })
  .catch(err => {
    log.error(err);
    promiseError = err;
  });
