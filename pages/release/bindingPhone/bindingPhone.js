// pages/release/bindingPhone/bindingPhone.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    phone: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
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
        if (res.data.data) {
          console.log("success")
          var id = res.data.data.id;
          that.setData({
            id: id
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

  },
  //检查手机号
  telCheck: function (e) {
    console.log(e.detail.value)
    var phone = e.detail.value;
    if (!(/^\d+$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确号码',
        confirmColor: "#2CBB6B",
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
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var userId = wx.getStorageSync('userId');
    var id = page.data.id;
    console.log('用户信息为：', name + phone + id + userId)
    if (!e.detail.value.name) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        confirmColor: "#2CBB6B",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!(/^\d+$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确手机号码',
        confirmColor: "#2CBB6B",
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
          userId: userId,
          id: id
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.statusCode == 200 && res.data.data == 1) {
            wx.showToast({
              title: '保存成功！',
              icon: 'success',
              duration: 2000
            })
            setTimeout(function () {
              wx.hideToast()
              page.onLoad()
              wx.navigateBack({
                delta: 1
              })
            }, 1500)
          } else {
            wx.showLoading({
              title: 'loading',
            })
            setTimeout(function () {
              wx.hideLoading();   //关闭模态框
              wx.showModal({
                title: '提示',
                content: '保存失败！',
                confirmColor: "#2CBB6B",
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }, 1500)
          }
          console.log("绑定手机成功")
        }
      })
    }
  }
})