
const util = require('../../utils/request.js');
var app=getApp();
var pageNo=1;
var idarr=[];
var b=0;
Page({
  data:{
    array: ['全部日记', '公开日记', '隐私日记'],
    index: 0,
    delIndex:0,
    pageNo:'1',
    outRotate: false,
    groupId:0,
    three:'all',
    groups:[],
    list:[],
    isMore:true,
    markUrl01:'/img/d_mark01.png',
    markUrl02: '/img/d_mark02.png',
    markUrl03: '/img/d_mark03.png',
    markUrl04: '/img/d_mark04.png',
    addIndex:''
  },
  // 日记隐私选择
  bindPickerChange: function (e) {
    if (e.detail.value==0){
      this.setData({
        three:'all'
      });
      this.onLoad; 
    } else if (e.detail.value == 1) {
      this.setData({
        three: 'false'
      });
      this.onLoad;
    } else if (e.detail.value == 2) {
      this.setData({
        three: 'true'
      });
      this.onLoad;
    };
    this.setData({
      index: e.detail.value
      // outRotate:true
    });
    var that = this;
    util.POST('mobile/orangeDiary/queryPage', getApp().globalData.loginInfo.token, {
        pageNum: '1',
        pageSize: '10',
        privacy: that.data.three
      }, function (res) {
      // console.log(res.data.result.orangeDiaryGroups)
        that.data.groups = res.data.result.orangeDiaryGroups;
        for (var i = 0; i < that.data.groups.length; i++) {
          that.data.groups[i].checkNums = 0;
        }
        that.setData({
          groups: res.data.result.orangeDiaryGroups,
          size: res.data.result.size
        });//返回数据
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(getApp().globalData.showIndex);
    util.checkLoginModel();
    var that = this;
    if (app.globalData.loginInfo == null) {
      return false;
    }
    pageNo = 1;
    util.POST('mobile/orangeDiary/queryPage', getApp().globalData.loginInfo.token,{
          pageNum: '1',
          pageSize: '10',
          privacy: that.data.three
      }, function (res) {
        console.log(res.data.result.orangeDiaryGroups) 
        if (res.data.result.orangeDiaryGroups.length == 0){
          that.setData({
            groups: []
          })
        } else if (res.data.result.orangeDiaryGroups.length > 0){
          that.data.groups = res.data.result.orangeDiaryGroups;
          for (var i = 0; i < that.data.groups.length; i++) {
            that.data.groups[i].checkNums = 0;
            that.data.groups[i].resultText = 0;
            // if (res.data.result.orangeDiaryGroups.length > 0) {
            //   that.data.groups = res.data.result.orangeDiaryGroups;
            //   for (var i = 0; i < that.data.groups.length; i++) {
            //     that.data.groups[i].checkNums = 0;
            //   }
              if (getApp().globalData.showIndex !== '') {
                that.data.groups[getApp().globalData.showIndex].isDelete = 1;
              }
              that.setData({
                // groups: res.data.result.orangeDiaryGroups,
                groups: that.data.groups,
                size: res.data.result.size
              });//返回数据
            // }
          }
        }
    })
  },
  cutOut:function(e){
    var _that = this;
    var index = e.currentTarget.dataset.index;
    var groups = _that.data.groups;
    if (groups[index].isDelete==0){
      getApp().globalData.showIndex = '';
      groups[index].isDelete = 1;
    }else{
      getApp().globalData.showIndex = '';
      groups[index].isDelete = 0;
    }
    _that.setData({
      groups: groups
    })
    // console.log(groups[index].isDelete)
  },
  title:function(e){
    var showIndex = e.currentTarget.dataset.index;
    getApp().globalData.showIndex = showIndex;
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // this.setData({
    //   groups:[]
    // });
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
  onShareAppMessage:function(){
    return {
      title:'构筑平安家庭，我们是您坚实的后盾！',
      path:'/pages/index/index',
      imageUrl: app.globalData.imgURL+'img/share.png'
    }
  },
  //数组删除重复
  removeByValue:function(array, val) {
    for(var i= 0; i<array.length; i++) {
      if (array[i] == val) {
         array.splice(i, 1);
         break;
      }
    }
  },
  delRemove:function(arr){
    var newArr = [arr[0]];
    for(var i= 1;i<arr.length;i++){
      if (newArr.indexOf(arr[i]) == -1) {
          newArr.push(arr[i]);
       }
    }
  return newArr;
  },
  //danxuan单选
  checklist(e) {
    var _this = this;
    const id = e.currentTarget.dataset.id;   // 获取日记id
    const groupId = e.currentTarget.dataset.groupid;   // 获取日记组id 
    var groupIndex = e.currentTarget.dataset.index; //分组索值引
    var inIdx = e.currentTarget.dataset.idx;  //分组中日记索引值
    var a = this.data.groups;
    a[groupIndex].checkNums = 0;
    var isApplyAry= [];
    // var sel = a[groupIndex].orangeDiaryList[inIdx].selected//单选
    a[groupIndex].orangeDiaryList[inIdx].selected = !a[groupIndex].orangeDiaryList[inIdx].selected;
    for (var i = 0; i < a[groupIndex].orangeDiaryList.length; i++) {
      a[groupIndex].checkNums = a[groupIndex].checkNums + a[groupIndex].orangeDiaryList[i].selected;
      if (a[groupIndex].orangeDiaryList[i].selected) {//判断提交删除文字
        isApplyAry.push(a[groupIndex].orangeDiaryList[i].isApply);
        a[groupIndex].resultText = 0;
        for (var p = 0; p < isApplyAry.length; p++) {
          a[groupIndex].resultText += Number(isApplyAry[p]);
        }
      } 
    };
    if (isApplyAry.length == 0) {//判断提交删除文字
      a[groupIndex].resultText = 0;
    }
    if (a[groupIndex].checkNums>0){
      a[groupIndex].selected = true;
      if (a[groupIndex].checkNums == a[groupIndex].orangeDiaryList.length){
        a[groupIndex].isDeleteGroup = true
      }else{
        a[groupIndex].isDeleteGroup = false
      }
    }else{
      a[groupIndex].selected = false;
      a[groupIndex].isDeleteGroup = false
    };
    this.setData({
      groups: a
    });
    // console.log(a[groupIndex].resultText)
  },
  //全选
  selectAll(e) {
    // console.log(e.target.dataset.index);
    var a = this.data.groups;
    var isApplyAry = [];
    b = e.target.dataset.index;
    a[b].isDeleteGroup = !this.data.groups[b].isDeleteGroup;
    for (var i=0;i<a[b].orangeDiaryList.length;i++){
      a[b].orangeDiaryList[i].selected = a[b].isDeleteGroup;
    };
    a[b].selected = a[b].isDeleteGroup;
    if (a[b].selected==true){
      a[b].checkNums = a[b].orangeDiaryList.length;
    }else{
      a[b].checkNums=0;
    };
    for (var i = 0; i < a[b].orangeDiaryList.length; i++) {//判断提交删除文字
      if (a[b].orangeDiaryList[i].selected) {
        isApplyAry.push(a[b].orangeDiaryList[i].isApply);
        a[b].resultText = 0;
        for (var p = 0; p < isApplyAry.length; p++) {
          a[b].resultText += Number(isApplyAry[p]);
        }
      }
    }
    if (isApplyAry.length == 0) {//判断提交删除文字
      a[b].resultText = 0;
    }
    this.setData({
      groups: a
    })
  },
  //删除询问弹窗   删除列表
  openConfirm: function (e) {
    var _that=this;
    var groupId = e.target.dataset.groupid;//分组ID
    var delIndex = e.target.dataset.index;//分组索引
    var oneIndex = e.target.dataset.oneIdx;//分组索引
    var newGroups = this.data.groups;
    this.setData({
      groupId: groupId,
      groups:newGroups
    });
    var idarr = [];
    wx.showModal({
      title: '确认删除',
      content: '删除请点击确认，返回请点击取消',
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          // console.log('确定');
          for (var i = 0; i < newGroups[delIndex].orangeDiaryList.length; i++) {
            if (newGroups[delIndex].orangeDiaryList[i].selected) {
              idarr.push(newGroups[delIndex].orangeDiaryList[i].id);
            } else {
              _that.removeByValue(idarr, newGroups[delIndex].orangeDiaryList[i].id);
            }
          };
          var del = _that.delRemove(idarr);
          var ids = del.toString();
          var token = getApp().globalData.loginInfo.token;
          var isDelGroup = _that.data.groups[delIndex].isDeleteGroup;
          var getAindex = getApp().globalData.showIndex;
          if (isDelGroup == true & getAindex !=''){
            getApp().globalData.showIndex-1;
          }//展示项-1
          wx.request({
            url: getApp().globalData.rootURL+'/mobile/orangeDiary/delete',
            data: [{
              isDeleteGroup: _that.data.groups[delIndex].isDeleteGroup,
              groupId: groupId,
              ids:ids
            }],
            method: 'DELETE',
            header: {
              'content-type': 'application/json', // 默认值
              'token': token
            },
            success: function (res) {
              newGroups[delIndex].checkNums=0;
              if(newGroups[delIndex].isDeleteGroup){
                newGroups.splice(delIndex, 1);
              }else{
                var nums = 0;
                var lengths = newGroups[delIndex].orangeDiaryList.length;
                for (var i = 0; i < lengths;i++){
                  if(newGroups[delIndex].orangeDiaryList[i].selected==true){
                    nums++;
                  }
                }
                for (var y = 0; y<nums; y++) {
                  lengths = newGroups[delIndex].orangeDiaryList.length;
                  for (var i = 0; i < lengths; i++) {
                    if (newGroups[delIndex].orangeDiaryList[i].selected == true) {
                      newGroups[delIndex].orangeDiaryList.splice(i, 1);
                      lengths = newGroups[delIndex].orangeDiaryList.length;
                      _that.setData({
                        groups: newGroups
                      });
                      newGroups[delIndex].selected = false;
                      break; 
                    }
                  }
                } 
              }
              _that.setData({
                groups: newGroups
              });
            }
          })
        } else {
          // console.log('取消')
        }
      }
    });
    _that.setData({
      groups: newGroups
    });
  },
  //  提交日记
  diaries:function(e){
    var _that = this;
    var groupId = e.target.dataset.groupid;//分组ID
    var delIndex = e.target.dataset.index;//分组索引
    var newGroups = this.data.groups;
    // console.log(newGroups[delIndex].orangeDiaryList.length);
    var idarr = [];
    if (newGroups[delIndex].orangeDiaryList.length>0){
      wx.showModal({
        title: '确认提交',
        content: '提交请点击确认，返回请点击取消',
        confirmText: "确认",
        cancelText: "取消",
        success: function (res) {
          if (res.confirm) {
            console.log('确定');
            for (var i = 0; i < newGroups[delIndex].orangeDiaryList.length; i++) {
              if (newGroups[delIndex].orangeDiaryList[i].selected) {
                idarr.push(newGroups[delIndex].orangeDiaryList[i].id);
              } else {
                _that.removeByValue(idarr, newGroups[delIndex].orangeDiaryList[i].id);
              }
            };
            var del = _that.delRemove(idarr);
            var ids = del.toString();
            var submit = {
              subGroupId: groupId,
              subTitle: [],
              subIds: ids,
            };//提交传值
            for(var d=0;d<del.length;d++){
              for (var q = 0; q < newGroups[delIndex].orangeDiaryList.length; q++) {
                if (del[d] == newGroups[delIndex].orangeDiaryList[q].id){
                  // title.push(newGroups[delIndex].orangeDiaryList[q].title)
                  submit.subTitle.push(newGroups[delIndex].orangeDiaryList[q].title)
                }
              }
            }
            app.globalData.diaryArray = submit
            wx.switchTab({
              url: '/pages/index/index'
            })
          } else {
            // console.log('取消')
          }
        }
      });
    }else{
      wx.showToast({
        title: "分组内无日记可提交，请新建日记...",
        icon: 'none',
        duration: 1500
      })
    }
    _that.setData({
      groups: newGroups
    });
  },
  // 上拉加载
  bindDownLoad: function (e) {
    var that = this; 
    var groups = this.data.groups;
    pageNo++;
    util.POST('mobile/orangeDiary/queryPage', getApp().globalData.loginInfo.token, {
      pageNum: pageNo,
      pageSize: '10',
      privacy: that.data.three
    }, function (res) {

      var addDiaryGroups = res.data.result.orangeDiaryGroups;
      for (var i = 0; i < addDiaryGroups.length; i++) {
        addDiaryGroups[i].checkNums = 0;
        groups.push(addDiaryGroups[i])
        that.setData({
          groups: groups
        })
      }
    }
    )
    // console.log(pageNo);
    // console.log(groups.length)
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 100//loading时间
    });
  }
})