<template>
  <div id="wrapper">
    <div id="container"></div>
    <div class="toolbar">
      <el-button v-no-more-click type="primary" id="start">开始</el-button>
      <el-button v-no-more-click type="success" id="pause">暂停</el-button>
      <el-button v-no-more-click type="success" id="resume">继续</el-button>
    </div>
  </div>
</template>

<script>
const urlMateConfig = require('@/config/service')
import AMapLoader from '@amap/amap-jsapi-loader'
export default {
  props: ['id'],
  data() {
    return {
      map: null,
      AMap: null,
      lineData: ''
    }
  },
  computed: {
    orderSn() {
      return this.id
    }
  },
  beforeRouteLeave(to, from, next) {
    // // 销毁组件，避免通过vue-router再次进入时，仍是上次的history缓存的状态
    this.$destroy(true)
    next()
  },
  created() {
    const that = this
    AMapLoader.load({
      key: 'bb858d55ad016e93393e2492e21243bd', // 申请好的Web端开发者Key，首次调用 load 时必填
      version: '1.4.15', // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
      plugins: ['AMap.Marker', 'AMap.CircleEditor', 'AMap.PolyEditor'], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      Loca: {
        version: '1.3.2' // Loca 版本，缺省 1.3.2
      }
    })
      .then(AMap => {
        // _AMap = AMap;
        that.map = new AMap.Map('container')
        that.AMap = AMap
        that.getLine()
      })
      .catch(e => {
        console.log(e)
      })
  },
  methods: {
    // 获取乘客选择的导航路线
    getLine() {
      this.$get(
        urlMateConfig.NETCAR_ADMIN + `/map/navigate/log/${this.orderSn}`
      ).then(result => {
        if (result.data.code === '0') {
          // 乘客路线
          this.lineData = result.data.data
          this.draw()
        } else {
          this.draw()
        }
      })
    },
    //绘制，监听
    draw() {
      this.$get(
        urlMateConfig.NETCAR_ADMIN + `/map/replay?orderSn=${this.orderSn}`
      ).then(result => {
        if (result.data.code === '0') {
          var marker
          var lineArr
          this.map.clearMap() // 清除地图覆盖物
          var carStartPoint = result.data.data.carStartPoint

          marker = new this.AMap.Marker({
            map: this.map,
            position: carStartPoint,//车辆起点
            icon: '/map/car.png',
            // icon: "http://webapi.amap.com/images/car.png,
            // 图片大小52x26，则Pixel(-26, -13)
            offset: new this.AMap.Pixel(-20, -9),
            autoRotation: true
          })
          var startPoint = result.data.data.startPoint
          // 起点
          if (startPoint != null) {
            new this.AMap.Marker({
              map: this.map,
              position: startPoint,
              icon: '/map/icon_start.png',
              // 图片大小20x25，则Pixel(-10, -25)
              offset: new this.AMap.Pixel(-14, -41)
            })
          }
          var endPoint = result.data.data.endPoint
          // 终点
          if (endPoint != null) {
            new this.AMap.Marker({
              map: this.map,
              position: endPoint,
              icon: '/map/icon_end.png',
              // 图片大小20x25，则Pixel(-10, -25)
              offset: new this.AMap.Pixel(-14, -41)
            })
          }
          // 上车点
          var upPoint = result.data.data.upPoint
          if (upPoint != null) {
            new this.AMap.Marker({
              map: this.map,
              position: upPoint,
              icon: '/map/icon_up.png',
              // 图片大小20x25，则Pixel(-10, -25)
              offset: new this.AMap.Pixel(-22, -38)
            })
          }
          var orderStatus = result.data.data.orderStatus
          var downPoint = result.data.data.downPoint
          if (downPoint != null && (orderStatus === 30 || orderStatus === 40)) {
            downPoint = result.data.data.downPoint
            // 下车点
            new this.AMap.Marker({
              map: this.map,
              position: downPoint,
              icon: '/map/icon_down.png',
              // 图片大小20x25，则Pixel(-10, -25)
              offset: new this.AMap.Pixel(-22, -38)
            })
          }
          //司机路线
          lineArr = result.data.data.line
          
          // 如果接口有返回乘客选择的路线，进行处理绘制，没返回没用到
          if (this.lineData !== '' && this.lineData !== null && this.lineData !== undefined) {
            let arr = this.lineData.split(';')
            let finalArr = []
            for (let i=0; i<arr.length; i++) {
              let subArr = arr[i].split(',')
              finalArr.push([Number(subArr[0]), Number(subArr[1])])
            }
            // console.log(finalArr)

            // 绘制乘客选择的路线轨迹
            var passPolyline = new this.AMap.Polyline({
              map: this.map,
              path: finalArr,
              strokeColor: '#008006', // 线颜色<D-d><D-d>
              // strokeOpacity: 1,     //线透明度
              strokeWeight: 5 // 线宽
              // strokeStyle: "solid"  //线样式
            })
          }
          // 绘制司机行车轨迹
          var polyline = new this.AMap.Polyline({
            map: this.map,
            path: lineArr,
            strokeColor: '#00A', // 线颜色<D-d><D-d>
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 3 // 线宽
            // strokeStyle: "solid"  //线样式
          })
          // 经过的路线
          var passedPolyline = new this.AMap.Polyline({
            map: this.map,
            // path: lineArr,
            strokeColor: '#F00', // 线颜色
            // strokeOpacity: 1,     //线透明度
            strokeWeight: 3 // 线宽
            // strokeStyle: "solid"  //线样式
          })
          // 监听点移动，将移动过的点渲染成经过路线
          marker.on('moving', function (e) {
            passedPolyline.setPath(e.passedPath)
          })
          this.map.setFitView()
        } else {
          this.map.clearMap() // 清除地图覆盖物
          startPoint = result.data.data.startPoint
          // 起点
          if (startPoint != null) {
            new this.AMap.Marker({
              map: this.map,
              position: startPoint,
              icon: '/map/icon_start.png',
              // 图片大小20x25，则Pixel(-10, -25)
              offset: new this.AMap.Pixel(-14, -41)
            })
          }
          endPoint = result.data.data.endPoint
          if (endPoint != null) {
            // 终点
            new this.AMap.Marker({
              map: this.map,
              position: endPoint,
              icon: '/map/icon_end.png',
              // 图片大小20x25，则Pixel(-10, -25)
              offset: new this.AMap.Pixel(-14, -41)
            })
          }
          this.map.setFitView()
        }
        // 沿着司机路线进行播放
        // TODO 速度可计算
        this.AMap.event.addDomListener(
          document.getElementById('start'),
          'click',
          function () {
            if (marker != null) {
              // 指定这个点沿着某条路线移动
              marker.moveAlong(lineArr, 2400)
            }
          },
          false
        )
        // 暂停
        this.AMap.event.addDomListener(
          document.getElementById('pause'),
          'click',
          function () {
            if (marker != null) {
              marker.pauseMove()
            }
          },
          false
        )
        // 继续
        this.AMap.event.addDomListener(
          document.getElementById('resume'),
          'click',
          function () {
            if (marker != null) {
              marker.resumeMove()
            }
          },
          false
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#wrapper {
  margin: 10px;
  padding: 20px;
  background: #fff;

  .input-search {
    display: flex;
    align-items: center;

    .input-box {
      margin-right: 20px;
    }
  }

  .page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .el-pagination {
    padding: 10px;
    text-align: right;
  }

  #container {
    margin: 0 30px;
    height: 600px;
  }
}
</style>
