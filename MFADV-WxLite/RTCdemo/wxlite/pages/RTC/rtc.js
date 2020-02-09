Page({
  data: {
    focus: false,
    playing: false,
    frontCamera: true,
    cameraContext: {},
    pushUrl1: "",
    playUrl1: "",
    playUrl2: "",
    playUrl:"",
    mode: "HD",
    muted: false,
    enableCamera: true,
    orientation: "vertical",
    beauty: 6.3,
    whiteness: 3.0,
    backgroundMute: false,
    hide: false,
    debug: false,
    roles:["role1","role2","role3"],
    members:[],
    role:"role1"
  },
  createContext: function () {
    this.setData({
      cameraContext: wx.createLivePusherContext('camera-push1')
    })
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
  onPushEvent: function (e) {
    console.log("start");
    console.log(e.detail.code);

    if (e.detail.code == -1307) {
      this.stop();
      wx.showToast({
        title: '推流多次失败',
      })
    }
  },
  onPlay:function(){
    wx.createLivePlayerContext("play2").play();
  },

  //进入会议
  onReady:function(){
    wx.createLivePusherContext('push1').start();
     var self=this;
     console.log(self);
     //建立链接
      wx.connectSocket({
        url: 'ws://' + '122.112.210.226:28888' + '/' + 'meeting/' + this.data.role
      })
      //监听消息
      wx.onSocketMessage(function (res) {
        var json = JSON.parse(res.data);
        console.log(json);
        //自己的pushUrl与playUrl
        if (json.event =="rolelist"){
          self.data.members=json.data;
        }else if (json.event =="ownUrl"){
          self.setData({
            "pushUrl1": json.data.pushUrl
          })       
          self.data.playUrl=json.data.playUrl;
        } 
      })
      
      //发送offer
      setTimeout(function(){
        wx.createLivePusherContext('push1').start();
        console.log("3333");
        for (var i = 0; i < self.data.members.length; i++) {
          // if (self.data.members[i] != self.data.role) {
            wx.sendSocketMessage({
              data: "{'event':'offer','own':self.data.role}"
            })
          //}

        } 
      },1000)


  },
  clickkk:function(){
   // console.log("222");
    this.setData({
      pushUrl1:"rtmp://3891.livepush.myqcloud.com/live/3891_user_af2834fa_5e7e?bizid=3891&txSecret=e9962c5e1eee85f0251f9a43633c3e12&txTime=5A59713D"
    })
    wx.createLivePusherContext('push1').start();
  },
  //发送soket
  // sendSocketMessage:function(msg){
  //   wx.sendSocketMessage({
  //     data: msg
  //   })
  // }
})