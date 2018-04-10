
// 引入coolsite360交互配置设定
require('coolsite.config.js');

// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  name: "detail",
  data: {
    appGlobalUrl: app.globalData.domain,
    userImg: "",                                //发布用户头像
    goodstopic: "",                             //接龙主题
    goodsdata:"",                               //接龙日期
    person:0,                                   //浏览人数
    goodsdescribe:"",                           //接龙描述
    goodsImg: [],                               //接龙图片
    joinnum:0,                                  //参与数量
    SetGroup:true,                              //是否设置最小成员团
    joinperson:5,                               //参与人数
    joinUserImg: ['../../images/navIcon/personal1.png', '../../images/navIcon/personal1.png', '../../images/navIcon/personal1.png', '../../images/navIcon/personal1.png'],
    Group:5,                                    //最小开团人数
    buy: "请选择商品",                           //购买商品
    count: 0,                                   //商品总数
    total: 0,                                   //商品总价
    GoodsDetialList: [{                         //接龙信息
      mineIcon: "../../images/bigposition.png",
      mineName: "",
      show: true,
      bindTap:"showMap",
      addressDetail:"",
      addressLatitude:"",
      addressLongitude:""
    }, {
      mineIcon: "../../images/phone.png",
      mineName: "",
      phone:"",
      show: true,
      bindTap: "callPhone"
    }, {
      mineIcon: "../../images/location.png",
      mineName: "查看并选择自提点",
      goodsAddresses:"",
      show: true,
      bindTap: "showLocation"
    }, {
      mineIcon: "../../images/time.png",
      mineName: "",
      show:true,
      rightArrow:"dn"
    }],
    GoodList: [],
    record: [{                                   //接龙记录
      recordNumber: 0,
      recordText: "浏览(人)",
      rightBorder: "rightborder"
    }, {
      recordNumber:0,
      recordText:"参与接龙(人)",
      rightBorder: "rightborder"
    }, {
      recordNumber: 0.00,
      recordText: "接龙金额(元)"
    }],
    partakeRecord: [{                            //参与记录
      userimg: '../../images/deleteImg.png',     //用户头像
      username:"迪欧大魔王",                      //用户名称
      joinnumber:1,                              //购买数量
      partakedate: "2018-03-28 22:03"            //参与日期
    }, {
      userimg: '../../images/navIcon/personal1.png',
      username: "MonsterDO",
      joinnumber: 2,
      partakedate: "2018-04-01 15:35"
    }],
    footnav: [{
      navIcon: "../../images/home.png",
      navText: "首页",
      navUrl: "../index/index",
      navborder: "footNavrightborder"
    }, {
      navIcon: "../../images/add.png",
      navText: "发布接龙",
      navUrl: "../add/add"
    }],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    var _this = this;
    var id = e.id;
    var app = getApp();
    //增加页面浏览人数
    wx.request({
      url: this.data.appGlobalUrl + '/jielong/updateBrowse',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res)
      }
    })
    //获取页面数据
    wx.request({
      url: app.globalData.domain + '/jielong/selectById',
      data: {
        id: id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data) {
          _this.data.GoodsDetialList[0].mineName = res.data.data.addressName;
          _this.data.GoodsDetialList[0].addressDetail = res.data.data.addressDetail;
          _this.data.GoodsDetialList[0].addressLatitude = res.data.data.addressLatitude;
          _this.data.GoodsDetialList[0].addressLongitude = res.data.data.addressLongitude;
          _this.data.GoodsDetialList[1].mineName = res.data.data.phoneNumber + "(" + res.data.data.userInfo.name + ")";
          _this.data.GoodsDetialList[1].phone = res.data.data.phoneNumber;
          _this.data.GoodsDetialList[2].goodsAddresses = res.data.data.goodsAddresses;
          _this.data.GoodsDetialList[3].show = (res.data.data.setFinishTime==1)?true:false;
          _this.data.GoodsDetialList[3].mineName = "接龙截至时间: " + res.data.data.finishTime;
          _this.data.GoodList = res.data.data.goodsList;
          _this.data.record[0].recordNumber = res.data.data.browseSum;
          var SetGroup = res.data.data.goodsList[0].isSetGroup;
          for (var i = 0; i < (_this.data.GoodList.length); i++){
            _this.data.GoodList[i].serverPaths = _this.data.GoodList[i].serverPaths.split(",");
            _this.data.GoodList[i]["goodsnum"] = 0;
          }
          _this.setData({
            userImg: res.data.data.userInfo.avatarUrl,
            goodstopic: res.data.data.topic,
            goodsdata: res.data.data.createdAt,
            person: res.data.data.browseSum,
            goodsdescribe: res.data.data.description,
            goodsImg: res.data.data.imageList,
            GoodsDetialList: _this.data.GoodsDetialList,
            GoodList: _this.data.GoodList,
            takeGoodsAddressList: res.data.data.takeGoodsAddressList,
            SetGroup: SetGroup,
            record: _this.data.record
          })
        }
      }
    })
   


    if (e.addrJson){
      console.log("设置了自提点");
    }else{
      console.log("没有设置自提点");
    }
    
    // 注册coolsite360交互模块
    app.coolsite360.register(this);
    
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
  //查看地图
  showMap:function(){
    var _this = this;
    wx.openLocation({
      //当前经纬度
      latitude: _this.data.GoodsDetialList[0].addressLatitude,
      longitude: _this.data.GoodsDetialList[0].addressLongitude,
      //缩放级别默认28
      scale: 28,
      //位置名
      name: _this.data.GoodsDetialList[0].mineName,
      //详细地址
      address: _this.data.GoodsDetialList[0].addressDetail
    })
  },
  //拨打电话
  callPhone: function () {
    var _this = this;
    wx.makePhoneCall({
      phoneNumber: _this.data.GoodsDetialList[1].phone
    })
  },
  showLocation: function () {
    console.log(this.data.takeGoodsAddressList)
    var jsonStr = JSON.stringify(this.data.takeGoodsAddressList);
    wx.navigateTo({
      url: './selectAddress/selectAddress?jsonStr=' + jsonStr
    })
  },
  //减少购买数量
  minusNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    if (this.data.GoodList[index].goodsnum > 0) {
      this.data.GoodList[index].goodsnum--;
      this.data.count--;
      if (this.data.count < 0) {
        this.data.count = 0;
      }
      this.data.total -= this.data.GoodList[index].price;
      if (this.data.total == 0) {
        var buy = "请选择商品";
      } else {
        var buy = "已选：￥" + this.data.total;
      }
    } else {
      if (this.data.total <= 0) {
        var buy = "请选择商品";
      } else {
        var buy = "已选：￥" + this.data.total;
      }
    }
    console.log(this.data.count)
    this.setData({
      GoodList: this.data.GoodList,
      count: this.data.count,
      buy: buy
    })
  },
  //增加购买数量
  addNumber: function (e) {
    var index = e.currentTarget.dataset.index;
    var repertory = this.data.GoodList[index].repertory;
    if (this.data.GoodList[index].goodsnum >= repertory) {
      wx.showModal({
        title: '',
        content: '抱歉，该商品库存不足!',
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#08CF40",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      var buy = "已选：￥" + this.data.total;
    } else {
      this.data.GoodList[index].goodsnum++;
      this.data.count++;
      this.data.total += this.data.GoodList[index].price;
      var buy = "已选：￥" + this.data.total;
    }
    console.log(this.data.total)
    this.setData({
      GoodList: this.data.GoodList,
      count: this.data.count,
      buy: buy
    })
  },
  //预览图片
  preViewImg:function(e){
    var imgUrl = [];
    var _this = this;
    if(e.currentTarget.dataset.viewlist == "head"){
      _this.data.goodsImg.forEach(function (e) {
        imgUrl.push(_this.data.appGlobalUrl + e);
      })
      
    }else{
      console.log(_this.data.GoodList)
      _this.data.GoodList[e.currentTarget.dataset.index].serverPaths.forEach(function (e) {
        imgUrl.push(_this.data.appGlobalUrl + e);
      })
    }
    wx.previewImage({
      current: e.currentTarget.dataset.imgsrc,
      urls: imgUrl,
    })
  },
  //提交购买商品
  buyGoods:function(e){
    var _this = this;
    var count = this.data.count;
    if(count == 0 ){
      return false;
    } else {
      wx.showModal({
        title: '确定下单吗？',
        content: '确认购买信息无误请点击确定！',
        confirmText: '确定',
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
          // for (var i = 0; i < (_this.data.GoodList.length); i++) {
            
          // }
            console.log("购买")
          } else if (res.cancel){
            console.log("点击取消")
          }
        }
      })
    }
    console.log(count)
  }


})

