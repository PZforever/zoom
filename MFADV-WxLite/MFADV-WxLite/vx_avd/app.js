//app.js
App({
  onLaunch: function () {
    const _self = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.openSetting({
            success: (res) => {
              console.log(res);
              wx.getUserInfo({
                success: function (res) {
                  _self.getOpenId();
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            }
          })
        } else {
          wx.getUserInfo({
            success: function (res){
              _self.getOpenId();
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      }
    });
    wx.getSystemInfo({
      success: function(res){
        // console.log(res)
        _self.globalData.system = res.system.toUpperCase(); 
        _self.globalData.screenWidth = res.screenWidth;
        console.log(_self.globalData.system);
      }
    });

    this.wxVersionCheck();
  },
  //获取openId
  getOpenId: function () {
    const _self = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          var API_LOGIN = _self.globalData.rootURL+'/mobile/user/getWeChatIdByCode';
          wx.request({
            url: API_LOGIN,
            method:"post",
            header: {"Content-Type": "application/json", 'token': ''},
            data: {
              code: res.code
            },
            success: function (res) {
              if (res.data.code == "200"){
                _self.globalData.wxcode.openid = res.data.result.openid;
                _self.globalData.wxcode.sessionkey = res.data.result.session_key;
                _self.wxloginFun();
              }
            },
            fail: function (res) {
              console.log(res.data.message);
            }
          })

        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });

  },
  //微信登入
  wxloginFun:function(){
    const _self = this;
    var API_LOGINS = _self.globalData.rootURL +"mobile/login/signin";
    if (_self.globalData.wxcode.openid != ""){
      wx.request({
        url: API_LOGINS,
        method: "post",
        header: { "Content-Type": "application/json", 'token': '' },
        data: {
          wechatId: _self.globalData.wxcode.openid
        },
        success: function (res) {
          if (res.data.code == "200"){
            _self.globalData.loginInfo = res.data.result;
          }
        },
        fail: function (res) {
          console.log(res.data.message);
        }
      })
    }
  },
  wxVersionCheck: function () {
    var res = wx.getSystemInfoSync();
    //console.log(res.system);   //最低6.6.5   6.6.6  
    var num1 = res.system.split(" ")[1], num2 = num1.split(".")[0], num3 = num1.split(".")[1];

    if (res.system.split(" ")[0] == "Android"){
      console.log(typeof num2)
      if (parseInt(num2) < 5){
        wx.showModal({
          title: '提示',
          content: '您当前的手机系统版本为' + res.system + '，版本过低时会影响您的使用，请更新！',
          showCancel: false
        })
      }
    } else if (res.system.split(" ")[0] == "iOS"){
      if (parseInt(num2) < 10){
        wx.showModal({
          title: '提示',
          content: '您当前的手机系统版本为' + res.system + '，版本过低时会影响您的使用，请更新！',
          showCancel: false
        })
      }
    }
    
    
  },
  globalData: {
    system: '',
    //屏幕宽度
    screenWidth: 0,
    // 判断告知书是否被确认的字段
    agreeBol:false,
    agreeBol:false,
    //保护令申请书
    Protective:[],
    applyName: '',
    applyGender: '',
    applyNation:'',
    applyIdCard: '',
    applyAddress: '',
    applyAddressDetail:'',
    claimantName: '',
    claimantGender: '',
    claimantNation: '',
    claimantIdCard: '',
    claimantAddress: '',
    claimantAddressDetail:'',
    hasProtective:false,
    applyConfirm:false,
    //是否要申请人身安全保护令
    order: false,
    //保护令法院
    courtChoose:'',
    courtChooaseIndex:'0',
    Court:'',
    index1:0,
    //当前时间
    nowDate: new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate(),
    dateTime: [new Date().getFullYear() - 1900, new Date().getMonth(), new Date().getDate() - 1, new Date().getHours()],
    //时间选择数组
    dateTimeArray: '',
    //家暴发生时间
    happen_time: new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日' + (new Date().getHours()) + '时',

    userInfo: null,
    /*系统用户的登录信息，actualName，age，headPortrait，id，idCard，isAuthenticate，phone，sex，token */
    loginInfo: null,
    //rootURL:'https://fanjiabao.net/',

    rootURL:"https://fjbt.odrcloud.cn/",
    // rootURL: "http://115.159.91.79:11010/",
    
    //imgURL:"https://fanjiabao.net/wechat/",
    imgURL:"https://fjbt.odrcloud.cn/wechat/",
    wxcode:{
      openid:"",
      sessionkey:""
    },
    signonInfo:null,
    violentTypeIndex: 0,
    relationTypeIndex: 0,
    respondentNationIndex: 0,
    applicantNationIndex: 0,
    //选择地址缓存数组
    address: [
      { id: 1, name: '' },//申请人
      { id: 2, name: '' },//被申请人
      { id: 3, name: '' },//事件描述
      { id: 4, name: '' },//人身保护令
    ],
    //一键申请服务数组
    servicesArray: [],
    //新建服务事件的证据类型
    newEventEvidenceType:[],
    //新建服务事件从资料库中关联证据的数组
    getDatabaseArray: [],
    //新建服务事件从资料库中关联证据的选中状态数组
    getDatabaseStatusArray: [],
    //橙色日记上传
    orangeDiaryUpLoad:[],
    //橙色日记列表页显示项索引
    showIndex:'',
    //提交申请的城市日记
    diaryArray: "",
    //用户当前定位地址(省市区)
    CurrentLocationAddress: '',
    //用户当前点位省市区code
    areasCode: '',
    //用户当前定位详细地址
    residenceDetail: '',
    // 增加填表目录完成状态
    listStatus:[
      {id:0,checked:false},//登记人信息
      {id:1,checked:false},//申请人（本人）
      {id:2,checked:false},//被申请人
      {id:3,checked:false},//事件描述
      {id:4,checked:false},//人身保护令
      {id:5,checked:false},//心理咨询
      {id:6,checked:false},//庇护所
      {id:7,checked:false},//伤情鉴定
      {id:8,checked:false},//证据上传
      {id:9,checked:false}//申请人（他人）
    ],
    //预约心理咨询师的姓名
    psychologist_name: '点击选择咨询师',
    psychologist_index: null,
    //已选择的庇护所名称
    shelter_selected: '无',
    //会谈方式数组
    radioItems: [
      { name1: '预约线上会议', name2: '(小程序)', value: '0' },
      { name1: '预约线上会议', name2: '(小程序+IE浏览器)',value: '1', checked: true },
      { name1: '预约线下会议', value: '2'},
    ],
    //预约机构选项
    orgs_index: 0,
    //会谈人数选项
    number_index: 0,
    //庇护所信息
    shelter_name: '',
    shelter_phone: '',
    //事件描述用户点击选择的事件
    remarks:[],
    inputContent:"",
    //申请诉求用户手动内容
    appeal_writed: '',
    //事件描述 申请事项的其他描述
    selfDesc:'',
    // 登记人
    registerInfo: {
      "role": 31,
      "actualName": "",
      "sex": "",
      "nation": "N001001",
      "phone": "",
      "idCard": "",
      "residenceAreaCode": "",
      "residenceDetail": ""
    },
    // 申请人
    applicantInfo: {
      "role": 10,
      "actualName": "",
      "sex": "",
      "nation": "N001001",
      "phone": "",
      "idCard": "",
      "residenceAreaCode": "",
      "residenceDetail": "",
      "registration": ""
    },
    //默认户籍地址和户籍地址code
    applyRegistration:'',
    applyRegistration: '',
    // 被申请人
    respondengtInfo: {
      "role": 20,
      "actualName": "",
      "sex": "",
      "nation": "N001001",
      "phone": "",
      "idCard": "",
      "residenceAreaCode": "",
      "residenceDetail": ""
    },
    "personalSafetyProtectionOrder": {
      "protectiveMeasures": [
      ],
      "organization":{
        'id':''
      },
      "isSubmit": false,
      "factAndReasons": '',
    },
    "psychologicalCounseling": {
      "reservationType": "0",
      "reservationOrg": {
        "id": ''
      },
      "psychologist": {
        "id": ''
      },
      "timeRange": "",
      "number": '',
      "psychologicalSchedule": {
        "id": ''
      }
    },
    "sanctuaryApplication": {
      "sanctuary": {
        "id": ''
      }
    },
    apply_info: {
      "source": "MOBILE",
      "applyType": "ONESELF",
      "isUrgent": false,
      "litigant": [
         
      ],
      "violentType": "",
      "violentDate": new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日' + (new Date().getHours()) + '时',
      "remarks": "",
      "appeal": "",
      "applyExpect": "",
      "areas": {
        "code": ''
      },
      "address": "",
      "personalSafetyProtectionOrder": null,
      "psychologicalCounseling": null,
      "asylumApplication": null,
      "attachments" : []
    },
    // 创建心理咨询，人身保护令，庇护所，伤情鉴定信息表
    messageObj:{
      // 类型 type?0:心理咨询，1：人身保护令，2：庇护所，3：伤情鉴定
      type:'',
      // 申请方式 applyType?0：个人，1：其他
      applyType:'',
      // 本人申请
      personalList:[
        { 
          "id":1,
          "name":"申请人信息",
          "url":'',
          "checked":false
        },
        { 
          "id":2,
          "name":"被申请人信息",
          "url":'',
          "checked":false
        },
        { 
          "id":3,
          "name":"事件描述",
          "url":'',
          "checked":false
        },
        { 
          "id":4,
          "name":"证据上传",
          "url":'',
          "checked":false
        },
        { 
          "id":5,
          "name":"人身安全保护令",
          "url":'',
          "checked":false
        }
      ],
      // 其他申请
      otherList:[
        { 
          "id":1,
          "name":"登记人信息",
          "url":'',
          "checked":false
        },
        { 
          "id":2,
          "name":"申请人信息",
          "url":'',
          "checked":false
        },
        { 
          "id":3,
          "name":"被申请人信息",
          "url":'',
          "checked":false
        },
        { 
          "id":4,
          "name":"事件描述",
          "url":'',
          "checked":false
        },
        { 
          "id":5,
          "name":"证据上传",
          "url":'',
          "checked":false
        },
        { 
          "id":6,
          "name":"人身安全保护令",
          "url":'',
          "checked":false
        },
      ],
      // 信息列表
      typeList:[
        { 
          "name":"心理咨询",
          "url":'',
          "checked":false
        },
        { 
          "name":"人身安全保护令",
          "url":'',
          "checked":false
        },
        { 
          "name":"庇护所",
          "url":'',
          "checked":false
        },
        { 
          "name":"伤情鉴定",
          "url":'',
          "checked":false
        }
      ],
      // 渲染列表显示的数据信息,
      showList:[]



    }
  }
  
})