// pages/completeData/applicantPrivacy/applicantPrivacy.js
const util = require('../../../utils/request.js');
var app = getApp();
Page({
  /** 
   * 页面的初始数据
   */
  data: { 
    disease_history: [],
    disease_history2: [],
    crime_history: [],
    crime_history2: [],
    violent_history: [],
    violent_history2: [],

    privacy:'',
    diseaseHistory:'',
    illnessDetail:'',
    crimeHistory:'',
    domesticViolenceHistory:'',
    index1: '0',
    index2: '0',
    index3: '0'
  },

/**
 * 生命周期函数--监听页面加载
 */
onLoad: function (options) {
  this.setData({
    caseId: options.caseId
  });
  this.getMessage();
},
getMessage: function () {
  var _this = this;
  util.POST('mobile/violentCase/getPrivacy', app.globalData.loginInfo.token, {
    "violentCaseId": this.data.caseId
  }, function (res) {
    // 判断交互是否正常
    console.log(res.data);
    if (res.data.code == '200') {
      /*请求申请人隐私 */
      _this.setData({
        privacy: res.data.result.privacy,
        illnessDetail: res.data.result.illnessDetail,
        diseaseHistory: res.data.result.diseaseHistory,
        crimeHistory: res.data.result.crimeHistory,
        domesticViolenceHistory: res.data.result.domesticViolenceHistory
      })
      /*调用列表 */
      _this.getDiseaseHistory();
      _this.getCrimeHistory();
      _this.getViolentHistory();
    }
    else {
      wx.showToast({
        title: res.data.message,
      })
    }
  });
},
/*
*提交表单
*/
  formSubmit: function (e) {
    var _this = this;
    util.POST('mobile/violentCase/updatePrivacy', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId,
      "privacy": {
        "privacy": _this.data.privacy,
        "illnessDetail": e.detail.value.illnessDetail,
        "diseaseHistory": _this.data.disease_history2[_this.data.index1].code,
        "crimeHistory": _this.data.crime_history2[_this.data.index2].code,
        "domesticViolenceHistory": _this.data.violent_history2[_this.data.index3].code
      }
    }, function (res) {
      // 判断交互是否正常
      console.log(res.data);
      if (res.data.code == '200') {
        /*返回列表页面 */
        wx.showToast({
          title:res.data.message,
          complete: function () {
            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              })
            }, 500)
          }
        })
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    })
  },

/*
* 疾病史列表
*/
  getDiseaseHistory: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'disease_history'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        /*共同生活成员列表 */
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            disease_history: _this.data.disease_history.concat(res.data.result.dicts[i].name),
            disease_history2: _this.data.disease_history2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.diseaseHistory) {
            _this.setData({
              index1: i
            })
          }
        };
      }
      else {
        wx.showToast({
          title: res.data.message,
        })
      }
    });
  },
/*
*疾病史
*/
  diseasePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index1: e.detail.value
    });
  },
/*
* 犯罪史列表
*/
  getCrimeHistory: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'crime_history'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      /*共同生活成员列表 */
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        _this.setData({
          crime_history: _this.data.crime_history.concat(res.data.result.dicts[i].name),
          crime_history2: _this.data.crime_history2.concat(res.data.result.dicts[i])
        })
      };
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        if (res.data.result.dicts[i].code == _this.data.crimeHistory) {
          _this.setData({
            index2: i
          })
        }
      };
    }
    else {
      wx.showToast({
        title: res.data.message,
      })
    }
  });
},
/*
*犯罪史
*/
crimePickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index2: e.detail.value
  });
},

/*
* 家暴史列表
*/
getViolentHistory: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'violent_history'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      /*共同生活成员列表 */
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        _this.setData({
          violent_history: _this.data.violent_history.concat(res.data.result.dicts[i].name),
          violent_history2: _this.data.violent_history2.concat(res.data.result.dicts[i])
        })
      };
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        if (res.data.result.dicts[i].code == _this.data.domesticViolenceHistory) {
          _this.setData({
            index3: i
          })
        }
      };
    }
    else {
      wx.showToast({
        title: res.data.message,
      })
    }
  });
},
/*
*家暴史
*/
dvPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index3: e.detail.value
  });
},

/*
*是否隐私
*/
  switchChange: function (e) {
    var _this=this;
    _this.setData({
      privacy: e.detail.value
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

})