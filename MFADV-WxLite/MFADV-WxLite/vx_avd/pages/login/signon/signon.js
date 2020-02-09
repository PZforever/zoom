// pages/login/signon/signon.js
const util = require('../../../utils/request.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:'',
    password:'',
    passwords:'',
    code:'',
    focusID:0,
    validationBtnText: "发送验证码",
    disabled:false,
    getCodeBol:false,
    type:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断用户是注册还是修改密码
    if (options.type==1) {
      wx.setNavigationBarTitle({
        title: '密码重置'
      })
      this.setData({
        type:options.type
      })
    }else if(options.type == 2){
      this.setData({
        type: options.type
      })
      wx.setNavigationBarTitle({
        title: '绑定手机'
      })
    } else if (options.type == 3){
      this.setData({
        type: options.type
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 点击设置光标
  setFocus:function(e){
    this.setData({
      focusID:e.currentTarget.id
    })
  },
  // 设置手机号
  setPhone:function(e){
    this.setData({
      phone:e.detail.value
    })
  },
  // 设置密码
  setPassword:function(e){
    this.setData({
      password:e.detail.value
    })
  },
  // 再次设置密码
  setPasswords:function(e){
    this.setData({
      passwords:e.detail.value
    })
  },
  // 设置验证码
  setCode:function(e){
    this.setData({
      code:e.detail.value
    })
  },
  // 获取验证码
  getCode:function(){
    // 首先检测手机号是否正确
    if (!util.checkPhone(this.data.phone)) {
      util.remind("手机号输入有误");
      return false;
    }
    this.setData({
      disabled:true
    })
    // 获取验证码
    var _this=this;
    util.POST('mobile/common/getVerificationCode',"",{'phone':this.data.phone},function(res){
      if (res.data.code==200) {
        // 启动倒计时
        _this.downTime();
        util.remind("验证码发送成功");
        _this.setData({
          getCodeBol:true
        })
      }else{
        _this.setData({
          disabled:false
        })
        util.remind(res.data.message);
      }
    })
     
  },
  // 验证码倒计时
  downTime:function(){
    var _this=this;
    var number=60;
    var timer=setInterval(function(){
      number--;
      _this.setData({
        validationBtnText:number+"秒"
      })
      if (number==0) {
        clearInterval(timer);
        _this.setData({
          disabled:false,
          validationBtnText:"获取验证码"
        })
      }
    },1000)
  },
  // 提交注册
  send:function(){
    // 首先检测手机号是否正确
    if (!util.checkPhone(this.data.phone)) {
      util.remind("手机号输入有误");
      return false;
    }
    // 判断密码是否含中文
    if (util.checkCode(this.data.password)||util.checkCode(this.data.passwords)) {
      util.remind("密码禁用中文");
      return false;
    }
    // 判断两次密码位数是否符合要求
    if (this.data.password.length<8) {
      util.remind("密码最低8位");
      return false;
    }else{
      if (this.data.passwords!==this.data.password) {
        util.remind("两次密码不相同");
        return false;
      }
    }
    // 检测是否获取验证码
    if(!this.data.getCodeBol){
      util.remind("请先获取验证码");
      return false;
    }else if (this.data.code.length<4) {
      util.remind("验证码填写有误");
      return false;
    }
    // 判断用户是修改密码还是注册
    if (this.data.type==1) {
      var apiUrl='mobile/login/forgetPassword';
    }else{
       var apiUrl='mobile/login/registered';
    }
    // 发送请求
    var _this=this;
    util.POST(apiUrl,'',{'phone':this.data.phone,'pwd1':this.data.password,'pwd2':this.data.passwords,'verificationCode':this.data.code},function(res){
        if (res.data.code==200) {
           util.remind("操作成功");
           if (_this.data.type==1) {
              // 返回上一页
              setTimeout(function(){
                  /*返回登录页面 */
                  wx.navigateBack({
                    delta:1
                  })
              },500) 
           } else if (_this.data.type == 2){
              // 返回上一页
             setTimeout(function(){
            /*返回登录页面 */
                wx.navigateBack({
                  delta:2
                })
            },500)
           } else if (_this.data.type == 3){
             wx.navigateBack({
               delta: 2
             })
             setTimeout(function () {
               /*返回登录页面 */
               wx.navigateTo({
                 url: '/pages/login/login'
               })
             }, 50)
           }              
        }else{
          util.remind(res.data.message);
        }
    })
  },
  // 
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
  
})