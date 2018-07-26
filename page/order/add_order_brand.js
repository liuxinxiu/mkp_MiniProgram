// page/order/add_order_brand.js
//获取应用实例
const app = getApp()
var qurl = app.data.qurl;

Page({
   data: {
      navbar: ['首页', '搜索', '我'],
      currentTab: 0,
      mainpageUrl: "/page/order/add_order_mainpage"
   },
   onLoad: function (options) {
      //调用wxToast
      // app.wxToast({
      //    title: '加载中'
      // })

      console.log('token: ' + app.data.token)

      //发起网络请求(焦点图)
      wx.request({
         url: qurl + '/index.php?m=miniapp&c=model&a=modellist',
         header: {
            "Content-Type": "application/x-www-form-urlencoded"
         },
         method: "POST",
         data: { model_id: 35 },
         complete: res => {
            console.log(res.data.status + '+++++')
            console.log(res.data.msg + '+++++')
            // 判断是否请求出错
            if (res.data.status != "100") {
               console.log('服务器错误：' + res.data.msg)
               app.wxToast({
                  title: '服务器错误：' + res.data.msg
               })
            }
            //无错误就执行逻辑回调或者赋值
            else {
               console.log(res.data.ext)
               this.setData({
                  modellist: res.data.ext
               })
            }
         }
      })

   },
   navbarTap: function (e) {
      this.setData({
         currentTab: e.currentTarget.dataset.idx
      })
   }
})
