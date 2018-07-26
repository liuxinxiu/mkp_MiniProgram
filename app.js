// 导入常用到的类库
let { qurl } = require('./utils/qurl.js');
var wxToast = require('./toast/toast.js')

console.log(qurl)

//app.js
App({
  wxToast,
  data:{
     qurl: qurl
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //   }
    // })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })


    // 获取用户信息
   //  wx.getSetting({
   //    success: res => {
   //      if (res.authSetting['scope.userInfo']) {
   //        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
   //        wx.getUserInfo({
   //          success: res => {
   //            // 可以将 res 发送给后台解码出 unionId
   //            this.globalData.userInfo = res.userInfo

   //            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
   //            // 所以此处加入 callback 以防止这种情况
   //            if (this.userInfoReadyCallback) {
   //              this.userInfoReadyCallback(res)
   //            }
   //          }
   //        })
   //      }
   //    }
   //  })


    wx.getSetting({
       success: res => {
          if (res.authSetting['scope.userInfo']) {
             // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
             wx.getUserInfo({
                success: res => {
                   // 可以将 res 发送给后台解码出 unionId
                   this.globalData.userInfo = res.userInfo

                   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                   // 所以此处加入 callback 以防止这种情况
                   if (this.userInfoReadyCallback) {
                      //this.userInfoReadyCallback(res)
                      this.getUserInfoFun(res)
                   }
                }
             })
          }
       }
    })
    


    this.getUserInfoFun = (res) => {
       var userInfo = res.userInfo //用户基本信息
       var nickName = userInfo.nickName //用户名
       var avatarUrl = userInfo.avatarUrl //头像链接
       var gender = userInfo.gender //性别 0：未知、1：男、2：女
       var province = userInfo.province //所在省
       var city = userInfo.city //所在市
       var country = userInfo.country //所在国家
       this.globalData.username = nickName;   //昵称
       this.globalData.avatar = avatarUrl;    //头像-//wx.qlogo.cn/mmopen/
       this.globalData.gender = gender;       //性别-1
       this.globalData.country = country;     //国家-China
       this.globalData.province = gender;     //地区-Beijing
       this.globalData.city = city;           //城市-West
       console.log(userInfo)
       // 获取系统信息
       wx.getSystemInfo({
          success: res => {
             // console.log(res.model)    //  手机型号
             // console.log(res.pixelRatio)
             // console.log(res.windowWidth)
             // console.log(res.windowHeight)
             // console.log(res.language)
             // console.log(res.version)
             // console.log(res.platform)
             // console.log(res.system) //  操作系统版本
             var model = res.model               //手机型号
             var pixelRatio = res.pixelRatio     //用户名
             var windowWidth = res.windowWidth   //宽度
             var windowHeight = res.windowHeight //高度
             var language = res.language         //语言
             var version = res.version           //操作系统版本
             var platform = res.platform         //平台
             var system = res.system             //系统


             //初始化拼接所有的发送数据
             var _data = {
                nickName: nickName,
                avatarUrl: avatarUrl,
                gender: gender,
                province: province,
                city: city,
                country: country,
                model: res.model,
                pixelRatio: res.pixelRatio,
                windowWidth: res.windowWidt,
                windowHeight: res.windowHeight,
                language: res.language,
                version: res.version,
                platform: res.platform,
                system: res.system,
             }
             console.log(_data)
             // 微信登录验证
             wx.login({
                success: res => {
                   // 发送 res.code 到后台换取 openId, sessionKey, unionId
                   if (res.code) {
                      var _this = this;
                      _data.code = res.code;
                      //发起网络请求
                      wx.request({
                         url: qurl + '/index.php?m=miniapp&c=user&a=getopenid',
                         header: {
                            "Content-Type": "application/x-www-form-urlencoded"
                         },
                         method: "POST",
                         data: _data,
                         complete: res => {
                            if (res.data.status != "100") {
                               _this.wxToast({
                                  title: '服务器错误：' + res.data.msg
                               })
                            }
                            else {
                               var token = res.data.ext.token;
                               var session_key = res.data.ext.session_key;
                               var dataJson = {};
                               dataJson.token = token;
                               dataJson.session_key = session_key;
                               //以键值对的形式存储 传进去的是个对象
                               // wx.setStorage({
                               //    key: 'dataJson',
                               //    success: function (res) {
                               //       console.log(res)
                               //    }
                               // })
                               wx.setStorageSync('token', token);
                               wx.setStorageSync('session_key', session_key);

                               // 把token设置在入口App上和其他page共享
                               this.globalData.token = this.data.token = wx.getStorageSync('token');
                               this.globalData.token = this.data.token = wx.getStorageSync('session_key');
                               // console.log(res.data.ext.token);
                               // console.log(res.data.ext.session_key);
                               console.log('token: ' + this.data.token)

                               //由于这里是网络请求，可能会在 Page.onLoad 之后才返回
                               // 所以此处加入 callback 以防止这种情况
                               if (this.tokenCallback) {
                                  this.tokenCallback(token);
                               }
                            }
                         }
                      })

                   } else {
                      //console.log('登录失败！' + res.errMsg)
                      _this.wxToast({
                         title: '登录失败！' + res.errMsg
                      })
                   }
                }
             })
             // 微信登录验证 End
          }
       })
        // 获取系统信息 End
    }


  },
  globalData: {
    userInfo: null
  }
})