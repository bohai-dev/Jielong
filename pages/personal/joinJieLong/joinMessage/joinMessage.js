// pages/personal/joinJieLong/joinMessage/joinMessage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data:{

    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.jsonStr))
    this.setData({
      data: this.formatData(JSON.parse(options.jsonStr))
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
  //修改订单
  // modifyOrder:function(){
  //   var id = this.data.data.jielongId;
  //   console.log(id)
  //   var jsonStr = JSON.stringify(this.data.data);
  //   wx.navigateTo({
  //     url: '../../../detail/detail.wxss?id=' + id + '&fromMine=0&jsonStr=' + jsonStr
  //   })
  // },
  //取消订单
  cancelOrder:function(){
    var _this = this;
    var app = getApp();
    wx.showModal({
      title: '提示',
      content: '确定取消订单？',
      confirmColor: "#2CBB6B",
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({
            title: 'loading',
            mask: true
          })
          setTimeout(function () {
            wx.hideLoading();   //关闭模态框
          }, 60000)
          var order = _this.data.data;
          if (order.orderGoods[0].goods.isSetGroup == 0){
            var orderId = order.id;
            console.log(orderId);
            wx.request({
              url: app.globalData.domain + '/order/cancelOrder',
              // data: orderId,
              data: {
                orderId: orderId
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200 && res.data.data == 1) {
                  wx.hideLoading();   //关闭模态框
                  wx.showModal({
                    title: '提示',
                    content: '取消订单成功！',
                    confirmColor: "#2CBB6B",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                        console.log("取消成功")
                      }
                    }
                  })
                } else {
                  console.log("取消失败")
                  wx.hideLoading();   //关闭模态框
                  wx.showModal({
                    title: '提示',
                    content: '取消失败！请重试',
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
            console.log("费城团团购");
          }else{
            clear(order)
            //删除字段
            function clear(order) {
              delete order.createdAt;
              delete order.updatedAt;
              if (order.orderGoods){
                clear(order.orderGoods[0])
                clear(order.orderGoods[0].goods)
              }
            }
            console.log("成团团购");
            //取消订单接口
            wx.request({
              url: app.globalData.domain + '/order/cancelJoinGroup',
              data: order,
              method: 'POST',
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200 && res.data.data == 1) {
                  wx.hideLoading();   //关闭模态框
                  wx.showModal({
                    title: '提示',
                    content: '取消订单成功！',
                    confirmColor: "#2CBB6B",
                    showCancel: false,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                        console.log("取消成功")
                      }
                    }
                  })
                } else {
                  console.log("取消失败")
                  wx.hideLoading();   //关闭模态框
                  wx.showModal({
                    title: '提示',
                    content: '取消失败！请重试',
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
  },
  //格式化数据
  formatData: function (res) {
    console.log(res)
      var detailTime = res.userAddress.detail.split("***");
      if (detailTime.length == 2) {
        res.userAddress.detail = detailTime[0];
        res.userAddress.claimTime = detailTime[1];
      } else {
        res.userAddress.detail = detailTime[0];
        res.userAddress.claimTime = "";
      }
    return res;
  },  
})