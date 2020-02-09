// pages/completeData/description/description.js
const util = require('../../../utils/request.js');
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */ 
  data: {
    caseId:'',
    expect_purpose:[],
    expect_purpose2:[],
    violent_type:['请选择'],
    violent_type2:[],
    violent_reason:[],
    mentality_shou:[], 
    mentality_shou2:[],
    mentality_shi: [],
    mentality_shi2: [],
    violent_attitude:[],
    violent_attitude2:[],
    violentReasons:[],
    violentReasons2:[],
    // 弹框内容
    codes: [],
    remarks:'',
    appeal:'',
    desiredPurpose:'',
    isDisabled:'',
    isPregnancy:'',
    violentTime:'',
    violentType:'',
    reasons:[],
    isHurt:'',
    isTestHurt:'',
    injuryIdentifyPlace:'',
    isAlarmed:'',
    alarmNumber:'',
    violentNumber:'',
    victimMentalStatus:'',
    violentMentalStatus:'',
    violentAttitude:'',
    disability: ['否','是'],
    pregnant: ['否','是'],
    advTime:['白天','晚上'],
    whetherInjured: ['否','是'],
    whetherInjury: ['否','是'],
    whetherCall: ['否','是'],
    nowDate: app.globalData.nowDate,
    alarmTime: '',
    firstViolentTime: '',
    index1: '0',
    index2: '0',
    index3: '0',
    index4: '0',
    index5: '0',
    index6: '0',
    index7: '0',
    index8: '0',
    index9: '0',
    index10: '0',
    index11: '0',
    // 自定义弹框
    animationData: {},
    textareaShow: true,
    posShow:false,
    whetherAlarm:'',
    whetherInjuryIdentify:'',
    recommendCase: [{ name: '殴打', id: 0, checked: false }, { name: '捆绑', id: 1, checked: false }, { name: '残害', id: 2, checked: false }, { name: '限制人身自由', id: 3, checked: false }, { name: '经常性谩骂', id: 4, checked: false }, { name: '恐吓', id: 5, checked: false }],
    against_type: '暴力手段',
  },

  /*
  *选择住址省市区
  */
  openAddress: function () {
    this.setData({
      textareaShow: false
    })
    this.areaSelect.showDialog();
  },
  // 关闭弹框
  _cancelEvent: function () {
    this.areaSelect.hideDialog();
    this.setData({
      textareaShow: true
    })
  },

  // 确认地址
  _confirmEvent: function () {
    var addressObj = this.areaSelect.data.addressObj;
    var _region = addressObj.province.provinceName  + addressObj.city.cityName + addressObj.area.areaName + addressObj.address.addressName + addressObj.community.communityName
    var check_region = addressObj.province.provinceName + ' ' + addressObj.city.cityName + ' ' + addressObj.area.areaName
    if (check_region != this.data.region && this.data.address == app.globalData.residenceDetail) {
      this.setData({
        address: ''
      })
    }
    this.setData({
      areas_code: addressObj.area.areaCode,
      region: _region,
      address:'',
      textareaShow: true
    })
    this.areaSelect.hideDialog();
  }, 

  /**
   * 侵害手段选择
   */
  choseTxtColor: function (e) {
    var that = this
    var applyExpect = ''
    var index = e.currentTarget.dataset.id;  //获取自定义的ID值
    var checked = !e.currentTarget.dataset.checked;
    var remarks_value = this.data.remarks_writed
    var expect_value = ''
    var _recommendCases = that.data.recommendCase
    _recommendCases[index].checked = checked
    for (var i = 0; i < _recommendCases.length; i++) {
      if (_recommendCases[i].checked == true) {
        applyExpect += _recommendCases[i].name + '|'
        expect_value += ',' + _recommendCases[i].name
      }
    }
    remarks_value = expect_value
    if (remarks_value.substr(0, 1) == ',') {
      remarks_value = remarks_value.substr(1)
    }

    that.setData({
      recommendCase: _recommendCases,
      remarks: remarks_value
    })
  },

  getAddress: function (e) {
    this.setData({
      address: e.detail.value
    })
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
    util.POST('mobile/violentCase/getViolentCase', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId
    }, function (res) { 
      // 判断交互是否正常
      console.log(res.data);
      if (res.data.code == '200') {
        /*获取表单数据*/
        if (res.data.result.firstViolentTime != null){
          _this.setData({
            firstViolentTime: res.data.result.firstViolentTime,
          })
        };
        if (res.data.result.alarmTime != null) {
          _this.setData({
            alarmTime: res.data.result.alarmTime,
          })
        };
        if (res.data.result.areas == ''){
          _this.setData({
            areas_code: '',
            region: app.globalData.CurrentLocationAddress,
          })
        }else{
          _this.setData({
            areas_code: res.data.result.areas.code,
            region: res.data.result.areas.lname,
          })
        }
        _this.setData({
          personId: res.data.result.id,
          remarks: res.data.result.remarks,
          appeal: res.data.result.appeal,
          desiredPurpose: res.data.result.desiredPurpose,
          isDisabled: res.data.result.isDisabled,
          isPregnancy: res.data.result.isPregnancy,
          violentTime: res.data.result.violentTime,
          isHurt: res.data.result.isHurt,
          isTestHurt: res.data.result.isTestHurt,
          isAlarmed: res.data.result.isAlarmed,
          violentType: res.data.result.violentType,
          violentReasons: res.data.result.violentReasons,
          injuryIdentifyPlace: res.data.result.injuryIdentifyPlace,
          alarmNumber: res.data.result.alarmNumber,
          violentNumber: res.data.result.violentNumber,
          victimMentalStatus: res.data.result.victimMentalStatus,
          violentMentalStatus: res.data.result.violentMentalStatus,
          violentAttitude: res.data.result.violentAttitude,
          address: res.data.result.address,
        })
        /*调用列表*/
        _this.getExpectPurpose();
        _this.getViolentType();
        _this.getVictimMentalStatus();
        _this.getViolentMentalStatus();
        _this.getViolentAttitude();

        _this.isDisabled();
        _this.isPregnancy();
        _this.violentTime();
        _this.isHurt();
        _this.isTestHurt();
        _this.isAlarmed();

        _this.getViolentReason();
        _this.nowDate();
      }
      else {
        wx.showToast({
          title: res.data.message,
        })
      }
    });
  },
/*
*现在时间
*/
nowDate:function(){
  var _this=this;
  var date=new Date();
  var year=date.getFullYear();
  var month=date.getMonth() + 1;
  month = month >= 10 ? month : '0' + month;
  var day=date.getDate();
  day = day >= 10 ? day : '0' + day;
  var nowDate = year + '-' + month + '-' + day;
  _this.setData({
    alarmTime: nowDate,
    firstViolentTime: nowDate,
  })
},
/*
*提交表单
*/
formSubmit: function (e) {
  var _this = this;
  if (e.detail.value.violentNumber != '' && e.detail.value.violentNumber<=0) {
    util.remind('施暴次数应大于0');
    return false;
  };
  
  if (e.detail.value.alarmNumber != '' && e.detail.value.alarmNumber<=0) {
    util.remind('报警次数应大于0');
    return false;
  };

  if (_this.data.areas_code == '') {
    var areas = null
  } else {
    var areas = {
      "code": _this.data.areas_code
    }
  }

  util.POST('mobile/violentCase/updateViolentCase', app.globalData.loginInfo.token, {
    "id": _this.data.personId,
    "remarks": e.detail.value.remarks,
    "appeal": e.detail.value.appeal,
    "alarmNumber": e.detail.value.alarmNumber,
    "desiredPurpose": _this.data.expect_purpose2[_this.data.index1].code,
    "isDisabled": _this.data.index2,
    "isPregnancy": _this.data.index3,
    "violentTime": _this.data.advTime[_this.data.index4],
    "isHurt": _this.data.index9,
    "isTestHurt": _this.data.index10,
    "isAlarmed": _this.data.index11,
    "injuryIdentifyPlace": e.detail.value.injuryIdentifyPlace,
    "violentType": _this.data.violentType,
    "victimMentalStatus": _this.data.mentality_shou2[_this.data.index6].code,
    "violentMentalStatus": _this.data.mentality_shi2[_this.data.index7].code,
    "violentAttitude": _this.data.violent_attitude2[_this.data.index8].code,
    "violentNumber": e.detail.value.violentNumber,
    "violentReasons": _this.data.violentReasons,
    "alarmTime": _this.data.alarmTime,
    "firstViolentTime": _this.data.firstViolentTime,
    "areas": areas,
    "address": _this.data.address,
  }, function (res) {
    // 判断交互是否正常
    console.log(res.data);
    if (res.data.code == '200') {
      /*返回列表页面 */
      wx.showToast({
        title: res.data.message,
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
* 家暴原因列表
*/
getViolentReason: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'violent_reason'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      /*共同生活成员列表 */
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        res.data.result.dicts[i].isChecked = false;
      };
      _this.setData({
        violent_reason: res.data.result.dicts
      })
    }
    else {
      wx.showToast({
        title: res.data.message,
      })
    }
  });
},
/**
 * 选择施暴原因
 */
chooseReason: function (e) {
  const _this = this;
  var param = e.currentTarget.dataset.param;
  var code;
  var name;
  if (_this.data.violent_reason[param].isChecked == false) {
    _this.data.violent_reason[param].isChecked = true;
  } else {
    _this.data.violent_reason[param].isChecked = false;
  }
  _this.setData({
    violent_reason: _this.data.violent_reason,
  });
},
//弹框选择成员确认
confirmReason: function () {
  const _this = this;
  _this.setData({
    violentReasons: [],
    violentReasons2:[],
  });
  for (var i = 0; i < _this.data.violent_reason.length; i++) {
    if (_this.data.violent_reason[i].isChecked == true){
      _this.data.violentReasons2.push({ code: _this.data.violent_reason[i].code, name: _this.data.violent_reason[i].name });
    }
  };
  _this.setData({
    violentReasons2: _this.data.violentReasons2,
  });
  if (_this.data.violentReasons == '') {
    _this.setData({
      violentReasons: _this.data.violentReasons2
    });
  }
  // console.log(_this.data.violentReasons)
  _this.hideModal();
},
//弹框选择成员取消
cancelReason: function () {
  const _this = this;
  _this.setData({
    violentReasons: _this.data.violentReasons
  });
  _this.hideModal();
},

/*
* 判断是否残疾
*/
isDisabled: function () {
  var _this = this;
  if (_this.data.isDisabled) {
    _this.setData({
      index2: 1
    })
  } else {
    _this.setData({
      index2: 0
    })
  }
},
/*
*设置是否残疾
*/
disabilityPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面

  this.setData({
    index2: e.detail.value
  });
},

/*
* 判断是否怀孕
*/
isPregnancy: function () {
  var _this = this;
  if (_this.data.isPregnancy) {
    _this.setData({
      index3: 1
    })
  } else {
    _this.setData({
      index3: 0
    })
  }
},
/*
*设置是否怀孕
*/
pregnantPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index3: e.detail.value
  });
},

/*
* 判断暴力发生时间
*/
violentTime: function () {
  var _this = this;
  if (_this.data.violentTime == "白天") {
    _this.setData({
      index4: 0
    })
  } else {
    _this.setData({
      index4: 1
    })
  }
},
/*
*设置暴力发生时间
*/
advTimePickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index4: e.detail.value
  });
},
/*
* 判断是否受伤
*/
isHurt: function () {
  var _this = this;
  if (_this.data.isHurt) {
    _this.setData({
      index9:"1"
    })
  } else {
    _this.setData({
      index9:"0"
    })
  }
},
/*
*是否受伤
*/
whetherInjuredPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index9: e.detail.value
  });
},

/*
* 判断是否验伤
*/
isTestHurt: function () {
  var _this = this;
  if (_this.data.isTestHurt) {
    _this.setData({
      index10:1,
      whetherInjuryIdentify:true,
    })
  } else {
    _this.setData({
      index10:0,
      whetherInjuryIdentify: false,
    })
  }
},
/*
*是否验伤
*/
whetherInjuryPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index10: e.detail.value
  });
  if (e.detail.value == 1) {
    this.setData({
      whetherInjuryIdentify: true,
    });
  } else {
    this.setData({
      whetherInjuryIdentify: false,
      injuryIdentifyPlace: '',
    });
  }

},

/*
* 判断是否报警
*/
isAlarmed: function () {
  var _this = this;
  if (_this.data.isAlarmed) {
    _this.setData({
      index11:"1",
      whetherAlarm:true,
    })
  } else {
    _this.setData({
      index11:"0",
      whetherAlarm: false,
    })
  }
},

/*
*是否报警
*/
whetherCallPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index11: e.detail.value
  });
  if (e.detail.value == 1){
    this.setData({
      whetherAlarm:true,
    });
  }else{
    this.setData({
      whetherAlarm: false
      // alarmTime:'',
    });
  }
},

/*
* 期望目的列表
*/
getExpectPurpose: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'expect_purpose'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      /*共同生活成员列表 */
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        _this.setData({
          expect_purpose: _this.data.expect_purpose.concat(res.data.result.dicts[i].name),
          expect_purpose2: _this.data.expect_purpose2.concat(res.data.result.dicts[i])
        })
      };
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        if (res.data.result.dicts[i].code == _this.data.desiredPurpose) {
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
*受害人期望目的
*/
aimPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index1: e.detail.value
  });
},

/*
* 暴力类型列表
*/
getViolentType: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'violent_type'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      /*共同生活成员列表 */
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        _this.setData({
          violent_type: _this.data.violent_type.concat(res.data.result.dicts[i].name),
          violent_type2: _this.data.violent_type2.concat(res.data.result.dicts[i])
        })
      };
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        if (res.data.result.dicts[i].code == _this.data.violentType) {
          _this.setData({
            index5: i + 1
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
*暴力类型
*/
advTypePickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  var _this=this;
  if (e.detail.value == 0){
    _this.setData({
      violentType:'',
      index5: e.detail.value
    })
  }else{
    _this.setData({
      violentType: _this.data.violent_type2[e.detail.value - 1].code,
      index5: e.detail.value
    })
  }
},
/*
* 受害人当前心理状态列表
*/
getVictimMentalStatus: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'mentality'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      /*共同生活成员列表 */
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        _this.setData({
          mentality_shou: _this.data.mentality_shou.concat(res.data.result.dicts[i].name),
          mentality_shou2: _this.data.mentality_shou2.concat(res.data.result.dicts[i])
        })
      };
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        if (res.data.result.dicts[i].code == _this.data.victimMentalStatus) {
          _this.setData({
            index6: i
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
*受害人当前心理状态
*/
victimStatePickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index6: e.detail.value
  });
},
/*
* 施暴人当前心理状态列表
*/
getViolentMentalStatus: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'mentality'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        _this.setData({
          mentality_shi: _this.data.mentality_shi.concat(res.data.result.dicts[i].name),
          mentality_shi2: _this.data.mentality_shi2.concat(res.data.result.dicts[i])
        })
      };
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        if (res.data.result.dicts[i].code == _this.data.violentMentalStatus) {
          _this.setData({
            index7: i
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
*施暴人当前心理状态
*/
perpetratorStatePickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index7: e.detail.value
  });
},

/*
* 施暴人对家暴态度列表
*/
getViolentAttitude: function () {
  var _this = this;
  util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
    "type": 'violent_attitude'
  }, function (res) {
    // 判断交互是否正常
    if (res.data.code == '200') {
      /*共同生活成员列表 */
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        _this.setData({
          violent_attitude: _this.data.violent_attitude.concat(res.data.result.dicts[i].name),
          violent_attitude2: _this.data.violent_attitude2.concat(res.data.result.dicts[i])
        })
      };
      for (var i = 0; i < res.data.result.dicts.length; i++) {
        if (res.data.result.dicts[i].code == _this.data.violentAttitude) {
          _this.setData({
            index8: i
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
*施暴人对家暴态度
*/
perpetratorAdvPickerSelected: function (e) {
  //改变index值，通过setData()方法重绘界面
  this.setData({
    index8: e.detail.value
  });
},

/*
*报警时间
*/
  
  bindDateChange: function (e) {
    var _this=this;
    _this.setData({
      alarmTime: e.detail.value
    });
  },

/*
*首次家暴时间
*/
  
  bindDateChange2: function (e) {
    this.setData({
      firstViolentTime: e.detail.value
    });
  },

/*
*自定义弹框
*/
  showModal: function () {
    this.setData({
      textareaShow: false,
      posShow:true,
    });
    // 显示遮罩层
    for (var i = 0; i < this.data.violent_reason.length; i++) {
      this.data.violent_reason[i].isChecked = false;
    };
    for (var i = 0; i < this.data.violent_reason.length; i++) {
      for (var j = 0; j < this.data.violentReasons.length; j++){
        if (this.data.violentReasons[j].name == this.data.violent_reason[i].name){
          this.data.violent_reason[i].isChecked = true;
        }
      }
    };
    this.setData({
      violent_reason: this.data.violent_reason,
    });

    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  
  hideModal: function () {
    this.setData({
      textareaShow: true,
      posShow:false
    })
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
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
    //  this.getMessage();
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