// pages/onlineRoom/room.js
const request = require('../../utils/request.js');
const socketHost = require('../../utils/config.js');
const app = require('../../app.js')
const formatNumber = n => {   //时间格式转换 一位数转两位
  n = n.toString()
  return n[1] ? n : '0' + n
}
// const plugin = requirePlugin("WechatAI")
// const recordManager = plugin.getRecordRecognitionManager()

// recordManager.onStop = function (res) {
//   console.log("record file path", res.tempFilePath)
//   console.log("result", res)
// }

// recordManager.start = function (res) {
//   console.log(res)
// }

// recordManager.onError = function (res) {
//   console.error("error msg", res.msg)
// }
// recordManager.onRecognize = function (res) {
//   console.log("current result", res.result)
// }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role: '',              // 表示当前的角色，取值'consultant'表示咨询师，'applyer'表示申请人,'beapplyer'表示被申请人
    meetingId: '',         // 房间id
    code: '',               //身份代码  申请方=10  被申请方=20  咨询师=50  登记人=31
    userId: '',
    // prefix: 'PTEST_1400053166_', //环境_sdkappid

    //视频人员信息
    pusher: {},
    player: [],

    num: 0,  //参与视频的当事人数量
    firstShow: true,  //首次渲染
    scrollTop: 100,
    config: {           //live-pusher live-player对应的配置项
      aspect: '3:4',     //设置画面比例，取值为'3:4'或者'9:16'
      minBitrate: 200,   //设置码率范围为[minBitrate,maxBitrate]，四人建议设置为200~400
      maxBitrate: 400,
      beauty: 0,        //美颜程度，取值为0~9
      debug: false,     //是否显示log

    },

    backgroundMute: true,
    msgList: [],
    content: '', //用户输入内容
    btnDisabled: true,
    toView: '',
    isSocketOpen: false,
    socketRequest: 0,  //websocket连接失败次数
    pageSize: 5,  //获取历史消息条数
    pusherContext: '',
    isMessageHide: true,
    timeOut: 0,
    isPush: false,
    btnShow: true,
    heartInterval: null,
    requestMsg:true     //防止重复触发获取历史消息
  },
  // startRecord:function(){
  //   recordManager.start()
  // },
  // stopRecord: function () {
  //   recordManager.onStop()
    
  // },
  onPush: function (e) {
    console.log('onpush')
    console.log(e.detail.code)
    var that = this
    that.data.isPush = true
    if (!this.data.pusherContext) {
      this.data.pusherContext = wx.createLivePusherContext('pusher');
    }
    if (e.detail.code == -1307) {
      wx.showModal({
        title: '提示',
        content: '网络状况较差，请重新进入房间',
        showCancel: false,
        complete: function () {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },

  onPlay: function (ret) {
    console.log('onplay')
    console.log(ret)
    // if (ret.detail.code == -2301){
    //   wx.showModal({
    //     title: '提示',
    //     content: '进入房间失败',
    //     showCancel: false,
    //     complete: function () {
    //       wx.navigateBack({ delta: 1 });
    //     }
    //   });
    // }
  },
  onError: function (e) {
    var self = this;
    console.log('错误处理', e);
    e.detail.errCode == 10001 ? (e.detail.errMsg = '未获取到摄像头功能权限，请删除小程序后重新打开') : '';
    e.detail.errCode == 10002 ? (e.detail.errMsg = '未获取到录音功能权限，请删除小程序后重新打开') : '';

    wx.showModal({
      title: '提示',
      content: e.detail.errMsg || '未获取到摄像头、录音功能权限，请删除小程序后重新打开',
      showCancel: false,
      complete: function () {
        wx.navigateBack({ delta: 1 });
      }
    });
  },
// 控制本身
  changeMute: function (e) {
    var that = this
    if (!this.data.pusher.muted) {
      that.sendSocketInstructions('closeVoice', that.data.pusher.id)
    } else {
      that.sendSocketInstructions('openVoice', that.data.pusher.id)
    }
  },
  
  closeCamera: function (e) {
    var that = this
    if (!this.data.pusher.enableCamera) {
      that.sendSocketInstructions('openVideo', that.data.pusher.id)
    } else {
      that.sendSocketInstructions('closeVideo', that.data.pusher.id)
    }
  },

  // 咨询师控制其他用户
  changeVoice: function (e) {
    var that = this, id = e.currentTarget.dataset.id
    console.log(id)
    if (that.data.role == 'consultant') {
      that.data.player.forEach(function(val){
        if(val.id==id){
          if (!val.muted) {
            that.sendSocketInstructions('closeVoice', id)
          } else {
            that.sendSocketInstructions('openVoice', id)
          }
        }
      })
    }
  },
  changeCamera: function (e) {
    var that = this, id = e.currentTarget.dataset.id
    console.log(id)
    if (that.data.role == 'consultant') {
      that.data.player.forEach(function (val) {
        if (val.id == id) {
          if (!val.enableCamera) {
            that.sendSocketInstructions('openVideo', id)
          } else {
            that.sendSocketInstructions('closeVideo', id)
          }
        }
      })
    }
  },
  showLog: function () {
    this.data.config.debug = !this.data.config.debug;
    this.setData({
      config: this.data.config
    });
  },

  openSocket: function () {
    var that = this
    //建立连接
    if (!that.data.isSocketOpen) {
      wx.connectSocket({
        url: socketHost.socket_Host+ that.data.code + '_' + that.data.userId + ',' + that.data.meetingId,
        header: {
          'content-type': 'application/json'
        },
        method: "POST"
      })
    }
    //连接成功
    wx.onSocketOpen(function () {
      // console.log('WebSocket连接已打开！')
      that.setData({
        isSocketOpen: true,
        socketRequest: 0
      })
      that.data.heartInterval = setInterval(function () {
        that.sendSocketInstructions("heart", "@heart");
      }, 5000)
    })
    //连接失败
    wx.onSocketError(function () {
      // console.log('websocket连接失败');
      if (that.data.socketRequest < 5) {
        that.setData({
          socketRequest: that.data.socketRequest++,
        })
        that.openSocket()
      } else {
        wx.showModal({
          title: '提示',
          content: '网络多次连接失败，请退出重试',
          showCancel: false,
          complete: function () {
            wx.navigateBack({ delta: 1 })
          }
        })
      }
    })
  },

  sendSocketInstructions: function (eventCode, id) {
    var socketMsg = {}, that = this;
    if (that.data.isSocketOpen) {
      socketMsg.event = eventCode
      socketMsg.data = id
      socketMsg = JSON.stringify(socketMsg)
      wx.sendSocketMessage({
        data: socketMsg,
        success: function (e) {
          // console.log('发送成功')
          // console.log(e)
        },
        fail: function (e) {
          // console.log('发送失败')
          // console.log(e)
        }
      })
    } else {
      that.openSocket()
      that.sendSocketInstructions(eventCode, id)
    }
  },
  inputMsg: function (e) {
    this.setData({
      content: e.detail.value,
    })
    if (this.data.content) {
      this.setData({
        btnDisabled: false
      })
    } else {
      this.setData({
        btnDisabled: true
      })
    }

  },
  sendMessage: function () {
    var that = this, content = that.data.content, sender, name = '';
    that.setData({
      content: '',
      btnDisabled: true
    })
    // console.log(that.data.role)
    var sender = that.data.pusher.role.role, name = that.data.pusher.actualName
    request.POST('/mmc/saveMsg', '', { vpersonnelId: that.data.userId, vmeettingId: that.data.meetingId, content: content, sender: sender + '(' + name + ')' },
      function (ret) {
        // console.log(ret)
        if (ret.data.code == '200') {  //发送成功

          that.sendSocketInstructions('getChatMsg', ret.data.result.msgid)
        } else {
          wx.showModal({
            title: '提示',
            content: '消息发送失败，请重新发送',
            showCancel: false,
          })
        }
      })
  },
  getHistoryMsg: function () {
    
    var that = this, lastId = 0;
    if (that.data.msgList.length) {
      lastId = that.data.msgList[0].id
    }
    if (that.data.requestMsg){
      that.data.requestMsg=false
      request.POST("/mmc/getMsgList", '', { msgId: lastId, pageSize: that.data.pageSize, meetingId: that.data.meetingId },
        function (ret) {
          console.log(ret)
          if (ret.data.result.msg.length) {
            ret.data.result.msg.reverse().forEach(function (val) {
              var time = val.create_time
              var newTime = that.formatTime(time)
              val.create_time = newTime
              that.data.msgList.unshift(val)
            })
            that.data.toView = ret.data.result.msg[0].id
            that.setData({
              msgList: that.data.msgList,
              toView: that.data.toView
            })
            that.data.requestMsg = true
            // console.log(that.data.msgList)
          }
        }
      )
    }
  },
  formatTime: function (e) {
    var date = new Date(e)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
    return [hour, minute, second].map(formatNumber).join(':')
  },
  getInfo: function () {
    var that = this
    request.POST('mmc/inMeeting', '', { meetingId: that.data.meetingId, userId: that.data.userId },
      function (ret) {
        console.log(ret)
        // that.data.pusher ={}
        // that.data.player = []
        var code = ret.data.result.role.role.code
        // 判断当前角色 设置role
        that.data.pusher = ret.data.result.pusher
        
        if (code == 50) {
          that.data.player = ret.data.result.litigant
        } else {
          that.data.player = ret.data.result.player
        }
        that.data.role = ret.data.result.roleMark
        that.data.pusher.muted = false
        that.data.pusher.enableCamera = true
        that.data.player.forEach(function (ply) {
          ply.muted = false
          ply.enableCamera = true
        })
        that.setData({
          role: that.data.role,
          code: code
        })
        that.openSocket()
        // console.log(that.data.members)
      },
      function (ret) {
        // console.log(ret)
        wx.showModal({
          title: '提示',
          content: '连接失败，请检查网络情况，再重新进入',
          showCancel: false,
          complete: function () {
            wx.navigateBack({
              delta: 1
            })
          }
        })
      },

    )
  },
  toggleHide: function () {
    this.setData({ isMessageHide: !this.data.isMessageHide })
  },
  alertUser:function(){
    wx.showModal({
      title: '提示',
      content: '您的微信版本过低，请更新后再使用我们的视频功能',
      showCancel:false,
      complete:function(){
        wx.navigateBack({ delta: 1 })
      }
    })
  },
  wxVersionCheck:function(){
    var res = wx.getSystemInfoSync()
    // console.log(res.model)
    // console.log(res.system)
    console.log(res.version)   //最低6.6.5   6.6.6  
    console.log(res.platform)  //android  ios
    var num1 = res.version.split(".")[0], num2 = res.version.split(".")[1], num3 = res.version.split(".")[2];

    console.log(num1)
    console.log(num2)
    console.log(num3)
    var sysNum = res.system.split(" ")[1], sysNum1 = sysNum.split(".")[0], sysNum2 = sysNum.split(".")[1]
    if (res.system.split(" ")[0] == "Android") {
      console.log(typeof sysNum1)
      if (parseInt(sysNum1) < 5) {
        wx.showModal({
          title: '提示',
          content: '您当前的手机系统版本为' + res.system + '，版本过低时会影响您的使用，请更新！',
          showCancel: false
        })
      }
    } else if (res.system.split(" ")[0] == "iOS") {
      if (parseInt(sysNum1) < 10) {
        wx.showModal({
          title: '提示',
          content: '您当前的手机系统版本为' + res.system + '，版本过低时会影响您的使用，请更新！',
          showCancel: false
        })
      }
    }
    if (num1 < 6) {
      alertUser()
    }
    if (num1 == 6 && num2 < 6) {
      alertUser()
    }

    if (res.platform == 'android') {
      if (num1 == 6 && num2 == 6 && num3 < 5) {
        alertUser()
      }
    } else if (res.platform == 'ios') {
      if (num1 == 6 && num2 == 6 && num3 < 6) {
        alertUser()
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.wxVersionCheck()
    wx.showLoading({
      title: '进入房间中',
    })
    var that = this
    // console.log('onLoad')
    // console.log(options)
    if (options.q) {   //扫码进入
      var enterInfo = options.q.split("id%3D0%26")[1]
      var userInfo = enterInfo.split("%26")[1], meetingInfo = enterInfo.split("%26")[0]
      that.data.userId = userInfo.split("%3D")[1]
      that.data.meetingId = meetingInfo.split("%3D")[1]
    } else {
      //小程序端按流程进入
      this.data.userId = options.userId;
      this.data.meetingId = options.meetingId;
    }
    this.setData({
      userId: this.data.userId,
      meetingId: this.data.meetingId,
    });
    console.log(this.data.userId)
    console.log(this.data.meetingId)
    wx.setKeepScreenOn({
      keepScreenOn: true,
    })
    wx.setNavigationBarTitle({ title: '视频中' });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    // console.log('onready')
    this.setData({
      pusherContext: wx.createLivePusherContext('pusher')
    })
    if (that.data.firstShow) {
      that.getInfo();
    }
    this.getHistoryMsg()
    var interval = setInterval(function () {
      console.log("<<init timeout")
      console.log(that.data.timeOut)
      console.log(that.data.isPush)
      if (that.data.timeOut < 10 && !that.data.isPush) {
        that.data.timeOut++
        that.data.pusherContext.start()
      } else {
        clearInterval(interval)
        console.log('clearInterval')
      }
    }, 3000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onshow')
    var that = this
    if (!that.data.firstShow && !that.data.isSocketOpen) {
      that.getInfo();
      that.data.msgList = []
      that.setData({ msgList: that.data.msgList})
      that.getHistoryMsg()
    }
    wx.onSocketClose(function (res) {
      console.log('WebSocket 意外关闭------------')


      clearInterval(that.data.heartInterval);
      that.data.heartInterval = null;
      //   wx.livePusherContex("pusher").stop()
      that.setData({ isSocketOpen: false })
    })
    //接收数据
    wx.onSocketMessage(function (ret) {
      // console.log("收到消息")
      ret.data = JSON.parse(ret.data)
      console.log(ret.data)
      switch (ret.data.event) {
        case 'getPush': {
          that.data.num = 0
          ret.data.data.pushers.forEach(function (val) {
            var role = val.userId.split("_")[2]
            if (role != 50) {
              that.data.num++
            }
            if (role == that.data.code) {
              that.data.pusher.push = val
              that.data.pusher.muted = false
              that.data.pusher.enableCamera = true
              // that.data.player.forEach(function (ply) {
              //   ply.muted = false
              //   ply.enableCamera = true
              // })
            } else {
              that.data.player.forEach(function (res) {
                if (res.role.code == role) {
                  res.push = val
                  res.muted = false
                  res.enableCamera = true
                }
              })
            }
          })
          // console.log(that.data.num)
          

          that.setData({
            pusher: that.data.pusher,
            player: that.data.player,
            num: that.data.num
          })
          
          setTimeout(function () {
            that.data.player.forEach(function (res) {
              if (res.push) {
                console.log(res);
                console.log("--------------------------")
                var code = res.role.code.toString();
                wx.createLivePlayerContext(code).play()
              }
            })
          }, 3000)
          that.data.pusherContext.start();
          if (that.data.firstShow) {
            wx.hideLoading();
            that.data.firstShow = false
          }
          break;
        }
        case 'getChatMsg': {
          request.POST('/mmc/getOneMsg', '', { msgId: ret.data.data },
            function (msg) {
              // console.log(msg)
              var time = msg.data.result.msg.create_time
              var newTime = that.formatTime(time)
              msg.data.result.msg.create_time = newTime
              that.data.msgList.push(msg.data.result.msg)
              that.setData({
                msgList: that.data.msgList,
                toView: ret.data.data
              })
            })
          break;
        }
        case 'closeVoice': {
          if (ret.data.data == that.data.userId){
            that.data.pusher.muted = true
            that.setData({
              pusher: that.data.pusher,
            })
          }else{
            that.data.player.forEach(function (val) {
              if (val.id == ret.data.data) {
                val.muted = true
              }
            })
            that.setData({
              player: that.data.player,
            })
          }
          break;
        }
        case 'openVoice': {
          if (ret.data.data == that.data.userId) {
            that.data.pusher.muted = false
            that.setData({
              pusher: that.data.pusher,
            })
          } else {
            that.data.player.forEach(function (val) {
              if (val.id == ret.data.data) {
                val.muted = false
              }
            })
            that.setData({
              player: that.data.player,
            })
          }
          break;
        }
        case 'closeVideo': {
          if (ret.data.data == that.data.userId) {
            that.data.pusher.enableCamera = false
            that.setData({
              pusher: that.data.pusher,
            })
          } else {
            that.data.player.forEach(function (val) {
              if (val.id == ret.data.data) {
                val.enableCamera = false
              }
            })
            that.setData({
              player: that.data.player,
            })
          }
          break;
        }
        case 'openVideo': {
          if (ret.data.data == that.data.userId) {
            that.data.pusher.enableCamera = true
            that.setData({
              pusher: that.data.pusher,
            })
          } else {
            that.data.player.forEach(function (val) {
              if (val.id == ret.data.data) {
                val.enableCamera = true
              }
            })
            that.setData({
              player: that.data.player,
            })
          }
        }
        case 'role': {
          var userRole = ret.data.data.split("_")[2]
          wx.createLivePlayerContext(userRole).stop()
          console.log(userRole)
          for (var i = 0; i < that.data.player.length; i++) {
            if (that.data.player[i].role.code == userRole) {
              that.data.player[i].push = {};
              if (userRole != 50) {
                that.data.num--;
              }
            }
          }
          // that.data.player.forEach(function (val) {
          //   if (val.role.code == userRole) {
          //     val = {}
          //   }
          // })
          that.setData({
            player: that.data.player,
            num: that.data.num
          })
        }
        case 'heart': {
          console.log(ret.data.data);
        }
      }
    })
    // // 语音识别onError
    // recordManager.onError = function (res) {
    //   console.error("error msg", res)
    // }
    // recordManager.onRecognize = function (res) {
    //   console.log("current result", res)
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide-----------')
    var that = this
    this.data.pusherContext.stop()
    wx.closeSocket()
    that.data.pusher = {}
    that.data.player = []
    that.setData({
      pusher: that.data.pusher,
      player: that.data.player,
      timeOut: 0,
      isPush: false,
      msgList:[]
    })
    wx.onSocketClose(function (res) {
      console.log('WebSocket onhide 已关闭！')
      clearInterval(that.data.heartInterval);
      that.data.heartInterval = null;
      //   wx.livePusherContex("pusher").stop()
      that.setData({ isSocketOpen: false })
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload-------------')
    var that = this
    // console.log(that.data.pusherContext);
    that.data.pusherContext.stop()
    wx.closeSocket()
    that.data.pusher = {}
    that.data.player = []
    that.setData({
      pusher: that.data.pusher,
      player: that.data.player,
      timeOut: 0,
      isPush: false,
      msgList:[]
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket onUnload 已关闭！')
      clearInterval(that.data.heartInterval);
      that.data.heartInterval = null;
      that.setData({ isSocketOpen: false })
    })
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
  onShareAppMessage: function () {

  }
})