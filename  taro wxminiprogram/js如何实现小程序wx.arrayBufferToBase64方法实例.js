// 目录
// 前言
// 探索失败的过程
// 卡壳的arrayBuffer转base64
// 关键点btoa的实现
// 修成正果
// 总结
// 前言
// 在小程序开发中，需要将接口请求获得的arrayBuffer数据，转换为base64格式数据，进行图片的显示。

// 微信小程序提供了wx.arrayBufferToBase64方法，但很不幸，这个方法在基础库版本 2.4.0 起已废弃，已不推荐使用。

// 虽然目前即使小程序基础库版本为2.22.0，也能正常使用。但是不确定未来哪天，在更新的基础库中，该方法被删除。这样就会带来项目上的隐患。

// 所以需要自己去实现arrayBuffer转为base64这一过程。

// 探索失败的过程
// new FileReader()在小程序中无法进行使用。无法使用new FileReader()实例中的readAsDataURL方法将数据转为base64。如果不熟悉该方法，可以查看FileReader介绍
// URL.createObjectURL在小程序中无法使用。无法使用该方法将数据转为在内存中的地址，进而能被image标签进行引用。如果不熟悉该方法，可以查看URL.createObjectURL讲解
// window.btoa在小程序中无法使用。无法将文本直接转为base64格式。
// 好了，条条大路都被阻断了。那就该自己铺路搭桥了。

// 卡壳的arrayBuffer转base64
// 问题的起始条件有arrayBuffer数据，期望结果是最终形成base64格式数据。那开始进行求解。

// 首先我们得来说说arrayBuffer这回事。

// 在javascript中，有一个很常用的引用数据类型Array,你可以在里面放字符串、数字、对象、布尔值等等等等。它存放在堆中，可以自由增减。

// ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区。它是一个字节数组，通常在其他语言中称为“byte array”。它的诞生就是为了解决一个问题：操作二进制数据。

// 只由0和1组成的二进制数据往往是非常巨大的，上千个字节可以说司空见惯，传统的Array这时候处理起二进制数据起来就显得非常低效，所以ArrayBuffer出现了，它作为一块专用的内存区域存放在栈中，取数据非常快。

// 我们现在通过new ArrayBuffer(10)初始化一个buffer实例，看看会得到什么。

// let buffer = new ArrayBuffer(10);
// console.log(buffer);

// 在控制台上显示如下
// ArrayBuffer(10)
// byteLength: 10
// [[Prototype]]: ArrayBuffer
// [[Int8Array]]: Int8Array(10)
// [[Uint8Array]]: Uint8Array(10)
// [[Int16Array]]: Int16Array(5)
// [[ArrayBufferByteLength]]: 10
// [[ArrayBufferData]]: 1367
// 可以看到在ArrayBuffer中，主要存放了几个“视图”，Int8Array表示8位有符号整数数组，Int16Array表示16位有符号整数数组，Uint8Array则表示8位无符号整数数组。

// 当然，如果比如说我们想取出Int8Array这个数组来，是不能直接通过buffer.Int8Array来取的。这是因为ArrayBuffer不能直接通过下标去读写，我们需要把它转成一个类型化数组（TypedArray）。

// 你不能直接操作 ArrayBuffer 的内容，而是要通过类型数组对象或 DataView 对象来操作，它们会将缓冲区中的数据表示为特定的格式，并通过这些格式来读写缓冲区的内容。

// const myTypedArray = new Uint8Array(buffer)
// 转化完之后，我们我们不仅可以通过下标去对类型化数组进行索引，也可以获取其length，当然TypedArray仍与普通的Array存在细微的区别，那就是假设我们用超出边界的索引语法去获取数组元素时，TypedArray并不会去原型链中进行查找。

// 现在我们已经拿到了这个类型化数组，是时候把它转成普通字符串了。看看String.fromCharCode这个函数，它接受的参数为一堆代码单元序列，输出一个普通字符串。而我们刚刚得到的类型化数组，里面存放的正是代码单元。

// const str = String.fromCharCode(...myTypedArray)
// 这里我们用拓展运算符...把类型数组的代码单元解出来，一次性转完，得到一个普通的字符串。

// 最后，我们需要借助一个window对象的方法，也就是btoa方法，它的作用是：把一个普通字符串编码成base-64格式的字符串。

// 上面看似很好，但是在最后一步，btoa，在小程序中是没有该方法的去使用的。需要自己去实现btoa这个方法。

// 关键点btoa的实现
// 因为该函数，在浏览器中已经实现，所以更多使用在小程序及node环境中。所以总体以module.exports进行方法的输出，以require形式进行引入。

// 输出方法

// module.exports = {
//   btoa: ...,
//   atob: ...
// }
// 引入文件

// const { btoa } =  require('./base64')

// 修成正果
// 有时候后台把图片资源通过arrayBuffer传给前端，这时候为了能正常显示，我们还需要在转化的base64字符串前面拼接上data:image/jpeg;base64,

// 所以我们整理一下，可以得出这样一个函数：

// const { btoa } =  require('./base64')
// const arrayBufferToBase64Img = (buffer) => {
//   const str = String.fromCharCode(...new Uint8Array(buffer));
//   return `data:image/jpeg;base64,${btoa(str)}`;
// }
// 整个流程如下：

// 得到一个ArrayBuffer ---> 转成类型化数组以正常读取(Uint8Array) --> 转成普通字符串(String.fromCharCode) --> 转成base64字符串(btoa)

// 总结
// 到此这篇关于js如何实现小程序wx.arrayBufferToBase64方法实例的文章就介绍到这了,更多相关js实现小程序wx.arrayBufferToBase64内容请搜索八叔技术之家以前的文章或继续浏览下面的相关文章希望大家以后多多支持八叔技术之家！