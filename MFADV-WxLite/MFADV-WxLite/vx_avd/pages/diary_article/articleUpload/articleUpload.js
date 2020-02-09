const util = require('../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evidenceType: [],
    tempFilePaths: [],
    oldTempFilePaths:[],
    index: 0,
    serviceId: '',
    evidenceCode: "ET0001",
    evidenceCodeName: "",
    uploadUrl: 'mobile/orangeDiary/insert/uploadAttachment',
    backTo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },


  /*
  *证据分类
  */
  uploadPickerSelected: function (e) {
    var _self = this;
    //改变index值，通过setData()方法重绘界面
    _self.data.index = e.detail.value;
    _self.data.evidenceCode = _self.data.evidenceType[e.detail.value].code;
    _self.data.evidenceCodeName = _self.data.evidenceType[e.detail.value].name;
    _self.setData({
      index: e.detail.value,
      evidenceCode: _self.data.evidenceType[e.detail.value].code,
      evidenceCodeName: _self.data.evidenceType[e.detail.value].name
    });

  },
  //获取证据类型
  getDicts: function () {
    const _self = this;
    util.POST("/mobile/common/getDicts", "", {
      "type": "evidence_type"
    }, function (res) {

      if (res.data.code == "200") {
        _self.data.evidenceType = res.data.result.dicts;
        for (var i = 0; i < _self.data.evidenceType.length; i++) {
          _self.data.evidenceType[i].children = [];
        }
        app.globalData.orangeDiaryUpLoad = _self.data.evidenceType;
        _self.data.evidenceCode = _self.data.evidenceType[0].code;
        _self.data.evidenceCodeName = _self.data.evidenceType[0].name;
        _self.setData({
          evidenceType: _self.data.evidenceType,
          evidenceCode: _self.data.evidenceType[0].code,
          evidenceCodeName: _self.data.evidenceType[0].name
        })
      } else {
        util.remind("获取证据类型失败！");
      }
    })
  },
  uploadFile: function () {
    var _self = this;
    var evidenceCode = _self.data.evidenceCode;
    var evidenceCodeName = _self.data.evidenceCodeName;
    if (evidenceCode == "ET0010") {
      wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function (res) {
          _self.data.tempFilePaths.push(res.tempFilePath);
          _self.wxUploadFile(evidenceCode, evidenceCodeName);
        },
        fail: function (res) {
          console.log(res);
        }
      })
    } else {
      wx.chooseImage({
        success: function (res) {
          var tempFilePaths = res.tempFilePaths;
          _self.setData({
            oldTempFilePaths: tempFilePaths
          })
          _self.data.tempFilePaths = res.tempFilePaths
          _self.wxUploadFile(evidenceCode, evidenceCodeName);
        },
        fail: function (res) {
          // console.log(res);
        },
      })
      // console.log(_self.data.tempFilePaths)
    }
  },
  agoUP: function (fileUrl, fileName, fileCode) {
    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      url: fileUrl,
      urlName: fileName,
      urlCode: fileCode
    });
    wx.navigateBack({//返回
      delta: 1
    })
  },
  //上传文件方法
  wxUploadFile: function (evidenceCode, evidenceCodeName) {
    var _self = this;
    var token = '';
    if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false
    }
    wx.showLoading();
    for (var y = 0; y < _self.data.tempFilePaths.length; y++) {
      if (_self.data.tempFilePaths.length - 1 == y) {
        _self.data.backTo = true;
      }
      wx.uploadFile({
        url: getApp().globalData.rootURL + _self.data.uploadUrl,
        filePath: _self.data.tempFilePaths[y],
        name: 'file',
        formData: {
          'type': evidenceCode,
          'violentCaseId': _self.data.serviceId
        },
        header: {
          'token': token,
        },
        success: function (res) {

          var data = JSON.parse(res.data);
          var uploadFileNameOne = [];
          var uploadFileNameTwo = [];
          var evidenceTypeLength = app.globalData.orangeDiaryUpLoad.length;

          if (data.code == "200") {
            if (_self.data.serviceId == "") {
              uploadFileNameOne = data.result.attachements[0].url.split("/");
              uploadFileNameTwo = uploadFileNameOne[1].split(".");

              for (var i = 0; i < evidenceTypeLength; i++) {
                if (app.globalData.orangeDiaryUpLoad[i].code == evidenceCode) {

                  app.globalData.orangeDiaryUpLoad[i].children.push({
                    "createTime": "",
                    "name": uploadFileNameOne[1],
                    "url": data.result.attachements[0].url,
                    "delFlag": "0",
                    "type": evidenceCode,
                    "id": "",
                    "md5": uploadFileNameTwo[0]
                  });
                }
              }

            }
            wx.hideLoading();

            wx.showToast({
              title: "操作成功！",
              complete: function () {
                if (_self.data.backTo) {
                  _self.data.backTo = false;
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 500)
                }

              }
            })

          } else {
            util.remind(data.message);
          }
        },
        fail: function (res) {
          var data = JSON.parse(res.data);
          util.remind("操作失败" + data.message);
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    const _self = this;

    if (app.globalData.orangeDiaryUpLoad.length > 0) {
      _self.data.evidenceType = app.globalData.orangeDiaryUpLoad;
      _self.data.evidenceCode = _self.data.evidenceType[0].code;
      _self.data.evidenceCodeName = _self.data.evidenceType[0].name;
      _self.setData({
        evidenceType: _self.data.evidenceType,
        evidenceCode: _self.data.evidenceCode,
        evidenceCodeName: _self.data.evidenceCodeName
      })
    } else {
      _self.getDicts();
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
  onUnload: function (options) {
    var _self = this;
    // if (options.id != "") {
    // _self.data.serviceId = options.id;
    _self.data.uploadUrl = 'mobile/violentCase/uploadAttachmentForUpdate';
    // _self.setData({
    //   serviceId: options.id,
    //   });
    // } else {
    //   _self.data.uploadUrl = 'mobile/violentCase/uploadAttachmentForInsert';
    //   _self.data.serviceId = "";
    // }
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

  }
})