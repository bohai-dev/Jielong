// pages/personal/testPay/testPay.js
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  
  // 测试支付
  testPay:function(){
    //支付测试接口 
    var payUrl ="http://47.88.54.113:8081/wxpay/pay";
    wx.request({
      url: payUrl,
      success:function(res){
   
       var data=res.data;      
       if (data.errorCode==0){
         console.log(data.data);
         var params=data.data;

         //请求参数成功，发起支付
          wx.requestPayment({
            timeStamp: params.timeStamp,
            nonceStr: params.nonceStr,
            package: params.package,
            signType: params.signType,
            paySign: params.paySign,
            success: function (res) {
              console.log(res)
            },
            fail: function (res) {
              console.log(res)
            }  
          })
       
       }else{
         console.log(data.errorMessage);
       }
      },
      fail:function(err){
        console.log(err);
      }
    })
    

    // wx.requestPayment({
    //   timeStamp: '',
    //   nonceStr: '',
    //   package: '',
    //   signType: '',
    //   paySign: '',
    // })


  }
})