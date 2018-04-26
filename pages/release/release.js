
// 获取全局应用程序实例对象
var app = getApp();
var classifyData = [];     //分类总的数据
var firstClassify = [];    //分类一级数据
var secondClassify = [];   //分类二级数据
var initClassify = [];

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
    appGlobalHost: app.globalData.domainUpload,
    userId: wx.getStorageSync("userId"),
    topic: "",          //主题
    description: "",    //活动描述  
    noteMaxLen: 300,             //描述最多字数
    noteNowLen: 0,               //描述当前字数
    addressName: "",           //活动地址名称
    addressDetail: "",                   //活动详细地址
    addressLongitude: "",                 //活动地址经度
    addressLatitude: "",                  //活动地址纬度
    imageLocalPaths: [],                //本地介绍图片数组 { id:1, unique: 'unique_1',path:''}
    introImages: [],              //服务器图片介绍数组 用逗号隔开"001.png,002.png"
    goodsAddresses: "",            //用户自提地址id数组，用逗号隔开"1,2"
    phoneNumber: 0,                    //用户手机号
    setFinishTime: 1,               //是否设置截止时间
    multiArray: [],                 //截至时间日期
    finishTime: [],                 //截至时间
    multiIndex: [0, 0],
    seleAddrNum: 0,                  //已设置地址数量
    judeToMost: false,                //是否为多个商品
    toMostModal: true,                 //多个商品提示信息
    showdelete: true,                 //显示删除图标
    isShow:true,                    //提示图片长度
    isHighlight: 0,                 //是否高亮
    topId:"",                         //滑动元素id
    goodsList: [                     //商品数组 
      {
        unique: 'unique_0',            // 该item在数组中的唯一标识符
        name: "",              //商品名称 
        localPaths: [],         // 商品本地图片路径 数组
        serverPaths: [],       // 商品服务器图片路径数组,用逗号隔开"1.png,2.png"
        parentClass: app.globalData.initClassify,       //分类初始化数据
        Allsubclass: app.globalData.firstClassify,       //分类子类数据
        parentClassId: 0,     //商品一级分类 id
        subClassId: 0,      // 商品二级分类 id
        classIndex: [0, 0],
        specification: "",          //商品规格
        price: null,        //商品价格 
        repertory: null,   //商品库存
        isSetGroup: 0,       //是否设置最低成团数量，0否，1是
        groupSum: null        //最低成团数量

      }
    ],
    ossData: {
      host: "",
      accessKeyId: "",
      policy: "",
      signature: "",
      dir: "",
    },
    copySolitaireData:false



  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    if(options.jsonStr){
      this.copyData(JSON.parse(options.jsonStr));
    }
    this.setFinishTime()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */ 
  onShow(options) {
    if (this.data.copySolitaireData) {
      this.copyData(JSON.parse(this.data.copySolitaireData));
      this.data.copySolitaireData = false;
      this.setFinishTime();
    }
    this.getAddress();
    this.getClassify();    //获取分类数据
    this.getPhoneNumber();
    this.getOssPolicy();
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

  // 上传图片
  uploadImage: function (e) {
    var self = this;
    if (Number(e.currentTarget.dataset.iscommon)) {
      //console.log(e.currentTarget.dataset.iscommon)
      var imgs = self.data.imageLocalPaths;
      if (imgs.length >= 9) {
        wx.showModal({
          title: '提示',
          content: '最多上传9张图片',
          confirmColor: "#2CBB6B",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        var imgNumber = 9 - imgs.length;
        //console.log("imgnumber= " + imgNumber)
        wx.chooseImage({   //可选择多个图片
          sizeType: ['compressed'],
          count: imgNumber,
          success: function (res) {
            console.log(res)
            console.log(self.data.imageLocalPaths.length)
            var tempFilePaths = res.tempFilePaths  //图片临时路径,数组
            //console.log(tempFilePaths + '----1');
            var length = self.data.imageLocalPaths.length;
            var lastLength = self.data.imageLocalPaths.length;
            for (var i = 0; i < tempFilePaths.length; i++) {
              var loalImg = { id: length, unique: 'unique_' + length, path: tempFilePaths[i] };
              length++;
              imgs.push(loalImg);
            }
            //console.log(imgs);
            self.setData({
              imageLocalPaths: imgs,
              isHighlight: 0,
              isShow: false
            })
            self.changeImgStyle(imgs.slice(lastLength), "common");//每次上传图片获取本地地址
          }
        })
      }
    } else {
      var goodsindex = e.currentTarget.dataset.goodsindex;
      var imgs = self.data.goodsList[goodsindex].localPaths;
      //console.log(imgs.length)
      if (imgs.length >= 9) {
        wx.showModal({
          title: '提示',
          content: '最多上传9张图片',
          confirmColor: "#2CBB6B",
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }
          }
        })
      } else {
        var imgNumber = 9 - imgs.length;
        //console.log("goodsimgnumber= " + imgNumber)
        wx.chooseImage({   //可选择多个图片
          sizeType: ['compressed'],
          count: imgNumber,
          success: function (res) {
            var tempFilePaths = res.tempFilePaths  //图片临时路径,数组
            //console.log(tempFilePaths + '----2');
            var length = imgs.length;
            var lastLength = self.data.goodsList[e.currentTarget.dataset.goodsindex].serverPaths.length;
            for (var i = 0; i < tempFilePaths.length; i++) {
              var loalImg = { id: length, unique: 'unique_' + length, path: tempFilePaths[i] };
              length++;
              imgs.push(loalImg);
            }
            console.log(self.data.isHighlight);
            self.setData({
              goodsList: self.data.goodsList
            })
            self.changeImgStyle(imgs.slice(lastLength), "no-common", e.currentTarget.dataset.goodsindex); //每次上传图片获取本地地址
          }
        })
      }
    }
  },
  // 删除图片
  deleteImg: function (e) {
    var _this = this;
    if (Number(e.currentTarget.dataset.iscommon)) {
      var imgs = _this.data.imageLocalPaths;
      var index = e.currentTarget.dataset.index;
      imgs.splice(index, 1);
      var introImages = _this.data.introImages;
      introImages.splice(index, 1);
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].id = i;
        imgs[i].unique = "unique_" + i;
      }
      if (imgs.length == 0){
        var isShow = true;
      }
      _this.setData({
        imageLocalPaths: imgs,
        isShow: isShow
      })
      //console.log(_this.data.imageLocalPaths) 
    } else {
      var goodsindex = e.currentTarget.dataset.fatheridx;
      var imgs = _this.data.goodsList[goodsindex].localPaths;
      var index = e.currentTarget.dataset.index;
      imgs.splice(index, 1);
      var introImages = _this.data.goodsList[goodsindex].serverPaths;
      introImages.splice(index, 1);
      for (var i = 0; i < imgs.length; i++) {
        imgs[i].id = i;
        imgs[i].unique = "unique_" + i;
      }
      _this.setData({
        goodsList: _this.data.goodsList
      })
      //console.log(_this.data.goodsList)
    }
  },
  //选择活动地址
  chooseAddress: function () {
    console.log('chooseAddress')
    var self = this

    wx.chooseLocation({
      success: function (res) {
        self.setData({
          addressName: res.name,
          addressDetail: res.address,
          addressLongitude: res.longitude,
          addressLatitude: res.latitude
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })


  },
  //设置自提点
  selectAddress: function (e) {
    var _this = this;
    wx.navigateTo({
      url: './selectAddress/selectAddress?jsonStr=' + _this.data.goodsAddresses.replace(/,/g, "-")
    })

  },
  //设置截止时间
  setFinishTime:function(){
      var nowDate = new Date();
      var NowTimeHours = nowDate.getHours();
      //设置天数
      var NowDayarr = [];
      var enddayarr = [];
      for (var i = 0; i < 8; i++) {
        if (i == 0 && NowTimeHours + 1 < 23) {
          NowDayarr[i] = new Date(nowDate.setDate(nowDate.getDate()));
        } else {
          NowDayarr[i] = new Date(nowDate.setDate(nowDate.getDate() + 1));
        }
        //enddayarr[i] = NowDayarr[i].toLocaleDateString();
        enddayarr[i] = NowDayarr[i].getFullYear() + "/" + twonumber(NowDayarr[i].getMonth() + 1) + "/" + twonumber(NowDayarr[i].getDate());
      }
      console.log(enddayarr);
      //设置时间
      var todaytime = [];
      var othertime = [];
      for (var n = 0; n < 24; n++) {
        othertime[n] = twonumber(n) + ":00"
      }
      if (NowTimeHours < 22) {
        var num = 22 - NowTimeHours;
        for (var j = 0; j < num; j++) {
          todaytime[j] = twonumber(NowTimeHours + (j + 2)) + ":00";
        }
      } else if (NowTimeHours == 22) {
        todaytime = othertime
      } else {
        var num = 23;
        for (var j = 0; j < num; j++) {
          todaytime[j] = twonumber(j + 1) + ":00";
        }
      }
      function twonumber(num) {
        if (num < 10) {
          return "0" + num;
        }
        return num;
      }
      console.log(todaytime);
      console.log(othertime);
      var finishTime = [todaytime, othertime];
      var multiArray = [enddayarr, todaytime];
      this.setData({
        multiArray: multiArray,
        finishTime: finishTime
      })
  },
  //是否设置截止时间
  timeChange: function (e) {
    console.log(e.detail.value)
    this.setData({
      setFinishTime: e.detail.value ? 1 : 0

    })
  },
  //判断多个商品还是一个
  goodsChange: function (e) {
    console.log(e);
    var _this = this;
    var toMostModal = wx.getStorageSync('toMostModal')
    if (e.detail.value) {
      //console.log(e.detail.value)
      if (!toMostModal) {
        wx.showModal({
          title: '提示',
          content: '多个商品，无法设置最小成团数量！',
          confirmText: '确定',
          confirmColor: "#2CBB6B",
          cancelColor: "#333",
          cancelText: "不再提示",
          success: function (res) {
            if (res.cancel) {
              wx.setStorageSync('toMostModal', "1")
            }
          }
        })
      }
    } else {
      var showdelete = true;
      var len = _this.data.goodsList.length;
      if (len > 1) {
        wx.showModal({
          title: '提示',
          content: '点击确定将保留第一个商品信息，其他将清除',
          confirmText: '确定',
          confirmColor: "#2CBB6B",
          cancelText: "取消",
          success: function (res) {
            if (res.confirm) {
              console.log("用户点击确定")
              _this.data.goodsList = _this.data.goodsList.splice(0, 1);
              _this.setData({
                goodsList: _this.data.goodsList,
                showdelete: showdelete
              })
            } else if (res.cancel) {
              console.log("用户点击取消")
              var judeToMost = true;
              _this.setData({
                judeToMost: judeToMost
              })
            }
          }
        })
      }
      //console.log(e.detail.value)
    }
    _this.setData({
      judeToMost: e.detail.value
    })
    console.log(this)
  },
  //上传商品图片
  uploadGoodsImage: function (index) {
    var self = this
    wx.chooseImage({
      success: function (res) {

      },
    })
  },
  //修改商品名称
  inputGoodsName: function (e) {
    var goodsindex = e.currentTarget.dataset.goodsindex;
    this.data.goodsList[goodsindex].name = e.detail.value;
  },
  //修改商品规格
  inputGoodsSpecification: function (e) {
    var goodsindex = e.currentTarget.dataset.goodsindex;
    this.data.goodsList[goodsindex].specification = e.detail.value;
  },
  //修改商品价格
  inputGoodsPrice: function (e) {
    var goodsindex = e.currentTarget.dataset.goodsindex;
    this.data.goodsList[goodsindex].price = e.detail.value;
    console.log()
  },
  //修改商品库存
  inputGoodsRepertory: function (e) {
    var goodsindex = e.currentTarget.dataset.goodsindex;
    this.data.goodsList[goodsindex].repertory = e.detail.value;
  },
  //修改商品成团数量
  inputGoodsGroupSum: function (e) {
    var goodsindex = e.currentTarget.dataset.goodsindex;
    this.data.goodsList[0].groupSum = e.detail.value;
  },
  //最小成团数量控制
  chenTuanNum: function (res) {
    console.log(app.globalData.classifyData);
    console.log(this)
    // console.log(res.target.dataset.setgroupnum)  //找到渲染数组的索引位置
    // console.log(this.data.goodsList[res.target.dataset.setgroupnum].isSetGroup) //找到遍历列表成团字段
    // res.detail.value = Number(res.detail.value) ? 1 : 0;
    // this.data.goodsList[res.target.dataset.setgroupnum].isSetGroup = res.detail.value;
    // this.setData({
    //   goodsList: this.data.goodsList
    // })
    console.log(this.data.goodsList[0].isSetGroup) //找到遍历列表成团字段
    res.detail.value = Number(res.detail.value) ? 1 : 0;
    this.data.goodsList[0].isSetGroup = res.detail.value;
    this.setData({
      goodsList: this.data.goodsList
    })
  },
  //新增商品
  addGoods: function () {
    var goods = [{
      unique: 'unique_' + this.data.goodsList.length,            // 该item在数组中的唯一标识符
      name: "",              //商品名称 
      localPaths: [],         // 商品本地图片路径 数组
      serverPaths: [],       // 商品服务器图片路径 数组
      parentClass: app.globalData.initClassify,
      Allsubclass: app.globalData.firstClassify,
      parentClassId: 0,     //商品一级分类 id
      subClassId: 0,      // 商品二级分类 id
      classIndex: [0, 0],
      specification: "",
      specification: "",          //商品规格
      price: null,        //商品价格 
      repertory: null,   //商品库存
      isSetGroup: 0,       //是否设置最低成团数量，0否，1是
      groupSum: null        //最低成团数量

    }]
    var showdelete = false;
    this.data.goodsList = this.data.goodsList.concat(goods)
    this.setData({
      goodsList: this.data.goodsList,
      showdelete: showdelete
    })

    //滑动到底部
    setTimeout(function(){
      var query = wx.createSelectorQuery();
      query.select("#container").boundingClientRect();
      query.exec(function (res) {
        console.log(res)
        wx.pageScrollTo({
          scrollTop: Math.abs(res[0].top) + 500,
          duration: 300
        })
      })
    },300)


  },
  //发布接龙
  formSubmit: function (e) {
    console.log(app.globalData.classifyData)
    console.log(e);
    console.log(this)
    var _this = this;
    var _thisData = _this.data;
    var _detailValue = e.detail.value;
    wx.showLoading({
      title: '发布中...',
      mask: true
    })
    setTimeout(function () {
      wx.hideLoading();   //关闭模态框
    }, 60000)

    //封装发布数据
    var pushData = {};
    pushData.userId = _thisData.userId;
    pushData.topic = _detailValue.topic;
    pushData.description = _detailValue.description;
    pushData.introImages = _thisData.introImages.join(",");
    pushData.addressName = _detailValue.addressName;
    // pushData.addressName = _thisData.addressName;
    // pushData.addressDetail = _thisData.addressDetail;
    // pushData.addressLongitude = _thisData.addressLongitude;
    // pushData.addressLatitude = _thisData.addressLatitude;
    pushData.goodsAddresses = _thisData.goodsAddresses;
    pushData.phoneNumber = _thisData.phoneNumber;
    pushData.setFinishTime = _thisData.setFinishTime;
    pushData.finishTime = _detailValue.finishTime;
    pushData.goodsList = [];
    for (var i = 0; i < _thisData.goodsList.length; i++) {
      pushData.goodsList[i] = {};
      var _name = "name" + i;
      pushData.goodsList[i].name = _detailValue["name" + i];
      pushData.goodsList[i].serverPaths = _thisData.goodsList[i].serverPaths.join(",");
      pushData.goodsList[i].parentClassId = app.globalData.classifyData[_thisData.goodsList[i].classIndex[0]].id;
      if (!app.globalData.classifyData[_thisData.goodsList[i].classIndex[0]].goodsSubClasses.length) {
        pushData.goodsList[i].subClassId = 0;
      } else {
        pushData.goodsList[i].subClassId = app.globalData.classifyData[_thisData.goodsList[i].classIndex[0]].goodsSubClasses[_thisData.goodsList[i].classIndex[1]].id;
      }
      pushData.goodsList[i].specification = _detailValue["specification" + i];
      pushData.goodsList[i].price = Math.round(Number(_detailValue["price" + i]) * 100) / 100;
      pushData.goodsList[i].repertory = Number(_detailValue["repertory" + i]);
      if (!_this.data.judeToMost) {
        pushData.goodsList[i].isSetGroup = _thisData.goodsList[0].isSetGroup;
        pushData.goodsList[i].groupSum = _detailValue.groupSum;
      } else {
        pushData.goodsList[i].isSetGroup = 0;
        pushData.goodsList[i].groupSum = null;
      }

    }
    console.log(pushData);

    //手机号码不存在
    if (!pushData.phoneNumber) {
      wx.hideLoading();   //关闭模态框
      wx.navigateTo({
        url: './bindingPhone/bindingPhone',
      })
      return;
    }

    //数据验证

    var veriData = _this.verifPushData(pushData);
    console.log(veriData);
    if (veriData.pushForm) {
      //发布接龙
      wx.request({
        url: app.globalData.domain + '/jielong/insert',
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        data: pushData,
        success: function (res) {
          console.log(res)
          if (res.data.errorCode == 0) {
            wx.hideLoading();   //关闭模态框
            wx.showModal({
              title: '发布接龙成功！',
              confirmColor: "#2CBB6B",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1,
                  })
                }
              }
            })
          } else {
            var errMessage = res.data.errorMessage || "请填写正确的发布接龙信息！";
            if (errMessage) {
              wx.hideLoading();   //关闭模态框
              wx.showModal({
                title: errMessage,
                confirmColor: "#2CBB6B",
                showCancel: false
              })
            }

          }
        }
      })
    } else {
      wx.hideLoading();   //关闭模态框
      wx.showModal({
        title: veriData.remData || "请填写正确的发布接龙信息！",
        confirmColor: "#2CBB6B",
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            _this.setData({
              isHighlight: veriData.isHighlight,
              //topId: veriData.topId
            })
          }
          // var query = wx.createSelectorQuery()
          // query.select('#' + _this.data.topId).boundingClientRect()
          // query.selectViewport().scrollOffset()
          // query.exec(function (res) {
          //   console.log(res)
          //   wx.pageScrollTo({
          //     scrollTop: res[0].top,
          //     duration: 300
          //   })
          // })
        }
      })
    }

  },
  //截至时间
  bindMultiPickerChange: function (e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    var _this = this;
    //console.log(_this.data.finishTime);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = this.data.finishTime[0];
            break;
          case 1:
            data.multiArray[1] = this.data.finishTime[1];
            break;
          case 2:
            data.multiArray[1] = this.data.finishTime[1];
            break;
          case 3:
            data.multiArray[1] = this.data.finishTime[1];
            break;
          case 4:
            data.multiArray[1] = this.data.finishTime[1];
            break;
          case 5:
            data.multiArray[1] = this.data.finishTime[1];
            break;
          case 6:
            data.multiArray[1] = this.data.finishTime[1];
            break;
          case 7:
            data.multiArray[1] = this.data.finishTime[1];
            break;
        }
        //console.log(data.multiIndex);
        break;
    }
    this.setData({
      multiArray: data.multiArray,
      multiIndex: data.multiIndex
    });
  },
  //公共方法
  //获取自提点数据
  getAddress: function (e) {
    var addrNum = 0;
    var _this = this;
    var arr = [];
    wx.getStorage({
      key: 'seleAddrKey',
      success: function (res) {
        var addrParseJson = JSON.parse(res.data);
        console.log(addrParseJson)
        for (var i = 0; i < addrParseJson.length; i++) {
          if (addrParseJson[i].value) {
            addrNum++;
            arr.push(addrParseJson[i].id);
          }
        }
        console.log(addrNum);
        console.log(arr.join(","));
        _this.setData({
          seleAddrNum: addrNum,
          goodsAddresses: arr.join(",")
        },function(){
          if (_this.data.seleAddrNum>0){
            _this.setData({
              isHighlight:0
            })
          }
        })
      },
      fail: function (err) {
        console.log(err)
        return addrNum;
      }
    })

  },

  //商品分类
  bindGoodsPickerChange: function (e) {
    //console.log(e)
    var _this = this;
    var goodsindex = e.currentTarget.dataset.goodsindex;
    _this.data.goodsList[goodsindex].classIndex = e.detail.value
    this.setData({
      goodsList: _this.data.goodsList
    })
  },
  bindGoodsPickerColumnChange: function (e) {
    var _this = this;
    var goodsindex = e.currentTarget.dataset.goodsindex;
    var data = {
      parentClass: this.data.goodsList[goodsindex].parentClass,
      classIndex: this.data.goodsList[goodsindex].classIndex
    };
    data.classIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        for (var i = 0; i < app.globalData.firstClassify.length; i++) {
          if (data.classIndex[0] == i) {
            data.parentClass[1] = app.globalData.secondClassify[i];
          }
        }
        break;
    }
    _this.setData({
      goodsList: _this.data.goodsList
    });
    //console.log(this.data);
  },
  //改变图片格式
  changeImgStyle: function (e, types, goodsIndex) {
    var localImages = e
    var _this = this;
    if (types == "common") {
      //先循环上传接龙介绍图片，得到url
      for (var i = 0; i < localImages.length; i++) {
        (function(i){
        console.log(localImages[i].path);
        var imageSrc = localImages[i].path;
        var imageStyle = imageSrc.substring(11);
        var imgType = imageStyle.substring(imageStyle.lastIndexOf(".") + 1, )
        var imageName = Date.parse(new Date());
        wx.uploadFile({
          url: app.globalData.domainUpload,        //服务器上传地址
          filePath: imageSrc,
          name: 'file',
          formData: {
            name: imageSrc,
            key: _this.data.ossData.dir + imageName + i + '.' + imgType,
            OSSAccessKeyId: _this.data.ossData.accessKeyId,
            success_action_status: "200",
            policy: _this.data.ossData.policy,
            signature: _this.data.ossData.signature
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              _this.data.introImages.push(_this.data.ossData.dir + imageName + i + '.' + imgType);
            }
          }
        })
        })(i)
      }
    } else {
      //先循环上传接龙介绍图片，得到url
      for (var i = 0; i < localImages.length; i++) {
        (function (i) {
        var imageSrc = localImages[i].path;
        var imageStyle = imageSrc.substring(11);
        var imgType = imageStyle.substring(imageStyle.lastIndexOf(".") + 1, )
        var imageName = Date.parse(new Date());
        wx.uploadFile({
          url: app.globalData.domainUpload,        //服务器上传地址
          filePath: imageSrc,
          name: 'file',
          formData: {
            name: imageSrc,
            key: _this.data.ossData.dir + imageName + i + '.' + imgType,
            OSSAccessKeyId: _this.data.ossData.accessKeyId,
            success_action_status: "200",
            policy: _this.data.ossData.policy,
            signature: _this.data.ossData.signature
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              _this.data.goodsList[goodsIndex].serverPaths.push(_this.data.ossData.dir + imageName + i + '.' + imgType);
            }
          }
        })
        })(i)
      }
    }
  },
  //描述字数限制
  bindTextAreaChange: function (e) {
    var that = this;
    var value = e.detail.value, len = parseInt(value.length);
    if (len > that.data.noteMaxLen) return;
    that.setData({
      //description: value,
      noteNowLen: len
    })
  },
  //删除商品
  deleteGoods: function (e) {
    var _this = this;
    var goodsindex = e.currentTarget.dataset.goodsindex;
    var goodsList = _this.data.goodsList;
    var showdelete = false;
    goodsList.splice(goodsindex, 1);
    for (var i = 0; i < goodsList.length; i++) {
      goodsList[i].unique = "unique_" + i;
    }
    if (goodsList.length == 1) {
      showdelete = true;
    }
    console.log(showdelete);
    _this.setData({
      goodsList: goodsList,
      showdelete: showdelete
    })
    console.log(goodsList);
  },
  //获取分类数据
  getClassify: function (e) {
    var _this = this;
    var arr = [];
    if (!app.globalData.classifyData.length && !app.globalData.firstClassify.length && !app.globalData.secondClassify.length && !app.globalData.initClassify.length) {
      //获取分类数据
      wx.request({
        url: app.globalData.domain + '/getAllGoodsClass',
        method: 'POST',
        header: {
          "content-type": "application/json"
        },
        success: function (res) {
          console.log(res)
          app.globalData.classifyData = res.data.data;
          for (var i = 0; i < res.data.data.length; i++) {
            arr = [];
            app.globalData.firstClassify.push(res.data.data[i].className);   //赋值一级数组数据
            for (var j = 0; j < res.data.data[i].goodsSubClasses.length; j++) {
              arr.push(res.data.data[i].goodsSubClasses[j].className);
            }
            app.globalData.secondClassify.push(arr);  //赋值二级数组数据
          }
          app.globalData.initClassify.push(app.globalData.firstClassify, app.globalData.secondClassify[0]);
          console.log(app.globalData.initClassify)
          console.log(_this.data)
          console.log(_this.data.goodsList[0].parentClass)
          _this.data.goodsList[0].parentClass.push(app.globalData.firstClassify, app.globalData.secondClassify[0]);
          _this.data.goodsList[0].Allsubclass.push(app.globalData.secondClassify);
          _this.setData({
            goodsList: _this.data.goodsList
          })


        }
      })
    }
  },
  //获取手机号码
  getPhoneNumber: function (e) {
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/userInfo/selectByUserId',
      data: {
        userId: wx.getStorageSync("userId")
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.data) {
          _this.setData({
            phoneNumber: res.data.data.phoneNumber
          })
        }

      }

    })
  },
  //发布数据验证
  verifPushData: function (data) {
    var remindDataObj = {};
    if (!data.userId) {
      remindDataObj = { pushForm: 0, remData: "用户id已经过期!请重新登陆!", isHighlight: 888 };
    } else if (!data.topic) {
      remindDataObj = { pushForm: 0, remData: "请填写团购主题！", isHighlight: 1};
    } else if (!data.description) {
      remindDataObj = { pushForm: 0, remData: "请填写团购描述！", isHighlight: 2};
    } else if (!data.introImages) {
      remindDataObj = { pushForm: 0, remData: "请上传团购图片！", isHighlight: 3 };
    // } else if (!data.addressDetail || !data.addressName || !data.addressLongitude || !data.addressLatitude) {
    } else if (!data.addressName) {
      remindDataObj = { pushForm: 0, remData: "请填写团购城市！", isHighlight: 4 };
    } else if (!this.data.seleAddrNum) {
      remindDataObj = { pushForm: 0, remData: "请设置取货点及时间！", isHighlight: 5 };
    } else if (this.data.setFinishTime && !data.finishTime) {
      remindDataObj = { pushForm: 0, remData: "请设置截止时间！", isHighlight: 888 };
    } else if (data.goodsList[0].isSetGroup && !data.finishTime) {
      remindDataObj = { pushForm: 0, remData: "成团必须设置设置截止时间！", isHighlight: 888 };
    } else {
      for (var i = 0; i < data.goodsList.length; i++) {
        if (!data.goodsList[i].name) {
          remindDataObj = { pushForm: 0, remData: "请设置商品名称！", isHighlight: 6 };
        } else if (!data.goodsList[i].serverPaths) {
          remindDataObj = { pushForm: 0, remData: "请设置商品图片！", isHighlight: 7 };
        } else if (!data.goodsList[i].parentClassId && !data.goodsList[i].subClassId) {
          remindDataObj = { pushForm: 0, remData: "请设置商品分类！", isHighlight: 8 };
        } else if (!data.goodsList[i].specification) {
          remindDataObj = { pushForm: 0, remData: "请设置商品规格！", isHighlight: 9 };
        } else if (!data.goodsList[i].price) {
          remindDataObj = { pushForm: 0, remData: "请设置商品价格！", isHighlight: 10 };
        } else if (!data.goodsList[i].repertory) {
          remindDataObj = { pushForm: 0, remData: "请设置商品库存！", isHighlight: 11 };
        } else if (data.goodsList[i].isSetGroup && !data.goodsList[i].groupSum) {
          remindDataObj = { pushForm: 0, remData: "请设置商品的最小成团数量！", isHighlight: 12 };
        } else if (data.goodsList[i].isSetGroup && data.goodsList[i].repertory < data.goodsList[i].groupSum) {
          remindDataObj = { pushForm: 0, remData: "商品库存不能小于最小成团数量", isHighlight: 888  };
        } else {
          remindDataObj = { pushForm: 1, remData: "" };
        }
      }


    }
    return remindDataObj;
  },
  //获取oss配置
  getOssPolicy: function (e) {
    var _this = this;
    wx.request({
      url: app.globalData.domain + '/oss/policy',
      success: function (res) {
        if (res.statusCode == 200) {
          _this.setData({
            ossData: {
              host: res.data.host,
              accessKeyId: res.data.accessKeyId,
              policy: res.data.policy,
              signature: res.data.signature,
              dir: res.data.dir,
            }
          })
        }
      }
    })
  },

  //复制接龙
  //跳转到复制接龙列表
  copySolitaire:function(){
    wx.navigateTo({
      url: './copySolitaire/copySolitaire',
    })

  },

  //复制接龙初始化数据
  copyData:function(copyData){
    console.log(copyData);
    var _this = this;
    this.setFinishTime()
    //获取分类数据
    wx.request({
      url: app.globalData.domain + '/getAllGoodsClass',
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      success: function (res) {
        copyData.goodsList.map(function(item,index){
          item.unique = "unique_"+index;
          if (!(item.serverPaths instanceof Array)) {
            item.serverPaths = item.serverPaths.split(",");
          }
          item.localPaths = _this.formatCopyImg(item.serverPaths);
          item.serverPaths = item.serverPaths;
          item.parentClass = app.globalData.initClassify;       //分类初始化数据
          item.Allsubclass = app.globalData.firstClassify;       //分类子类数据
          item.classIndex = _this.formatClassifyIdToIndex(item.parentClassId, item.subClassId,res.data.data);
          return item;
        })

       console.log(copyData.goodsList)

      _this.setData({
        topic: copyData.topic,          //主题
        description: copyData.description,    //活动描述  
        noteMaxLen: 300,             //描述最多字数
        noteNowLen: 0,               //描述当前字数
        addressName: copyData.addressName,           //活动地址名称
        addressDetail: copyData.addressDetail,                   //活动详细地址
        addressLongitude: copyData.addressLongitude,                 //活动地址经度
        addressLatitude: copyData.addressLatitude,                  //活动地址纬度
        imageLocalPaths: _this.formatCopyImg(copyData.imageList),                //本地介绍图片数组 { id:1, unique: 'unique_1',path:''} 
        introImages: copyData.introImages.split(","),              //服务器图片介绍数组 用逗号隔开"001.png,002.png"
        goodsAddresses: copyData.goodsAddresses,            //用户自提地址id数组，用逗号隔开"1,2"
        phoneNumber: copyData.phoneNumber,                    //用户手机号
        setFinishTime: 1,               //是否设置截止时间
        // multiArray: [],                 //截至时间日期
        // finishTime: [],                 //截至时间
        multiIndex: [0, 0],
        seleAddrNum: copyData.goodsAddresses.split(",").length,                  //已设置地址数量  
        judeToMost: copyData.goodsList.length > 1,                //是否为多个商品
        toMostModal: false,                 //多个商品提示信息
        showdelete: true,                 //显示删除图标  
        goodsList: copyData.goodsList,
      })

      //初始化字数
      _this.bindTextAreaChange({ detail: { value: copyData.description}});

      }
    })

  },

  //格式化复制的图片
  formatCopyImg:function(ImgList){
    var _this = this;
    var arr = [];
    console.log(ImgList)
    ImgList.forEach(function(item,index){
       arr[index] = {};
       arr[index].id = index;
       arr[index].unique = 'unique_' + index;
       arr[index].path = _this.data.appGlobalHost + item;
    })
    return arr;

  },

  //根据分类id转换成索引
  formatClassifyIdToIndex:function(pId,sId,classifyData){
      var arr = [];
      classifyData.forEach(function(item,index){
        if(item.id == pId){
          arr[0] = index;
          item.goodsSubClasses.forEach(function(sItem,sIndex){
            if(sItem.id == sId){
              arr[1] = sIndex;
            }
          })
        }
      })
      console.log(arr)
      return arr;
  }
  //复制接龙end



})

