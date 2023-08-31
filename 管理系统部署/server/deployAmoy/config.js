module.exports = {
  accessToken:
    '1234567890',
  timeOut: 30000,
  logTarFileName: 'web-base-dev',
  deployLogUrl: `https://cdntest.xxxxx.cn/xxxxx/xxxxxx-base-net-deployLog-dev`,
  subConfig: [
    {
      name: 'index.html',
      title: '管理后台',
      url: 'https://cdntest.xxxxx.cn/xxxxx/xxxxxx-base-net-dev/index.html'
    },
    {
      name: 'authentication.html',
      title: 'xxxxxx-sub-authentication',
      url: 'https://cdntest.xxxxx.cn/xxxxx/xxxxxx-sub-authentication-dev/index.html'
    },
    {
      name: 'enterprise.html',
      title: 'xxxxxx-sub-enterprise',
      url: 'https://cdntest.xxxxx.cn/xxxxx/xxxxxx-sub-enterprise-dev/index.html'
    },
    {
      name: 'business.html',
      title: 'xxxxxx-sub-business',
      url: 'https://cdntest.xxxxx.cn/xxxxx/xxxxxx-sub-business-dev/index.html'
    }, 
    {
      name: 'assets.html',
      title: 'xxxxxx-sub-assets',
      url: 'https://cdntest.xxxxx.cn/xxxxx/xxxxxx-sub-assets-dev/index.html'
    }
 ].map(sub => {
    return {
      location: '/home/admin/xxxxxx-base-net/app/',
      ...sub
    }
  })
}