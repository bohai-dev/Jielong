
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "comments",
  /**
   * 页面的初始数据
   */

  data: {
    photo: '../../images/notice.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var app = getApp();
    var _this=this;
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
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].isRead == 0) {
            var photo = '../../images/w-notice.png';
            break;
          } else {
            var photo = '../../images/notice.png';
          }
        }
        _this.setData({
          photo: photo
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },


  //以下为自定义点击事件

})

