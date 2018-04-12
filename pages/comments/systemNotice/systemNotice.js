// pages/comments/systemNotice/systemNotice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:[]
  },
  searchAddress: function () {
    wx.navigateTo({
      url: './noticeContent/noticeContent',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //显示系统通知
    var app = getApp();
    var _this = this;
    var userId = wx.getStorageSync("userId");
    wx.request({
      url: app.globalData.domain + '/userMessage/selectByUserId',
      data: {
        userId: userId
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        _this.setData({
          noticeList: res.data.data
        })
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
    console.log(this.data.noticeList)
    //用户已读消息
    var  _this = this;
    var app = getApp();
    for (var i = 0; i < this.data.noticeList.length; i++) {
      if (this.data.noticeList[i].isRead == 0) {
        var id = this.data.noticeList[i].id;
        wx.request({
          url: app.globalData.domain + '/userMessage/updateReadStatus',
          data: {
            id: id
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res.data.data)
            // _this.setData({
            //   noticeList: res.data.data
            // })
          }
        })
      }
      wx.hideTabBarRedDot({
        index: 2
      })
    }
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