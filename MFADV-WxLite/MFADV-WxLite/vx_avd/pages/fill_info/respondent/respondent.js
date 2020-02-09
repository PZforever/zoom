// pages/fill_info/respondent/respondent.js
const util = require('../../../utils/request.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    gender: ['女', '男'],
    nation: [],
    region: "",
    index: 0,
    phone: '',
    id_num: '',
    residenceDetail: ''
  },

  /*
  *选择性别
  */
  genderPickerSelected: function (e) {
    app.globalData.respondengtInfo.sex = this.data.gender[e.detail.value]
    this.setData({
      index: e.detail.value
    });
  },

  /*
  *选择民族
  */
  nationPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    console.log('picker发送选择改变，携带值为', e.detail.value)
    app.globalData.respondentNationIndex = e.detail.value
    app.globalData.respondengtInfo.nation = this.data.Code[e.detail.value]
    this.setData({
      nationIndex: e.detail.value
    });
  },

  /*
  *选择住址省市区
  */
  openAddress: function () {
    this.areaSelect.showDialog();
  },
  // 关闭弹框 
  _cancelEvent: function () {
    this.areaSelect.hideDialog();
  },
  // 确认地址
  _confirmEvent: function () {
    var addressObj = this.areaSelect.data.addressObj
    var _region = addressObj.province.provinceName + " " + addressObj.city.cityName + " " + addressObj.area.areaName + " " + addressObj.address.addressName + " " + addressObj.community.communityName
    var check_region = addressObj.province.provinceName + ' ' + addressObj.city.cityName + ' ' + addressObj.area.areaName
    if (check_region != this.data.region) {
      this.setData({
        residenceDetail: ''
      })
      app.globalData.respondengtInfo.residenceDetail=""
    }
    app.globalData.address[1].name = _region
    this.setData({
      region: _region
    })

    if (addressObj.community.communityCode == '' && addressObj.address.addressCode == '') {
      app.globalData.respondengtInfo.residenceAreaCode = addressObj.area.areaCode;
    } else if (addressObj.address.addressCode != '' && addressObj.community.communityCode == '') {
      app.globalData.respondengtInfo.residenceAreaCode = addressObj.address.addressCode;
    } else {
      app.globalData.respondengtInfo.residenceAreaCode = addressObj.community.communityCode;
    }
    //退回选择法院时
    if (this.data.fill_info_type.indexOf('人身安全保护令') != -1 && app.globalData.courtChooaseIndex == 2) {
      app.globalData.courtChoose = '';
      app.globalData.courtChooaseIndex = 0;
      app.globalData.listStatus[4].checked = false; 
      app.globalData.listStatus[3].checked = false;
    }

    this.areaSelect.hideDialog();
  },

  //获取姓名
  getName: function (e) {
    app.globalData.respondengtInfo.actualName = e.detail.value
    this.setData({
      name: e.detail.value
    })
  },

  //获取手机号
  getPhone: function (e) {
    app.globalData.respondengtInfo.phone = e.detail.value
    this.setData({
      phone: e.detail.value
    })
  },

  //获取身份证号
  getIdCard: function (e) {
    app.globalData.respondengtInfo.idCard = e.detail.value
    this.setData({
      id_num: e.detail.value
    })
  },

  //获取具体地址
  getSpecificAddress: function (e) {
    app.globalData.respondengtInfo.residenceDetail = e.detail.value
    this.setData({
      residenceDetail: e.detail.value
    })
  },

  submit: function () {
    if (!util.checkPhone(this.data.phone) && this.data.phone != "") {
      util.remind("手机号输入有误");
      return false;
    }

    if (!util.checkId(this.data.id_num) && this.data.id_num != "") {
      util.remind("身份证号输入有误");
      return false;
    }

    if (this.data.phone == app.globalData.applicantInfo.phone && this.data.phone != "") {
      util.remind("申请人与被申请人手机号不能重复");
      return false;
    }

    if (this.data.phone == app.globalData.registerInfo.phone && app.globalData.apply_info.applyType == "OTHER") {
      util.remind("被申请人与登记人手机号不能重复");
      return false;
    }

    if (this.data.id_num == app.globalData.applicantInfo.idCard &&　this.data.id_num != "") {
      util.remind("申请人与被申请人身份证号不能重复");
      return false;
    }

    if (this.data.id_num == app.globalData.registerInfo.idCard && app.globalData.apply_info.applyType == "OTHER") {
      util.remind("被申请人与登记人身份证号不能重复");
      return false;
    }

    if (this.data.fill_info_type.indexOf('人身安全保护令') != -1) {
      if (!this.data.name) {
        util.remind("姓名不能为空");
          return false;
      }

      if (!this.data.phone) {
         util.remind("手机号不能为空");
         return false;
      }
      if (!this.data.id_num) {
         util.remind("身份证号不能为空");
         return false;
      }
      if (!this.data.region) {
        util.remind("请选择发生地址");
        return false;
      }
      if (!this.data.residenceDetail) {
        util.remind("具体地址不能为空");
        return false;
      }

      app.globalData.respondengtInfo.residenceDetail = this.data.residenceDetail;
      this.setData({
        residenceDetail: this.data.residenceDetail
      })

     if (this.data.name != null && util.checkPhone(this.data.phone) && util.checkId(this.data.id_num) && this.data.residenceDetail != null) {
        app.globalData.listStatus[2].checked = true
        //保护令需显示的信息
        app.globalData.claimantName= this.data.name,
        app.globalData.claimantGender= this.data.gender[this.data.index],
        app.globalData.claimantNation= this.data.nation[this.data.nationIndex],
        app.globalData.claimantIdCard= this.data.id_num,
        wx.navigateBack({
          delta: 1
        })
      }

    } else {
      app.globalData.listStatus[2].checked = true
      wx.navigateBack({
        delta: 1
      })
    }
  },
 
  success: function(res){
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
    var data = {
      type: "nation"
    }
    util.POST('mobile/common/getDicts', getApp().globalData.loginInfo.token, data, this.success)
    if (app.globalData.respondengtInfo.sex == "女") {
      this.setData({
        index: 0,
      })
    }
    if (app.globalData.respondengtInfo.sex == "男") {
      this.setData({
        index: 1,
      })
    }
    if (app.globalData.respondengtInfo.sex == "") {
      app.globalData.respondengtInfo.sex = "男"
      this.setData({
        index: 1,
      })
    }
    this.setData({
      nationIndex: app.globalData.respondentNationIndex,
      gender: ['女', '男'],
      fill_info_type: options.fill_info_type,
    })

    this.setData({
      name: app.globalData.respondengtInfo.actualName,
      region: app.globalData.address[1].name,
      phone: app.globalData.respondengtInfo.phone,
      id_num: app.globalData.respondengtInfo.idCard,
      residenceDetail: app.globalData.respondengtInfo.residenceDetail,
    })

    if (this.data.fill_info_type.indexOf('人身安全保护令') != -1) {
      if (app.globalData.address[1].name == '') {
        this.setData({
          region: app.globalData.CurrentLocationAddress
        })
      } else {
        this.setData({
          region: app.globalData.address[1].name,
        })
      }

      if (this.data.residenceDetail == '' && this.data.region == app.globalData.CurrentLocationAddress) {
        this.setData({
          residenceDetail: app.globalData.residenceDetail
        })
      }
    }
    
    switch (options.fill_info_type) {
      case '伤情鉴定申请':
        this.setData({
          url: '/pages/injury_identification/description/description?fill_info_type=' + options.fill_info_type,
        });
        break;
      case '心理咨询':
        this.setData({
          url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
        });
        break;
      case '庇护所':
        this.setData({
          url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
        });
        break;
      case '人身安全保护令':
        this.setData({
          url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
        });
        break;
      default:
        this.setData({
          url: '/pages/psychological_counseling/description/description?fill_info_type=' + options.fill_info_type,
        });
        break;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.areaSelect = this.selectComponent("#areaSelect");
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.fill_info_type.indexOf("人身安全保护令") != -1) {
      if (app.globalData.address[1].name == '') {
        app.globalData.address[1].name = app.globalData.CurrentLocationAddress;
      }
    }
    this.setData({
      region: app.globalData.address[1].name,
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
  
})