const util = require('../../../utils/request.js');
const xhr = require('../../../utils/xhr.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myProfileData: {},
    genderArray:["女","男"],
    genderIndex:0,
    age:"",
    sex:"",
    actualName:"",
    idCard:"",
    verifiedFlag:false
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
    _self.data.myProfileData = app.globalData.loginInfo;
    _self.data.age = _self.data.myProfileData.age;
    _self.data.sex = _self.data.myProfileData.sex;
    _self.data.actualName = _self.data.myProfileData.actualName;
    _self.data.idCard = _self.data.myProfileData.idCard;

    if (_self.data.myProfileData.sex == "女"){
      _self.data.genderIndex = 0;
    } else if (_self.data.myProfileData.sex == "男" || _self.data.myProfileData.sex == ""){
      _self.data.genderIndex = 1;
    }
    if (_self.data.myProfileData.isAuthenticate == 1){
      _self.data.verifiedFlag = true;
    }else{
      _self.data.verifiedFlag = false;
    }
    _self.setData({
      myProfileData: _self.data.myProfileData,
      genderArray: _self.data.genderArray,
      genderIndex: _self.data.genderIndex,
      verifiedFlag: _self.data.verifiedFlag,
    })
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
 
  //修改头像
  modifyAvatar:function(){
    var _self = this,token = '';
    if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    }else{
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    wx.chooseImage({
      count:1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.rootURL +'/mobile/user/updateHeadPortrait', 
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {},
          header:{
            'token': token,
          },
          success: function (res) {
            var data = JSON.parse(res.data);
            if (data.code == "200"){
              _self.data.myProfileData.headPortrait = data.result.url;
              app.globalData.loginInfo.headPortrait = data.result.url;
              _self.setData({
                myProfileData: _self.data.myProfileData
              })
            }else{
              util.remind(res.data.message);
            }
          },
          fail: function (res) {
            util.remind(res.data.message);
          }
        })
      },
      complete:function(res){
        //console.log(res);
      },
      fail:function(res){
        //console.log(res);
      },
    })
  },
  savePersonalInfo:function(){
    const _self = this;
    var data = JSON.stringify({
      age: _self.data.age,
      sex: _self.data.sex,
      actualName: _self.data.actualName,
      idCard: _self.data.idCard,
    });
    var contentType = 'application/json';
    var method = 'POST';
    if (_self.data.age == ""){
      util.remind("年龄不能为空！");
      return false
    } else if (_self.data.age == "0" || _self.data.age == "00" || _self.data.age == "000"){
      util.remind("年龄不能为0！");
      return false
    }

    wx.showLoading();
    var API_PROFILE = '/mobile/user/updateAgeAndSex';
    var promise = new Promise((resolve, reject) => {
      xhr.wxRequest(API_PROFILE, { data, contentType, method }, resolve, reject)
    })

    promise.then(res => {
      if (res.data.code == 'JWT00002' || res.data.code == 'JWT00001' || res.data.code == 'JWT00004' || res.data.code == '403') {
        wx.navigateTo({
          url: '/pages/login/login'
        })
        return false;
      }
      wx.hideLoading();
      if (res.data.code == "200") {
        util.remind(res.data.message);
        app.globalData.loginInfo.age = _self.data.age;
        app.globalData.loginInfo.sex = _self.data.sex;
        app.globalData.loginInfo.actualName = _self.data.actualName;
        app.globalData.loginInfo.idCard = _self.data.idCard;
      }else{
        util.remind(res.data.message);
      }
      
    }).catch(err => {
      util.remind(res.data.message);
    })

  },
  changeGender:function(e){
    const _self = this;
    const index = parseInt(e.detail.value);
    _self.data.sex = _self.data.genderArray[index];
    _self.data.genderIndex = index;

    _self.setData({
      genderIndex: _self.data.genderIndex
    })
  },
  bindKeyAge:function(e){
    const _self = this;
    var regs = /^([1-9]|[1-9]\d|1[01]\d|150)$/;
    var strs = e.detail.value;
    if (strs.length == 3){
      if (strs.substring(0, 1) == "0" && strs.substring(1, 2) == "0"){
        strs = strs.substring(2, 3);
      } else if (strs.substring(0, 1) == "0" && strs.substring(1, 2) != "0"){
        strs = strs.substring(1, 3);
      }
    } else if (strs.length == 2){
      if (strs.substring(0, 1) == "0"){
        strs = strs.substring(1, 2);
      }
    }
    
    var ages = parseInt(strs);
    if (regs.test(ages)){
      _self.data.age = ages;
    }else{
      util.remind("请输入正确的年龄！");
      _self.data.age = "";
    }
    
    _self.data.myProfileData.age = _self.data.age;
    app.globalData.loginInfo.age = _self.data.age;
    _self.setData({
      age: _self.data.age,
      myProfileData: _self.data.myProfileData
    })
  },
  getActualName:function(e){
    var _self = this;
    _self.data.actualName = e.detail.value;
    _self.data.myProfileData.actualName = e.detail.value;
    app.globalData.loginInfo.actualName = e.detail.value;
    _self.setData({
      myProfileData: _self.data.myProfileData
    })
  },
  getIdCard:function(e){
    var _self = this;
    var idCardFlag = util.checkId(e.detail.value)
    _self.data.myProfileData.idCard = e.detail.value;
    app.globalData.loginInfo.idCard = e.detail.value;
    _self.setData({
      myProfileData: _self.data.myProfileData
    })
    if (idCardFlag){
      _self.data.idCard = e.detail.value;
    }else{
      _self.data.idCard = "";
      util.remind("身份证格式错误！");
    }
   
  }

})