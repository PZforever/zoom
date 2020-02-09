const util = require('../../utils/request.js');
var app=getApp();
// pages/login/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'', 
    password:'',
    focusID:'',
    disabled:true 
  },  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  setFocus:function(e){
    this.setData({
      focusID:e.currentTarget.id
    })
  }, 
  // 设置手机号
  setPhone:function(e){
    this.setData({
      phone:e.detail.value,
      disabled:false
    })
  },
  // 设置密码
  setPassword:function(e){
    this.setData({
      password:e.detail.value
    })
  },
  // 登录账号
  submit:function(){
    // 首先检测手机号是否正确
    if (!util.checkPhone(this.data.phone)) {
      util.remind("手机号输入有误");
      return false;
    }
    if (this.data.password.length<8) {
      util.remind("密码最低8位");
      return false;
    }
    // 提交登录请求
    var _this=this;
    util.POST('mobile/login/signin','',{'phone':this.data.phone,'pwd':this.data.password},function(res){
      console.log(res)
      if (res.data.code==200) {
        util.remind("登录成功！");
        app.globalData.loginInfo = res.data.result;
        for (var i in app.globalData.loginInfo){
          if (app.globalData.loginInfo[i] == null){
            app.globalData.loginInfo[i] = "";
          }
        }

        wx.navigateBack({
          delta: 1
        })
      }else{  
        util.remind(res.data.message);
      }
    })
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
    return {
      title: '构筑平安家庭，我们是您坚实的后盾！',
      path: '/pages/index/index',
      imageUrl: app.globalData.imgURL+'img/share.png'
    }
  }

})