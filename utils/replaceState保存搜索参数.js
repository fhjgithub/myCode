// 增改记录:
// history.pushState() , history.replaceState()
// HTML5为history对象添加了两个新方法，history.pushState()和history.replaceState()，
//用来在浏览历史中添加和修改记录。state属性用来保存记录对象，而popstate事件用来监听history对象的变化

// ------------------------------------------------------------------------------------------
// pushState()
// history.pushState()方法向浏览器历史添加了一个状态(增加一个记录)。
// pushState()方法带有三个参数：一个状态对象、一个标题(现在被忽略了)以及一个可选的URL地址
//state object —— 状态对象是一个由pushState()方法创建的、
//与历史纪录相关的javascript对象。当用户定向到一个新的状态时，会触发popstate事件。
//事件的state属性包含了历史纪录的state对象。如果不需要这个对象，此处可以填null

//title —— 新页面的标题，但是所有浏览器目前都忽略这个值，因此这里可以填null

//URL —— 这个参数提供了新历史纪录的地址。新URL必须和当前URL在同一个域，否则，pushState()将丢出异常。
//这个参数可选，如果它没有被特别标注，会被设置为文档的当前URL

// ------------------------------------------------------------------------------------------
// replaceState()
// 把当前的页面的历史记录替换掉
// 他们最大的特点是添加或替换历史记录后，浏览器地址栏会变成你传的地址，而页面并不会重新载入或跳转。
// 例如，假设当前的页面地址是example.com/1.html，且history中此时只有一条当前页面的记录。

//当你执行 history.pushState(null, null, “2.html”)后，浏览器的地址栏会显示example.com/2.html，
//但并不会跳转到2.html，甚至并不会去检查2.html存不存在，只是加入一个最新的历史记录项。此时history中会有两个记录。
//假如你此时点击页面上的link跳转到另外一个页面后，点击浏览器的后退按钮，则url会变成example.com/2.html，
//如果此前的1.html的页面浏览器有缓存的话会显示1.html的内容，否则会发起请求example.com/2.html。如果再次点后退，url会变成example.com/1.html。

// 而如果执行 history.replaceState(null, null, “2.html”)的话，浏览器的地址栏也会显示example.com/2.html，区别是history中只有当前2.html的记录，而1.html的记录已被替换掉。

// 利用这些特性，可以用来修改当前页面的URL来达成某些目的，比如可以用来记住搜索条件。

/** 修改url的query */
export function changeUrlQuery(url, arg, arg_val) {
  const pattern = `${arg}=([^&]*)`
  const replaceText = `${arg}=${arg_val}`
  if (url.match(pattern)) {
    let tmp = `/(${arg}=)([^&]*)/gi`
    tmp = url.replace(eval(tmp), replaceText)
    return tmp
  } else if (url.match('[?]')) {
    return `${url}&${replaceText}`
  } else {
    return `${url}?${replaceText}`
  }
}

/** 删除url的query */
export function delUrlQuery(url, key) {
  const urlArr = url.split('?')
  if (urlArr.length > 1 && urlArr[1].indexOf(key) > -1) {
    const query = urlArr[1]
    const obj = {}
    const arr = query.split('&')
    for (let i = 0;i < arr.length;i++) {
      arr[i] = arr[i].split('=')
      obj[arr[i][0]] = arr[i][1]
    }
    delete obj[key]
    const newQueyStrArr = []
    Object.keys(obj).map(k => newQueyStrArr.push(`${k}=${obj[k]}`))
    const urlte = `${urlArr[0]}${
      newQueyStrArr.length ? '?' : ''
    }${newQueyStrArr.join('&')}`
    return urlte
  }
  return url
}

// 将参数值存进url中
export const setQueryParams = params => {
  const {
    location: { pathname }
  } = window
  let newQuery = ''
  const queryObj = { ...params }
  Object.keys(queryObj).forEach(queryKey => {
    const queryVal = queryObj[queryKey]
    newQuery = delUrlQuery(newQuery, queryKey)
    if (queryVal !== undefined && queryVal !== null) {
      newQuery = changeUrlQuery(newQuery, queryKey, queryVal)
    }
  })
  history.replaceState(null, '', `${pathname}${newQuery}`)
}