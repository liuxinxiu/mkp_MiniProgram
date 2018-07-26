//获取应用实例
const app = getApp()
var qurl = app.data.qurl;

// page/order/details.js
Page({
   data: {
      title: 'x'
   },
   onLoad: function (options) {
      //console.log(options.title==undefined)
      if (options.title == undefined) options.title = '';
      if (options.motto == undefined) options.motto = '';
      if (options.submit == undefined) options.submit = '';
      // 页面初始化 options为页面跳转所带来的参数
      var dataJson = {};
          dataJson["names"] = "liuxinxiu111";
          dataJson["title"] = options.title;
          dataJson["motto"] = options.motto;
          dataJson["submit"] = options.submit;

          this.setData(dataJson);

      // this.setData({
      //    title: options.title,
      //    motto: options.motto,
      //    submit: options.submit
      // })

      console.log(this.data.names)




      //发起网络请求(订单详情)
      wx.request({
         url: qurl + '/index.php?m=miniapp&c=order&a=orderDetail',
         header: {
            "Content-Type": "application/x-www-form-urlencoded"
         },
         method: "POST",
         data: { 
            token: app.data.token,
            order_id: 35
         },
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
                  market: res.data.ext
               })
            }
         }
      })



   },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     console.log(this.data.submit)
     if (this.data.submit=='ok'){
         wx.navigateTo({
            url: '/page/index/index?orderlist=1',
         })
     }
     //console.log("out!" + app.globalData.userInfo)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})