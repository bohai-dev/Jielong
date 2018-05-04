
// 获取全局应用程序实例对象
var app = getApp();

// 创建页面实例对象
Page({
  name: "detail",
  data: {
    appGlobalUrl: app.globalData.domain,
    appGlobalHost: app.globalData.domainUpload,
    xOssProcess: app.globalData.xOssProcess,
    userImg: "",                                //发布用户头像
    goodstopic: "",                             //mart主题
    goodsdata:"",                               //mart日期
    person:0,                                   //浏览人数
    goodsdescribe:"",                           //mart描述
    showMask: true,                             //是否显示遮罩层
    showMaskbar: false,                         //遮罩层
    arrow: "../../images/arrowdown.png",        //箭头
    goodsImg: [],                               //mart图片
    SetGroup:true,                              //是否设置最小成员团
    Group:0,                                    //最小开团数量
    joingoodsnum:0,                             //参团商品数量
    buy: "请选择商品",                           //购买商品
    count: 0,                                   //商品总数
    total: 0,                                   //商品总价
    selectAddrId: "",                           //mart的自提点id
    selectAddrDetail: "",                       //mart的自提点详细地址
    jieLongId:"",                               //martid
    QR_CodeSrc:"",                              //二维码地址
    hiddenModal:false,                           
    fromMine: 0,                                //是否从发起mart进入
    overSolitaire:false,                        //mart数据状态
    goodsAddresses:"",
    selectAddresses:"查看并选择取货点及时间",
    GoodsDetialList: [{                         //mart信息
      mineIcon: "../../images/position.png",
      mineName: "",
      show: true,
      rightArrow:"dn"
      // bindTap:"showMap",
      // addressDetail:"",
      // addressLatitude:"",
      // addressLongitude:""
    }, {
      mineIcon: "../../images/phone.png",
      mineName: "",
      phone:"",
      show: true,
      bindTap: "callPhone"
    // }, {
    //   mineIcon: "../../images/location.png",
    //   mineName: "查看并选择自提点",
    //   goodsAddresses:"",
    //   show: true,
    //   bindTap: "showLocation"
    }, {
      mineIcon: "../../images/time.png",
      mineName: "",
      show:true,
      rightArrow:"dn"
    }],
    GoodList: [],
    record: [{                                   //mart记录数据
      recordNumber: 0,
      recordText: "浏览(人)",
      rightBorder: "rightborder"
    }, {
      recordNumber:0,
      recordText:"参与mart(人)",
      rightBorder: "rightborder"
    }, {
      recordNumber: 0.00,
      recordText: "mart金额(元)"
    }],
  partakeRecord: [],                             //参与记录
    footnav: [{
      navIcon: "../../images/home.png",
      navText: "首页",
      navUrl: "../index/index",
      navborder: "footNavrightborder"
    }, {
      navIcon: "../../images/add.png",
      navText: "发布mart",
      navUrl: "../add/add"
    }],
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(e) {
    var _this = this;
    //console.log(e)
    var id = e.id;
    var fromMine = Number(e.fromMine);
    _this.data.jieLongId = id;
    var app = getApp();
    var userid = wx.getStorageSync("userId");

    // wx.request({
    //   url: app.globalData.domain +'/jielong/selectByUserId',
    //   data:{

    //   }
    // })

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
        _this.setData({
          id: id,
          fromMine: fromMine
        })
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
          _this.data.allData = res.data.data;
          _this.data.GoodsDetialList[0].mineName = res.data.data.addressName;
          // _this.data.GoodsDetialList[0].addressDetail = res.data.data.addressDetail;
          // _this.data.GoodsDetialList[0].addressLatitude = res.data.data.addressLatitude;
          // _this.data.GoodsDetialList[0].addressLongitude = res.data.data.addressLongitude;
          _this.data.GoodsDetialList[1].mineName = res.data.data.phoneNumber + "(" + res.data.data.userInfo.name + ")";
          _this.data.GoodsDetialList[1].phone = res.data.data.phoneNumber;
          //_this.data.GoodsDetialList[2].goodsAddresses = res.data.data.goodsAddresses;
          _this.data.GoodsDetialList[2].show = (res.data.data.setFinishTime==1)?true:false;
          _this.data.GoodsDetialList[2].mineName = "mart截止时间: " + res.data.data.finishTime;
          _this.data.GoodList = res.data.data.goodsList;
          _this.data.record[0].recordNumber = res.data.data.browseSum;
          _this.data.record[1].recordNumber = res.data.data.joinSum;
          _this.data.record[2].recordNumber = res.data.data.joinMoney;
          var SetGroup = res.data.data.goodsList[0].isSetGroup;
          var Group = res.data.data.goodsList[0].groupSum;
          var joingoodsnum = res.data.data.goodsList[0].remainSum;
          var goodsUserid = res.data.data.userId;
          for (var i = 0; i < (_this.data.GoodList.length); i++){
            _this.data.GoodList[i].serverPaths = _this.data.GoodList[i].serverPaths.split(",");
            _this.data.GoodList[i]["goodsnum"] = 0;
          }
          // var jieLongStatus = res.data.data.status == 2 ? true : false;
          _this.setData({
            userImg: res.data.data.userInfo.avatarUrl,
            goodstopic: res.data.data.topic,
            goodsdata: res.data.data.createTimeStr,
            person: res.data.data.browseSum,
            goodsdescribe: res.data.data.description,
            goodsImg: res.data.data.imageList,
            GoodsDetialList: _this.data.GoodsDetialList,
            goodsAddresses: res.data.data.goodsAddresses,
            takeGoodsAddressList: res.data.data.takeGoodsAddressList,
            SetGroup: SetGroup,
            record: _this.data.record,
            goodsUserid: goodsUserid,
            overSolitaire: res.data.data.status == 2 ? true : false,
            Group: Group,
            joingoodsnum: joingoodsnum
          },function(){
             _this.getheight();
          })
        }      
        //获取参与记录
        wx.request({
          url: _this.data.appGlobalUrl + '/jielong/selectJoin',
          data: {
            id: id
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            //console.log(res)
            //参与记录列表
            var partakeRecord = new Array();
            for (var i = 0; i < res.data.data.length; i++){
              var userimg = res.data.data[i].userInfo.avatarUrl;
              var username = res.data.data[i].userInfo.nickName;
              var joinnumber = 0;
              for (var j = 0; j < res.data.data[i].orderGoods.length;j++){
                joinnumber += res.data.data[i].orderGoods[j].sum;
              }
              var partakedate = res.data.data[i].createdAt;
              partakeRecord[i] = { userimg, username, joinnumber, partakedate}
            }
            partakeRecord.reverse();
            //参与份数
            var goodsSum = [];
            for (var i = 0; i < _this.data.GoodList.length; i++) {
              var goodsid = _this.data.GoodList[i].id;
              var joinsum = 0;
              goodsSum[i] = { goodsid, joinsum}
              for (var j = 0; j < res.data.data.length; j++) {
                if (res.data.data[j].userId == userid) {
                  for (var n = 0; n < res.data.data[j].orderGoods.length; n++){
                    if (goodsSum[i].goodsid == res.data.data[j].orderGoods[n].goodsId) {
                      goodsSum[i].joinsum += res.data.data[j].orderGoods[n].sum;
                    }
                  }
                }
              }
            }
            //console.log(goodsSum)
            for (var k = 0; k < _this.data.GoodList.length; k++) {
              for (var l = 0; l < goodsSum.length; l++) {
                if (goodsSum[l].goodsid == _this.data.GoodList[k].id) {
                  _this.data.GoodList[k]["sum"] = goodsSum[l].joinsum
                }
              }
            }
            //console.log(_this.data.GoodList)
            _this.setData({
              partakeRecord: partakeRecord,
              GoodList: _this.data.GoodList
            })
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow(e) {

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

  /**
   * 转发
   */
  onShareAppMessage(options){
    var _this = this;
    return {
      title: _this.data.goodstopic + "，已有" + _this.data.record[1].recordNumber + "人参与",
      imageUrl: _this.data.appGlobalHost + _this.data.goodsImg[0],
      success: function (res) {
        // console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // console.log(res)        
        // 转发失败
      }
    }
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
  //选择自提点
  showLocation: function () {
    var _this = this;
    this.data.takeGoodsAddressList.forEach(function(e){
      if (_this.data.selectAddrId == e.id){
          e.selectVal = true;
        }else{
        e.selectVal = false;
        }
    })
    var jsonStr = JSON.stringify(_this.data.takeGoodsAddressList);
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
        var buy = "已选：$" + this.data.total;
      }
    } else {
      if (this.data.total <= 0) {
        var buy = "请选择商品";
      } else {
        var buy = "已选：$" + this.data.total;
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
        content: '抱歉，该商品mart剩余不足!',
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#2CBB6B",
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
      if (repertory>0){
        var buy = "已选：$" + this.data.total;
      }
    } else {
      this.data.GoodList[index].goodsnum++;
      this.data.count++;
      this.data.total += this.data.GoodList[index].price;
      var buy = "已选：$" + this.data.total;
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
        imgUrl.push(_this.data.appGlobalHost + e + _this.data.xOssProcess);
      })
      
    }else{
      console.log(_this.data.GoodList)
      _this.data.GoodList[e.currentTarget.dataset.index].serverPaths.forEach(function (e) {
        imgUrl.push(_this.data.appGlobalHost + e + _this.data.xOssProcess);
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
      var jielongId = Number(this.data.id);
      var goodsUserid = this.data.goodsUserid;
      var addressId = this.data.selectAddrId;
      var addressName = this.data.selectAddrDetail;
      var orderGoods = [];
      var isSetGroup = this.data.SetGroup ? 1 : 0;
      for (var i = 0; i < this.data.GoodList.length; i++){
        if (this.data.GoodList[i].goodsnum>0){
          var orderGoodsList = { goodsId: this.data.GoodList[i].id, sum: this.data.GoodList[i].goodsnum, money: this.data.GoodList[i].price, total: this.data.GoodList[i].goodsnum * this.data.GoodList[i].price, goodsname: this.data.GoodList[i].name}
          orderGoods.push(orderGoodsList)
        }
      }
      var goodsInfo = { jielongId, goodsUserid, addressId, orderGoods, addressName, isSetGroup};
      var jsonStr = JSON.stringify(goodsInfo);
      //console.log(goodsInfo)
      if (!addressId){
        wx.showModal({
          content: '请选择取货点及时间',
          confirmColor: "#2CBB6B",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
      }else{
        wx.navigateTo({
          url: './confirmOrder/confirmOrder?jsonStr=' + jsonStr
        })
      }
    }
  },
  //二维码
  qrTap:function(e){
    var _this = this;
    _this.setData({
      QR_CodeSrc: app.globalData.domain + '/getQRcode/' + _this.data.jieLongId,
      hiddenModal:true
    })
  },
  //取消二维码
  listenerConfirm:function(e){
    this.setData({
      hiddenModal:false
    })
  },
  //保存二维码图片
  saveQr_code:function(e){
    var _this = this;
    wx.previewImage({
      current: _this.data.QR_CodeSrc,
      urls: _this.data.QR_CodeSrc.split(),
    })
  },
  //跳转mart统计
  solitaireStatistics:function(e){
    var _this = this;
    wx.navigateTo({
      url: './solitaireStatistics/solitaireStatistics?jieLongId=' + _this.data.jieLongId,
    })
  },
  //跳转到自提标记
  addrRemake:function(e){
    var _this = this;    
    wx.navigateTo({
      url: './addrRemake/addrRemake?jieLongId=' + _this.data.jieLongId,
    })
  },
  //结束mart
  overSolitaire:function(e){
    var _this = this;
    console.log(_this)
    wx.showModal({
      title: '确定结束mart？',
      confirmColor: "#2CBB6B",
      success:function(res){
        if(res.confirm){
          wx.request({
            url: app.globalData.domain + '/jielong/closeJielong',
            method: "GET",
            data: {
              id: _this.data.jieLongId,
            },
            success: function (res) {
              console.log(res)
              if(res.statusCode == 200){
                wx.showToast({
                  title: '结束mart成功!',
                  duration: 4000,
                  success: function (e) {
                    _this.setData({
                      overSolitaire: true
                    })
                  }
                })
              }else{
                wx.showToast({
                  title: '结束mart失败!',
                  duration: 4000,
                  icon: "none",
                })
              }
            }
          })
        }
      }

    })
  },
  //复制mart
  copySolitaire:function(){
    var _this = this;
    console.log(_this.data.allData);
    wx.removeStorage({
      key: 'seleAddrKey'
    })
    wx.navigateTo({
      url: '../release/release?jsonStr=' + JSON.stringify(_this.data.allData),
    })





  },
  //获取高度
  getheight:function(){
    var _this = this;
    var query = wx.createSelectorQuery();
    query.select('#mjltest').boundingClientRect()
    query.exec(function (res) {
      //res就是 所有标签为mjltest的元素的信息 的数组
      console.log(res);
      //取高度
      console.log(res[0].height);
      if (res[0].height>150){
        var showMask = false;
        _this.setData({
          initialHeight: res[0].height,
          showMask: showMask,
          showMaskbar:true
        })
      }
    })
  },
  //显示描述全部内容
  showMaskFun:function(){
    var showMask = this.data.showMask;
    if (showMask){
      showMask = false;
      this.setData({
        showMask: showMask,
        arrow: "../../images/arrowdown.png"
      })
      console.log(111)
    }else{
      showMask = true;
      console.log(this.data.initialHeight)
      this.setData({
        showMask: showMask,
        arrow: "../../images/arrowup.png"
      })
      console.log(222)
    }
  },
  //手动输入商品数量
  inputGoodsNum:function(e){
    var _this = this;
    var index = e.currentTarget.dataset.index;
    if (e.detail.value > this.data.GoodList[index].repertory){
      wx.showModal({
        title: '',
        content: '抱歉，该商品mart剩余不足!',
        showCancel: false,
        confirmText: "确定",
        confirmColor: "#2CBB6B",
        success: function (res) {
          if (res.confirm) {
            const goodsnumlast = _this.data.GoodList[index].goodsnum;
            var countnum = _this.data.GoodList[index].repertory - goodsnumlast;
            var pricediff = _this.data.GoodList[index].price * countnum;
            _this.data.count = _this.data.count + countnum;
            _this.data.total = _this.data.total + pricediff;
            _this.data.GoodList[index].goodsnum = _this.data.GoodList[index].repertory;
            var buy = _this.data.count > 0 ? "已选：$" + _this.data.total : "请选择商品";
            _this.setData({
              GoodList: _this.data.GoodList,
              count: _this.data.count,
              buy: buy
            })
          }
        }
      })
    }else{
      const goodsnumlast = this.data.GoodList[index].goodsnum;
      var countnum = e.detail.value - goodsnumlast;
      var pricediff = this.data.GoodList[index].price * countnum;
      this.data.count = this.data.count + countnum;
      this.data.total = this.data.total + pricediff;
      this.data.GoodList[index].goodsnum = new Number(e.detail.value);
      var buy = this.data.count > 0 ? "已选：$" + this.data.total : "请选择商品";
      this.setData({
        GoodList: this.data.GoodList,
        count: this.data.count,
        buy: buy
      })
    }
  }

})