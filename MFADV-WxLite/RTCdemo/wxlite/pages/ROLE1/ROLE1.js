// pages/ROLE1/ROLE1.js
Page({

  data: {
    focus: false,
    playing: false,
    frontCamera: true,
    cameraContext: {},
    mode: "RTC",
    muted: false,
    enableCamera: true,
    orientation: "vertical",
    beauty: 6.3,
    whiteness: 3.0,
    backgroundMute: false,
    hide: false,
    debug: false,
    roles: ["role1", "role2", "role3"],
    members: [],
    role: "role1",
    msgs:[],
    inputTxt:"",
    soketMark:false
  },
  createContext: function () {
    this.setData({
      cameraContext: wx.createLivePusherContext('camera-push1')
    })
  },
  //得到发送的消息
  getValue:function(e){
    this.setData({
      inputTxt: e.detail.value
  })
  },
  //点击发送消息
  send: function () {
    //if (this.soketMark){
      console.log("开始发送消息");
      wx.sendSocketMessage({
        data: this.data.inputTxt 
      })
    //}

  },
  onReady: function () {
    console.log("onLoad onReady");
    this.createContext();

    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
  },
  onPlayEvent: function (e) {

    if (e.detail.code == 2004) {
      wx.hideLoading();
    }
  },

  onLoad:function(e){
    self=this;
   // wx.closeSocket(); 
    //链接websoket
    if (wx.isSoket != true){
      wx.connectSocket({
        url: 'ws://' + '122.112.210.226:28888' + '/' + 'meeting/' + this.data.role
      })
      console.log("建立链接")
    }

    //websket发送消息
   wx.onSocketMessage(function (res) {
     console.log(res);
     var json = JSON.parse(res.data);
     //聊天消息
     if(json.event=="message"){
       console.log(json.data);
       var m=self.data.msgs;
       m.push(json.data);
       console.log(m);
        self.setData({
          'msgs':m
        });
        self.setData({
          'inputTxt':""
        })
     }else if(json.event=="close"){
       console.log("链接关闭")
       wx.closeSocket();
     }
    })
   wx.onSocketOpen(function (res) {
     wx.isSoket=true;
     console.log('WebSocket连接已打开！')
   })
   wx.onSocketClose(function (res) {
     wx.isSoket=false
     console.log('WebSocket 已关闭！')
   })
   wx.onSocketError(function (res) {
     console.log('WebSocket连接打开失败，请检查！')
   })
  },
  onHide: function () {
    console.log("onHide");
    // Do something when page hide.
  },
  onPushEvent: function (e) {
    console.log("start");
    console.log(e.detail.code);

    if (e.detail.code == -1307) {
      this.stop();
      wx.showToast({
        title: '推流多次失败',
      })
    }
  }
})