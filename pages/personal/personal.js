
// 引入coolsite360交互配置设定
require('coolsite.config.js');

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
      mineName:"我发起的接龙",
      rlCont: "3个"
    }, {
      mineIcon: "../../images/mine/supplier-features.png",
      mineName: "我参与的接龙",
      mineMarginTop:"mineMarginTop",
      rlCont: "0次"
    },{
      mineIcon: "../../images/mine/personal-center.png",
      mineName: "个人资料",
      navUrl: "./userInfo/userInfo"
    }, {
      mineIcon: "../../images/mine/map.png",
      mineName: "自提点管理",
      navUrl:  "./address/address",
      mineMarginTop: "mineMarginTop"
    }, {
      mineIcon: "../../images/mine/comments.png",
      mineName: "帮助中心",
    }],
    userInfo:{}



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 注册coolsite360交互模块
    app.coolsite360.register(this);
    console.log(123)
    console.log(app.globalData)
    console.log(app.globalData.userInfo)
    if (app.globalData.userInfo) {
      console.log(456)
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
    // 执行coolsite360交互组件展示
    app.coolsite360.onShow(this);
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

