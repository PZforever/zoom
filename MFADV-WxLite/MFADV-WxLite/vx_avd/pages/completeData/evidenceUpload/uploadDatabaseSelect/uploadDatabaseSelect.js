const util = require('../../../../utils/request.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    attachments: [],
    newAttachments:[],
    evidenceCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _self =this;
    _self.setData({
      from_service: options.from_service,
      evidenceCode: options.evidenceCode
    })
    if (!!options.serviceId) {
      console.log("补全资料选择资料库...", options.serviceId);
      _self.setData({
        serviceId: options.serviceId
      })
    }
    // this.login();
    /* 如果附件列表是空才初始化 */
    if (!app.globalData.newEventEvidenceType || app.globalData.newEventEvidenceType.length == 0) {
      console.log("self.getDicts()...");
      _self.getDicts();
    }
    this.getUploadDatabaseAll();
    // console.log(app.globalData.loginInfo.token);
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
    const _self = this;
    _self.getSystemInformation();
    // _self.getUploadDatabaseAll();
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

  },


  //获取证据类型
  getDicts: function () {
    const _self = this;
    util.POST("/mobile/common/getDicts", "", {
      "type": "evidence_type"
    }, function (res) {
      if (res.data.code == "200") {
        _self.data.attachments = res.data.result.dicts;
        for (var i = 0; i < _self.data.attachments.length; i++) {
          _self.data.attachments[i].children = [];
        }
        app.globalData.newEventEvidenceType = _self.data.attachments;
        _self.setData({
          attachments: _self.data.attachments,
        })
      } else {
        util.remind("获取证据类型失败！");
      }
    })
  },

  /**
   * 资料库获取上传列表
   */
  getUploadDatabaseAll: function () {
    var _self = this;
    util.POST('mobile/violentCase/attachment/list', app.globalData.loginInfo.token, {
    }, function (res) {
      // console.log(res.data);
      // 判断交互是否正常
      if (res.data.code == '200') {
        _self.data.attachments = res.data.result.attachments;
        for (var i = 0; i < _self.data.attachments.length; i++) {
          _self.data.attachments[i].isFold = true;
          if (_self.data.evidenceCode == _self.data.attachments[i].code) {
            _self.data.newAttachments.push(_self.data.attachments[i])
          }
        }
        /*请求数据 */
        _self.setData({
          newAttachments: _self.data.newAttachments,
          attachments: _self.data.newAttachments
        })
        
      } else {
        util.remind("获取数据失败！");
      }
    });
  },

  /**
   * 全选
   */
  selectAll: function (e) {
    var _this = this;
    var attachments = _this.data.attachments;
    var index = e.currentTarget.dataset.index;
    attachments[index].selected = !attachments[index].selected;

    for (var i = 0; i < attachments[index].children.length; i++) {
      attachments[index].children[i].selected = attachments[index].selected;
    }

    if (attachments[index].selected == true) {
      attachments[index].checkNums = attachments[index].children.length;
    } else {
      attachments[index].checkNums = 0;
    }

    _this.setData({
      attachments: attachments
    });
  },

  /**
   * 单选
   */
  checkItem(e) {
    var _this = this;
    var typeIndex = e.currentTarget.dataset.typeIndex; //分组索值引
    var itemIndex = e.currentTarget.dataset.itemIndex;  //分组中日记索引值
    var attachments = _this.data.attachments;
    attachments[typeIndex].children[itemIndex].selected = !attachments[typeIndex].children[itemIndex].selected;
    attachments[typeIndex].checkNums = 0;
    attachments[typeIndex].selected = true;
    for (var i = 0; i < attachments[typeIndex].children.length; i++) {
      attachments[typeIndex].checkNums = attachments[typeIndex].checkNums + attachments[typeIndex].children[i].selected;
      if (!attachments[typeIndex].children[i].selected){
        attachments[typeIndex].selected = false;
      }
    };

    // if (attachments[typeIndex].checkNums > 0) {
    //   attachments[typeIndex].selected = true;
    // } else {
    //   attachments[typeIndex].selected = false;
    // };
    _this.setData({
      attachments: attachments
    });
  },

  /**
   * 折叠展开
   */
  flodFn: function (e) {
    // console.log(e);
    const _self = this;
    var index = e.currentTarget.dataset.index;
    _self.data.attachments[index].isFold = !_self.data.attachments[index].isFold;
    _self.setData({
      attachments: _self.data.attachments
    });
  },

  /**
   * 保存按钮点击事件
   */
  saveDatabaseSelect: function (e) {
    var _this = this;
    var attachments = _this.data.attachments;
    for (var typeIndex = 0; typeIndex < attachments.length; typeIndex++) {
      for (var i = 0; i < attachments[typeIndex].children.length; i++) {
        if (attachments[typeIndex].children[i].selected) {
          // console.log(attachments[typeIndex].children[i]);
          _this.saveAttachement(attachments[typeIndex].children[i]);
        }
      }
    }

    app.globalData.listStatus[8].checked = true
    // if (this.data.from_service == 1) {
    //   wx.navigateBack({
    //     delta: 3
    //   })
    // } else {
      wx.navigateBack({
        delta: 1
      })
    // }
  },

  /**
   * 保存单个附件
   */
  saveAttachement: function (attachment) {
    if (!!this.data.serviceId) {
      /*补全资料的保存 */
      var serviceId = this.data.serviceId;
      var token = getApp().globalData.loginInfo.token;
      var data = {
        violentCaseAttachmentId: attachment.id,
        violentCaseId: serviceId
      };
      util.POST('mobile/violentCase/uploadAttachmentByDatabase', token, data, this.uploadAttachmentByDatabaseSuccess)
    }
    else {
      /*新建案件的保存 */
      app.globalData.listStatus[8].checked = true //将列表中上传证据的状态改成已完成
      var evidenceTypeLength = app.globalData.newEventEvidenceType.length;
      for (var i = 0; i < evidenceTypeLength; i++) {
        if (app.globalData.newEventEvidenceType[i].code == attachment.type) {
          /*排除重复选择 */
          for (var j = 0; j < app.globalData.newEventEvidenceType[i].children.length; j++) {
            if (app.globalData.newEventEvidenceType[i].children[j].id == attachment.id) {
              return;
            }
          }
          /*保存到证据数据中 */
          app.globalData.newEventEvidenceType[i].children.push(attachment);
          return;
        }
      }
    }
  },
  
  /*补全资料的上传成功 */
  uploadAttachmentByDatabaseSuccess: function (e) {
    // console.log(e)
  },

  //获取系统信息
  getSystemInformation: function () {
    const _self = this;
    wx.getSystemInfo({
      success: function (res) {
        _self.setData({
          clientHeight: res.windowHeight - 70
        });
      }
    });
  },

  // 登录账号
  login: function () {
    // 提交登录请求
    var _self = this;
    util.POST('mobile/login/signin', '', { 'phone': '15871775675', 'pwd': '12345678' }, function (res) {
      // util.POST('mobile/login/signin', '', { 'phone': '15928578507', 'pwd': '111111' }, function (res) {
      // console.log(res.data);
      if (res.data.code == 200) {
        app.globalData.loginInfo = res.data.result;
        _self.getUploadDatabaseAll();
      } else {
        util.remind(res.data.message);
      }
    })
  }
})