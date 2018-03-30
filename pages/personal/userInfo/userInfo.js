// pages/personal/userInfo/userInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    email: '',
    detail: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var page = this;
    var userid = wx.getStorageSync("userId")
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
          console.log("success")
          var name = res.data.data.name;
          var phone = res.data.data.phoneNumber;
          var email = res.data.data.email;
          var detail = res.data.data.deliveryAddress;
          var id = res.data.data.id;
          page.setData({
            name: name,
            phone: phone,
            email: email,
            detail: detail,
            id: id
          })
        }
        //console.log(info+"222"+"id:"+id)
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
  //检查手机号
  telCheck: function (e) {
    console.log(e.detail.value)
    var phone = e.detail.value;
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确号码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      return false;
    }
  },
  //提交信息
  formSubmit: function (e) {
    var page = this;
    var app = getApp();
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var email = e.detail.value.email;
    var detail = e.detail.value.detail;
    var userId = wx.getStorageSync('userId');
    var id = page.data.id;
    console.log('用户信息为：', name + phone + email + detail + userId)
    if (!e.detail.value.name) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确手机号码',
        showCancel: false,
        success: function (res) {
          console.log(res)
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.request({
        url: app.globalData.domain + '/userInfo/update',
        method: 'POST',
        data: {
          name: name,
          phoneNumber: phone,
          email: email,
          deliveryAddress: detail,
          userId: userId,
          id: id
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          wx.navigateBack({
            url: '../personal/personalt'
          })
          console.log("新建或更新成功")
        }
      })
    }
  }
})