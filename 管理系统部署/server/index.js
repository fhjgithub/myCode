// 服务器部署工作
// 一、创建项目目录
// 进入目标文件夹：cd /home/admin/
// 创建项目目录：mkdir web（不同项目不一样）

// 二、安装环境内的运行工具包
// 1.在任意位置创建脚本文件：vim install.sh
// 2.至此，nginx、node、forever均已安装完毕；

// 三、为项目植入更新脚本
// 1. 在项目根目录下，创建app、modulesUpdate两个文件夹；
// 2. 进入modulesUpdate目录，创建config.js、index.js、utils.js、package.json文件，文件内容具体见链接，且在该目录下执行npm --registry https://registry.npm.taobao.org installl；
// 3. 编辑config.js文件，对内部的logTarFileName、deployLogUrl、subConfig进行对应的“项目名称、环境变量、项目映射配置”的修改；
//   ○ logTarFileName：日志文件名称，
//   ○ deployLogUrl：oss日志文件地址
//   ○ subConfig：
//     ■ name：写入到本地app文件夹内的名称，基座访问子应用资源时，nginx配置代理会跑到该目录；
//     ■ title：前端项目打包后，index.html内的<title>标签内的信息；
//     ■ url：脚本会根据该地址，去下载oss的产物与本地资源进行对比，判断是否更新；
// 4. 在modulesUpdate目录下，执行启动脚本命令：forever start deployAmoy/index.js --env={环境变量}-{项目名称}，例如：forever start index.js --env=dev-honeybee-web-base-skynet；
// 注意：后面每次修改该目录下的“脚本or配置”，均需要重新执行forever restartall，方可生效新配置；
// 5. 最终项目基本目录如下（灰色字体为后续脚本会自动生成的文件/目录）
// {
// app:{
//   projectA.html,
//   projectB.html
// },
// modulesUpdate:{
//   config.js,
//   index.js,
//   utils.js,
//   package.json
// }
// }


// 四、配置Nginx
// 1. 修改nginx配置：vim /usr/local/webserver/nginx/conf/nginx.conf，具体配置项，参考现有机器配置或根据场景自行进行配置；
// 2. 每次编辑配置文件，需重载nginx：nginx -s reload；