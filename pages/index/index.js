//index.js
//获取应用实例
const app = getApp()
//获取应用实例
var imageUtil = require('../../utils/imageUtil.js');


Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imagewidth: 0,//缩放后的宽
    imageheight: 0,//缩放后的高
    slider: [
      { picUrl: '../../images/0_0.gif' },
      { picUrl: '../../images/0_0.gif' },
      { picUrl: '../../images/0_0.gif' },
    ],
    swiperCurrent: 0,
    swiperCircular: true,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    iconlists: [
       { normal: "../../images/1.png", focus: "../../images/1-1.png" },
       { normal: "../../images/2.png", focus: "../../images/2-2.png" },
       { normal: "../../images/3.png", focus: "../../images/3-3.png" },
       { normal: "../../images/4.png", focus: "../../images/4-4.png" }
    ]
  },
  //拨打电话
  tel: function () {
      wx.makePhoneCall({
         phoneNumber: '18701519435',
      })
  },
  //图片宽度自适应
  imageLoad: function (e) {
     console.log(e)
     var imageSize = imageUtil.imageUtil(e)
     var mpadding = e.currentTarget.dataset.mpadding;
     var imageRatio = (imageSize.imageWidth - mpadding) / imageSize.imageWidth;
     console.log(imageRatio)
     this.setData({
        imagewidth: imageSize.imageWidth * imageRatio,
        imageheight: imageSize.imageHeight * imageRatio
     })
  },
  swiperChange: function (e) {
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //调用wxToast
    // app.wxToast({
    //   title: '加载中'
    // })

     var that = this;
     //获取系统信息
     wx.getSystemInfo({
        success: function (res) {
           that.setData({
              winWidth: res.windowWidth,
              winHeight: res.windowHeight
           });
        }
     });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  /**
   * 滑动切换tab
   */
  bindChange: function (e) {
     var that = this;
     that.setData({ currentTab: e.detail.current });
  },
  /**
   * 点击切换tab
   */
  swichNav: function (e) {
     console.log(e)
     var that = this;
     if (this.data.currentTab === e.currentTarget.dataset.current) {
        //点击的是同一个，则不操作
        return false;
     } else {
        that.setData({
           currentTab: e.currentTarget.dataset.current
        })
     }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
