// pages/online_counselling/event_info/event_info.js
const util = require('../../../utils/request.js');
const rootUrl = require('../../../utils/config.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disputes: {},
    violentIndex: 0,
    violentTypes: [{name: '婚姻继承'}],
    appealList: [{
      name: "法律咨询",
      value: "1",
      checked: false
    }, {
        name: "纠纷调解",
        value: "3",
        checked: false
    }, {
      name: "法院诉讼",
      value: "4",
      checked: false
    }],
    appeals: [],
    appealsString: "",
    region: "",
    residenceDetail: "",
    textareaShow:true
  },
  /*
  *选择诉求按钮
  */
  // handleAppealsChange: function (e) {
  //   const appeals = e.detail.value.map((value) => {
  //     const foundAppeal = this.data.appealList.find(appeal => appeal.value === value);
  //     return foundAppeal && foundAppeal.name;
  //   });
  //   this.setData({
  //     appeals,
  //     appealsString: appeals.join(",")
  //   });
  // },
  handleAppealInput: function(e) {
    this.setData({
      appealsString:e.detail.value
    });
  },
  handleExpectEffectsClick: function (e) {
    console.log(e);
    const effect = e.currentTarget.dataset["effect"];
    let appeal = "";
    if (~this.data.appealsString.indexOf(effect.name)) {
      appeal = this.data.appealsString.replace(new RegExp(effect.name + "\\s?", "g"), "").trim();
    } else {
      appeal = this.data.appealsString.concat(" " + effect.name).trim();
    }
    this.setData({
      appealsString: appeal
    });
  },
  bindRegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.login();
    this.init();
  },

  init:function(){
    var token = this.getToken();
    if (!token) {
      return;
    }

    // console.log('初始化家暴类型...');
    // wx.request({
    //   url: getApp().globalData.rootURL + 'mobile/common/getDicts',
    //   data: { "type": "violent_type" },
    //   method: "POST",
    //   header: {
    //     'Content-Type': 'application/json'
    //   },
    //   success: (res) => {
    //     console.log(res.data);
    //     if (res.data.code == '200') {
    //       //{"result":{"size":3,"dicts":[{"extend":"","code":"V00001","name":"配偶家暴","showOrder":1,"id":843,"type":"violent_type","describes":"家暴类型"},{"extend":"","code":"V00002","name":"对子女家暴","showOrder":2,"id":844,"type":"violent_type","describes":"家暴类型"},{"extend":"","code":"110000","name":"对老人家暴","showOrder":3,"id":845,"type":"violent_type","describes":"家暴类型"}]},"code":"200","message":"操作成功"}
    //       var dicts = res.data.result.dicts;
    //       this.setData({
    //         violentTypes: dicts
    //       });
    //       this.data.disputes.type = this.data.violentTypes[0].code;
    //       console.log(this.data.violentTypes);
    //     }
    //     else {
    //       console.log(res.data.message);
    //       wx.showToast({
    //         title: res.data.message,
    //       })
    //     }
    //   }
    // })

    // if (this.data.region == '') {
    //   this.setData({
    //     region: app.globalData.CurrentLocationAddress,
    //     residenceDetail: app.globalData.residenceDetail,
    //   })
    // }

    // if (this.data.residenceDetail == ''){
    //   this.setData({
    //     residenceDetail: app.globalData.residenceDetail,
    //   })
    // }
    
    this.data.disputes.type = '110000';
    this.data.disputes.areaCode = app.globalData.areasCode
    console.log(app.globalData.areasCode)
    this.setData({
      disputes: this.data.disputes,
    })

    console.log(this.data.disputes)
         
  },
  violenceTypePickerSelected: function (e) {
    this.setData({
      violentIndex: e.detail.value
    });
    this.data.disputes.type = '110000';
    console.log('disputes:', this.data.disputes);
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


  /**
   * 提交
   */
  formSubmit: function (e) {
    var token = this.getToken();
    if (!token) {
      return;
    }
    var disputes = this.data.disputes;
    /*合并数据 */
    Object.assign(disputes, e.detail.value);

    if (!disputes.type) {
      util.remind("家暴类型不能为空");
      return false;
    }

    if (!disputes.areaCode) {
      util.remind("发生地点的区域不能为空");
      return false;
    }

    // if (!disputes.address) {
    //   util.remind("发生地点的详细地址不能为空");
    //   return false;
    // }

    if (!disputes.remarks) {
      util.remind("事件描述不能为空");
      return false;
    }

    /*提交的内容 */
    var formData = JSON.stringify(disputes);

    console.log('提交事件信息：', formData, disputes);
    console.log(rootUrl.API_HOST + 'mobile/consult/save')
    wx.request({
      url: rootUrl.API_HOST + 'mobile/consult/save',
      data: formData,
      method: "POST",
      header: {
        'Content-Type': 'application/json',
        token: token
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == '200') {
          /*得到事件id */
          var disputesId = res.data.result.id;
          console.log("disputesId：", disputesId);
           /*把事件id存到URL中 */
          wx.redirectTo({
            url: '/pages/consult/counselor_list/counselor_list?disputesId=' + disputesId,
          });
        }
        else {
          console.log(res.data.message);
          wx.showModal({
            title: '错误',
            showCancel: false,
            content: res.data.message
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '错误',
          content: JSON.stringify(res)
        })
      }
    })

  },
  // 关闭弹框
  _cancelEvent: function () {
    this.areaSelect.hideDialog();
    this.setData({
      textareaShow:true
    })
  },
  // 确认地址
  _confirmEvent: function () {
    var addressObj = this.areaSelect.data.addressObj
    var _region = addressObj.province.provinceName + " " + addressObj.city.cityName + " " + addressObj.area.areaName + " " + addressObj.address.addressName + " " + addressObj.community.communityName
    var check_region = addressObj.province.provinceName + ' ' + addressObj.city.cityName + ' ' + addressObj.area.areaName
    if (check_region != this.data.region && this.data.residenceDetail == app.globalData.residenceDetail) {
      this.setData({
        residenceDetail: ''
      })
    }

    this.setData({
      region: _region,
      textareaShow:true
    })
    this.data.disputes.areaCode = addressObj.area.areaCode
    this.areaSelect.hideDialog();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.areaSelect = this.selectComponent("#areaSelect");
  },
  openAddress: function () {
    this.areaSelect.showDialog();
    this.setData({
      textareaShow:false
    })
  },
  /**
   * 获取登录令牌
   */
  getToken: function () {
    if (!getApp().globalData.loginInfo || !getApp().globalData.loginInfo.token) {
      wx.showModal({
        title: '错误',
        showCancel: false,
        content: "请先登录！",
        success: function () {
          wx.redirectTo({
            url: '/pages/login/login',
          });
        }
      })
      return null;
    }
    var token = getApp().globalData.loginInfo.token;
    return token;
  },

  // 登录账号
  login: function () {
    // 提交登录请求
    var _this = this;
    util.POST('mobile/login/signin', '', { 'phone': '15928578507', 'pwd': '11111111' }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        app.globalData.loginInfo = res.data.result;
        _this.init();
      } else {
        util.remind(res.data.message);
      }
    })
  }
})