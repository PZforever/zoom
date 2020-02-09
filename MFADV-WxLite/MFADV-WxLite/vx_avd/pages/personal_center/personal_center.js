var app = getApp();
const util = require('../../utils/request.js');
const xhr = require('../../utils/xhr.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actualName: '',
    headPortrait:'',
    personalBG:"",
    imgURL:"",
    idCard:"",
    openID:"",
    sessionKey:"",
    isBindWX:"",
    isBindText:""
  },
  showModal: function () {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 100)
  },
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 100)
  },
  //退出
  dropOut:function(){
    var _self = this;
    if (app.globalData.loginInfo == null) {
      util.remind("您还未登入！");
      _self.hideModal();
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false
    }
    app.globalData.loginInfo = null;
    _self.hideModal();
    wx.navigateTo({
      url: '/pages/login/login'
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '确认退出？',
    //   success: function (res) {
    //     if (res.confirm) {
    //       app.globalData.loginInfo = null;
    //       _self.hideModal();
    //       wx.navigateTo({
    //         url: '/pages/login/login'
    //       })
    //     } else if (res.cancel) {
    //       _self.hideModal();
    //     }
    //   }
    // }) 

  },
  //绑定微信
  bindingWechat:function(){
    const _self = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.openSetting({
            success: (res) => {
              wx.getUserInfo({
                success: function (res) {
                  _self.getOpenId();
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            }
          })
        }else{
          wx.getUserInfo({
            success: function (res) {
              _self.getOpenId();
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      }
    })
  },
//获取openId
getOpenId:function(){
  const _self = this;
  var contentType = 'application/json';
  var method = 'POST';
  wx.login({
    success: function (res) {
      var data = {
        code: res.code,
      };
      if (res.code) {
        //发起网络请求
        var API_LOGIN = '/mobile/user/getWeChatIdByCode';
        var promise = new Promise((resolve, reject) => {
          xhr.wxRequest(API_LOGIN, { data, contentType, method }, resolve, reject)
        })

        promise.then(res => {
          if (res.data.code == 'JWT00002' || res.data.code == 'JWT00001' || res.data.code == 'JWT00004' || res.data.code == '403') {
            wx.navigateTo({
              url: '/pages/login/login'
            })
            return false;
          }
          if (res.data.code == "200") {
            _self.data.openID = res.data.result.openid;
            _self.data.sessionKey = res.data.result.session_key;
            _self.bindWechat();

          } else {
            util.remind(res.data.message);
          }

        }).catch(err => {
          util.remind(res.data.message);
        })

      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  });

},
//绑定微信
bindWechat:function(){
  const _self = this;
  var contentType = 'application/json';
  var method = 'POST';
  var API_BIND = "";
  var data = {
    wechatId: _self.data.openID
  }
  if (_self.data.isBindWX){
  //解绑 
    API_BIND = '/mobile/user/unbindWechatId';
  }else{
    //绑定
    API_BIND = '/mobile/user/bindWechatId';
  }
  
  var promises = new Promise((resolve, reject) => {
    xhr.wxRequest(API_BIND, { data, contentType, method }, resolve, reject);
  })

  promises.then(res => {
    if (res.data.code == 'JWT00002' || res.data.code == 'JWT00001' || res.data.code == 'JWT00004' || res.data.code == '403') {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false;
    }
    if (res.data.code == "200") {
      if (_self.data.isBindWX){
        _self.data.isBindWX = false;
        _self.data.isBindText = "绑定微信";
      }else{
        _self.data.isBindWX = true;
        _self.data.isBindText = "解绑微信";
      }
      _self.setData({
        isBindText: _self.data.isBindText
      })
     
      util.remind(res.data.message);

    } else {
      util.remind(res.data.message);
    }

  }).catch(err => {
    util.remind(res.data.message);
  })

},
//绑定微信
bindWechat: function () {
  const _self = this;
  var contentType = 'application/json';
  var method = 'POST';
  var API_BIND = "";
  var data = {
    wechatId: _self.data.openID
  }
  if (_self.data.isBindWX) {
    //解绑 
    API_BIND = '/mobile/user/unbindWechatId';
  } else {
    //绑定
    API_BIND = '/mobile/user/bindWechatId';
  }

  var promises = new Promise((resolve, reject) => {
    xhr.wxRequest(API_BIND, { data, contentType, method }, resolve, reject);
  })

  promises.then(res => {
    if (res.data.code == 'JWT00002' || res.data.code == 'JWT00001' || res.data.code == 'JWT00004' || res.data.code == '403') {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false;
    }
    if (res.data.code == "200") {
      if (_self.data.isBindWX) {
        _self.data.isBindWX = false;
        _self.data.isBindText = "绑定微信";
      } else {
        _self.data.isBindWX = true;
        _self.data.isBindText = "解绑微信";
      }
      _self.setData({
        isBindText: _self.data.isBindText
      })

      util.remind(res.data.message);

    } else {
      util.remind(res.data.message);
    }

  }).catch(err => {
    util.remind(res.data.message);
  })

},
setImgs:function(){
  const _self = this;
  if (app.globalData.loginInfo == null || typeof app.globalData.loginInfo == "null"){
    return
  }
  if (app.globalData.loginInfo.idCard != "" || app.globalData.loginInfo.idCard != null || typeof app.globalData.loginInfo.idCard != "null"){
    if(app.globalData.loginInfo.sex == "男"){
      _self.data.headPortrait = app.globalData.rootURL+"headPortrait/man.png"; 
    }else if(app.globalData.loginInfo.sex == "女"){
      _self.data.headPortrait = app.globalData.rootURL +"headPortrait/women.png";
    }else{
      _self.data.headPortrait = app.globalData.rootURL + "headPortrait/man.png";
    }
  }else{
    _self.data.headPortrait = app.globalData.rootURL + "headPortrait/man.png";
  }
  app.globalData.loginInfo.headPortrait = _self.data.headPortrait;
  _self.setData({
    headPortrait: _self.data.headPortrait
  })
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
    var _self = this;
    util.checkLoginModel();
    _self.data.imgURL = app.globalData.imgURL;
    _self.data.personalBG = _self.data.imgURL +"img/personal_bg.png";
    if (app.globalData.loginInfo != null){
      _self.data.isBindWX = app.globalData.loginInfo.isBindWX;
    }
    
    if (_self.data.isBindWX){
      _self.data.isBindText = "解绑微信";
    }else{
      _self.data.isBindText = "绑定微信";
    }
    _self.setData({
      imgURL: _self.data.imgURL,
      personalBG: _self.data.personalBG,
      isBindText: _self.data.isBindText
    })
    if (app.globalData.loginInfo != null) {
      _self.data.actualName = app.globalData.loginInfo.actualName;
      _self.data.headPortrait = app.globalData.loginInfo.headPortrait;
      _self.data.idCard = app.globalData.loginInfo.idCard;
      _self.setData({
        actualName: app.globalData.loginInfo.actualName,
        headPortrait: app.globalData.loginInfo.headPortrait,
        idCard: app.globalData.loginInfo.idCard
      })
    } else {
      _self.setData({
        actualName: '',
        headPortrait: ''

      })

    }
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
  onShareAppMessage:function(){
    return {
      title:'构筑平安家庭，我们是您坚实的后盾！',
      path:'/pages/index/index',
      imageUrl: app.globalData.imgURL+'img/share.png'
    }
  }
})