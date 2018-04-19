// pages/comments/systemNotice/systemNotice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var show = false;
    for (var i = 0; i < this.data.noticeList.length; i++) {
      if (this.data.noticeList[i].isRead == 0) {
        show = false;
        break;
      }else{
        show = true;
      }
    }
    if (show) {
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
  
  },
  //自定义函数
  searchAddress: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    console.log(this.data.noticeList[index]);
    var jsonStr = JSON.stringify(this.data.noticeList[index]);
    wx.navigateTo({
      url: './noticeContent/noticeContent?jsonStr=' + jsonStr,
    })
  },
})