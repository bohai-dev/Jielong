// 获取全局应用程序实例对象
var app = getApp();
var pageNum = 1;             //页数

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "index",
  /**
   * 页面的初始数据
   */

  data: {
    appGlobalUrl: app.globalData.domain,
    appGlobalHost: app.globalData.domainUpload,
    swiperList: [],                //轮播图片数据
    containerList: [],             //首页内容数据
    showLoading: false,
    pageSize: 10,                   //每页加载的数据量
    jielongAllCount:0,              //总的页数
    showAllData:false               //是否加载完所有的数据

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 接龙首页所有的数据量
    this.selectAllCount();
    // 加载首页轮播图片
    this.loadSwiperImg();
    //加载内容
    this.loadContainer(pageNum);

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
    //消息接口
    var app = getApp();
    var _this = this;
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
        for(var i=0;i<res.data.data.length;i++){
          if (res.data.data[i].isRead == 0){
            wx.showTabBarRedDot({
              index: 2
            })
            break;
          }else{
            wx.hideTabBarRedDot({
              index: 2
            })
          }
        }
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
    wx.showNavigationBarLoading();
    pageNum = 1;
    this.setData({
      containerList:[],
      showAllData:false
    })

    this.loadContainer(1);

    setTimeout(function () {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 10000)
  },
  /**
 * 页面相关事件处理函数--监听用户上拉动作
 */
  onReachBottom() {
    if (pageNum < this.data.jielongAllCount){
      this.setData({
        showLoading: true
      })
      this.loadContainer(++pageNum);
    }else{
      this.setData({
        showAllData: true
      })
    }


  },

  //以下为自定义点击事件

  //加载轮播图
  loadSwiperImg: function () {
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/queryStartCarousels',
      method: "GET",
      success: function (res) {
        if (res.statusCode == 200 && res.data) {
          _this.setData({
            swiperList: res.data
          })
        }
      }
    })
  },

  //加载首页内容
  loadContainer: function (p) {
    var _this = this;
    var data = {
      pageNum: p,
      pageSize: _this.data.pageSize
    }
    wx.request({
      url: app.globalData.domain + '/jielong/selectByPage',
      method: "POST",
      data: data,
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        console.log(res);
        if (res.data.errorCode == 0 && res.data.data) {
          _this.data.containerList = _this.data.containerList.concat(res.data.data)
          for (var i = 0; i < _this.data.containerList.length ; i++){
            var todayTime = new Date(_this.data.containerList[i].createTimeStr);
            todayTime = todayTime.getFullYear() + "-" + (todayTime.getMonth() + 1) + "-" + todayTime.getDate();
            _this.data.containerList[i].createTimeStr = todayTime;
          }
          _this.setData({
            containerList: _this.data.containerList,
            showLoading: false
          })
          wx.hideNavigationBarLoading();
          wx.stopPullDownRefresh();
        }
      },
      fail:function(err){
        _this.setData({
          showLoading: false
        })
      }
    })
    console.log(this)
  },
  //查找所有的数据
  selectAllCount:function(){
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/jielong/selectCount',
      method: "GET",
      success:function(res){
        if(res.statusCode == 200){
          _this.setData({
            jielongAllCount: Math.ceil(res.data.data / _this.data.pageSize)
          })

        }
      }
    })
  },
  //跳转到每个接龙详细信息
  // navToDetail:function(e){
  //   var jsonStr = JSON.stringify(e.currentTarget.dataset.data);
  //   if (e.currentTarget.dataset.data){
  //     wx.navigateTo({
  //       url: '../detail/detail?jsonStr=' + jsonStr,
  //     })
  //   }
  // }

})

