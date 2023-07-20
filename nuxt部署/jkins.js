// nuxt项目部署
// jenkins任务

// 参数化构建过程打勾

// git参数
// 名称：codeBranch
// 参数类型：分支
// 默认值：origin/master

// 选项参数
// 名称：deployEnv
// 选项：daily，pre2,pre,online

// 源码管理
// repository URL
// git地址
// branchs to build 填入${codeBranch}

// 构建环境
// Add timestamps to the Console Output打勾
// Provide Node & npm bin/ folder to PATH打勾
// NodeJS Installation
// Specify needed nodejs installation where npm installed packages will be provided to the PATH
// nodejs_14.15.0

// npmrc file
// - use system default -

// Cache location
// Default (~/.npm or %APP_DATA%\npm-cache)

// 构建
// 执行shell
// git_url='git地址'
// robot_accessToken='钉钉机器人token'
// task_url="http://191.161.100.211:1234/${BUILD_NUMBER}"

//钉钉通知机器人
// robotNotice(){
//  if [ ${4} == true ]
//  then
//    errMsg=""
//  else
//    errMsg="${4}\n"
//  fi
//  curl 'https://oapi.dingtalk.com/robot/send?access_token='${robot_accessToken}'' \
//  -H 'Content-Type: application/json' \
//    -d '{
//      "msgtype": "actionCard",
//      "actionCard":{
//        "title":"'${JOB_BASE_NAME}${1}'",
//        "text": "### 【'${1}'】\n'${errMsg}'- 模块：['${JOB_BASE_NAME}']('${git_url}')\n- 分支：['${codeBranch}']('${git_url}'/tree/'${codeBranch}')\n- 环境：['${deployEnv}']('${3}')",
//        "btns": [
//          {
//            "title": "'${2}'", 
//            "actionURL": "'${3}'"
//          }
//        ]
//      }
//    }'
// }


 
   
//    #
//    status=true
//    {
//      npm install --verbose --registry http://npm地址
//    } || {
//      status="安装依赖包出错！"
//    }
   
//    if [ $status == true ]
//    then
//      {
//      开始构建项目
//      echo -e '\n用户：'${userId}'\n分支：'${codeBranch}'\n环境：'${deployEnv}'\n'
//        npm run build:${deployEnv}
//      } || {
//        status="构建产物出错！"
//      }
//    fi
   
//    if [ $status == true ]
//    then
//      {
//        上传打包文件到oss
//        npm run deploy:${deployEnv}
//      } || {
//        status="上传oss出错！"
//      }
//    fi
   
//    #
//    if [ $status == true ]
//    then
//        robotNotice "开始部署" "查看更新地址" "${task_url}" "${status}"
//    else
//        robotNotice "部署失败" "查看地址" "${ task_url}" "${status}"
//        sleep 100
//    fi
   
// # 如果是 部署正式环境 提交mr 合并到master
// # 项目名称
//   jobBaseName='项目名称'
// # @合并人id
//   assigneeId=12614
// #项目id
//   projectId=61211

//    if [ $deployEnv == 'online' -a $status == true ] 
//    then {
//      curl --location --request POST 'http://gitip地址/view/hubble/job/createMergeRequest/build?delay=0sec' \
//           --header 'Authorization: Basic AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==' \
//           --header 'Content-Type: application/x-www-form-urlencoded' \
//           --data-urlencode 'json={"parameter":[{"name":"assigneeId","value":'$assigneeId'},{"name":"projectId","value":'$projectId'},{"name":"commitRefName","value":"'$codeBranch'"},{"name":"targetBranch","value":"master"},{"name":"jobBaseName","value":"'$jobBaseName'"},{"name":"gitLabPrivateToken","value":"AHBDAIBDIABJKS"}]}'
//    }
//    fi    


