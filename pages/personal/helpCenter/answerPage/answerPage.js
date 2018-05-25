// pages/personal/helpCenter/answerPage/answerPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // answerList: []
    isStatic:false,
    decode:true,
    static1: false,
    static2: false,
    static3: false,
    static4: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      if(options.index == "static-1"){
        wx.setNavigationBarTitle({
          title: "如何发布Mart？"
        })
        this.setData({
          isStatic:true,
          static1:1
        })
      } else if (options.index == "static-2") {
        wx.setNavigationBarTitle({
          title: "如何参与Mart？"
        })
        this.setData({
          isStatic: true,
          static2: 1
        })
      } else if (options.index == "static-3") {
        wx.setNavigationBarTitle({
          title: "联系客服"
        })
        this.setData({
          isStatic: true,
          static3: 1
        })
      } else if (options.index == "static-4") {
        wx.setNavigationBarTitle({
          title: "我需要开发小程序"
        })
        this.setData({
          isStatic: true,
          static4: 1
        })
      }else{
     var _this = this;
     var app = getApp();
     var index = options.index;
     console.log(index)
      wx.request({
        url: app.globalData.domain + '/helpMessage/selectAll',
       header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          _this.setData({
            answerList:res.data.data[index],
         })

          wx.setNavigationBarTitle({
            title: res.data.data[index].title
          })

        }
      })
      }    
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

  //预览
  showImg:function(){
    wx.previewImage({
      current:"https://qswebsite.oss-cn-beijing.aliyuncs.com/concat_service/contact_service.png",
      urls: ["https://qswebsite.oss-cn-beijing.aliyuncs.com/concat_service/contact_service.png"]
    })
  }
})