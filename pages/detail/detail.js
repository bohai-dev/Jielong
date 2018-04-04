
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  name: "detail",
  data: {
    appGlobalUrl: app.globalData.domain,
    userImg: "",            //发布用户头像
    goodstopic: "",                  //接龙主题
    goodsdata:"",                          //接龙日期
    person:0,                                 //浏览人数
    goodsdescribe:"",             //接龙描述
    goodsImg: [],          //接龙图片
    goodsnum:0,                                 //购买数量
    joinnum:0,                                  //参与数量
    GoodsDetialList: [{                         //接龙信息
      mineIcon: "../../images/bigposition.png",
      mineName: "",
      show: true,
      addressDetail:"",
      addressLatitude:"",
      addressLongitude:""
    }, {
      mineIcon: "../../images/phone.png",
      mineName: "",
      phone:"",
      show: true
    }, {
      mineIcon: "../../images/location.png",
      mineName: "查看并选择自提点",
      goodsAddresses:"",
      show: true
    }, {
      mineIcon: "../../images/time.png",
      mineName: "接龙截至时间: 2018-04-02 16:00",
      show:true,
      rightArrow:"dn"
    }],
    GoodList: [
    //   {                                //商品列表
    //   img: ["../../images/deleteImg.png"],      //商品图片
    //   name: "多肉植物",                          //商品名称
    //   price:10.00,                              //商品价格
    //   specification:"盆",                       //商品规格
    //   repertory:100,                            //商品库存
    // }
    ],
    record:[{                                   //接龙记录
      recordNumber:0,
      recordText:"参与接龙(人)",
      rightBorder: "rightborder"
    }, {
      recordNumber: 0.00,
      recordText: "接龙金额(元)"
    }],
    partakeRecord: [{                            //参与记录
      userimg: '../../images/deleteImg.png',           //用户头像
      username:"迪欧大魔王",                      //用户名称
      joinnumber:1,                              //购买数量
      partakedate: "2018-03-28 22:03"            //参与日期
    }, {
        userimg: '../../images/personal.png',
      username: "MonsterDO",
      joinnumber: 2,
      partakedate: "2018-04-01 15:35"
    }]    



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    // 注册coolsite360交互模块
    app.coolsite360.register(this);
    var _this = this;
    var data = JSON.parse(e.jsonStr);
    console.log(data)
    var userImg = data.userInfo.avatarUrl;
    var goodstopic = data.topic;
    var goodsdata = data.createdAt;
    var person = data.browseSum;
    var goodsdescribe = data.description;
    var goodsImg = data.imageList;
    _this.data.GoodsDetialList[0].mineName = data.addressName;
    _this.data.GoodsDetialList[0].addressDetail = data.addressDetail;
    _this.data.GoodsDetialList[0].addressLatitude = data.addressLatitude;
    _this.data.GoodsDetialList[0].addressLongitude = data.addressLongitude;
    _this.data.GoodsDetialList[1].mineName = data.phoneNumber + "(" + data.userInfo.name + ")";
    _this.data.GoodsDetialList[1].phone = data.phoneNumber;
    _this.data.GoodsDetialList[2].goodsAddresses = data.goodsAddresses;
    _this.data.GoodsDetialList[3].show = (data.setFinishTime==1)?true:false;
    _this.data.GoodsDetialList[3].mineName = "接龙截至时间: "+data.finishTime;
    _this.data.GoodList = data.goodsList;
    for (var i = 0; i < (_this.data.GoodList.length); i++){
      _this.data.GoodList[i].serverPaths = _this.data.GoodList[i].serverPaths.split(",")
    }
    _this.setData({
      userImg: userImg,
      goodstopic: goodstopic,
      goodsdata: goodsdata,
      person: person,
      goodsdescribe: goodsdescribe,
      goodsImg: goodsImg,
      GoodsDetialList: _this.data.GoodsDetialList,
      GoodList: _this.data.GoodList
    })
    console.log(_this.data)
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

