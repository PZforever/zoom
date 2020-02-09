// pages/psychological_counseling/description/description.js
const util = require('../../../utils/request.js');
const dateTimePicker = require('../../../utils/dateTimePicker.js');
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //日期时间选择器
    date: '2018-10-01',
    time: '12:00',
    dateTimeArray: null,
    dateTime: null,
    startYear: 1900,
    endYear: 2100,
    // 推荐案例
    id: 0,
    region: "",
    address: "",
    textareaShow:true,
    recommendCase: [{ name: '殴打', id: 0, checked: false }, { name: '捆绑', id: 1, checked: false }, { name: '残害', id: 2, checked: false }, { name: '限制人身自由', id: 3, checked: false }, { name: '经常性谩骂', id: 4, checked: false }, { name: '恐吓', id: 5, checked: false }],
    against_type:'暴力手段',
    //保护令
    order:'', 
    self_desc: false,
    selfDesc:'',
    ProtectiveMeasure: [],
    index1:0,
    isOrderType:'',
    inputShow:false,
    inputFocus:false,
    // 事件详情输入的内容
    inputContent:'',
    // 事件详情
    remarks:[],
    courtChoose: ['请选择受理法院','以申请人地址选择受理法院', '以被申请人地址选择受理法院','以事件发生地地址选择受理法院'],
    // 申请事项其他输入的内容
    otherInput:'',
  },
  // 获取申请事项列表
  get_protective_measures: function (res) {
    var ProtectiveMeasure = []
    var Code = []
    var Array = res.data.result.dicts;
    Array[Array.length - 1].name = '其他 （自我描述）';
    var checkboxItems = this.data.checkboxItems
    for (var i = 0, len = Array.length; i < len; ++i) {
      ProtectiveMeasure.push(Array[i]); 
    }
    //显示已选的申请事项
    var itemsNum = app.globalData.Protective;
    for (var j = 0; j < itemsNum.length; j++) {
      var i = itemsNum[j];
      ProtectiveMeasure[i].checked = true
    }
    this.setData({
      ProtectiveMeasure: ProtectiveMeasure,
    });
    console.log(this.data.ProtectiveMeasure)
    var last = this.data.ProtectiveMeasure.length - 1
    if (this.data.ProtectiveMeasure[last].checked) {
      this.setData({
        self_desc: true
      })
    }
  },
  //选择申请事项
  checkboxChange: function (e) {
    var protectiveMeasures = [];
    for (var j = 0; j < e.detail.value.length; j++) {
      var i = e.detail.value[j];
      var protectiveMeasuresItem = {
        code: this.data.ProtectiveMeasure[i].code,
        name: this.data.ProtectiveMeasure[i].name,
        content:''
      }
      protectiveMeasures.push(protectiveMeasuresItem)
    }
    app.globalData.personalSafetyProtectionOrder.protectiveMeasures = protectiveMeasures
    app.globalData.Protective = e.detail.value;
    if (app.globalData.Protective.length>=1){
      app.globalData.hasProtective = true
    } else {
      app.globalData.hasProtective = false
    }
    var last_item = this.data.ProtectiveMeasure.length - 1
    var self_desc = false
    for (var i = 0; i < protectiveMeasures.length; i ++){
      if (protectiveMeasures[i].code == 'PM0999') {
        self_desc = true;
        app.globalData.self_desc ='';
        this.setData({
          selfDesc: ''
        })
      }
    }
    this.setData({
      self_desc: self_desc
    })
  },

  /*
  *选择住址省市区
  */
  openAddress: function () {
    this.areaSelect.showDialog();
    this.setData({
      textareaShow:false
    })
  },
  // 关闭弹框
  _cancelEvent: function () {
    this.areaSelect.hideDialog();
    this.setData({
      textareaShow:true
    })
  },

  // 确认地址
  _confirmEvent: function () {
    var addressObj = this.areaSelect.data.addressObj;
    var _region = addressObj.province.provinceName + " " + addressObj.city.cityName + " " + addressObj.area.areaName + " " + addressObj.address.addressName + " " + addressObj.community.communityName
    var check_region = addressObj.province.provinceName + ' ' + addressObj.city.cityName + ' ' + addressObj.area.areaName
    if (check_region != this.data.region){
      this.setData({
        address: ''
      })
      app.globalData.listStatus[4].checked = false;
      app.globalData.apply_info.address = "";
    }
    this.setData({
      region: _region,
      textareaShow:true
    })
    app.globalData.address[2].name = this.data.region; 
    //退回选择法院时
    if (this.data.fill_info_type.indexOf('人身安全保护令') != -1 && app.globalData.courtChooaseIndex == 3) {
      app.globalData.courtChoose = '';
      app.globalData.courtChooaseIndex = 0;
      this.setData({
        index1:0
      })
    }
    app.globalData.apply_info.areas.code = addressObj.area.areaCode
    this.areaSelect.hideDialog();
  }, 


  /**
  *  选择家暴类型
  */
  FamilyViolenceTypePickerSelected: function (e) {
    if (e.detail.value == 0){
      app.globalData.apply_info.violentType = '';
      app.globalData.violentTypeIndex = 0;
    }else{
      app.globalData.apply_info.violentType = this.data.Code[e.detail.value-1]
      app.globalData.violentTypeIndex = e.detail.value;
    }
    this.setData({
      index: e.detail.value
    });
  },
  
  /**
  *  选择法院
  */
  courtChoosePickerSelected: function (e) {
    var _this=this;
    if(e.detail.value == '1'){
      if (app.globalData.applicantInfo.residenceAreaCode) {      
        // 判断地址是否正确    
        if(app.globalData.applicantInfo.residenceAreaCode.substring(0,2)!='33'){
          util.remind("申请人地址非浙江省，无法选择");
          return false;
        }      
      }else{
        util.remind("请先选择申请人地址");
        return false;
      };
    }else if(e.detail.value == '2'){
        if (app.globalData.respondengtInfo.residenceAreaCode) {
            if(app.globalData.respondengtInfo.residenceAreaCode.substring(0,2)!='33'){
              util.remind("被申请人地址非浙江省，无法选择");
              return false;
            }
        }else{
          util.remind("请先选择被申请人地址");
          return false;    
        };
    }else if(e.detail.value == '3'){
        if (app.globalData.apply_info.areas.code) {
            if (app.globalData.apply_info.areas.code.substring(0,2)!='33') {
              util.remind("事件发生地址非浙江省，无法选择");
              return false;
            }
        }else{
          util.remind("请先选择发生地址");
          return false;
        };
    }else if(e.detail.value == '0'){
      app.globalData.courtChooaseIndex=0;
      app.globalData.courtChoose='';
    }
    app.globalData.courtChooaseIndex = e.detail.value;
    _this.setData({
      index1: e.detail.value
    });
    if(this.data.index1 == '1'){
      app.globalData.courtChoose = app.globalData.applicantInfo.residenceAreaCode
    } else if (_this.data.index1 == '2'){
      app.globalData.courtChoose = app.globalData.respondengtInfo.residenceAreaCode
    }else{
      app.globalData.courtChoose = app.globalData.apply_info.areas.code
    }
  },


  /**
   * 侵害手段选择
   */
  // choseTxtColor: function (e) {
  //   var that = this
  //   var applyExpect = ''
  //   var index = e.currentTarget.dataset.id;  //获取自定义的ID值
  //   var checked = !e.currentTarget.dataset.checked;
  //   var remarks_value = this.data.remarks_writed
  //   var expect_value = ''
  //   var _recommendCases = that.data.recommendCase
  //   _recommendCases[index].checked = checked
  //   for (var i = 0; i < _recommendCases.length; i++) {
  //     if (_recommendCases[i].checked == true) {
  //       applyExpect += _recommendCases[i].name + '|'
  //       expect_value += ',' + _recommendCases[i].name  
  //     }
  //   }
  //   remarks_value = remarks_value + expect_value
  //   if (remarks_value.substr(0, 1) == ','){
  //     remarks_value = remarks_value.substr(1)
  //   }
  //   app.globalData.apply_info.remarks = remarks_value
  //   app.globalData.apply_info.applyExpect = applyExpect
  //   that.setData({
  //     recommendCase: _recommendCases,
  //     remarks: remarks_value
  //   })
  // },
  /**
   * 侵害手段选择
   */
  choseTxtColor:function(e){
    var _this=this;
    this.data.recommendCase.forEach(function(item,index){
      // 判断点击点
      if(e.currentTarget.id==item.id){
        if (item.checked) {
          item.checked=false;
          _this.data.remarks.splice(_this.data.remarks.indexOf(item),1);
        }else{
          item.checked=true;
          _this.data.remarks.push(item);
        }
      }
    })

    for (var j = 0; j < this.data.remarks.length; j++) {
      this.data.remarks[j].index = j
    }

    this.setData({
      remarks:this.data.remarks,
      recommendCase:this.data.recommendCase
    })
    
    app.globalData.remarks=this.data.remarks;
    this.setRemarks();
  },
  success: function (res) {
    var FamilyViolenceType = ['请选择']
    var Code = []
    var Array = res.data.result.dicts
    for (var i = 0, len = Array.length; i < len; ++i) {
      FamilyViolenceType.push(Array[i].name)
      Code.push(Array[i].code)
    }
    this.setData({
      FamilyViolenceType: FamilyViolenceType,
      Code: Code 
    })
  },

  //获取
  // getRemarks: function (e) {
  //   app.globalData.apply_info.remarks = e.detail.value
  //   app.globalData.remarks_writed = e.detail.value
  //   this.setData({
  //     remarks: e.detail.value,
  //     remarks_writed: e.detail.value
  //   })
  // },

  getAddress: function (e) {
    app.globalData.apply_info.address = e.detail.value
    this.setData({
      address: e.detail.value
    })
  },

  getSlefDesc: function (e) {
    app.globalData.personalSafetyProtectionOrder.protectiveMeasures.forEach(function(item){
      if (item.code =='PM0999'){
        item.content = e.detail.value;
      }
    })
    app.globalData.selfDesc = e.detail.value
    this.setData({
      selfDesc: e.detail.value
    })
  },

  submit: function () {
    if (this.data.fill_info_type.indexOf("人身安全保护令") != -1 && app.globalData.apply_info.violentType == '') {
      util.remind("请选择事件类型");
      return false;
    }

    if (this.data.fill_info_type.indexOf("人身安全保护令") != -1){
      if (this.data.remarks.length==0 && this.data.inputContent=='') {
        util.remind("事件描述不能为空");
        return false;
      }
    
    // if (!this.data.remarks) {
    //   util.remind("申请人诉求不能为空");
    //   return false;
    // }

      if (!this.data.region) {
        util.remind("请选择发生地址");
        return false;
      }

      if (!this.data.address) {
        util.remind("详细地址不能为空");
        return false;
      }

      if (!app.globalData.hasProtective) {
        util.remind("请选择申请事项");
        return false;
      }
      // if (this.data.self_desc == true && this.data.selfDesc == ''){
      //   util.remind("请描述要申请的内容");
      //   return false;
      // }

      if (this.data.index1 == 0) {
        util.remind("请选择受理法院");
        return false;
      }
    }

    app.globalData.apply_info.address = this.data.address;
    this.setData({
      address: this.data.address
    })

    if (this.data.fill_info_type != "庇护所" && this.data.fill_info_type != "庇护所,心理咨询" && this.data.fill_info_type != "心理咨询,庇护所") {
      if (app.globalData.apply_info.remarks != null && this.data.region != null && this.data.address != null) {
        app.globalData.listStatus[3].checked = true
        wx.navigateBack({
          delta: 1
        })
      }
    } else {
      app.globalData.listStatus[3].checked = true
      wx.navigateBack({
        delta: 1
      })
    }
  },
  // 添加自定义组件
  changeDate(e) {
    this.setData({ date: e.detail.value });
  },
  changeTime(e) {
    this.setData({ time: e.detail.value });
  },
  changeDateTime(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    this.setData({ dateTime: e.detail.value });
    app.globalData.happen_time = dateArr[0][arr[0]] + "年" + dateArr[1][arr[1]] + "月" + dateArr[2][arr[2]] + "日" + dateArr[3][arr[3]] + "时"
    app.globalData.apply_info.violentDate = dateArr[0][arr[0]] + "年" + dateArr[1][arr[1]] + "月" + dateArr[2][arr[2]] + "日" + dateArr[3][arr[3]] + "时"
  },
  changeDateTimeColumn(e) {
    var arr = this.data.dateTime, dateArr = this.data.dateTimeArray;
    var today = new Date()
    var lastMonth = today.getMonth() + 1

    arr[e.detail.column] = e.detail.value;
    if (dateArr[0][arr[0]] < today.getFullYear()) {
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      dateArr[1] = dateTimePicker.getLoopArray(1, 12);
      dateArr[3] = dateTimePicker.getLoopArray(0, 23);
    }

    if (dateArr[0][arr[0]] == today.getFullYear()) {
      dateArr[1] = dateTimePicker.getLoopArray(1, lastMonth);
      dateArr[2] = dateTimePicker.getLoopArray(1, today.getDate());
      dateArr[3] = dateTimePicker.getLoopArray(0, today.getHours());
    }
    
    if (dateArr[1][arr[1]] < lastMonth) {
      dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
      dateArr[3] = dateTimePicker.getLoopArray(0, 23);
    }

    if (dateArr[0][arr[0]] == today.getFullYear() && dateArr[1][arr[1]] == lastMonth) {
      dateArr[2] = dateTimePicker.getLoopArray(1, today.getDate());
      dateArr[3] = dateTimePicker.getLoopArray(0, today.getHours());
    }

    if (dateArr[2][arr[2]] < today.getDate()) {
      dateArr[3] = dateTimePicker.getLoopArray(0, 23);
    }

    if (dateArr[0][arr[0]] == today.getFullYear() && dateArr[1][arr[1]] == lastMonth && dateArr[2][arr[2]] == today.getDate()) {
      dateArr[3] = dateTimePicker.getLoopArray(0, today.getHours());
    }
    
    this.setData({
      dateTimeArray: dateArr,
    });
    app.globalData.dateTime = arr
    app.globalData.dateTimeArray = dateArr
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePickerToToday(this.data.startYear);
    // 精确到小时的处理，将数组的分和秒去掉
    var lastArray = obj.dateTimeArray.pop();
    var lastTime = obj.dateTime.pop();
    var lastArray1 = obj.dateTimeArray.pop();
    var lastTime1 = obj.dateTime.pop();
    if (app.globalData.dateTimeArray == ''){
      app.globalData.dateTimeArray = obj.dateTimeArray
    }
    this.setData({
      dateTime: app.globalData.dateTime,
      dateTimeArray: app.globalData.dateTimeArray,
      fill_info_type: options.fill_info_type
    });
    var data = {
      type: 'violent_type'
    }
    var protective_measure_data = {
      type: 'protective_measure'
    }
    util.POST('mobile/common/getDicts', getApp().globalData.loginInfo.token, protective_measure_data, this.get_protective_measures);
    util.POST('mobile/common/getDicts', getApp().globalData.loginInfo.token, data, this.success);

    this.setData({
      index: app.globalData.violentTypeIndex,
      index1: app.globalData.courtChooaseIndex,
      order: app.globalData.order,
      remarks: app.globalData.remarks,
      inputContent: app.globalData.inputContent,
      region: app.globalData.address[2].name,
      address: app.globalData.apply_info.address,
      selfDesc: app.globalData.selfDesc
    })
    
    if (this.data.fill_info_type.indexOf('人身安全保护令') != -1) {
      if (app.globalData.address[2].name == '') {
        app.globalData.apply_info.areas = { code: app.globalData.areasCode }
        this.setData({
          region: app.globalData.CurrentLocationAddress
        })
      }

      if (this.data.address == '' && this.data.region == app.globalData.CurrentLocationAddress) {
        this.setData({
          address: app.globalData.residenceDetail
        })
      }
      // 重置渲染的列表
      var _this=this;
      for (var i=0; i <app.globalData.remarks.length; i++) {
        for (var j = 0; j < this.data.recommendCase.length; j++) {
          if (app.globalData.remarks[i].id==this.data.recommendCase[j].id) {
            this.data.recommendCase[j].checked=app.globalData.remarks[i].checked;
          }
        }
      }
      this.setData({
        recommendCase:this.data.recommendCase
      })
    }
    //默认选择申请人地址受理法院
    // app.globalData.courtChoose = app.globalData.applicantInfo.residenceAreaCode

    switch (options.fill_info_type) {
      // case '伤情鉴定申请':
      //   this.setData({
      //     url: '/pages/injury_identification/description/description',
      //   });
      //   break;
      case '心理咨询':
        this.setData({
          url: '/pages/psychological_counseling/appointment/appointment?fill_info_type=' + options.fill_info_type,
        });
        break;
      case '庇护所':
        this.setData({
          url: '/pages/shelter/shelterList/shelterList?fill_info_type=' + options.fill_info_type,
        });
        break;
      case '人身安全保护令':
        this.setData({
          url: '/pages/protectionOrder/order/order?fill_info_type=' + options.fill_info_type,
        });
        break;
    }
  },
  setHide:function(){
    this.setData({
      inputShow:false,
      inputFocus:false
    })
  },
  setInput:function(event){
    app.globalData.inputContent=event.detail.value;
    this.setData({
     inputContent:event.detail.value
    })
    this.setRemarks();
  },
  setShow:function(){
    this.setData({
      inputShow:true,
      inputFocus:true,
      inputContent:this.data.inputContent
    })
  },
  // 更新数据
  setRemarks:function(){
    var str="";
    app.globalData.apply_info.remarks="";
    this.data.remarks.forEach(function(item){
      str+=item.name+","
    })
    var remarks_str = str + this.data.inputContent;
    if (remarks_str.charAt(remarks_str.length - 1) == ',') {
      app.globalData.apply_info.remarks = remarks_str.substring(0, remarks_str.length - 1)
    } else {
      app.globalData.apply_info.remarks = remarks_str
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