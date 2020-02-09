//index.js
//获取应用实例
const util = require('../../../../utils/request.js');
const config = require('../../../../utils/config.js');
const app = getApp()
Page({
  data: {
    select:1,
    id:'',
    personal1:"",
    personal2:"",
    msg:"",
    evidence:[]
  },
  onLoad: function (query) {
    this.setData({
      id: query.messageId
    })
    // 1申请人
    // 2被申请人
    this.getMessage(1);
    this.getMessage(2);
    // 获取事件表述
    this.getMsg();
    // 获取证据
    this.getEvidence();
  },
  selectBtn:function(e){
    this.setData({
      select: e.currentTarget.id
    })
  },
  // 获取申请人信息
  getMessage:function(type){
    var _this=this;
    if(type==1){
      util.POST("mobile/violentCase/getLitigant", app.globalData.loginInfo.token, { 'violentCaseId': this.data.id, 'type': 'A' }, function (res) {
        _this.setData({
          personal1: res.data.result
        })
      })
    }else{
      util.POST("mobile/violentCase/getLitigant", app.globalData.loginInfo.token, { 'violentCaseId': this.data.id, 'type': 'R' }, function (res) {
        _this.setData({
          personal2: res.data.result
        })
      })
    }
  },
  // 获取事件表述
  getMsg:function(){
    var _this=this;
    util.POST('mobile/violentCase/getViolentCase', app.globalData.loginInfo.token, { 'violentCaseId': this.data.id},function(res){
    _this.setData({
      msg:res.data.result
    })
    })
  },
  // 获取证据
  getEvidence:function(){
    var _this=this;
    util.POST('mobile/violentCase/getAttachments', app.globalData.loginInfo.token, { 'violentCaseId': this.data.id }, function (res) {
      res.data.result.attachments.forEach(function(item){
        item.checked=false
      })
      _this.setData({
        evidence: res.data.result
      })
    })
  },
  // 切换关闭页面
  openBtn:function(e){
    this.data.evidence.attachments.forEach(function(item){
      if (item.id == e.currentTarget.id){
        item.checked=!item.checked;
      }
    })
    this.setData({
      evidence: this.data.evidence
    })
  },
  // 下载证据
  downLoadFiles: function (e) {
    const _self = this;
    var token = '';
    var violentCaseUrl = e.currentTarget.dataset.param;
    if (violentCaseUrl.indexOf('https://') == -1) {
      violentCaseUrl = config.API_HOST + "lawCaseAttachment/" + violentCaseUrl;
    }
    if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    }
    wx.showLoading();
    wx.downloadFile({
      url: violentCaseUrl,
      header: {
        'token': token
      },
      success: function (res) {
        if (res.statusCode == 200) {
          var tempFilePaths = res.tempFilePath;
          var imageArray = tempFilePaths.split(".");
          var lengths = imageArray.length - 1;
          //保存图片
          if (imageArray[lengths] == "png" || imageArray[lengths] == "PNG" || imageArray[lengths] == "jpg" || imageArray[lengths] == "JPG" || imageArray[lengths] == "jpeg" || imageArray[lengths] == "JPEG" || imageArray[lengths] == "GIF" || imageArray[lengths] == "gif" || imageArray[lengths] == "PSD" || imageArray[lengths] == "psd" || imageArray[lengths] == "TIFF" || imageArray[lengths] == "tiff" || imageArray[lengths] == "eps" || imageArray[lengths] == "EPS") {

            wx.saveImageToPhotosAlbum({
              filePath: tempFilePaths,
              success(res) {
                util.remind("下载成功，请到手机相册中查看！");

              },
              fail(res) {
                console.log(res);
              }
            })
            //保存视频
          } else if (imageArray[lengths] == "mp4" || imageArray[lengths] == "avi" || imageArray[lengths] == "mpeg" || imageArray[lengths] == "mov" || imageArray[lengths] == "mkv" || imageArray[lengths] == "rmvb" || imageArray[lengths] == "flv" || imageArray[lengths] == "rm") {
            wx.saveVideoToPhotosAlbum({
              filePath: tempFilePaths,
              success(res) {
                util.remind("下载成功，请到手机相册中查看！");
              },
              fail(res) {
                console.log(res);
              }
            })
          } else {
            //除图片其他文件保存到本地
            wx.saveFile({
              tempFilePath: tempFilePaths,
              success: function (res) {
                var savedFilePath = res.savedFilePath
                util.remind("下载成功，请到手机中查看！");

                wx.openDocument({
                  filePath: savedFilePath,
                  success: function (res) {

                  },
                  fail: function (res) {
                    console.log(res);
                  }
                })
              }
            })
          }

        }
        wx.hideLoading();
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res);
        util.remind(res.errMsg);
      }

    })
  }
})
