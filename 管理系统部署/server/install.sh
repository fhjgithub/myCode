#!/usr/bin/env bash
arg=$1

# 安装nginx的前置依赖项
yum -y install make zlib zlib-devel gcc-c++ libtool  openssl openssl-devel
cd /usr/local/src/
wget https://xxxx-test.oss-cn-shenzhen.aliyuncs.com/xxxxx/xxxxWebsite/pcre-8.35.tar.gz
tar zxvf pcre-8.35.tar.gz
cd pcre-8.35
./configure
make && make install

# 安装nginx
cd /usr/local/src/
wget https://xxxx-test.oss-cn-shenzhen.aliyuncs.com/xxxxx/xxxxxWebsite/nginx-1.16.1.tar.gz
tar zxvf nginx-1.16.1.tar.gz
cd nginx-1.16.1
./configure --prefix=/usr/local/webserver/nginx --with-http_stub_status_module --with-http_ssl_module --with-pcre=/usr/local/src/pcre-8.35
make
make install
sudo ln -s /usr/local/webserver/nginx/sbin/nginx /usr/local/bin/nginx

#安装node
if ! type node 2>/dev/null;
then
cd /usr/local/src/
wget https://xxxx-test.oss-cn-shenzhen.aliyuncs.com/xxxx/xxxxWebsite/node-v12.13.1-linux-x64.tar.xz
tar xf node-v12.13.1-linux-x64.tar.xz -C /usr/local/
cd /usr/local/
mv node-v12.13.1-linux-x64/ nodejs
sudo ln -s /usr/local/nodejs/bin/node /usr/bin
sudo ln -s /usr/local/nodejs/bin/npm /usr/bin
# sudo ln -s /usr/local/nodejs/bin /usr/bin
sudo sed -i '$a export PATH=$PATH:/usr/local/nodejs/bin' ~/.bashrc
source ~/.bashrc
fi

# 安装forever
if ! type forever 2>/dev/null;
then
sudo npm --registry https://registry.npm.taobao.org install forever -g
fi
sudo ln -s /usr/local/nodejs/bin/forever /usr/bin

# 启动nginx配置
cd /usr/local/webserver/nginx/conf/
# sudo wget https://xxx.xxxx.cn/xxxx/cache-xxxx/nginx.conf -O nginx.conf 本地有
sudo /usr/local/webserver/nginx/sbin/nginx