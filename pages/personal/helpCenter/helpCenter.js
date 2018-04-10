// pages/personal/helpCenter/helpCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questionList: [
      // {
      //   title: '关于我们'
      // },
      // {
      //   title: '红包怎么用？'
      // },
      // {
      //   title: '使用本产品是否产生费用？提现是否有手续费？'
      // },
      // {
      //   title: '如何上首页推荐？'
      // },
      // {
      //   title: '如何发布到朋友圈？'
      // }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var app = getApp();
    wx.request({
      url: app.globalData.domain + '/helpMessage/selectAll',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        for (var i = 0; i < res.data.data.length; i++) {
          _this.data.questionList[i] = res.data.data[i]
        }
        _this.setData({
          questionList: _this.data.questionList
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