  // 自定义地图插件用于使用第三方地图数据包 by张涛20180307
// components/Dialog/dialog.js
const util = require('../../utils/request.js');
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   * 用于组件自定义设置
   */
  properties: {
    // 模拟数据
    provinces: {            // 属性名
      type: Array,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value:[]     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    citys: {            // 属性名
      type: Array,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value:[]     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    areas: {            // 属性名
      type: Array,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value:[]     // 属性初始值（可选），如果未指定则会根据类型选择一个
    }
  },

  /**
   * 私有数据,组件的初始数据
   * 可用于模版渲染
   */
  data: {
    // 弹窗显示控制
    isShow:false,
    value:'',
    area:{
      province:[],
      city:[],
      area:[]
    },
    provinceCode:'',
    cityCode:'',
    areaCode:'',
    address:{
      province:'',
      city:'',
      area:''
    },
    // 滚动地址后的最后位置点
    areaList:[]
  },
  /*
  *组件生命周期函数，在组件实例进入页面节点树时执行
  */
  attached:function(){
    this.getProvince();
  },
  /**
   * 组件的方法列表
   * 更新属性和数据的方法与更新页面数据的方法类似
   */
  methods: {
    /*
     * 公有方法
     */
     // 地址三级请求函数
     // 省
     getProvince(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.provinceCode},function(res){
        _this.data.area.province=res.data.result;
        _this.setData({
          area:_this.data.area,
          provinceCode:res.data.result[0].code
        })
        _this.getCity();
      })
     },
    // 市 
     getCity(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.provinceCode},function(res){
          _this.data.area.city=res.data.result;
          _this.setData({
            area:_this.data.area,
            cityCode:res.data.result[0].code
          })
          _this.getArea();
      })
     },
     // 区
     getArea(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.cityCode},function(res){
        _this.data.area.area=res.data.result;
        _this.setData({
            area:_this.data.area,
            areaCode:res.data.result[0].code,
            address:{
              province:_this.data.area.province[_this.data.areaList[0]?_this.data.areaList[0]:0],
              city:_this.data.area.city[_this.data.areaList[1]?_this.data.areaList[1]:0],
              area:_this.data.area.area[_this.data.areaList[2]?_this.data.areaList[2]:0]
            }
        })
      })
     },
    //隐藏弹框
    hideDialog(){
      this.setData({
        isShow: !this.data.isShow
      })
    },
    //展示弹框
    showDialog(){
      this.setData({
        isShow: !this.data.isShow
      })
    },
     /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent(){
      //触发取消回调
      this.triggerEvent("cancelEvent")
    },
    _confirmEvent(){
      //触发成功回调
      this.triggerEvent("confirmEvent");
    },
    bindChange(event){
      // 保存滚动按钮坐标
      this.setData({
        areaList:event.detail.value
      })
      if (this.data.provinceCode!=this.data.area.province[event.detail.value[0]].code) {
        // 改动了省,修改省的代码
        this.setData({
          provinceCode:this.data.area.province[event.detail.value[0]].code
        })
        this.getCity();
      }
      if (this.data.cityCode!=this.data.area.city[event.detail.value[1]].code) {
        // 改动了省,修改省的代码
        this.setData({
          cityCode:this.data.area.city[event.detail.value[1]].code
        })
        this.getArea();
      }
      if (this.data.areaCode!=this.data.area.area[event.detail.value[2]].code) {
        // 改变了区的选择
        this.setData({
          address:{
            province:this.data.area.province[event.detail.value[0]],
            city:this.data.area.city[event.detail.value[1]],
            area:this.data.area.area[event.detail.value[2]]
          }
        })
      }
    },
  }
})


// 使用说明使用在你需要此组件的文件中引入，引入方式如下
// wxml中引入方式
// <area id="area" bind:cancelEvent="_cancelEvent"  bind:confirmEvent="_confirmEvent"></area>
// 其中_cancelEvent为取消按钮
// _confirmEvent为确认按钮
// js中定义方式
// this.area = this.selectComponent("#area");
// 在json中定义方式
// {
//   "usingComponents": {
//     "dialog": "/components/Dialog/dialog"
//   }
// }
// by张涛20180307

