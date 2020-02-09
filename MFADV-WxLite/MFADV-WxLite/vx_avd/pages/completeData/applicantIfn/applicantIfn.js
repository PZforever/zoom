// pages/completeData/applicantIfn/applicantIfn.js
const util = require('../../../utils/request.js');
var app = getApp();
Page({
  /**  
   * 页面的初始数据
   */
  data: { 
    nationList: [],
    nationList2: [],
    live_members:[], 
    liveMembers: [],
    liveMembers2: [],
    liveMembers3: [],
    occupation_type: [],
    occupation_type2: [],
    occupation: '', 
    educational_level: [],
    educational_level2: [],
    education: '',
    income_list: [],
    income_list2: [],  
    income: '',
    marital_status: [],
    marital_status2: [],
    maritalStatus: '',
    caseId:'',
    name: '', 
    age:'',
    gender: ['男','女'],
    sex:'',
    phone: '',
    idCard: '',
    residenceAreaCode: '',
    fullName:'',
    provinceName: '',
    cityName: '',
    areaName: '',
    addressName: '',
    communityName: '',
    residenceDetail:'',
    relationToRespondent:'',
    relationList: [],
    relationList2: [], 
    emergencyPhone:'',
    marriageAge: '',
    hasChildrenList: ['否', '是'],
    hasChildren: '',
    index:'0',
    index1:'0',
    index2:'0',
    index3:'0',
    index4:'0',
    index5:'0',
    index6:'0',
    index7:'0',
    index14:'0',
    getArea:false,
    hasMarriage:true,
    respondentPhone:'',
    respondentIdCard:'',
    // 自定义弹框
    animationData: {},
    checkedNone:false,
  }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      caseId: options.caseId
    });
    this.getMessage();  
  },
  getMessage: function () {
    var _this = this;
    util.POST('mobile/violentCase/getLitigant', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId,
      "type": "A"
    }, function (res) {
      // 判断交互是否正常
      console.log(res.data);
      // 调用列表
      _this.getNation();
      _this.getLiveMembers();
      _this.getOccupationType();
      _this.getEducationalLevel();
      _this.getIncomeList();
      _this.getMaritalStatus();
      _this.hasChildren();
      _this.getRelation();
      _this.getSex();
      _this.getMessage2(); 
      
      if (res.data.code == '200') {
        /*请求表单数据 */
        _this.setData({
          actualName: res.data.result.actualName,
          age: res.data.result.age,
          nation: res.data.result.nation,
          sex: res.data.result.sex,
          phone: res.data.result.phone,
          idCard: res.data.result.idCard,
          residenceDetail: res.data.result.residenceDetail, 
          relationToRespondent: res.data.result.relationToRespondent,
          emergencyPhone: res.data.result.emergencyPhone,
          marriageAge: res.data.result.marriageAge,
          occupation: res.data.result.occupation,
          education: res.data.result.education,
          income: res.data.result.income,
          maritalStatus: res.data.result.maritalStatus,
          residenceAreaName: res.data.result.residenceAreaName,//地址
          residenceAreaCode: res.data.result.residenceAreaCode,
          registration: res.data.result.registration,
          personId: res.data.result.id,
          liveMembers: res.data.result.liveMembers,
          hasChildren: res.data.result.hasChildren
        });

        //首次填写地址信息，自动默认用户当前定位地址供用户进行修改
        if (_this.data.residenceAreaName == '') {
          _this.setData({
            residenceAreaName: app.globalData.residenceAreaName,
          })
        }
        // if (_this.data.residenceDetail == '') {
        //   _this.setData({
        //     residenceDetail: app.globalData.residenceDetail,
        //   })
        // }

      }
      else {
        wx.showToast({
          title: res.data.message,
        })
      }
    });
  },
  //被申请人信息
  getMessage2: function () {
    var _this = this;
    util.POST('mobile/violentCase/getLitigant', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId,
      "type": "R"
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        _this.setData({
          respondentPhone: res.data.result.phone,
          respondentIdCard: res.data.result.idCard,
        })

      }else {
      }
      });
  },
  /*
  *提交表单
  */
  formSubmit: function (e) {
    var _this = this;
    var iptPhone = util.checkPhone(e.detail.value.phone);
    var iptPhone2 = util.checkPhone(e.detail.value.emergencyPhone);
    var iptIdCard = util.checkId(e.detail.value.idCard);

    if (!iptPhone && e.detail.value.phone != '') {
      util.remind('手机号输入有误');
      return false;
    };
    if (!iptPhone2 && e.detail.value.emergencyPhone != ''){
      util.remind('紧急联系人手机号输入有误');
      return false;
    }; 
    if (!iptIdCard && e.detail.value.idCard != '') {
      util.remind('身份证号输入有误'); 
      return false;
    };

    if (e.detail.value.phone == _this.data.respondentPhone) {
      util.remind("申请人手机号与被申请人手机号不能相同");
      return false;
    };
    
    if (e.detail.value.idCard == _this.data.respondentIdCard){
      util.remind("申请人手机号与被申请人身份证号不能相同");
      return false;
    };

    util.POST('mobile/violentCase/updateLitigant', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId,
      "litigant": {
        "id": _this.data.personId,
        "actualName": e.detail.value.actualName,
        'age': e.detail.value.age,
        'nation': _this.data.nationList2[_this.data.index7].code,
        'sex': _this.data.gender[_this.data.index6],
        'phone': e.detail.value.phone,
        'idCard': e.detail.value.idCard,
        'residenceDetail': e.detail.value.residenceDetail,
        'relationToRespondent': _this.data.relationList2[_this.data.index14].code,
        'emergencyPhone': e.detail.value.emergencyPhone,
        'marriageAge': e.detail.value.marriageAge,
        'residenceAreaCode': _this.data.residenceAreaCode,
        'registration': _this.data.registration,
        "occupation": _this.data.occupation_type2[_this.data.index2].code,
        "education": _this.data.educational_level2[_this.data.index3].code,
        "income": _this.data.income_list2[_this.data.index4].code,
        "maritalStatus": _this.data.marital_status2[_this.data.index5].code,
        "hasChildren": _this.data.index,
        "liveMembers": _this.data.liveMembers
      }
    }, function (res) { 
      // 判断交互是否正常
      console.log(res.data)
      if (res.data.code == '200') {
        _this.setData({
          getArea:false
        })
        /*返回列表页面 */
        wx.showToast({
          title: res.data.message,
          complete:function(){
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
  民族请求 
  */
  getNation: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": "nation"
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        /*民族列表 */
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            nationList: _this.data.nationList.concat(res.data.result.dicts[i].name),
            nationList2: _this.data.nationList2.concat(res.data.result.dicts[i]),
          });
          if (res.data.result.dicts[i].code == _this.data.nation) {
            _this.setData({
              index7: i
            })
          };
        };
      }else {
        wx.showToast({
          title: res.data.message,
        })
      }
    });
  },
  /*
  *选择民族
  */
  nationPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index7: e.detail.value
    });
  },
  /* 
  *关系列表请求 
  */
  getRelation: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": "relation"
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        /*关系列表 */
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            relationList: _this.data.relationList.concat(res.data.result.dicts[i].name),
            relationList2: _this.data.relationList2.concat(res.data.result.dicts[i]),
          });
          if (res.data.result.dicts[i].code == _this.data.relationToRespondent) {
            _this.setData({
              index14: i
            })
          };
        };
      } else {
        wx.showToast({
          title: res.data.message,
        })
      }
    });
  },
  /*
  *选择关系
  */
  relationPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index14: e.detail.value
    });
  },
  /*
  * 共同生活成员列表
  */
  getLiveMembers: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'live_members'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        /*共同生活成员列表 */
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          res.data.result.dicts[i].isChecked = false;
        };
        res.data.result.dicts[res.data.result.dicts.length - 1].name = '其他';
        _this.setData({
          live_members: res.data.result.dicts
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
   * 选择共同生活成员
   */
  chooseMember: function (e) {
    const _this = this;
    var param = e.currentTarget.dataset.param;
    // var code;
    // var name;
    if (_this.data.live_members[param].isChecked == false) {
      if (_this.data.live_members[param].name == '无') {
        for (var i = 0; i < _this.data.live_members.length; i++) {
          _this.data.live_members[i].isChecked = false;
        };
        _this.data.live_members[param].isChecked = true;
        _this.setData({
          checkedNone: true,
        });

      } else if (!_this.data.checkedNone) {
        _this.data.live_members[param].isChecked = true;
      };

    } else {
      if (_this.data.live_members[param].name == '无') {
        _this.setData({
          checkedNone: false,
        });
        _this.data.live_members[param].isChecked = false;
      } else {
        _this.data.live_members[param].isChecked = false;
      }

    };
    _this.setData({
      live_members: _this.data.live_members,
    });
  },
  //弹框选择成员确认
  confirmMember:function(){
    const _this = this;
    _this.setData({
      liveMembers: [],
      liveMembers2: [],
    });
    for (var i = 0; i < _this.data.live_members.length; i++) {
      if (_this.data.live_members[i].isChecked == true) {
        _this.data.liveMembers2.push({ code: _this.data.live_members[i].code, name: _this.data.live_members[i].name });
      }
    };
    _this.setData({
      liveMembers2: _this.data.liveMembers2,
    });
    if (_this.data.liveMembers == ''){ 
      _this.setData({
        liveMembers: _this.data.liveMembers2
      });
    }
    _this.hideModal();
  },
  //弹框选择成员取消
  cancelMember: function () {
    const _this = this;
    _this.hideModal();
  },
  /* 
  *获取性别
  */
  getSex: function () {
    var _this=this;
    if (_this.data.sex == '男') {
      _this.setData({
        index6: 0,
      });
    } else {
      _this.setData({
        index6: 1,
      });
    }
  },
  /*
  *选择性别
  */
  genderPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    var _this=this;
    _this.setData({
      index6: e.detail.value,
      sex: _this.data.gender[e.detail.value]
    });
  },
  /*
  * 职业列表
  */
  getOccupationType: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'occupation_type'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            occupation_type: _this.data.occupation_type.concat(res.data.result.dicts[i].name),
            occupation_type2: _this.data.occupation_type2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.occupation) {
            _this.setData({
              index2: i
            })
          }
        };
      }
      else {
        wx.showToast({
          title: "获取职业列表失败"
        })
      }
    });
  },
  /*
  *职业
  */
  jobPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index2: e.detail.value
    });
  },
  /*
  * 教育程度列表
  */
  getEducationalLevel: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'educational_level'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            educational_level: _this.data.educational_level.concat(res.data.result.dicts[i].name),
            educational_level2: _this.data.educational_level2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.education) {
            _this.setData({
              index3: i
            })
          }
        };
      }
      else {
        wx.showToast({
          title: "获取教育程度列表失败",
        })
      }
    });
  },
  /*
  *教育程度
  */
  educationPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index3: e.detail.value
    });
  },
  /*
  * 税后收入列表
  */
  getIncomeList: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'income'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            income_list: _this.data.income_list.concat(res.data.result.dicts[i].name),
            income_list2: _this.data.income_list2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.income) {
            _this.setData({
              index4: i
            })
          }
        };
      }
      else {
        wx.showToast({
          title: '获取税后收入列表失败',
        })
      }
    });
  },
  /*
  *税后收入
  */
  incomePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index4: e.detail.value
    });
  },
  /*
  * 婚姻状况列表
  */
  getMaritalStatus: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'marital_status'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            marital_status: _this.data.marital_status.concat(res.data.result.dicts[i].name),
            marital_status2: _this.data.marital_status2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.maritalStatus) {
            _this.setData({
              index5: i
            })
          }
        };
        if (_this.data.marital_status[_this.data.index5] == '未婚' || _this.data.marital_status[_this.data.index5] == '同居') {
          _this.setData({
            hasMarriage: false,
            marriageAge:'', 
          })
        } else {
          _this.setData({
            hasMarriage: true
          })
        };
        
      }
      else {
        wx.showToast({
          title:"获取婚姻状况列表失败"
        })
      }
    });
  },
  /*
  *婚姻状况
  */
  marriagePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    var _this=this;
    _this.setData({
      index5: e.detail.value
    });
    if (_this.data.marital_status[_this.data.index5] == '未婚' || _this.data.marital_status[_this.data.index5] == '同居'){
      _this.setData({
        hasMarriage:false,
        marriageAge: '',  
      })
    }else{
      _this.setData({
        hasMarriage: true
      })
    }
  },
  /*
  * 判断是否有子女
  */
  hasChildren: function () {
    var _this = this;
    if (_this.data.hasChildren) {
      _this.setData({
        index: 1
      })
    } else {
      _this.setData({
        index: 0
      })
    }
  },
  /*
  *是否有子女
  */
  childrenPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
    });
  },
  /*
  *自定义弹框
  */
  showModal: function () {
    // 显示选中样式
    for (var i = 0; i < this.data.live_members.length; i++) {
      this.data.live_members[i].isChecked = false;
    };
    for (var i = 0; i < this.data.live_members.length; i++) {
      for (var j = 0; j < this.data.liveMembers.length; j++) {
        if (this.data.liveMembers[j].name == this.data.live_members[i].name) {
          this.data.live_members[i].isChecked = true;
        }
      }
    };
    this.setData({
      live_members: this.data.live_members,
    });
    
    // 显示遮罩层
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
    var _this = this;
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    _this.animation = animation
    animation.translateY(300).step()
    _this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      _this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(_this), 200)
  },
  hideModalConfirm: function () {
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

  // 关闭弹框
  _cancelEvent: function () {
    if (this.areaSelect.data.isShow) {
      this.areaSelect.hideDialog();
    }

    if (this.areaSelect.data.isRegistrationShow) {
      this.areaSelect.hideRegistrationDialog();
    }
  },
  // 确认地址
  _confirmEvent: function () { 
    if (this.areaSelect.data.isShow) {
      var _this=this;
      var address = _this.areaSelect.data.addressObj;
      _this.setData({
        fullName: address.province.provinceName+address.city.cityName+address.area.areaName+ address.address.addressName+address.community.communityName,
        residenceDetail:'',
        getArea:true
      })
      if (address.province.provinceName == "") {
        _this.setData({
          residenceAreaCode: _this.data.residenceAreaCode
        })
      } else if (address.address.addressName == ""){
        _this.setData({
          residenceAreaCode: address.area.areaCode
        })
      } else if (address.community.communityName == ""){
        _this.setData({
          residenceAreaCode: address.address.addressCode
        })
      }else{
        _this.setData({
          residenceAreaCode: address.community.communityCode
        })
      }
      if (_this.data.getArea && _this.data.residenceAreaCode ){

      }
      _this.areaSelect.hideDialog();
    }

    if (this.areaSelect.data.isRegistrationShow) {
      var addressObj = this.registrationAreaSelect.data.addressObj
      var registration = addressObj.province.provinceName + addressObj.city.cityName + addressObj.area.areaName + addressObj.address.addressName + addressObj.community.communityName
      this.setData({
        registration: registration,
      })
      this.areaSelect.hideRegistrationDialog();
    }
  },

  openRegistrationAddress: function () {
    this.areaSelect.showRegistrationDialog();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.areaSelect = this.selectComponent("#areaSelect");
    this.registrationAreaSelect = this.selectComponent("#areaSelect");
  },
  openAddress: function () {
    this.areaSelect.showDialog();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    
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