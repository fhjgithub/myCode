function jsonp(url) {
  return new Promise((resolve, reject) => {
      // 这里的 "jsonCallBack" ，和调用的 jsonp 的 url 中的 callback 值相对应（见粗体字）
      window.jsonCallBack =(result) => {
          resolve(result)
      }
      const JSONP = document.createElement('script');
      JSONP.type = 'text/javascript';
      JSONP.src = url;
      document.getElementsByTagName('head')[0].appendChild(JSONP);
      setTimeout(() => {
          document.getElementsByTagName('head')[0].removeChild(JSONP)
      },500)
  })

}
//调用示例
// jsonp(
//   'https://xx.map.yy.com/ss/location/v1/ip?callback=jsonCallBack&key=[KEY]&output=jsonp&_=[NUMBER]'
// )