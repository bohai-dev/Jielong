// pages/release/selectAddress/selectAddress.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList:[]
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
    var _this = this;
    wx.getStorage({
      key: 'seleAddrKey',
      success: function (res) {
        console.log(res)
        var addrParseJson = JSON.parse(res.data);
        _this.setData({
          addressList: addrParseJson
        })
      },
      fail: function (err) {
        wx.request({
          url: app.globalData.domain + '/userAddress/selectByUserId',
          data: {
            userId: wx.getStorageSync("userId")
          },
          success: function (res) {
            if (res.data.errorCode == 0) {
              _this.setData({ addressList: res.data.data })
            }
            for (var i = 0; i < _this.data.addressList.length; i++) {
              _this.data.addressList[i].value = false;
            }
            var addrJson = JSON.stringify(_this.data.addressList);
            wx.setStorage({
              key: 'seleAddrKey',
              data: addrJson,
            })
          }
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
  //选择自提点
  listenCheckboxChange: function(e){
    var _this = this;
    var checkIndex = e.currentTarget.dataset.index;
    _this.data.addressList[checkIndex].value = !_this.data.addressList[checkIndex].value; 
    var addrJson = JSON.stringify(_this.data.addressList);
    console.log(_this)
    wx.setStorage({
      key: 'seleAddrKeyB',
      data: addrJson,
    })
    console.log(_this)

  },
  //确认自提点
  sureAddr:function(e){
    wx.getStorage({
      key: 'seleAddrKeyB',
      success: function(res) {
        var addrParseJson = JSON.parse(res.data);
        wx.setStorage({
          key: 'seleAddrKey',
          data: res.data,
          success:function(res){
            wx.navigateBack({
              delta: "1"
            })
          }
        })
        console.log(addrParseJson)
      }
    })

  }
})