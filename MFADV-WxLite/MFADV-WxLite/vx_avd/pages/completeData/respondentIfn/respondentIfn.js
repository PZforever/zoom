// pages/completeData/respondentIfn/respondentIfn.js
const util = require('../../../utils/request.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    caseId:'',
    nationList: [],
    nationList2: [],
    live_members: [], 
    liveMembers: [],
    liveMembers2: [],
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
    hobby_list:[],
    hobby_list2:[],
    hobby:'',
    mentalIllnessList: ['无', '有'],
    mentalIllness: '',
    disease_history: [],
    disease_history2: [],
    crime_history: [],
    crime_history2: [],
    violent_history: [],
    violent_history2: [],
    diseaseHistory: '',
    crimeHistory: '',
    domesticViolenceHistory: '',
    actualName: '',
    age: '',
    gender: ['男', '女'],
    sex:'',
    phone: '',
    idCard: '',
    residenceAreaCode:'',
    provinceName: '',
    cityName: '',
    areaName: '',
    addressName: '',
    communityName:'',
    residenceDetail: '',
    relationToApply: '',
    relationList:[], 
    relationList2:[], 
    emergencyPhone: '',
    marriageAge: '',
    hasChildrenList: ['否', '是'],
    hasChildren: '',
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
    index12: 0,
    index13: '0',
    index14: '0',
    hasMarriage:true,
    applicantPhone:'',
    applicantIdCard:'',
    checkedNone:false,
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
    util.POST('mobile/violentCase/getLitigant', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId,
      "type": "R"
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
      _this.getHobbyList();
      _this.getCrimeHistory();
      _this.getViolentHistory();
      _this.getDiseaseHistory();
      _this.mentalIllness();
      _this.hasChildren();
      _this.getRelation();
      _this.getSex();
      _this.getMessage2();

      if (res.data.code == '200') {
        /*请求表单数据 */
        if (res.data.result.mentalIllness != null) {
          _this.setData({
            mentalIllness: res.data.result.mentalIllness,
          })
        };
        
        if (res.data.result.diseaseHistory != null) {
          _this.setData({
            diseaseHistory: res.data.result.diseaseHistory,
          })
        };
        if (res.data.result.crimeHistory != null) {
          _this.setData({
            crimeHistory: res.data.result.crimeHistory,
          })
        };
        if (res.data.result.domesticViolenceHistory != null) {
          _this.setData({
            domesticViolenceHistory: res.data.result.domesticViolenceHistory,
          })
        };

        _this.setData({
          actualName: res.data.result.actualName,
          age: res.data.result.age,  
          nation: res.data.result.nation,
          sex: res.data.result.sex,
          phone: res.data.result.phone,
          idCard: res.data.result.idCard,
          residenceDetail: res.data.result.residenceDetail,
          relationToApply: res.data.result.relationToApply,
          emergencyPhone: res.data.result.emergencyPhone,
          marriageAge: res.data.result.marriageAge,
          residenceAreaName: res.data.result.residenceAreaName,
          residenceAreaCode: res.data.result.residenceAreaCode,
          personId: res.data.result.id,
          liveMembers: res.data.result.liveMembers,
          hasChildren: res.data.result.hasChildren,
          education: res.data.result.education,
          income: res.data.result.income,
          maritalStatus: res.data.result.maritalStatus,
          hobby: res.data.result.hobby,
          occupation: res.data.result.occupation
        })

        //首次填写地址信息，自动默认用户当前定位地址供用户进行修改
        // if (_this.data.residenceDetail == '') {
        //   _this.setData({
        //     residenceDetail: app.globalData.residenceDetail,
        //   })
        // }
      }
      else {
        // wx.showToast({
        //   title: res.data.message,
        // })
      }
    }); 
  },
  //申请人信息
  getMessage2: function () {
    var _this = this;
    util.POST('mobile/violentCase/getLitigant', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId,
      "type": "A"
    }, function (res) {
      // 判断交互是否正常
      console.log(res.data);
      if (res.data.code == '200') {
        _this.setData({
          applicantPhone: res.data.result.phone,
          applicantIdCard: res.data.result.idCard,
        })

        //首次填写地址信息，自动默认用户当前定位地址供用户进行修改
        if (_this.data.residenceAreaName == '') {
          _this.setData({
            residenceAreaName: app.globalData.residenceAreaName,
          })
        }
      }
      else {
        // wx.showToast({
        //   title: res.data.message,
        // })
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
    if (!iptPhone2 && e.detail.value.emergencyPhone != '') {
      util.remind('紧急联系人手机号输入有误');
      return false;
    };
    if (!iptIdCard && e.detail.value.idCard != '') {
      util.remind('身份证号输入有误');
      return false;
    };
    if (e.detail.value.phone == _this.data.applicantPhone) {
      util.remind("被申请人手机号与申请人手机号不能相同");
      return false;
    };

    if (e.detail.value.idCard == _this.data.applicantIdCard) {
      util.remind("被申请人手机号与申请人身份证号不能相同");
      return false;
    };
    util.POST('mobile/violentCase/updateLitigant', app.globalData.loginInfo.token, {
      "violentCaseId": this.data.caseId,
      "litigant": {
        "id": _this.data.personId,
        "actualName": e.detail.value.actualName,
        "age": e.detail.value.age, 
        "residenceAreaCode": _this.data.residenceAreaCode,
        'nation': _this.data.nationList2[_this.data.index13].code,
        'sex': _this.data.gender[_this.data.index12],
        'phone': e.detail.value.phone,
        'idCard': e.detail.value.idCard,
        'residenceDetail': e.detail.value.residenceDetail,
        'relationToApply': _this.data.relationList2[_this.data.index14].code,
        'emergencyPhone': e.detail.value.emergencyPhone,
        'marriageAge': e.detail.value.marriageAge,
        'mentalIllness': _this.data.index9,
        "diseaseHistory": _this.data.disease_history2[_this.data.index10].code,
        "crimeHistory": _this.data.crime_history2[_this.data.index7].code,
        "domesticViolenceHistory": _this.data.violent_history2[_this.data.index8].code,
        "education": _this.data.educational_level2[_this.data.index3].code,
        "income": _this.data.income_list2[_this.data.index4].code,
        "maritalStatus": _this.data.marital_status2[_this.data.index5].code,
        "hobby": _this.data.hobby_list2[_this.data.index6].code,
        "occupation": _this.data.occupation_type2[_this.data.index2].code,
        "hasChildren": _this.data.index11,
        "liveMembers": _this.data.liveMembers

      }
    }, function (res) {
      // 判断交互是否正常
      console.log(res.data)
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
  // 确认地址
  _confirmEvent: function () {
    var _this = this;
    var address = _this.areaSelect.data.addressObj;
    _this.setData({
      residenceAreaName: address.province.provinceName + address.city.cityName + address.area.areaName + address.address.addressName + address.community.communityName,
      residenceDetail:'',
    })
    if (address.province.provinceName == ""){
      _this.setData({
        residenceAreaCode: _this.data.residenceAreaCode
      })
    }else if (address.address.addressName == "") {
      _this.setData({
        residenceAreaCode: address.area.areaCode
      })
    } else if (address.community.communityName == "") {
      _this.setData({
        residenceAreaCode: address.address.addressCode
      })
    } else {
      _this.setData({
        residenceAreaCode: address.community.communityCode
      })
    }
    _this.areaSelect.hideDialog();
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
        // console.log(_this.data.live_members)
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
  confirmMember: function () {
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
    if (_this.data.liveMembers == '') {
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
              index13: i
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
  *选择民族
  */
  nationPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index13: e.detail.value
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
          if (res.data.result.dicts[i].code == _this.data.relationToApply) {
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
  * 疾病史列表
  */
  getDiseaseHistory: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'disease_history'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        /*共同生活成员列表 */
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            disease_history: _this.data.disease_history.concat(res.data.result.dicts[i].name),
            disease_history2: _this.data.disease_history2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.diseaseHistory) {
            _this.setData({
              index10: i
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
  *疾病史
  */
  diseasePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index10: e.detail.value
    });
  },
  /*
  * 犯罪史列表
  */
  getCrimeHistory: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'crime_history'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            crime_history: _this.data.crime_history.concat(res.data.result.dicts[i].name),
          })
        };
        _this.setData({
          crime_history2: res.data.result.dicts
        })
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.crimeHistory) {
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
  *犯罪史
  */
  crimePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index7: e.detail.value
    });
  },

  /*
  * 家暴史列表
  */
  getViolentHistory: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'violent_history'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            violent_history: _this.data.violent_history.concat(res.data.result.dicts[i].name),
            violent_history2: _this.data.violent_history2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.domesticViolenceHistory) {
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
  *家暴史
  */
  dvPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index8: e.detail.value
    });
  },
  /*
  * 判断有无精神疾病
  */
  mentalIllness: function () {
    var _this = this;
    if (_this.data.mentalIllness) {
      _this.setData({
        index9: 1
      })
    } else {
      _this.setData({
        index9: 0
      })
    }
  },
  /*
  *精神病史
  */
  mentalDiseasePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index9: e.detail.value
    });
  },
  /*
  *获取性别
  */
  getSex:function(){
    var _this=this;
    if (_this.data.sex == '男') {
      _this.setData({
        index12: 0,
      });
    } else {
      _this.setData({
        index12: 1,
      });
    }
  },
  /*
  *选择性别
  */
  genderPickerSelected: function (e) {
    var _this=this;
    //改变index值，通过setData()方法重绘界面
    _this.setData({
      index12: e.detail.value,
      sex: _this.data.gender[e.detail.value]
    });
  },

  /*
  *共同生活成员
  */
  memberPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index: e.detail.value
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
          title: res.data.message,
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
          title: res.data.message,
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
          title: res.data.message,
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
        //判断是否未婚
        if (_this.data.marital_status[_this.data.index5] == '未婚' || _this.data.marital_status[_this.data.index5] == '同居') {
          _this.setData({
            hasMarriage: false,
            marriageAge: '',
          })
        } else {
          _this.setData({
            hasMarriage: true
          })
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
  *婚姻状况
  */
  marriagePickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    var _this=this;
    _this.setData({
      index5: e.detail.value
    });
    //判断是否未婚
    if (_this.data.marital_status[_this.data.index5] == '未婚' || _this.data.marital_status[_this.data.index5] == '同居') {
      _this.setData({
        hasMarriage: false,
        marriageAge: '',
      })
    } else {
      _this.setData({
        hasMarriage: true
      })
    };
  },
  /*
  * 判断是否有子女
  */
  hasChildren: function () {
    var _this = this;
    if (_this.data.hasChildren) {
      _this.setData({
        index11: 1
      })
    } else {
      _this.setData({
        index11: 0
      })
    }
  },

  /*
  *是否有子女
  */
  childrenPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index11: e.detail.value
    });
  },
  /*
  * 嗜好列表
  */
  getHobbyList: function () {
    var _this = this;
    util.POST('mobile/common/getDicts', app.globalData.loginInfo.token, {
      "type": 'hobby'
    }, function (res) {
      // 判断交互是否正常
      if (res.data.code == '200') {
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          _this.setData({
            hobby_list: _this.data.hobby_list.concat(res.data.result.dicts[i].name),
            hobby_list2: _this.data.hobby_list2.concat(res.data.result.dicts[i])
          })
        };
        for (var i = 0; i < res.data.result.dicts.length; i++) {
          if (res.data.result.dicts[i].code == _this.data.hobby) {
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
  *嗜好
  */
  hobbyPickerSelected: function (e) {
    //改变index值，通过setData()方法重绘界面
    this.setData({
      index6: e.detail.value
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
    var _this=this;
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
    this.areaSelect.hideDialog();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.areaSelect = this.selectComponent("#areaSelect");
  },
  openAddress: function () {
    this.areaSelect.showDialog();
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