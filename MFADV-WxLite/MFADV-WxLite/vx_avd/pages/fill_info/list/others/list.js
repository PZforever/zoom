// pages/fill_info/list/others/list.js
const util = require('../../../../utils/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listStatus:'',
    services: [],
    type: '',
    shadow: false,
    showModal: false,
  },

  /**
       * 弹窗
       */
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  /**
   * 弹出框蒙层截断touchmove事件
   */
  preventTouchMove: function () {
  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModal: false,
    });
    wx.navigateTo({
      url: '/pages/personal_center/serviceList/serviceList',
    })
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    wx.navigateTo({
      url: '/pages/personal_center/serviceList/serviceList',
    })
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    var phoneNumber = this.data.shelter_phone
    wx.makePhoneCall({
      phoneNumber: phoneNumber
    })
  },

  success: function (res) {
    var that = this
    if (res.data.code==200) {
      app.globalData.listStatus[5].checked = false
      var token = getApp().globalData.loginInfo.token;
      wx.request({
        url: getApp().globalData.rootURL + '/mobile/orangeDiary/isApply',
        data: { 'id': getApp().globalData.diaryArray },
        method: 'POST',
        header: {
          'content-type': 'application/json', // 默认值
          'token': token
        },
        success: function (res) {
          util.remind("提交成功");
          app.globalData.newEventEvidenceType = []
          getApp().globalData.apply_info.areas = { "code": getApp().globalData.areasCode}
          getApp().globalData.psychologist_name = '点击选择咨询师'
          getApp().globalData.psychologist_index = null
          getApp().globalData.shelter_selected = '无'
          getApp().globalData.applicantInfo.registration = ''
          getApp().globalData.servicesArray = []
          app.globalData.apply_info.violentType = '';
          app.globalData.violentTypeIndex = 0;
          getApp().globalData.respondengtInfo = {
            "role": 20,
            "actualName": "",
            "sex": "",
            "nation": "N001001",
            "phone": "",
            "idCard": "",
            "residenceAreaCode": getApp().globalData.areasCode,
            "residenceDetail": ""
          }
          if (that.data.type.indexOf('庇护所') != -1) {
            that.showDialogBtn()
          } else {
            wx.redirectTo({
              url: '/pages/personal_center/serviceList/serviceList',
            })
          }
        }
      })
    }else{
      util.remind(res.data.message);
    }
  },
  //保护令申请获取法院
  // 点击跳转
  order:function(event){
    // 首先判断是否是申请多项服务,如果是单项服务，则心理咨询需要跳转到告知书页面，且确认后不再提示
    if(this.data.services.length==1){
      if (event.currentTarget.dataset.name=="心理咨询") {
        // 判断是否已经确认心理咨询告知书
          wx.navigateTo({
            url:'/pages/psychological_counseling/appointment/appointment'
          })
      }else if(event.currentTarget.dataset.name=="庇护所"){
        // 判断是否已经确认了庇护所告知书
         wx.navigateTo({
           url:'/pages/shelter/shelterList/shelterList'
          })
      }else{
        wx.navigateTo({
          url: event.currentTarget.dataset.url
        })
      }
    }else{
      // 判断是那种服务类型
      if (event.currentTarget.dataset.name=="心理咨询") {
        // 判断是否已经确认心理咨询告知书
          wx.navigateTo({
            url:app.globalData.agreeBol1?'/pages/psychological_counseling/appointment/appointment':'/pages/psychological_counseling/disclaimer/disclaimer'
          })
      }else if(event.currentTarget.dataset.name=="庇护所"){
        // 判断是否已经确认了庇护所告知书
         wx.navigateTo({
           url: app.globalData.agreeBol2 ?'/pages/shelter/shelterList/shelterList':'/pages/shelter/disclaimer/disclaimer'
          })
      }else{
        wx.navigateTo({
          url: event.currentTarget.dataset.url
        })
      }
    }
    
  },
  //提交申请
  submit: function () {
    switch (this.data.type) {
      case '庇护所':
        if (getApp().globalData.apply_info.areas != null) {
          getApp().globalData.apply_info.areas = null
        }
        getApp().globalData.apply_info.sanctuaryApplication = getApp().globalData.sanctuaryApplication
        getApp().globalData.apply_info.psychologicalCounseling = null
        getApp().globalData.apply_info.personalSafetyProtectionOrder = null
        break;
      case '心理咨询':
        this.data.listStatus[3].checked = true
        getApp().globalData.apply_info.areas = null
        getApp().globalData.apply_info.psychologicalCounseling = getApp().globalData.psychologicalCounseling
        getApp().globalData.apply_info.sanctuaryApplication = null
        getApp().globalData.apply_info.personalSafetyProtectionOrder = null
        break;
      case '人身安全保护令':
        getApp().globalData.apply_info.personalSafetyProtectionOrder = getApp().globalData.personalSafetyProtectionOrder
        getApp().globalData.apply_info.sanctuaryApplication = null
        getApp().globalData.apply_info.psychologicalCounseling = null
        break;
      case '庇护所,人身安全保护令':
        getApp().globalData.apply_info.sanctuaryApplication = getApp().globalData.sanctuaryApplication
        getApp().globalData.apply_info.personalSafetyProtectionOrder = getApp().globalData.personalSafetyProtectionOrder
        getApp().globalData.apply_info.psychologicalCounseling = null
        break;
      case '人身安全保护令,庇护所':
        getApp().globalData.apply_info.sanctuaryApplication = getApp().globalData.sanctuaryApplication
        getApp().globalData.apply_info.personalSafetyProtectionOrder = getApp().globalData.personalSafetyProtectionOrder
        getApp().globalData.apply_info.psychologicalCounseling = null
        break;
      case '庇护所,心理咨询':
        if (getApp().globalData.apply_info.areas.code != null){
          getApp().globalData.apply_info.areas = null
        }
        getApp().globalData.apply_info.sanctuaryApplication = getApp().globalData.sanctuaryApplication
        getApp().globalData.apply_info.psychologicalCounseling = getApp().globalData.psychologicalCounseling
        getApp().globalData.apply_info.personalSafetyProtectionOrder = null
        break;
      case '心理咨询,庇护所':
        if (getApp().globalData.apply_info.areas.code != null) {
          getApp().globalData.apply_info.areas = null
        }
        getApp().globalData.apply_info.sanctuaryApplication = getApp().globalData.sanctuaryApplication
        getApp().globalData.apply_info.psychologicalCounseling = getApp().globalData.psychologicalCounseling
        getApp().globalData.apply_info.personalSafetyProtectionOrder = null
        break;
      case '心理咨询,人身安全保护令':
        getApp().globalData.apply_info.psychologicalCounseling = getApp().globalData.psychologicalCounseling
        getApp().globalData.apply_info.personalSafetyProtectionOrder = getApp().globalData.personalSafetyProtectionOrder
        getApp().globalData.apply_info.sanctuaryApplication = null
        break;
      case '人身安全保护令,心理咨询':
        getApp().globalData.apply_info.psychologicalCounseling = getApp().globalData.psychologicalCounseling
        getApp().globalData.apply_info.personalSafetyProtectionOrder = getApp().globalData.personalSafetyProtectionOrder
        getApp().globalData.apply_info.sanctuaryApplication = null
        break;
      default:
        getApp().globalData.apply_info.sanctuaryApplication = getApp().globalData.sanctuaryApplication
        getApp().globalData.apply_info.psychologicalCounseling = getApp().globalData.psychologicalCounseling
        getApp().globalData.apply_info.personalSafetyProtectionOrder = getApp().globalData.personalSafetyProtectionOrder
        break;
    }

    var litigant = []
    litigant.push(getApp().globalData.applicantInfo)
    litigant.push(getApp().globalData.respondengtInfo)
    getApp().globalData.apply_info.litigant = litigant
    if (getApp().globalData.apply_info.applyType == "OTHER") {
      getApp().globalData.apply_info.litigant[2] = getApp().globalData.registerInfo
    }
    var attachments = []
    var attachmentsArray = app.globalData.newEventEvidenceType
    for (var i = 0; i < attachmentsArray.length; i++) {
      if (attachmentsArray[i].children.length > 0) {
        for (var j = 0; j < attachmentsArray[i].children.length; j++) {
          var attachment = {
            type: attachmentsArray[i].children[j].type,
            url: attachmentsArray[i].children[j].url,
            name: attachmentsArray[i].children[j].name,
          }
          attachments.push(attachment)
        }
      }
    }
    var getDatabaseArray = app.globalData.getDatabaseArray
    for (var k = 0; k < getDatabaseArray.length; k++) {
      for (var n = 0; n < getDatabaseArray[k].length; n++) {
        var attachment = {
          type: getDatabaseArray[k][n].type,
          url: getDatabaseArray[k][n].url,
          name: getDatabaseArray[k][n].name,
        }
        attachments.push(attachment)
      }
    }
    app.globalData.apply_info.attachments = attachments;
    var data = getApp().globalData.apply_info;
    var token = getApp().globalData.loginInfo.token;
    // 判断其中是否有假
    if (this.data.services.length == 1) {
      if (!this.data.services[0].status) {
        util.remind("信息未填写完毕");
        return false;
      }
    }
    // 判断其中是否有假
    this.data.services.forEach(function(item){
      if (!item.status) {
        util.remind("信息未填写完毕");
      }
      return false;
    })
    if (!this.data.listStatus[0].checked){
      util.remind("登记人信息未填写完毕");
      return false;
    }
    if (this.data.type.indexOf('心理咨询') != -1) {
      // 判断是否已经填写完毕
      if (!this.data.listStatus[1].checked) {
        util.remind("信息未填写完毕");
        return false;
      }
    }

    if (this.data.type.indexOf('人身安全保护令') != -1) {
      if (!this.data.listStatus[1].checked || !this.data.listStatus[2].checked || !this.data.listStatus[3].checked || !this.data.listStatus[4].checked) {
        util.remind("信息未填写完毕");
        return false;
      }
    }

    if (this.data.type.indexOf('庇护所') != -1) {
      if (!this.data.listStatus[1].checked || !this.data.listStatus[6].checked) {
        util.remind("信息未填写完毕");
        return false;
      }
    }
    if (this.data.type.indexOf('人身安全保护令') != -1 && app.globalData.courtChoose == '') {
      util.remind("修改地址后，请重新选择法院");
      return false;
    }
    util.POST('mobile/violentCase/apply', token, data, this.success)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.fill_info_type.indexOf('人身安全保护令') != -1){
      this.setData({
        is_order: true,
      })
    } else {
      this.setData({
        is_order: false,
      })
    }
    var statusArray = app.globalData.listStatus
    for (var i = 0; i < statusArray.length; i++) {
      statusArray[i].checked = false
    }
    this.setData({
      is_diary_submit: app.globalData.diaryArray,
      type:options.fill_info_type
    })
    switch (options.fill_info_type) {
      case '伤情鉴定':
        var services = []
        var service_data = {
          status:app.globalData.listStatus[7].checked,
          service_name: options.fill_info_type,
          serviceUrl: '',
        }
        services.push(service_data)
        this.setData({
          services: services,
          description_url: '/pages/injury_identification/description/description?fill_info_type=' + options.fill_info_type,
          registerInfoUrl: '/pages/fill_info/registerInfo/registerInfo?fill_info_type=' + options.fill_info_type,
          applicantInfoUrl: '/pages/fill_info/applicantInfo/applicantInfo?fill_info_type=' + options.fill_info_type,
          respondentUrl: '/pages/fill_info/respondent/respondent?fill_info_type=' + options.fill_info_type,
          uploadRecordUrl: '/pages/completeData/evidenceUpload/evidenceUpload',
        });
        break;
      case '心理咨询':
        var services = []
        var service_data = {
          status:app.globalData.listStatus[5].checked,
          service_name: options.fill_info_type,
          serviceUrl: '/pages/psychological_counseling/appointment/appointment?fill_info_type=' + options.fill_info_type,
        }
        services.push(service_data)
        this.setData({
          services: services,
          description_url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
          registerInfoUrl: '/pages/fill_info/registerInfo/registerInfo?fill_info_type=' + options.fill_info_type,
          applicantInfoUrl: '/pages/fill_info/applicantInfo/applicantInfo?fill_info_type=' + options.fill_info_type,
          respondentUrl: '/pages/fill_info/respondent/respondent?fill_info_type=' + options.fill_info_type,
          uploadRecordUrl: '/pages/completeData/evidenceUpload/evidenceUpload',
        });
        break;
      case '庇护所':
        var services = []
        var service_data = {
          status:app.globalData.listStatus[6].checked,
          service_name: options.fill_info_type,
          serviceUrl: '/pages/shelter/shelterList/shelterList?fill_info_type=' + options.fill_info_type,
        }
        services.push(service_data)
        this.setData({
          services: services,
          description_url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
          registerInfoUrl: '/pages/fill_info/registerInfo/registerInfo?fill_info_type=' + options.fill_info_type,
          applicantInfoUrl: '/pages/fill_info/applicantInfo/applicantInfo?fill_info_type=' + options.fill_info_type,
          respondentUrl: '/pages/fill_info/respondent/respondent?fill_info_type=' + options.fill_info_type,
          uploadRecordUrl: '/pages/completeData/evidenceUpload/evidenceUpload',
        });
        break;
      case '人身安全保护令':
        var services = []
        var service_data = {
          status:app.globalData.listStatus[4].checked,
          service_name: options.fill_info_type,
          serviceUrl: '/pages/protectionOrder/order/order?fill_info_type=' + options.fill_info_type,
        }
        services.push(service_data)
        this.setData({
          services: services,
          description_url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
          registerInfoUrl: '/pages/fill_info/registerInfo/registerInfo?fill_info_type=' + options.fill_info_type,
          applicantInfoUrl: '/pages/fill_info/applicantInfo/applicantInfo?fill_info_type=' + options.fill_info_type,
          respondentUrl: '/pages/fill_info/respondent/respondent?fill_info_type=' + options.fill_info_type,
          uploadRecordUrl: '/pages/completeData/evidenceUpload/evidenceUpload',
        });
        break;
      default:
        this.setData({
          services: app.globalData.servicesArray,
          description_url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
          registerInfoUrl: '/pages/fill_info/registerInfo/registerInfo?fill_info_type=' + options.fill_info_type,
          applicantInfoUrl: '/pages/fill_info/applicantInfo/applicantInfo?fill_info_type=' + options.fill_info_type,
          respondentUrl: '/pages/fill_info/respondent/respondent?fill_info_type=' + options.fill_info_type,
          uploadRecordUrl: '/pages/completeData/evidenceUpload/evidenceUpload',
        });
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
    // 判断来源更新列表状态
    this.setData({
      listStatus:app.globalData.listStatus,
      shelter_name: app.globalData.shelter_name,
      shelter_phone: app.globalData.shelter_phone,
    })
    // 判断当前页面来源
    if (this.data.type=="伤情鉴定") {
        this.data.services[0].status=app.globalData.listStatus[7].checked
    }else if (this.data.type=="心理咨询") {
        this.data.services[0].status=app.globalData.listStatus[5].checked
    }else if (this.data.type=="庇护所") {
        this.data.services[0].status=app.globalData.listStatus[6].checked
    }else if (this.data.type=="人身安全保护令") {
        this.data.services[0].status=app.globalData.listStatus[4].checked
    }else{
      // 判断状态码
      this.data.services.forEach(function(item){
          if (item.service_name=="伤情鉴定") {
              item.status=app.globalData.listStatus[7].checked
          }else if(item.service_name=="心理咨询"){
              item.status=app.globalData.listStatus[5].checked
          }else if(item.service_name=="庇护所"){
              item.status=app.globalData.listStatus[6].checked
          }else if(item.service_name=="人身安全保护令"){
              item.status=app.globalData.listStatus[4].checked
          }
      })

    }
    this.setData({
      services:this.data.services
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
  // 蒙层阴影提示文本
  shadowTurn: function () {
    this.setData({
      shadow: false
    })
  },
  shadow: function () {
    this.setData({
      shadow: true
    })
    // setTimeout(this.shadowTurn, 2000)
  },
  unShadow:function(){
    this.setData({
      shadow: false
    })
  }
  /**
   * 用户点击右上角分享
   */
  
})