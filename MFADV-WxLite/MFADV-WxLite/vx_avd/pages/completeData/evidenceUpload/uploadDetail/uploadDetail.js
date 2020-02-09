const util = require('../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    evidenceType: [],
    tempFilePaths: [],
    index: 0,
    serviceId: '',
    evidenceCode: "",
    evidenceCodeName: "",
    uploadUrl: '',
    backTo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _self = this;
    var allFiles = false;
    if (options.allFiles != undefined && options.allFiles) {
      allFiles = true;
      _self.setData({
        uploadUrl: 'mobile/violentCase/uploadDatabase',
        serviceId: ""
      })
    } else {
      if (options.id != undefined) {
        _self.setData({
          uploadUrl: 'mobile/violentCase/uploadAttachmentForUpdate',
          serviceId: options.id,
        });
      } else {
        _self.setData({
          uploadUrl: 'mobile/violentCase/uploadAttachmentForInsert',
          serviceId: ''
        })
      }
    }

    _self.setData({
      allFiles: allFiles
    });
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
        app.globalData.newEventEvidenceType = _self.data.evidenceType;
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
    var token = '';
    var evidenceCode = _self.data.evidenceCode;
    var evidenceCodeName = _self.data.evidenceCodeName;

    if (app.globalData.loginInfo != null) {
      token = app.globalData.loginInfo.token;
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return false
    }
    if (_self.data.evidenceCode == "") {
      util.remind("请选择证据类型！");
      return false
    }
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
          _self.data.tempFilePaths = res.tempFilePaths;
          _self.wxUploadFile(evidenceCode, evidenceCodeName);
        },
        complete: function (res) {
          //console.log(res);
        },
        fail: function (res) {
          console.log(res);
        },
      })

    }
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
      var url = getApp().globalData.rootURL + _self.data.uploadUrl;
      console.log(url);
      wx.uploadFile({
        url: url,
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
          console.info(res);
          var data = JSON.parse(res.data);
          var uploadFileNameOne = [];
          var uploadFileNameTwo = [];
          var evidenceTypeLength = app.globalData.newEventEvidenceType.length;
          if (data.code == "200") {            
            console.info(!_self.data.allFiles);
            if (!_self.data.allFiles && _self.data.serviceId == "") {
              console.log("本地上传成功...");
              app.globalData.listStatus[8].checked = true //将列表中上传证据的状态改成已完成
              uploadFileNameOne = data.result.attachements[0].url.split("/");
              uploadFileNameTwo = uploadFileNameOne[1].split(".");

              for (var i = 0; i < evidenceTypeLength; i++) {
                if (app.globalData.newEventEvidenceType[i].code == evidenceCode) {
                  app.globalData.newEventEvidenceType[i].children.push({
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
    if (app.globalData.newEventEvidenceType.length > 0) {
      _self.data.evidenceType = app.globalData.newEventEvidenceType;
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