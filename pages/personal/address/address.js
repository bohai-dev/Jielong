// pages/personal/address/address.js
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

 //新增地点
  addAddress:function(){
   var data={
     userId: wx.getStorageSync("userId"),
     name:'银桥大厦',
     detail:'浦东新区新金桥路28号',
     longitude:50,       //经度
     latitude:20         //纬度

   } 

   wx.request({
     url: app.globalData.domain +'/userAddress/insert',
     method:'POST',
     header: {
       'content-type': 'application/json' // 默认值
     },
     data:data,
     success:function(res){
       var data=res.data
       if(data.errorCode==0){
         console.log('插入地址成功')
       }
     }

   })

  }
})