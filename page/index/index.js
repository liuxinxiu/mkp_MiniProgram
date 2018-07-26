//index.js
//获取应用实例
const app = getApp()
var qurl = app.data.qurl;

//获取应用实例
var imageUtil = require('../../utils/imageUtil.js');


Page({
   data: {
      motto: 'Hello World',
      userInfo: {},
      hasUserInfo: false,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      mainpageUrl: "/page/order/add_order_mainpage",
      token: '',
      imagewidth: 0,//缩放后的宽
      imageheight: 0,//缩放后的高
      swiperCurrent: 0,
      swiperCircular: true,
      winWidth: 0,
      winHeight: 0,
      vihi:'',
      currentTab: 0,
      iconlists: [
         { normal: "../../images/1.png", focus: "../../images/1-1.png" },
         { normal: "../../images/2.png", focus: "../../images/2-2.png" },
         { normal: "../../images/3.png", focus: "../../images/3-3.png" },
         { normal: "../../images/4.png", focus: "../../images/4-4.png" }
      ],
      classNameArr: ['co-blue', 'co-orange', 'co-gray', 'co-orange', 'co-gray', 'co-blue'],
      ext : [{ "title": "\u6d4b\u8bd51", "pic_url": "http:\/\/img.mochup.com\/navigation\/af\/af60065af66989e75a433801659e629a.png", "orderlist": "1" }, { "title": "\u6d4b\u8bd52", "pic_url": "http:\/\/img.mochup.com\/navigation\/e1\/e1cb70206d41bb9d3ac3b0835fc9550d.png", "orderlist": "2" }, { "title": "\u6d4b\u8bd53", "pic_url": "http:\/\/img.mochup.com\/navigation\/b2\/b2ef43b08b83fd7c6cdcebefec13d8d9.png", "orderlist": "3" }]

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
   bindViewTap: function () {
      wx.navigateTo({
         url: '../logs/logs'
      })
   },
   onLoad: function (options) {
      //调用wxToast
      // app.wxToast({
      //   title: '加载中'
      // })

      
      //判断是用户是否绑定了
      if (app.globalData.token && app.globalData.token != '') {
         this.setData({
            token: app.globalData.token
         });
         getapi(app.globalData.token);
      } else {
         // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
         // 所以此处加入 callback 以防止这种情况
         app.tokenCallback = token => {
            if (token != '') {
               this.setData({
                  token: token
               });
               getapi(token);
            }
         }
      }



      //判断token不等于空才会发起请求
      var getapi = (token) => {

         console.log('token(Index): ' + token)

         //发起网络请求(焦点图)
         wx.request({
            //url: qurl + '/index.php?m=miniapp&c=index&a=market',
            //url: 'http://www.testmochup.com/index.php?m=miniapp&c=index&a=market',
            url: 'http://192.168.180.200/php/Interface/cnmo/API/miniApps/index.php?m=miniapp&c=market',
            header: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "GET",
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
                  //console.log(res.data.ext)
                  this.setData({
                     picArr: res.data.ext
                  })
                  //console.log(_this.data.market[0].pic_url)

               }
            }
         })


         //发起网络请求(热门故障)
         wx.request({
            //url: qurl + '/index.php?m=miniapp&c=index&a=solutionHot',
            //url: 'http://www.testmochup.com/index.php?m=miniapp&c=index&a=solutionHot',
            url: 'http://192.168.180.200/php/Interface/cnmo/API/miniApps/index.php?m=miniapp&c=solutionHot',
            header: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "GET",
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
                  var dataList = res.data.ext;
                  console.log(dataList)
                  dataList[0].className = this.data.classNameArr[0];
                  dataList[1].className = this.data.classNameArr[1];
                  dataList[2].className = this.data.classNameArr[2];
                  dataList[3].className = this.data.classNameArr[3];
                  dataList[4].className = this.data.classNameArr[4];
                  dataList[5].className = this.data.classNameArr[5];
                  dataList = dataList.slice(0, 6);
                  this.setData({
                     solutionHot: dataList
                  })
               }
            }
         })



         console.log('token: ' + token)
         //发起网络请求(订单列表)
         wx.request({
            //url: qurl + '/index.php?m=miniapp&c=order&a=orderList',
            //url: 'http://www.testmochup.com/index.php?m=miniapp&c=order&a=orderList',
            url: 'http://192.168.180.200/php/Interface/cnmo/API/miniApps/index.php?m=miniapp&c=orderList',
            header: {
               "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST",
            data: {
               token: token,
               page: 1,
               n: 20
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
      }



      //获取系统信息
      wx.getSystemInfo({
         success: res => {
            this.setData({
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
      } else if (this.data.canIUse) {
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
   getUserInfo: function (e) {
      console.log(e)
      app.globalData.userInfo = e.detail.userInfo
      this.setData({
         userInfo: e.detail.userInfo,
         hasUserInfo: true
      })
   }
})
