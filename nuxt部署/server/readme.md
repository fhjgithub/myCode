服务器自动部署流程

1.安装 node

2.安装 pm2

3.指令执行轮询 js 脚本，每 30s 查询一次版本是否更新，如果更新则下载新资源，并且会在 js 里执行 deploy 部署脚本，deploy 脚本会下载新的打包结果，执行 npm install pm2 重新 mobile-official
pm2 start get-resource.js --name=get-resource

4.通过 pm2 将 nuxt 运行在服务器上
pm2 start npm --name mobile-official -- run start:daily

5.运维配置域名指向 nuxt 项目运行
