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
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading();   //关闭模态框
    }, 60000)
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
          wx.hideLoading();   //关闭模态框
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
            id: id,
            oldname: name,
            oldphone: phone,
            oldemail: email,
            olddetail: detail
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
    if (!(/^\d{10}$/.test(phone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确号码',
        confirmColor: "#2CBB6B",
        showCancel: false,
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
    wx.showLoading({
      title: 'loading',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading();   //关闭模态框
    }, 60000)
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var name = e.detail.value.name;
    var phone = e.detail.value.phone;
    var email = e.detail.value.email;
    var detail = e.detail.value.detail;
    var userId = wx.getStorageSync('userId');
    var oldname = this.data.oldname;
    var oldphone = this.data.oldphone;
    var oldemail = this.data.oldemail;
    var olddetail = this.data.olddetail;
    var id = page.data.id;
    console.log('用户信息为：', name + phone + email + detail + userId)
    console.log('旧信息为：', oldname + oldphone + oldemail + olddetail)
    if (!e.detail.value.name) {
      wx.hideLoading();   //关闭模态框
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        confirmColor: "#2CBB6B",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!(/^\d{10}$/.test(phone))) {
      wx.hideLoading();   //关闭模态框
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
      if (name == oldname && phone == oldphone && email == oldemail && detail == olddetail){
        wx.hideLoading();   //关闭模态框
        wx.navigateBack({
          delta: 1
        })
      }else{
        wx.request({
          url: app.globalData.domain + '/userInfo/update',
          method: 'POST',
          data: {
            name: name,
            phoneNumber: phone,
            email: email,
            deliveryAddress: detail,
            //userId: userId,
            id: id
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200 && res.data.data == 1) {
              wx.hideLoading();   //关闭模态框
              wx.showToast({
                title: '保存成功！',
                icon: 'success',
                mask: true,
                duration: 2000
              })
              setTimeout(function () {
                wx.hideToast()
                page.onLoad()
                // wx.navigateBack({
                //   delta: 1
                // })
              }, 1500)
            } else {
              wx.hideLoading();   //关闭模态框
              wx.showModal({
                title: '提示',
                content: '保存失败！请重试',
                confirmColor: "#2CBB6B",
                showCancel: false,
                success: function (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }
          }
        })
      }
    }
  }
})