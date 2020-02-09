// pages/fill_info/applicantInfo/applicantInfo.js
const util = require('../../../utils/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: { 
    name: '',
    phone: '',
    idNum: '',
    gender: ['女', '男'],
    region: "",
    residenceDetail: '',
    is_shelter: false,
    registration: '',
    index: 0,
  },

  /*
  *选择民族
  */
  nationPickerSelected: function (e) {
    app.globalData.applicantNationIndex = e.detail.value
    app.globalData.applicantInfo.nation = this.data.Code[e.detail.value]
    this.setData({
      nationIndex: e.detail.value
    });
  },



  /*
  *选择性别
  */
  genderPickerSelected: function (e) {
    app.globalData.applicantInfo.sex = this.data.gender[e.detail.value]
    this.setData({
      index: e.detail.value
    });
  },

  //获取登记人姓名
  getName: function (e) {
    app.globalData.applicantInfo.actualName = e.detail.value
    this.setData({
      name: e.detail.value
    })
  },

  //获取登记人手机号
  getPhone: function (e) {
    app.globalData.applicantInfo.phone = e.detail.value
    this.setData({
      phone: e.detail.value
    })
  },

  //获取登记人身份证号
  getIdCard: function (e) {
    app.globalData.applicantInfo.idCard = e.detail.value
    this.setData({
      idNum: e.detail.value
    })
  },

  //获取具体地址
  getSpecificAddress: function (e) {
    app.globalData.applicantInfo.residenceDetail = e.detail.value
    this.setData({
      residenceDetail: e.detail.value
    })
    //小程序缓存
    wx.setStorage({
      key: "applicantResidenceDetail",
      data: e.detail.value
    })
  },

  submit: function () {
    if (!this.data.name) {
      util.remind("姓名不能为空");
      return false;
    }

    if (!this.data.phone) {
      util.remind("手机号不能为空");
      return false;
    }

    if (!util.checkPhone(this.data.phone)) {
      util.remind("手机号输入有误");
      return false;
    }

    if (this.data.phone == app.globalData.respondengtInfo.phone) {
      util.remind("申请人与被申请人手机号不能重复");
      return false;
    }

    if (this.data.phone == app.globalData.registerInfo.phone && app.globalData.apply_info.applyType == "OTHER") {
      util.remind("申请人与登记人手机号不能重复");
      return false;
    }

    if (!this.data.idNum) {
      util.remind("身份证号不能为空");
      return false;
    }

    if (!util.checkId(this.data.idNum)) {
      util.remind("身份证号输入有误");
      return false;
    }

    if (this.data.idNum == app.globalData.respondengtInfo.idCard) {
      util.remind("申请人与被申请人身份证号不能重复");
      return false;
    }

    if (this.data.idNum == app.globalData.registerInfo.idCard && app.globalData.apply_info.applyType == "OTHER") {
      util.remind("申请人与登记人身份证号不能重复");
      return false;
    }

    if (this.data.fill_info_type.indexOf('庇护所') != -1) {
      

      if (!this.data.region) {
        util.remind("请选择现居住地");
        return false;
      }

      if (!this.data.residenceDetail) {
        util.remind("具体地址不能为空");
        return false;
      }

      if (!this.data.registration) {
        util.remind("请选择户籍地址");
        return false;
      }
    }
    
    if (this.data.fill_info_type.indexOf('人身安全保护令') != -1) {
      if (!this.data.region) {
        util.remind("请选择发生地址");
        return false;
      }

      if (!this.data.residenceDetail) {
        util.remind("具体地址不能为空");
        return false;
      }
    }

    app.globalData.applicantInfo.residenceDetail = this.data.residenceDetail;
    this.setData({
      residenceDetail: this.data.residenceDetail
    })
    //小程序缓存
    // wx.setStorage({
    //   key: "applicantResidenceDetail",
    //   data: this.data.residenceDetail
    // })
    // if (!this.data.residenceDetail) {
    //   util.remind("具体地址不能为空");
    //   return false;
    // }

    if (this.data.name != null && util.checkPhone(this.data.phone) && util.checkId(this.data.idNum)) {
      app.globalData.listStatus[1].checked = true;
      app.globalData.address[0].name = this.data.region

      //保护令需显示的信息 
        app.globalData.applyName=this.data.name;
        app.globalData.applyGender=this.data.gender[this.data.index];
        app.globalData.applyNation=this.data.nation[this.data.nationIndex];
        app.globalData.applyIdCard=this.data.idNum;
        
      wx.navigateBack({
        delta: 1
      })
    }
  },

  success: function (res) {
    var nationArray = []
    var Code = []
    var Array = res.data.result.dicts
    for (var i = 0, len = Array.length; i < len; ++i) {
      nationArray.push(Array[i].name)
      Code.push(Array[i].code)
    }
    this.setData({
      nation: nationArray,
      Code: Code
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var data = {
      type: "nation"
    }
    util.POST('mobile/common/getDicts', getApp().globalData.loginInfo.token, data, this.success)
    this.setData({
      fill_info_type: options.fill_info_type,
      applyType: app.globalData.apply_info.applyType,
      url: '/pages/fill_info/respondent/respondent?fill_info_type=' + options.fill_info_type,
    })
  },
  
  // 关闭弹框
  _cancelEvent:function(){
    if (this.areaSelect.data.isShow) {
      this.areaSelect.hideDialog();
    }

    if (this.areaSelect.data.isRegistrationShow) {
      this.areaSelect.hideRegistrationDialog();
    }
  },
  // 确认地址
  _confirmEvent:function(){
    if (this.areaSelect.data.isShow){
      var addressObj = this.areaSelect.data.addressObj
      var _region = addressObj.province.provinceName + " " + addressObj.city.cityName + " " + addressObj.area.areaName + " " + addressObj.address.addressName + " " + addressObj.community.communityName
      var check_region = addressObj.province.provinceName + ' ' + addressObj.city.cityName + ' ' + addressObj.area.areaName
      if (check_region != this.data.region) {
        this.setData({
          residenceDetail: ''
        })
        app.globalData.applicantInfo.residenceDetail='';
      }
      
      this.setData({
        region: _region
      })
      if (addressObj.community.communityCode == '' && addressObj.address.addressCode == ''){
        app.globalData.applicantInfo.residenceAreaCode = addressObj.area.areaCode;
      } else if (addressObj.address.addressCode != '' && addressObj.community.communityCode == ''){
        app.globalData.applicantInfo.residenceAreaCode = addressObj.address.addressCode;
      } else {
        app.globalData.applicantInfo.residenceAreaCode = addressObj.community.communityCode;
      }
      
      //退回选择法院时
      if (this.data.fill_info_type.indexOf('人身安全保护令') != -1 && app.globalData.courtChooaseIndex == 1) {
        app.globalData.courtChoose = '';
        app.globalData.courtChooaseIndex = 0;
        app.globalData.listStatus[4].checked =false;
        app.globalData.listStatus[3].checked = false;  
      }

      this.areaSelect.hideDialog();
    }

    if (this.areaSelect.data.isRegistrationShow){
      var addressObj = this.areaSelect.data.addressObj
      var registration = addressObj.province.provinceName + addressObj.city.cityName + addressObj.area.areaName + addressObj.address.addressName + addressObj.community.communityName
      app.globalData.applicantInfo.registration = addressObj.area.areaCode
      app.globalData.applyRegistrationCode = addressObj.area.areaCode
      this.setData({
        registration: registration,
      })
      app.globalData.applyRegistration = this.data.registration;
      this.areaSelect.hideRegistrationDialog();
    }
    

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.areaSelect=this.selectComponent("#areaSelect");
  },
  openAddress:function(){
    this.areaSelect.showDialog();
  },

  openRegistrationAddress: function () {
    this.areaSelect.showRegistrationDialog();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log(app.globalData)
    if (app.globalData.applicantInfo.sex == "女") {
      this.setData({
        index: 0,
      })
    }
    if (app.globalData.applicantInfo.sex == "男") {
      this.setData({
        index: 1,
      })
    }
    if (app.globalData.applicantInfo.sex == "") {
      app.globalData.applicantInfo.sex = "男"
      this.setData({
        index: 1,
      })
    }

    if (this.data.fill_info_type.indexOf('庇护所') != -1){
      if (app.globalData.address[0].name == '') {
        this.setData({
          region: app.globalData.CurrentLocationAddress
          // residenceDetail: app.globalData.residenceDetail
        })
      }
      if (this.data.residenceDetail == '' && this.data.region == app.globalData.CurrentLocationAddress) {
        console.log('具体地址')
        this.setData({
          residenceDetail: app.globalData.residenceDetail
        })
      }
      this.setData({
        is_shelter: true,
        registration: app.globalData.applyRegistration
        // region: app.globalData.CurrentLocationAddress
      })
      app.globalData.applicantInfo.registration = app.globalData.applyRegistrationCode
    }
    
    this.setData({
      name: app.globalData.applicantInfo.actualName,
      phone: app.globalData.applicantInfo.phone,
      idNum: app.globalData.applicantInfo.idCard,
      // region: app.globalData.address[0].name,
      nationIndex: app.globalData.applicantNationIndex
      // residenceDetail: app.globalData.applicantInfo.residenceDetail,
    })

    if (this.data.fill_info_type.indexOf('人身安全保护令') != -1) {
      console.log(app.globalData.address[0].name)
      if (app.globalData.address[0].name == '') {
        this.setData({
          region: app.globalData.CurrentLocationAddress
        })
      }

      if (this.data.residenceDetail == '' && this.data.region == app.globalData.CurrentLocationAddress) {
        this.setData({
          residenceDetail: app.globalData.residenceDetail
        })
      }
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