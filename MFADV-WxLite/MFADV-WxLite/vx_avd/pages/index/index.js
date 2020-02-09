//获取应用实例
const util = require('../../utils/request.js');
const utils = require('../../utils/util.js');
const QQMAP = require('../../utils/qqmap-wx-jssdk.js');
const app = getApp();
var wxMap = new QQMAP({
  key: 'JIFBZ-AW4W3-GGK3O-YJIEC-LUZOK-VXFXA'
  // key: 'JVLBZ-Y4M3D-RQO4D-HF7UI-6YVJ5-HYBT5'
}); 
var urls = [];
Page({
  data: {
    mottoVersionInfo: '',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [  
      { name: '心理咨询', value: '心理咨询', image: '/img/psychological_counseling.png', tip: '在线心理咨询疏导'},
      { name: '庇护所', value: '庇护所', image: '/img/on_shelter.png', tip: '快速申请安全庇护' },
      { name: '人身安全保护令', value: '人身安全保护令', image: '/img/on_order.png', tip: '法院48小时受理'},
      // { name: '伤情鉴定', value: '伤情鉴定', image: '/img/on_injury.png' },
    ],
    checked_number: 0,
    all_checked: false,
    isAgree: false,
    apply_url: '/pages/fill_info/apply?fill_info_type=["心理咨询"]',
    prefix_url: '/pages/fill_info/apply?fill_info_type=',
    off:0,
    cameraNone:true,
    cameraSwitch:true,
    fristShow:true,
    frist:"",
    turnBtn: false,
    cameraUrl:'',
    Dark:false,//拍照特效

    list: [],
    showRecordTop: true,
    unitPx: 0,
    lunitPx: 0,
    itemBar: 0,
    displace: 0,
    time: {
      minute: 0,
      second: 0,
      millisecond: 0
    },
    timeList: [],
    optionsShow: true,
    saveRecord: false,
    isRecording: false,
    showSave: false,
    audioName: '',
    editIndex: -1,
    showCheck: -1,
    //录音功能,录音播放
    recorder:{
      //录音
      recorderManager:null,
      //音频播放
      innerAudioContext:null,
      //音频缓存
      currentAudio:null,
      //定时器
      timer:null
    },
    audioIndex: "",
    audioPlayFlag: false,
    //当前是否播放
    audioPlayIngFlag:false,
    //当前是否录音
    recordIngFlag:false
  }, 
  //
  toOdrPro: function(e){
    console.log(e)
    wx.navigateToMiniProgram({
      appId: 'wxfb3210c3d6871fb4',
      success(res) {
        console.log("success")
      },
      fail(error){
        console.log(error)
      }
    })
  },

  onShareAppMessage:function(){
    return {
      title:'构筑平安家庭，我们是您坚实的后盾！',
      path:'/pages/index/index',
      imageUrl: app.globalData.imgURL +'img/share.png'
    }
  },
  //伤情鉴定提示信息
  message: function(){
    util.remind("伤情鉴定服务暂时无法申请");
  },
  
  // 检测用户是否登录了如果否跳转到登录页面,反之正常跳转
  open:function(event){
    if (app.globalData.loginInfo==''||app.globalData.loginInfo=='underfind'||app.globalData.loginInfo==null) {
      wx.navigateTo({
        url:'/pages/login/login'
      })
    }else{
      this.checkId(event);     
    }
  },
  // 检测是否实名认证了
  checkId:function(event){
    util.POST('mobile/user/isCertification',app.globalData.loginInfo.token,{},function(res){
      if (res.data.code=='MUC000001') {
        // 弹框提示当前用户还没实名认证
        wx.showModal({
          title: '实名提醒',
          content: '当前功能需要实名认证，是否认证？',
          confirmColor:'#fa822b',
          success: function(res) {
            if (res.confirm) {
              wx.navigateTo({
                url:'/pages/login/signon_idcard/signon_idcard'
              })
            } else if (res.cancel) {
              
            }
          }
        })
      }else{
        app.globalData.agreeBol1=false;
        app.globalData.agreeBol2=false;
        wx.navigateTo({
          url:event.currentTarget.dataset.url
        })
      }
    })
  },
  submit: function (event) {
    if (app.globalData.loginInfo == '' || app.globalData.loginInfo == 'underfind' || app.globalData.loginInfo == null) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
    } else {
      if (this.data.checked_number == 0) {
        util.remind('请选择要申请的服务')
      }else{
       this.checkId(event); 
      }
    }
  },
  // 在线报警
  openPhone:function(){
    wx.makePhoneCall({
      phoneNumber: '110' 
    })
  },
  // 
  checkboxChange: function (e) {
    var checkboxItems = this.data.items, values = e.detail.value
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = false;

      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        if (checkboxItems[i].value == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    var url = this.data.prefix_url + e.detail.value
    
    if (values == '心理咨询') {
      url = "/pages/psychological_counseling/disclaimer/disclaimer?fill_info_type=" + e.detail.value 
    }

    if (values == '庇护所') {
      url = "/pages/shelter/disclaimer/disclaimer?fill_info_type=" + e.detail.value
    }

    this.setData({
      items: checkboxItems,
      checked_number: values.length,
      apply_url: url,
    });

    

    //服务名数组
    var servicesArray = []
    if (values == '心理咨询'){
      var service_data = {
        service_name: '心理咨询',
        serviceUrl: '/pages/psychological_counseling/disclaimer/disclaimer',
        status: false,
      }
      servicesArray.push(service_data)
    } else {
      for (var j = 0, lenJ = values.length; j < lenJ; ++j) {
        switch (values[j]) {
          case '伤情鉴定':
            var service_data = {
              service_name: '伤情鉴定',
              serviceUrl: '',
              status: false,
            }
            servicesArray.push(service_data)
            break;
          case '心理咨询':
            var service_data = {
              service_name: '心理咨询',
              serviceUrl: '/pages/psychological_counseling/disclaimer/disclaimer',
              status: false,
            }
            servicesArray.push(service_data)
            break;
          case '庇护所':
            var service_data = {
              service_name: '庇护所',
              serviceUrl: '/pages/shelter/disclaimer/disclaimer',
              status: false,
            }
            servicesArray.push(service_data)
            break;
          case '人身安全保护令':
            var service_data = {
              service_name: '人身安全保护令',
              serviceUrl: '/pages/protectionOrder/order/order',
              status: false,
            }
            servicesArray.push(service_data)
            break;
        }
      }
    }
    
    app.globalData.servicesArray = servicesArray

    if (app.globalData.servicesArray.length == 3) {
      this.setData({
        isAgree: true
      });
    }
    if (app.globalData.servicesArray.length < 3) {
      this.setData({
        isAgree: false
      });
    }

    if (this.data.items[0].checked == true) {
      app.globalData.apply_info.AsylumApplication = app.globalData.AsylumApplication
    }
    if (this.data.items[0].checked == false) {
      app.globalData.apply_info.AsylumApplication = {}
    }
    if (this.data.items[1].checked == true) {
      app.globalData.apply_info.psychologicalCounseling = app.globalData.psychologicalCounseling
    }
    if (this.data.items[1].checked == false) {
      app.globalData.apply_info.psychologicalCounseling = {}
    }
    if (this.data.items[2].checked == true) {
      app.globalData.order = true
      app.globalData.apply_info.personalSafetyProtectionOrder = app.globalData.personalSafetyProtectionOrder
    }
    if (this.data.items[2].checked == false) {
      app.globalData.order = false
      app.globalData.apply_info.personalSafetyProtectionOrder = {}
    }
  },

  bindAgreeChange: function (e) {
    if (!!e.detail.value.length) {
      var status = this.data.all_checked
      var checkboxItems = this.data.items
      app.globalData.order = true
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = !status;
      }
      var url = "/pages/fill_info/apply?fill_info_type=" + '心理咨询,庇护所,人身安全保护令'

      app.globalData.servicesArray = [
        {
          service_name: '心理咨询',
          serviceUrl: '/pages/psychological_counseling/disclaimer/disclaimer',
        },
        {
          service_name: '庇护所',
          serviceUrl: '/pages/shelter/disclaimer/disclaimer',
        },
        {
          service_name: '人身安全保护令',
          serviceUrl: '/pages/protectionOrder/order/order',
        }
      ]

      this.setData({
        items: checkboxItems,
        checked_number: checkboxItems.length,
        apply_url: url,
        isAgree: true
      });

      if (app.globalData.diaryArray != "") {
        this.setData({
          apply_url: '/pages/fill_info/list/self/list?fill_info_type=' + '心理咨询,庇护所,人身安全保护令'
        })
      };
    }

    if (!!e.detail.value.length == false) {
      var status = this.data.all_checked
      var checkboxItems = this.data.items
      app.globalData.order = false
      for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
        checkboxItems[i].checked = status;
      }
      var url = this.data.prefix_url + ''

      app.globalData.servicesArray = []

      this.setData({
        items: checkboxItems,
        checked_number: 0,
        apply_url: url,
        isAgree: false
      });
    }
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
      prefix_url: '/pages/fill_info/apply?fill_info_type='
    });
    app.globalData.diaryArray = ""
    getApp().globalData.servicesArray = []
    var status = this.data.all_checked
    var checkboxItems = this.data.items
    app.globalData.order = false
    for (var i = 0, lenI = checkboxItems.length; i < lenI; ++i) {
      checkboxItems[i].checked = status;
    }
    var url = this.data.prefix_url + ''

    app.globalData.servicesArray = []

    this.setData({
      items: checkboxItems,
      checked_number: 0,
      apply_url: url,
      isAgree: false
    });
  },
  /**
   * 对话框取消按钮点击事件
   */
  onCancel: function () {
    this.hideModal();
  },
  /**
   * 对话框确认按钮点击事件
   */
  onConfirm: function () {
    this.hideModal();
  },
  /**
   * 弹出拍照框事件
   */
  openCamera:function(){
    var _that = this;
    _that.setData({
      off: 1
    })
  },
  /**
   * 弹出录音框事件
   */
  openRecord:function(){
    const that = this;
    const screenWidth = app.globalData.screenWidth;
    const unitPx = parseInt(screenWidth/6);
    let timeList = [];
    for(let i = 0; i < 600; i++){
      let second = i % 60;
      let minute = parseInt(i / 60)
      let item = {
        second: second,
        minute: minute
      }
      timeList.push(item)
    }
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#fcc376'
    });
    wx.getStorage({
      key: 'list',
      success: function(res) {
        let resData = res.data;
        for (var i = 0; i < resData.length;i++){
          resData[i].play = false;
          resData[i].process = 0;
          resData[i].timer = null;
          resData[i].isDisabled = true;
          resData[i].time = {
            minute:0,
            second: 0,
            millisecond: 0,
          }
        } 
        that.setData({
          list: resData,
          timeList: timeList,
          unitPx: unitPx,  
          lunitPx: unitPx,     
          off: 2
        })
      },
      fail: function(){
        that.setData({
          list: [],
          timeList: timeList,
          unitPx: unitPx, 
          lunitPx: unitPx, 
          off: 2
        })
      } 
    })

  },
  /**
   * 点击其他服务弹框提示
   */
  otherServicePoint:function(){
    util.remind("请电脑登录至反家暴服务平台fanjiabao.net申请相关服务。");
  },
  onShow:function(){
    var _self = this;
    if (app.globalData.rootURL == "https://fjbt.odrcloud.cn/"){
      _self.data.mottoVersionInfo = "对应WEB测试环境: fjbt.odrcloud.cn";
    } else if (app.globalData.rootURL == "https://fanjiabao.net/TEST/"){
      _self.data.mottoVersionInfo = "对应WEB测试环境: fjbt.odrcloud.cn";
    } else if (app.globalData.rootURL == "https://fanjiabao.net/"){
      _self.data.mottoVersionInfo = "";
    }
    _self.setData({
      mottoVersionInfo: _self.data.mottoVersionInfo
    })

    if (app.globalData.diaryArray != "") {
      app.globalData.apply_info.applyType = "ONESELF"
      app.globalData.applicantInfo.actualName = app.globalData.loginInfo.actualName
      app.globalData.applicantInfo.phone = app.globalData.loginInfo.phone
      app.globalData.applicantInfo.idCard = app.globalData.loginInfo.idCard
      app.globalData.applicantInfo.sex = app.globalData.loginInfo.sex
      this.setData({
        showModal: true,
        prefix_url: '/pages/fill_info/list/self/list?fill_info_type='
      })
    };

    wx.getStorage({
      key: 'Storage',
      success: function (res) {
        _self.setData({
          frist: res
        })
      }
    });
    if (_self.data.frist == '') {
      wx.setStorage({
        key: "Storage",
        data: _self.data.cameraNone
      })
    }

   
  },
  onHide:function(){
    const _self = this;
    _self.data.recorder.recorderManager.stop();
    _self.data.recorder.innerAudioContext.stop();
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (e) {
    var _self = this;
    if (app.globalData.loginInfo == '' || app.globalData.loginInfo == 'underfind' || app.globalData.loginInfo == null){
      _self.setData({
        is_login: false
      })
    } else {
      _self.setData({
        is_login: true
      })
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    };

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        wxMap.reverseGeocoder({
          location: {
            latitude:res.latitude,
            longitude:res.longitude,
          },
          success: function (res) {
            util.getCode(res.result.address_component.province,res.result.address_component.city,res.result.address_component.district,function(res){
              app.globalData.applicantInfo.residenceAreaCode=res.data.result.code;
              app.globalData.respondengtInfo.residenceAreaCode=res.data.result.code;
              app.globalData.apply_info.areas.code=res.data.result.code;
              app.globalData.areasCode = res.data.result.code
            })
              // app.globalData.applicantInfo.residenceDetail=res.result.formatted_addresses.recommend;
              // app.globalData.respondengtInfo.residenceDetail=res.result.formatted_addresses.recommend;
              // app.globalData.apply_info.address = res.result.formatted_addresses.recommend;
              app.globalData.CurrentLocationAddress = res.result.address_component.province+' '+res.result.address_component.city+' '+res.result.address_component.district
              app.globalData.residenceDetail = res.result.formatted_addresses.recommend
          },
          fail: function (res) {
            _self.setData({
              address: "网络错误，请从新加载"
            })
          }
        });
      },
      fail: function (res) {
        _self.setData({
          address: "您未授权获取位置或网络未连接"
        })
      }
    });
    
    _self.recorderInit();
  
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 首次关注弹框
  openProof: function () {//打开相机，固定证据
    var _that = this;
    _that.setData({
      off: 3
    })
  },
  unOpen:function(){//随意点击关闭蒙层
    var _that = this;
    _that.setData({
      cameraNone: false
    })
  },
  deteleBox:function(){//关闭蒙层
    var _that= this;
    wx.getStorage({
      key: 'Storage',
      success: function (res) {
        _that.setData({
          fristShow: false
        })
      }
    })
    _that.setData({
      cameraNone: false
    })
  },
  openRegister:function(){//跳转新用户注册
    wx.navigateTo({
      url: '../login/disclaimer/disclaimer?type=3'
    });
  },
  cameraSwitch:function(){//切换摄像头
    if (this.data.cameraSwitch){
      this.setData({
        cameraSwitch: false
      })
    }else{
      this.setData({
        cameraSwitch: true
      })
    }
  },
  turnBtn:function(){
    this.setData({
      turnBtn: false
    })
  },
  darkTurn:function(){
    this.setData({
      Dark: false
    })
  },
  cameraBtn:function(){//拍照
    this.setData({
      turnBtn:true,
      Dark: true
    });
    setTimeout(this.darkTurn, 400)
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          cameraUrl: res.tempImagePath
        });
        urls.push(this.data.cameraUrl);
        wx.saveImageToPhotosAlbum({
          filePath: res.tempImagePath,
          success(res) {
            console.log(res)
          }
        })
      }
    });
    setTimeout(this.turnBtn,1000)
  },
  cameraReturn: function () {//预览图片
    wx.previewImage({
      current: this.data.cameraUrl, // 当前显示图片的http链接
      urls: urls, // 需要预览的图片http链接列表
      success: function (res) {
        console.log(res)
      }
    })
  },
  cameraClose:function(){//关闭照相机
    var _this =this;
    wx.getStorage({
      key: 'Storage',
      success: function (res) {
        _this.setData({
          fristShow: false
        })
      }
    })
    this.setData({
      off:0
      // cameraNone:false
    })
  },
  //关闭选择拍照录音modal框
  closeProofModal: function(e){
    const that = this;
    clearInterval(that.data.recorder.timer); 
    that.data.time = {
      minute: 0,
      second: 0,
      millisecond: 0
    };
    that.data.recorder.recorderManager.stop(); 
    that.setData({
      time: {
        minute: 0,
        second: 0,
        millisecond: 0
      },
      displace: 0,
      off: 0
    })
  },
  recorderInit:function(){
    const _self = this;
    _self.data.recorder.recorderManager = null;
    _self.data.recorder.innerAudioContext = null;
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    _self.data.recorder.recorderManager = wx.getRecorderManager();
    _self.data.recorder.innerAudioContext = wx.createInnerAudioContext();
    //开始录音事件
    _self.data.recorder.recorderManager.onStart(() => {
      let isRecording = _self.data.isRecording;
      let time = _self.data.time;
      let displace = _self.data.displace;
      let lunitPx = _self.data.lunitPx;
      let moveitem = parseFloat(_self.data.unitPx / 10);
      let halfScreenWidth = parseFloat(_self.data.unitPx * 3);
      _self.data.recordIngFlag = true;
      _self.data.recorder.timer = setInterval(function () {
        time.millisecond = time.millisecond + 1;
        lunitPx = lunitPx + moveitem

        if (lunitPx >= halfScreenWidth) {
          displace = displace + moveitem
        }
        if (time.millisecond >= 10) {
          time.millisecond = 0;
          time.second = time.second + 1;
        }
        if (time.second >= 60) {
          time.second = 0;
          time.minute = time.minute + 1;
        }
        _self.setData({
          time: time,
          lunitPx: lunitPx,
          displace: displace
        })
      }, 100)
      console.log('开始录音')
    }); 

    //暂停录音事件
    _self.data.recorder.recorderManager.onPause(() => {
      console.log('暂停录音');
      _self.data.recordIngFlag = false;
      clearInterval(_self.data.recorder.timer)
      _self.setData({
        isRecording: false
      })
    });
    //结束录音事件
    _self.data.recorder.recorderManager.onStop((res) => {
      let time = _self.data.time;
      time.millisecond += 3;
      _self.data.recordIngFlag = false;
      if(parseInt(time.millisecond/10) > 0){
        time.millisecond = time.millisecond%10;
        time.second += 1
        if(parseInt(time.second/60) > 0){
          time.second = time.second%10;
          time.minute += 1
        }
      }
      console.log('结束录音');
      let timestamp = Date.parse(new Date());
      let createTime = utils.formatTime(timestamp).substring(0, 10);
      let audioName = '新录音' + parseInt(_self.data.list.length + 1);
      _self.setData({
        isRecording: false,
        saveRecord: true,
        audioName: audioName
      });
      clearInterval(_self.data.recorder.timer);
      _self.data.recorder.currentAudio = res;
      _self.data.recorder.currentAudio['createTime'] = createTime;
      _self.data.recorder.currentAudio['length'] = time;
      
    }) 
    //已录制完指定帧大小的文件事件
    _self.data.recorder.recorderManager.onFrameRecorded(() => {
      console.log('已录制完指定帧大小的文件事件');
      _self.data.recordIngFlag = false;
      clearInterval(_self.data.recorder.timer)
      _self.setData({
        isRecording: false
      })
    });
    //录音是出错
    _self.data.recorder.recorderManager.onError((res) => {
      console.log('录音出错了'+res);
    });
    //开始播放
    _self.data.recorder.innerAudioContext.onPlay(() => {
      console.log('开始播放事件');
      const index = _self.data.audioIndex;
      let list = _self.data.list;
      let process = list[index].process;
      let length = list[index].length;
      let time = list[index].time;
      _self.data.audioPlayIngFlag = true;
      _self.data.list[index].timer = setInterval(() => {
        time.millisecond = time.millisecond + 1;
         process = process + _self.data.itemBar;
        if (process >= 100) {
          process = 100
        }
        if (time.millisecond == length.millisecond && time.second == length.second && time.minute == length.minute) {
          process = 100
          clearInterval(_self.data.list[index].timer);
        }
        if (time.millisecond >= 10) {
          time.millisecond = 0;
          time.second = time.second + 1;
        }
        if (time.second >= 60) {
          time.second = 0;
          time.minute = time.minute + 1;
        }
        list[index].process = process;
        list[index].play = true;
        list[index].time = time;
        _self.setData({
          list: list
        })
      }, 100);
    });

    //暂停播放事件
    _self.data.recorder.innerAudioContext.onPause(() => {
      let list = _self.data.list;
      const index = _self.data.audioIndex;
      _self.data.audioPlayFlag = true;
      _self.data.audioPlayIngFlag = false;
      console.log('暂停播放事件')
      clearInterval(_self.data.list[index].timer);
      list[index].play = false;
      _self.setData({
        list: list,
      }); 
      
    });
    //停止播放事件
    _self.data.recorder.innerAudioContext.onStop((res) => {
      let list = _self.data.list;
      const index = _self.data.audioIndex;
      console.log('停止播放事件')
      clearInterval(_self.data.list[index].timer);
      _self.data.audioPlayIngFlag = false;
      _self.data.audioPlayFlag = true;
      list[index].play = false;
      list[index].process = 0;
      list[index].time.minute = 0;
      list[index].time.second = 0;
      list[index].time.millisecond = 0;
      _self.setData({
        list: list,
      });

    });
    
    //播放结束自然暂停事件
    _self.data.recorder.innerAudioContext.onEnded(() => {
      let list = _self.data.list;
      const index = _self.data.audioIndex;
      console.log('播放结束自然暂停事件');
      clearInterval(_self.data.list[index].timer);
      _self.data.audioPlayFlag = true;
      _self.data.audioPlayIngFlag = false;
      list[index].process = 0;
      list[index].play = false;
      list[index].time.minute = 0;
      list[index].time.second = 0;
      list[index].time.millisecond = 0;
      _self.setData({
        list:list,
      });
    });
    //跳到指定时间播放
    _self.data.recorder.innerAudioContext.onSeeked(() => {
      _self.data.audioPlayFlag = true;
       console.log('跳到指定时间');

    });
    _self.data.recorder.innerAudioContext.onError((res) =>{
      console.log("播放出错 "+res);
    });
  },
  // 开始录音
  startRecord: function(e){
    const _self = this;
    let isRecording = _self.data.isRecording;
    let time = _self.data.time;
    let displace = _self.data.displace;
    let lunitPx = _self.data.lunitPx;
    let moveitem = parseFloat(_self.data.unitPx/10);
    let halfScreenWidth = parseFloat(_self.data.unitPx*3);
   
    if (_self.data.audioPlayIngFlag){
      _self.stopPlay();
    }
    _self.setData({
      isRecording: true,
      showRecordTop: true,
      editIndex: -1
    })
    if(time.minute != 0 || time.second != 0 || time.millisecond != 0){
      if(app.globalData.system.indexOf('ANDROID') != -1){
        console.log("安卓")
        let isRecording = _self.data.isRecording;
        let time = _self.data.time;
        let displace = _self.data.displace;
        let lunitPx = _self.data.lunitPx;
        let moveitem = parseFloat(_self.data.unitPx / 10);
        let halfScreenWidth = parseFloat(_self.data.unitPx * 3);
        _self.data.recordIngFlag = true;
        _self.data.recorder.timer = setInterval(function () {
          time.millisecond = time.millisecond + 1;
          lunitPx = lunitPx + moveitem

          if (lunitPx >= halfScreenWidth) {
            displace = displace + moveitem
          }
          if (time.millisecond >= 10) {
            time.millisecond = 0;
            time.second = time.second + 1;
          }
          if (time.second >= 60) {
            time.second = 0;
            time.minute = time.minute + 1;
          }
          _self.setData({
            time: time,
            lunitPx: lunitPx,
            displace: displace
          })
        }, 100)
        console.log('开始录音')
      }
      
      _self.data.recorder.recorderManager.resume();
    }else{
      const options = {
        duration: 600000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'mp3',
      } 
      _self.data.recorder.recorderManager.start(options);
      
    } 
    
  },
  //暂停录音
  pauseRecord: function (e) {
    const _self = this;
    _self.data.recorder.recorderManager.pause();
    _self.setData({
      isRecording: false
    })
  },
  //停止录音
  overRecord: function(){
    const _self = this;
    _self.setData({
      showSave: true
    })
    _self.data.recorder.recorderManager.stop();  
  },
  //保存录音
  saveRecord: function(e){
    const _self = this;
    let list = _self.data.list;
    let saveRecord = _self.data.saveRecord;
    let audioName = _self.data.audioName;
    let showCheck = _self.data.showCheck;
    if(audioName == ''){
      wx.showModal({
        title: '提示',
        content: '音频名称不能为空'
      })
      return
    }
    if(!saveRecord){
      list[showCheck].audioName = audioName;
      wx.setStorage({
        key:"list",
        data:list,
        success: function(){
          wx.getStorage({
            key: 'list',
            success: function(res) {
              console.log(res.data);
              let resData = res.data;
              for (var i = 0; i < resData.length; i++) {
                resData[i].play = false;
                resData[i].process = 0;
                resData[i].timer = null;
                resData[i].isDisabled = true;
                resData[i].time = {
                  minute: 0,
                  second: 0,
                  millisecond: 0,
                }
              }
              _self.setData({
                showSave: false,
                list: resData
              })
            } 
          })
          
        }
      })
      return
    }
    _self.data.recorder.currentAudio['audioName'] = audioName;
    list.push(_self.data.recorder.currentAudio);
    wx.setStorage({
      key:"list",
      data:list,
      success: function(){
        wx.getStorage({
          key: 'list',
          success: function(res) {
            console.log(res.data)
            let resData = res.data;
            for (var i = 0; i < resData.length; i++) {
              resData[i].play = false;
              resData[i].process = 0;
              resData[i].timer = null;
              resData[i].isDisabled = true;
              resData[i].time = {
                minute: 0,
                second: 0,
                millisecond: 0,
              }
            }

            _self.setData({
              showSave: false,
              showRecordTop: false,
              time: {
                minute: 0,
                second: 0,
                millisecond: 0
              },
              list: resData,
              lunitPx: _self.data.unitPx,
              displace: 0
            })
          } 
        })
        
      }
    })
  },
  //删除录音
  deleteRecord: function(e){
    const _self = this;
    let list = _self.data.list;
    clearInterval(_self.data.recorder.timer);
    _self.data.recorder.recorderManager.stop();
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 2000
    })
    _self.setData({
      showSave: false,
      showRecordTop: false,
      time: {
        minute: 0,
        second: 0,
        millisecond: 0
      },
      lunitPx: _self.data.unitPx,
      displace: 0
    })
  },
  //编辑录音文件名字
  editAudioName: function(e){
    const that = this;
    that.setData({
      audioName: e.detail.value
    })
  },
  //展示要播放的一条
  editAudio: function(e){
    const _self = this;
    const index = parseInt(e.currentTarget.dataset.index);
    if (_self.data.editIndex == index) {
      _self.setData({
        editIndex: -1
      })
      return
    }
    _self.setData({
      showRecordTop: false,
      editIndex: index
    })

  },
  //开始播放点击事件
  startPlay: function(e){
    const _self = this;
    const index = e.currentTarget.dataset.index;
    if (_self.data.recordIngFlag){
      _self.overRecord();
    }
    if (_self.data.audioIndex == ""){
      _self.audioPlay();
    }else if (_self.data.audioIndex != "" && _self.data.audioPlayFlag){
      _self.data.audioPlayFlag = false;
      _self.audioPlay();
    }else{
      _self.data.audioPlayFlag = false;
      util.remind("当前正在播放，请先关闭，才能播放下一个！")
     // _self.data.recorder.innerAudioContext.stop();
    }
    
  },
  //开始播放函数
  audioPlay:function(){
    const _self = this;
    const index = _self.data.editIndex;
    let list = _self.data.list;
    let length = parseFloat(list[index].length.minute * 60 + list[index].length.second + list[index].length.millisecond / 10);
    let itemBar = parseFloat(10 / length);
    _self.data.audioIndex = index;
    _self.data.recorder.innerAudioContext.src = list[index].tempFilePath;
    list[index].isDisabled = false;
    _self.data.recorder.innerAudioContext.play();
    _self.setData({
      itemBar: itemBar,
      list: list
    })
  },
  //暂停播放
  pausePlay: function (e) {
    const _self = this;
    const index = _self.data.audioIndex;
    let list = _self.data.list;
    _self.data.recorder.innerAudioContext.pause();
  },
  //停止播放
  stopPlay:function(e){
    const _self = this;
    const index = _self.data.audioIndex;
    let list = _self.data.list;
    _self.data.recorder.innerAudioContext.stop();
  },

  changeingProcess: function(e){
    const _self = this;
    _self.data.recorder.innerAudioContext.pause()
  },

  //拖拽改变播放进度
  changeProcess: function(e){  
    const process = e.detail.value;
    const _self = this;
    const index = _self.data.editIndex;
    let list = _self.data.list;
    let length = Math.ceil(list[index].length.minute*600 + list[index].length.second*10 + list[index].length.millisecond);
    let newTime = Math.round((process/100)*length);
    let newProcess = 0

    list[index].time.minute = parseInt(newTime/600);
    list[index].time.second = parseInt((newTime%600)/10);
    list[index].time.millisecond = parseInt((newTime % 600)%10);
    list[index].process = process;
    newProcess = list[index].time.minute * 60 + list[index].time.second + list[index].time.millisecond/10;
    _self.setData({
      list: list
    })
    
    _self.data.recorder.innerAudioContext.seek(newProcess) 
  },

  //取消保存对音频的重命名
  cancleEdit: function(e){
    this.setData({
        showSave: false,
        showRecordTop: false
    })
  },

  edit: function(e){
    const that = this;
    const index = e.currentTarget.dataset.index;
    let list = that.data.list;
    let audioName = list[index].audioName
    that.setData({
      showCheck: index,
      showSave: true,
      saveRecord: false,
      audioName: audioName
    })
    
  },
  //删除缓存中的录音
  deleteAudio: function(e){
    const _self = this;
    const index = e.currentTarget.dataset.index;
    let list = _self.data.list;
    _self.data.recorder.recorderManager.stop();
    clearInterval(_self.data.recorder.timer);
    if (typeof index == "undefined"){
      wx.showToast({
        title: '删除成功',
        icon: 'success',
        duration: 2000
      })
      _self.setData({
        showSave: false,
        showRecordTop: false,
        time: {
          minute: 0,
          second: 0,
          millisecond: 0
        },
        lunitPx: _self.data.unitPx,
        displace: 0
      })
      return
    }
    list.splice(index,1)
    wx.setStorage({
      key: 'list',
      data: list,
      success: function(){
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
        wx.getStorage({
          key: 'list',
          success: function(res) {
            let resData = res.data;
            for (var i = 0; i < resData.length; i++) {
              resData[i].play = false;
              resData[i].process = 0;
              resData[i].timer = null;
              resData[i].isDisabled = true;
              resData[i].time = {
                minute: 0,
                second: 0,
                millisecond: 0,
              }
            }
            _self.setData({
              list: resData,
              showSave: false,
              showRecordTop: false,
              time: {
                minute: 0,
                second: 0,
                millisecond: 0
              },
              lunitPx: _self.data.unitPx,
              displace: 0
            })
          } 
        })  
      },
      fail: function(){
        console.log('删除失败')
      }
    })
  }
})
