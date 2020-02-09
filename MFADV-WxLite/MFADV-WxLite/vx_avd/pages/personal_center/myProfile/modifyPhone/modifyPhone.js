const xhr = require('../../../../utils/xhr.js');
const util = require('../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:'',
    verificationCode:'',
    verifyCodeTime:'获取验证码',
    buttonDisable:false,

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
  
  //获取短信验证码
  getVerificationCode:function(){
    var _self = this;
    var data = JSON.stringify({phone: _self.data.phoneNumber});
    var contentType = 'application/json';
    var method = 'POST';

    var API_CODE = '/mobile/common/getVerificationCode';
    var promise = new Promise((resolve, reject) => {
      xhr.wxRequest(API_CODE, { data, contentType, method}, resolve, reject)
    })

   promise.then(res => {
     if (res.data.code == 'JWT00002' || res.data.code == 'JWT00001' || res.data.code == 'JWT00004' || res.data.code == '403') {
       wx.navigateTo({
         url: '/pages/login/login'
       })
       return false;
     }
     if(res.data.code == "200"){
       _self.setData({
         buttonDisable: true
       })
       util.remind(res.data.message); 
     }

    }).catch(err => {
      console.log(err)
    })

  },
  bindKeyPhone: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
  },
  verifyCodeEvent: function (e) {
    if (this.data.buttonDisable) return false;
    var _self = this;
    var c = 60;
    var mobile = this.data.phoneNumber;
    var regMobile = /^1\d{10}$/;
    if (this.data.phoneNumber == ""){
      util.remind("手机号不能为空!");   
      return false
    }else{
      if (!regMobile.test(mobile)) {
        util.remind("手机号格式有误!");  
        this.setData({
          phoneNumber: ''
        })
        return false;
      }
    }
    
    var intervalId = setInterval(function () {
      c = c - 1;
      _self.setData({
        verifyCodeTime: c + 's后重发',
        buttonDisable: true
      })
      if (c == 0) {
        clearInterval(intervalId);
        _self.setData({
          verifyCodeTime: '获取验证码',
          buttonDisable: false
        })
      }
      
    }, 1000)
    
    _self.getVerificationCode();
  },
  bindKeyCode:function(e){
    this.setData({
      verificationCode: e.detail.value
    })
  },
  changePhone:function(){
    var _self = this;
    var data = JSON.stringify({ newPhone: _self.data.phoneNumber, verifyCode:_self.data.verificationCode });
    var contentType = 'application/json';
    var method = 'POST';
    var API_PHONE = '/mobile/user/updatePhone';

    if (this.data.phoneNumber == "") {
      util.remind("手机号不能为空！");        
      return false
    }
    if (_self.data.verificationCode == ""){
      util.remind("验证码不能为空！");  
      return false
    }
    var promise = new Promise((resolve, reject) => {
      xhr.wxRequest(API_PHONE, { data, contentType, method }, resolve, reject)
    })
    wx.showLoading();
    promise.then(res => {
      var data = res.data;
      if (res.data.code == 'JWT00002' || res.data.code == 'JWT00001' || res.data.code == 'JWT00004' || res.data.code == '403') {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return false;
      }
      if (res.data.code == "200"){
        app.globalData.loginInfo.phone = _self.data.phoneNumber;
        wx.navigateBack({
          delta: 1
        })
      }else{
        util.remind(res.data.message);
      }
      wx.hideLoading();
    }).catch(err => {
      console.log(err)
    })

  }
})