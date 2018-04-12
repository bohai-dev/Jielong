// pages/detail/confirmOrder/confirmOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderGoods:[],
    total:0,
    userName:"",
    userPhone:"",
    addressName: "",
    addressId:0,
    remark:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var data = JSON.parse(options.jsonStr);
    console.log(data)
    var userId = wx.getStorageSync("userId");
    var total = 0;
    for (var i=0;i<data.orderGoods.length;i++){
      total += data.orderGoods[i].total
    }
    _this.setData({
      orderGoods: data.orderGoods,
      total: total,
      addressName: data.addressName,
      addressId: Number(data.addressId),
      userId: userId,
      jielongId: data.jielongId,
      isSetGroup: data.isSetGroup
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
  
  },
  //检查手机号
  telCheck: function (e) {
    console.log(e.detail.value)
    var phone = e.detail.value;
    if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(phone))) {
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
  //修改用户姓名
  inputUserName: function (e) {
    this.data.userName = e.detail.value;
  },
  //修改用户手机
  inputUserPhone: function (e) {
    this.data.userPhone = e.detail.value;
  }, 
  //填写备注
  inputMemoChange: function(e) {
    this.data.remark = e.detail.value;
  },
  //提交订单
  submitOrder:function(e){
    var _this = this;
    var app = getApp();
    
    if (!this.data.userName) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else if (!(/^1(3|4|5|6|7|8)\d{9}$/.test(this.data.userPhone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确手机号码',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      var id = _this.data.jielongId;
      var orderGoods = _this.data.orderGoods;
      wx.request({
        url: app.globalData.domain + '/jielong/selectById',
        data: {
          id: id
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          var repertorychange = true;
          for (var i = 0; i < res.data.data.goodsList.length; i++) {
            for (var j = 0; j < orderGoods.length; j++) {
              if (res.data.data.goodsList[i].id == orderGoods[j].goodsId) {
                if (orderGoods[j].sum > res.data.data.goodsList[i].repertory) {
                  repertorychange = false;
                  break;
                }
              }
            }
          }
          if (repertorychange == true){
            var data = _this.data;
            wx.request({
              url: app.globalData.domain + '/order/insert',
              method: 'POST',
              data: data,
              header: {
                'content-type': 'application/json'
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200 && res.data.data == 1) {
                  console.log("下单成功")
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000
                  })
                  setTimeout(function () {
                    wx.hideToast()
                    wx.navigateBack({
                      delta: 2
                    })
                  }, 1500)
                } else {
                  console.log("下单失败")
                  wx.showLoading({
                    title: 'loading',
                  })
                  setTimeout(function () {
                    wx.hideLoading();   //关闭模态框
                    wx.showModal({
                      title: '提示',
                      content: '下单失败！',
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                        }
                      }
                    })
                  }, 1000)
                }
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: '商品库存发生变化，请刷新后重新选择商品！',
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
})