
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "release",
  /**
   * 页面的初始数据
   */

  data: {
  
      topic:null,          //主题
      description:null,    //活动描述  
      addressName: "定位活动地址" ,          //地址名称
      addressDetail:null ,                 //详细地址
      imageLocalPaths: [],                //本地介绍图片数组 { id:1, unique: 'unique_1',path:''}
      imageServerPaths: [],               //服务器图片介绍数组 { id:1, unique: 'unique_1',path:''}
      setFinishTime:false,               //是否设置截止时间
      goodsArray: [                     //商品数组 
         {
            unique:'unique_0',            // 该item在数组中的唯一标识符
            goodsName:null,              //商品名称 
            goodsLocalPaths:[],         // 商品本地图片路径 数组
            goodsLocalPaths: [],       // 商品服务器图片路径 数组
            goodsParentClass:null,     //商品一级分类 id
            goodsSubClass:null ,      // 商品二级分类 id
            goodsSpec:null,          //商品规格
            goodsPrice:null,        //商品价格 
            goodsRepertory:null,   //商品库存
            setGroup:false,       //是否设置最低参团人数,默认false
            groupSum:null        //最低参团人数

         }


      ]                  



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 注册coolsite360交互模块
    app.coolsite360.register(this)
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
    // app.coolsite360.onShow(this);
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

 

  uploadImage:function(){
 
    var self=this
    wx.chooseImage({   //可选择多个图片
      success: function(res) {
        var tempFilePaths = res.tempFilePaths  //图片临时路径,数组
      
        var length = self.data.imageLocalPaths.length
        for (var i = 0; i < tempFilePaths.length;i++){
          var loalImg = [{ id: length, unique: 'unique_' + length, path: tempFilePaths[i] }];
          self.data.imageLocalPaths = self.data.imageLocalPaths.concat(loalImg)   //concat拼接多个数组
          length++;

        }
        self.setData({
          imageLocalPaths: self.data.imageLocalPaths
        })

        console.log(self.data.imageLocalPaths)
       
      },
    })
  },


  //选择活动地址
  chooseAddress:function(){
    console.log('chooseAddress')
    var self=this

    wx.chooseLocation({
      success: function (res) {
        self.setData({
          addressName:res.name,
          addressDetail:res.address
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
    
    
  },
  //设置截止时间  
  timeChange:function(e){
    console.log(e.detail.value)
    this.setData({
      setFinishTime: e.detail.value

    })
  },
  //发布接龙
  publish:function(){
    var localImages=this.data.imageLocalPaths
    //先循环上传接龙介绍图片，得到url
    for (var i=0;i<localImages.length;i++){   
     
      wx.uploadFile({
        url: app.globalData.domain +'/uploadImage',        //服务器上传地址
        filePath: localImages[i].path,
        name: 'image',
        success: function (res) {
          var data = res.data
          console.log(data)
        }
      })
    }

  }



  

})

