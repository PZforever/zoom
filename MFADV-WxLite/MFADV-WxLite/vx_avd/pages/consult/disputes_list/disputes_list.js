const util = require('../../../utils/request.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 0,
    pageSize: 10,
    isMore: true,
    /*咨询师列表 */
    disputesList: [],
    shadeOff:false,//蒙层展示
    disputes: ''//查看已完成的咨询记录
  },
  shadeBtn: function () {//蒙层展示
    this.setData({
      shadeOff: false
    })
  },
  fillBtn:function(){//填写资料
    wx.navigateTo({
      url: '/pages/consult/disputes/disputes'
    })
  }, 
  restBtn:function(e){//查看记录
    var disputes =this.data.disputes;
    var status = disputes.status;
    var disputesId = disputes.disputesId;
    var counselorId = disputes.counselorId;
    wx.navigateTo({
      url: '/pages/consult/consult_session/consult_session?disputesId=' + disputesId + '&counselorId=' + counselorId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.login();
    // this.getDisputesList();
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
    this.setData({
      shadeOff: false
    })
    this.getDisputesList();
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
    this.getDisputesList();
  },

  /**
   * 用户点击右上角分享
   */

  /**
   * 获取咨询师列表，在加载和触底中调用
   */
  getDisputesList: function () {
    var token = this.getToken();
    if (!token) {
      return;
    }
    console.log("token", token);
    var that = this;
    if (!this.data.isMore) {
      return
    }
    // console.log(this.data);
    var disputesList = this.data.disputesList;

    this.data.pageNum++;
    wx.request({
      url: getApp().globalData.rootURL + 'mobile/consult/list',
      data: {
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize
      },
      method: 'POST',
      header: {
        'content-type': 'application/json', // 默认值
        'token': token
      },
      success: (res) => {
        // console.log(res.data.result.disputes);
        if (res.data.code == '200') {
          //{"result":{"size":1.0,"isMore":false,"disputes":[{"imgPhoto":"https://mf.dev.izern.cn:443/counselorAndMediators/10017-1.jpg","counselorName":"杨央平","disputesId":533,"sessionId":327,"caseNo":"1520406292698","counselorId":10017,"status":"1"}]},"code":"200","message":"查询成功"}
          var addDisputes = res.data.result.disputes
          // console.log(addDisputes)
          for (var i = 0; i < addDisputes.length; i++) {
            //过滤content = /568/e25e1a74c6ea4aafaf39dd2f2652bfd0.PNG&小程序模块.png
            var newDisputes = addDisputes[i];
            var content = newDisputes.content;
            if (content && content.indexOf('&') > -1) {
              content = content.substring(content.indexOf('&') + 1);
              newDisputes.content = content;
            }
            disputesList.push(newDisputes);
          }
          disputesList.forEach((item, index) => {
            item.formattedTime = this.formatDate(item.createTime);
          })
          that.setData({
            disputesList: disputesList,
            isMore: res.data.result.isMore
          })
        }
        else {
          wx.showModal({
            title: '错误',
            showCancel: false,
            content: '登录失败 请重新登录！'
          })
        }
      }
      // fail: function () {
      //   // fail
      // },
      // complete: function () {
      //   // complete
      // }
    })
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    });
  },
  formatDate: function (date) {
    if (!date) {
      return "";
    }
    var tt = new Date(date);
    var days = parseInt((new Date().getTime() - date) / 86400000);
    var today = new Date().getDate();
    var year = tt.getFullYear();
    var mouth = tt.getMonth() + 1;
    var day = tt.getDate();
    var hour = tt.getHours();
    var minute = this.check(tt.getMinutes());
    var result, offset;
    offset = today - day;
    if (days < 2) {
      if (offset === 0) {
        result = hour + ":" + minute;
      } else if (offset === 1) {
        result = "昨天";
      }
    } else {
      result = year + "/" + this.check(mouth) + "/" + this.check(day);
    }
    return result;
  },

  //检查是不是两位数字，不足补全
  check: function (str){
    str=str.toString();
    if(str.length<2){
      str = '0' + str;
    }
    return str;
  },

  selectDisputes: function (e) {
    console.log('选中disputes：', e.currentTarget.dataset.disputes);
    var disputes = e.currentTarget.dataset.disputes;
    var status = disputes.status;
    var disputesId = disputes.disputesId;
    var counselorId = disputes.counselorId;
    this.setData({
      disputes: disputes
    })
    if (status == '2') {
      this.setData({//蒙层
        shadeOff: true
      })
      return;
    }
    wx.navigateTo({
      url: '/pages/consult/consult_session/consult_session?disputesId=' + disputesId + '&counselorId=' + counselorId
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
  imgPhotoBinderror: function (e) {
    this.data.disputesList[e.target.dataset.errImg].imgPhoto ="/img/head_default.png";
    var disputesList = this.data.disputesList;
    this.setData({
      disputesList: disputesList
    })
  },
  // 登录账号
  login: function () {
    // 提交登录请求
    var _this = this;
    util.POST('mobile/login/signin', '', { 'phone': '15871775675', 'pwd': '12345678' }, function (res) {
      console.log(res.data);
      if (res.data.code == 200) {
        app.globalData.loginInfo = res.data.result;
        _this.getDisputesList();
      } else {
        util.remind(res.data.message);
      }
    })
  }
})