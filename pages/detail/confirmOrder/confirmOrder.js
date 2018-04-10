// pages/detail/confirmOrder/confirmOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList:[],
    sum:0,
    userName:"",
    userPhone:"",
    addressName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var data = JSON.parse(options.jsonStr);
    console.log(data)
    var sum = 0;
    for (var i=0;i<data.orderGoods.length;i++){
      sum += data.orderGoods[i].sum
    }
    _this.setData({
      goodsList: data.orderGoods,
      sum: sum,
      addressName: data.addressName
    })
    var userid = wx.getStorageSync("userId");
    var app = getApp();
    wx.request({
      url: app.globalData.domain + '/userInfo/selectByUserId',
      data: {
        userId: userid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data)
        console.log(res.data.data)
        if (res.data.data) {
          _this.setData({
            userName: res.data.data.name,
            userPhone: res.data.data.phoneNumber
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