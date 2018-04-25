// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "personal",
  /**
   * 页面的初始数据
   */

  data: {
    userDetialList:[{
      mineIcon:"../../images/mine/training.png",
      mineName:"我发起的团购",
      rlCont: "0个",
      navUrl: "./mineJieLong/mineJieLong"
    }, {
      mineIcon: "../../images/mine/supplier-features.png",
      mineName: "我参与的团购",
      mineMarginTop:"mineMarginTop",
      rlCont: "0次",
      navUrl: "./joinJieLong/joinJieLong"
    },{
      mineIcon: "../../images/mine/personal-center.png",
      mineName: "个人资料",
      navUrl: "./userInfo/userInfo"
    }, {
      mineIcon: "../../images/mine/map.png",
      mineName: "取货点及时间管理",
      navUrl:  "./address/address",
      mineMarginTop: "mineMarginTop"
    }, {
      mineIcon: "../../images/mine/comments.png",
      mineName: "帮助中心",
      navUrl: "./helpCenter/helpCenter"
    }],
    userInfo:{}



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }

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
    //初始化接龙数据
    this.initData();
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
  // 自定义事件
  //获取发起/参与接龙数
  initData: function (e) {
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/jielong/selectByUserId',
      method: "GET",
      data: { userId: wx.getStorageSync("userId") },
      success: function (res) {
        if (res.statusCode == 200 && res.data.data.length) {
          _this.data.userDetialList[0].rlCont = res.data.data.length + "个";
          _this.setData({
            userDetialList: _this.data.userDetialList
          })
        }
      }
    });

    wx.request({
      url: app.globalData.domain + '/order/selectByCustomerId',
      data: {
        customerId: wx.getStorageSync("userId")
      },
      success: function (res) {
        if (res.statusCode == 200 && res.data.data.length) {
          _this.data.userDetialList[1].rlCont = res.data.data.length + "个";
          _this.setData({
            userDetialList: _this.data.userDetialList
          })
        }
      }
    })
  }


})

