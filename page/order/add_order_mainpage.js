
//index.js
//获取应用实例
const app = getApp()
var qurl = app.data.qurl;

// page/order/add_order_mainpage.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
     showState: 0,
     showClass: 'show',
     maskShow: false,   //蒙层的显示与否
     aniStyle: false,    //false=slidedown
     oprice: 0,
     qprice: 0,
     qid: "",
     brandId: "",
     modelId: "",
     brandName: "",
     modelName: "",
     colorSelectId: "",
     colorCancelId: "",
     colorSelectName: "",
     colorArr: []
  },
  //多选
  checkboxCheck: function (e) {
     let index = e.currentTarget.dataset.id;//获取用户当前选中的索引值
     let qindex = e.currentTarget.dataset.qi;//获取用户当前选中的标题
     let oprice = e.currentTarget.dataset.oprice;//获取oprice
     let qprice = e.currentTarget.dataset.qprice;//获取qprice

     //判断并选择qData中元素是否选择做相应操作
     let checkBox = this.data.solution_lists[qindex].qData;
     if (checkBox[index].checked) {
         this.data.solution_lists[qindex].qData[index].checked = false;
         this.data.oprice -= oprice;
         this.data.qprice -= qprice;
     } else {
         this.data.solution_lists[qindex].qData[index].checked = true;
         this.data.oprice += oprice;
         this.data.qprice += qprice;
     }

     //变量数组qData种已经选择中的元素个数++
     let checkTit = this.data.solution_lists[qindex].qData;
     let n = 0;
     for (var i = 0; i < checkTit.length; i++) {
        if (checkTit[i].checked) {
           n++
        }
     }
     this.data.solution_lists[qindex].qlen = n;

     //this.data.solution_lists.
     this.setData({ solution_lists: this.data.solution_lists})
     this.setData({ oprice: this.data.oprice })
     this.setData({ qprice: this.data.qprice })

     //返回用户选中的值
     let value = checkBox.filter((item, index) => {
        return item.checked == true;
     })
     console.log(value)
  },

  //点击展开关闭
  showCheck: function (e) {
      let qindex = e.currentTarget.dataset.qi;//获取用户当前选中的标题
      let isshow = this.data.solution_lists[qindex].isshow;

      if(!isshow){
         this.data.solution_lists[qindex].isshow = true;
      }
      else{
         this.data.solution_lists[qindex].isshow = false;
      }
      console.log(this.data.solution_lists[qindex].isshow)

      //this.data.solution_lists.
      this.setData({ solution_lists: this.data.solution_lists })

  },

  //
  colorCheck: function (e) {
     var id = e.currentTarget.dataset.id;
     var index = e.currentTarget.dataset.index;
     var checked = this.data.colorArr[index].checked;
     var colorArr = this.data.colorArr;

// colorSelectId: "",
// colorCancelId: "",
// colorSelectName: "",

     //先遍历把全部设置为false
     for (var i = 0; i < colorArr.length; i++) {
        colorArr[i].checked = false;
     }

     //再把当前的元素设置为选中
     if (!checked){
        this.data.colorArr[index].checked = true;
        this.data.colorSelectId = this.data.colorCancelId = id;
        this.data.colorSelectName = this.data.colorArr[index].name;
        //this.data.solution_lists.
        this.setData({ 
           colorSelectId: this.data.colorSelectId,
           colorCancelId: this.data.colorCancelId,
           colorSelectName: this.data.colorSelectName,
           colorArr: this.data.colorArr 
        })
     }
   //   if (showState==0){
   //    this.setData({
   //       showState: 1,
   //       showClass: ' isshow'
   //    })
   //   }
   //   else{
   //      this.setData({
   //         showState: 0,
   //         showClass: ''
   //      })
   //   }
  },

  //蒙层的显示
  maskMeng: function (e) {         //这是“确认下单”这整个购物车导航栏的点击事件
     this.setData({
        mengShow: true,            //蒙层显示
        aniStyle: true　　　　　　　　//设置动画效果为slideup
     })
  },
  outbtn: function (e) {           //这是list-fix的点击事件，给它绑定事件，是为了实现点击其它地方隐藏蒙层的效果
     var that = this;
     if (this.data.aniStyle == false){
        this.setData({
           aniStyle:true,      //设置动画效果为slidedown
           maskShow: true
        })
     }
     else{
        this.setData({
           aniStyle: false   //设置动画效果为slidedown
        })
        setTimeout(function () {       //延时设置蒙层的隐藏，这个定时器的时间，就是slidedown在css动画里设置的时间，这样就能实现slidedown动画完成后，蒙层才消失的效果。不设置定时器会导致动画效果看不见
           that.setData({
              maskShow: false
           })
        }, 500)
     }
  },
  inbtn: function (e) {          //这个事件必须有，就算不做什么事情也要写上去，因为这个事件是为了防止事件冒泡，导致点击in-list这里面的元素时，点击事件冒泡到list-fix触发它的slidedown事件。
     console.log("in")
  },  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var colorArr = JSON.parse(options.colorArr);
     // 页面初始化 options为页面跳转所带来的参数
     this.setData({
        brandId: options.brandId,
        modelId: options.modelId,
        brandName: options.brandName,
        modelName: options.modelName,
        colorArr: colorArr
     })

     var _this = this;

     //调用wxToast
   //   app.wxToast({
   //      title: '加载中'
   //   })
     var modelId = this.data.modelId;
     //发起网络请求
     wx.request({
        url: qurl + '/index.php?m=miniapp&c=solution&a=solution',
        header: {
           "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST",
        data: { model_id: modelId },
        //complete: function (res) {
        complete: res => {
           //var yy = JSON.stringify(_this.globalData.userInfo);
           //console.log(res.data.code + '=====' + _this.globalData.userInfo.nickName)
           console.log(res.data.status +'+++++')
           console.log(res.data.msg + '+++++')

           if (res.data.status != "100") {
              console.log('服务器错误：' + res.data.msg)
              app.wxToast({
                 title: '服务器错误：' + res.data.msg
              })
           }
           else{
              let n = 0;
              for (var i = 0; i < res.data.ext.solution_lists.length; i++) {
                 res.data.ext.solution_lists[i].qlen = 0;
                 res.data.ext.solution_lists[i].isshow = false;
              }
              this.setData({
                 solution_lists: res.data.ext.solution_lists
              })
              console.log(this.data.solution_lists);
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
  
  },

  getAllRects: function (op) {
     
     if (op.currentTarget.dataset.selectname==undefined){
        console.log("请定义节点的：data-selectname 属性值！")
        //data-selectname=".abbox .flexWarp"
        return false;
     }
     else if (op.currentTarget.dataset.setdataname == undefined){
        console.log("请定义节点的：data-setdataname 属性值！")
        return false;
     }
     else{
        var selectname = op.currentTarget.dataset.selectname;
        var setdataname = op.currentTarget.dataset.setdataname;
        if (setdataname.indexOf("-line-")!= -1){
           var newName =setdataname.split('-line-')[0];
           var seleName = setdataname.split('-line-')[1];
           setdataname = newName;
           
        }
     }
     var _this = this;
     var _thisLen=0;
     wx.createSelectorQuery().selectAll(selectname).boundingClientRect(function (rects) {
        var arrStr = '';
        var dataJson = {};
        var dataArr = [];
        console.log(rects.length)
        rects.forEach(function (rect,index){
           rect.id      // 节点的ID
           rect.dataset // 节点的dataset
           rect.left    // 节点的左边界坐标
           rect.right   // 节点的右边界坐标
           rect.top     // 节点的上边界坐标
           rect.bottom  // 节点的下边界坐标
           rect.width   // 节点的宽度
           rect.height  // 节点的高度
           console.log(rect.dataset)
           console.log(index)

           console.log(seleName==undefined)

           if (seleName != undefined){
              /****** 根据dataset.checked判断lenth *******/
              if (rect.dataset.checked == "on") {
                 _thisLen++;
              }
              if (index == rects.length - 1) {
                 arrStr += rect.dataset[seleName];
                 // 页面元素点击后 重新为data赋值
                 dataJson[setdataname] = arrStr;
                 dataJson[setdataname + "-len"] = _thisLen;
                 _this.setData(dataJson);
              }
              else{
                 
                 arrStr += rect.dataset[seleName] + ',';
              }
              console.log(arrStr)
              console.log(setdataname)
              
           }
           else{
              dataArr.push(rect);
              if (index == rects.length - 1) {
                 // 页面元素点击后 重新为data赋值
                 dataJson[setdataname] = dataArr;
                 _this.setData(dataJson);
                 // 数组push之前，原样取出
                 //console.log(_this.data.pagebd[0].dataset)
                 console.log(setdataname)
              }
           }
           console.log(_this)
           console.log(index +"=="+ rects.length)

        })

     }).exec()
  }

})