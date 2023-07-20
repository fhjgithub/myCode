// 1.amfe-flexible
// amfe-flexible是配置可伸缩布局方案，主要是将1rem设为viewWidth/10,用于设置 rem 基准值。

// 2.postcss-pxtorem
// postcss-pxtorem是postcss的插件，用于将像素单元生成rem单位。

// 3.移动端适配方案
// vue实现移动端适配步骤如下：

// 4.先安装amfe-flexible和postcss-pxtorem
// npm install amfe-flexible --save
// npm install postcss-pxtorem --save
// 在main.js导入amfe-flexible
// import 'amfe-flexible';

// 5.基本的 PostCSS 示例配置，可以在此配置的基础上根据项目需求进行修改。
// // postcss.config.js
// module.exports = {
//   plugins: {
//     'postcss-pxtorem': {
//       rootValue: 37.5,  //设计稿375px, 使用amfe-flexible分隔成10rem后得到的值
//       propList: ['*'],
//     },
//   },
// };
// //------------------------------
// 或者在vue.config.js配置
// module.exports = {
//   productionSourceMap: false, // 生产环境是否生成 SourceMap
//   css: {
//     loaderOptions: {
//       postcss: {
//         plugins: [
//           require(‘postcss-pxtorem‘)({
//                 rootValue: 16,
//                 unitPrecision: 5,
//                 propList: ['font', 'font-size', 'line-height', 'letter-spacing'],
//                 selectorBlackList: [],
//                 replace: true,
//                 mediaQuery: false,
//                 minPixelValue: 0,
//                 exclude: /node_modules/i
//           }),
//         ]
//       }
//     }
//   },
// }   


// 三、参数解释

// 1）rootValue（Number | Function）表示根元素字体大小或根据input参数返回根元素字体大小。

// 2）unitPrecision （Number）允许REM单位增加的十进制数字。

// 3）propList （Array）可以从px更改为rem的属性。

// 值必须完全匹配。
// 使用通配符*启用所有属性。例：['*']
// *在单词的开头或结尾使用。（['*position*']将匹配background-position-y）
// 使用!不匹配的属性。例：['*', '!letter-spacing']
// 将“ not”前缀与其他前缀组合。例：['*', '!font*']


// 4）selectorBlackList （Array）要忽略的选择器，保留为px。
// 如果value是字符串，它将检查选择器是否包含字符串。
// ['body'] 将匹配 .body-class
// 如果value是regexp，它将检查选择器是否匹配regexp。
// [/^body$/]将匹配body但不匹配.body


// 5）replace （Boolean）替换包含rems的规则。

// 6）mediaQuery （Boolean）允许在媒体查询中转换px。

// 7）minPixelValue（Number）设置要替换的最小像素值。

// 四、补充
//   忽略单个属性的最简单方法是在像素单位声明中使用大写字母，将px写为Px。
//   比如
// .ignore {
//     border: 1Px solid; // ignored
//     border-width: 2PX; // ignored
// }