 // pages/protectionOrder/order/order.js
const util = require('../../../utils/request.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    applyName:'',
    applyGender: '',
    applyNation: '',
    applyBirth: '',
    applyAddress: '',
    claimantName: '',
    claimantGender: '',
    claimantNation: '',
    claimantBirth: '',
    claimantAddress: '',
    applyMatter:'请求人民法院依法签发人身保护令， 对申请人采取以下措施以保护申请人的人身安全',
    matterReason: "被申请人于" + app.globalData.happen_time + "在" + app.globalData.address[2].name + app.globalData.apply_info.address + "对申请人实施了" + app.globalData.apply_info.remarks + "等家暴手段", 
    // 申请事项
    ProtectiveMeasure: [],
    Court:'',
    // 法院id
    id:''
  },
  //保护令申请获取法院
  court: function () {
    var _this = this;
    if (app.globalData.courtChoose == ''){
      _this.setData({
        Court: ''
      })
      util.remind("请先选择管辖法院");
      return false;
    }
    util.POST('mobile/organization/getOrgByAreaCode', app.globalData.loginInfo.token, {
      "areasCode": app.globalData.courtChoose
    }, function (res) {
      console.log(res)
      // 判断交互是否正常
      if (res.data.code == '200') {
        if (res.data.result.organization.length > 0) {
          app.globalData.Court = res.data.result.organization[0].organizationName
          _this.setData({
            Court: app.globalData.Court,
            id: res.data.result.organization[0].id
          })
        }
      } else {
        wx.showToast({
          title: '法院未选择',
        })
      }
    })
  },

  // 获取申请事项列表
  get_protective_measures: function (res) {
    var _this=this;
    var ProtectiveMeasure = [];
    var Array = res.data.result.dicts;
    Array[Array.length - 1].name = app.globalData.self_desc;
    var itemsNum = app.globalData.Protective;
    for (var i = 0, len = Array.length; i < len; ++i) {
      ProtectiveMeasure.push(Array[i])
    }
    _this.setData({
      ProtectiveMeasure: ProtectiveMeasure,
    })
    //申请事项
    var itemsNum=app.globalData.Protective;
    for (var j = 0; j < itemsNum.length; j++) {
      var i = itemsNum[j];
      _this.data.ProtectiveMeasure[i].checked = true
    }
    const last = _this.data.ProtectiveMeasure.length - 1
    if (_this.data.ProtectiveMeasure[last].checked && app.globalData.selfDesc==""){
      _this.data.ProtectiveMeasure[last].name = "其他" 
    } else if (_this.data.ProtectiveMeasure[last].checked && app.globalData.selfDesc != ""){
      _this.data.ProtectiveMeasure[last].name = app.globalData.selfDesc
    }
    _this.setData({
      ProtectiveMeasure: _this.data.ProtectiveMeasure,
    })
  },
  /**
  *确认申请人提交
  */
  checkboxChange: function (e) {
    app.globalData.applyConfirm = !app.globalData.applyConfirm; 
    this.setData({
      applyConfirm: app.globalData.applyConfirm
    })
  },

  submit: function (e) {
    var a1 = app.globalData.listStatus[1].checked;
    var a2 = app.globalData.listStatus[2].checked;
    var a3 = app.globalData.listStatus[3].checked;
    if (!a1) {
      util.remind("请先完善申请人信息");
      return false;
    };
    if (!a2) {
      util.remind("请先完善被申请人信息");
      return false;
    };
    if (!a3) {
      util.remind("请先完善事件描述信息");
      return false;
    };


    if (this.data.applyConfirm) {
      // wx.showModal({
      //   title: '是否关联证据库中的已上传证据',
      //   content: '点击填表目录的证据上传选项，可选择新增上传证据或关联证据库中的已上传证据',
      //   confirmText: "是",
      //   cancelText: "否",
      //   success: function (res) {
      //     if (res.confirm) {
      //       app.globalData.listStatus[4].checked = true;
      //       wx.navigateTo({
      //         url: '/pages/completeData/evidenceUpload/uploadDatabaseSelect/uploadDatabaseSelect?from_service=2'
      //       })
      //     } else {
      app.globalData.listStatus[4].checked = true; 
      app.globalData.personalSafetyProtectionOrder.organization.id = this.data.id;
      wx.navigateBack({
        delta: 1
      })
      // app.globalData.applyConfirm = false;
      
      //     }
      //   }
      // })
    }; 
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this=this;

    if (app.globalData.listStatus[4].checked){
      app.globalData.applyConfirm = true;
    }else{
      app.globalData.applyConfirm = false;
    }
    
    //信息
    var Idcard = app.globalData.applyIdCard;
    var applyBirth = Idcard.substr(6, 4) + '年' + Idcard.substr(10, 2) + '月' + Idcard.substr(12, 2) + '日';
    console.log(app.globalData.address);
    var applyAddress = app.globalData.address[0].name + app.globalData.applicantInfo.residenceDetail;

    var Idcard2 = app.globalData.claimantIdCard;
    var claimantBirth = Idcard2.substr(6, 4) + '年' + Idcard2.substr(10, 2) + '月' + Idcard2.substr(12, 2) + '日';
    var claimantAddress = app.globalData.address[1].name + app.globalData.respondengtInfo.residenceDetail;

    _this.setData({
      matterReason: "被申请人于" + app.globalData.happen_time + "在" + app.globalData.address[2].name + app.globalData.apply_info.address + "对申请人实施了" + app.globalData.apply_info.remarks + "等侵害行为。",
      applyName: app.globalData.applyName,
      applyGender: app.globalData.applyGender,
      applyNation: app.globalData.applyNation,
      applyBirth: applyBirth,
      applyAddress: applyAddress,
      claimantName: app.globalData.claimantName,
      claimantGender: app.globalData.claimantGender,
      claimantNation: app.globalData.claimantNation,
      claimantBirth: claimantBirth,
      claimantAddress: claimantAddress,
      applyConfirm: app.globalData.applyConfirm,
      Court: app.globalData.Court,
    })
    

    app.globalData.personalSafetyProtectionOrder.factAndReasons = _this.data.matterReason

    var protective_measure_data = {
      type: 'protective_measure'
    }
    util.POST('mobile/common/getDicts', getApp().globalData.loginInfo.token, protective_measure_data, _this.get_protective_measures)

    if (getApp().globalData.apply_info.applyType == "ONESELF") {
      this.setData({
        url: '/pages/fill_info/list/self/list?fill_info_type=人身安全保护令'
      })
    }
    if (getApp().globalData.apply_info.applyType == "OTHER") {
      this.setData({
        url: '/pages/fill_info/list/others/list?fill_info_type=人身安全保护令'
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
  onShow: function () {
    var _this=this;
    _this.court();
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