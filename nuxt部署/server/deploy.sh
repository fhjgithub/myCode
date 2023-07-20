set -e
robot_accessToken='qwertyuio132456789ertyuio'
robotNotice(){
  if [ ${2} == true ]
  then
    errMsg=""
  else
    errMsg="${1}\n"
  fi
  curl 'https://oapi.dingtalk.com/robot/send?access_token='${robot_accessToken}'' \
  -H 'Content-Type: application/json' \
    -d '{
      "msgtype": "actionCard",
      "actionCard":{
        "title":"'${1}'",
        "text": "### 【'${1}'】\n'${errMsg}'- 平台：['mobile-official']('${git_url}')\n-  环境：'daily'\n- 模块：'offical'",
        "btns": [
         {
            "title": "查看更新内容", 
            "actionURL": ""
          }
]
      }
    }'
}

cur_sec=`date '+%s'`
rm -f mobile-official-daily.tar.*
wget http://cdntest.xxx.cn/mobile-official-daily/mobile-official-daily.tar.gz?date=${cur_sec} -O ./mobile-official-daily.tar.gz
tar -zxf mobile-official-daily.tar.gz
 status=true
    {
      npm install
    } || {
      status="安装依赖包出错！"
    }

#
    if [ $status == true ]
    then
        robotNotice "部署成功" "${status}"
	pm2 restart mobile-official
    else
        robotNotice "部署失败" "${status}"
        sleep 100
    fi
