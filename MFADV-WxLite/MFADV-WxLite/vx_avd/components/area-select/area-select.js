// components/area-select.js   by:张涛20180308
const util = require('../../utils/request.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    isShow:false,
    isRegistrationShow: false,
    // 公用列表数据
    list:[],
    // 获取的列表数组
    area:{
      province:[],
      city:[],
      area:[],
      address:[],
      community:[]
    },
    // 地址code
    provinceCode:'',
    cityCode:'',
    areaCode:'',
    addressCode:'',
    // 选择按钮
    selectNum:0,
    // 地址名称
    provinceName:'',
    cityName:'',
    areaName:'',
    addressName:'',
    communityName:'',
    // 判断是否还有下一级
    isHaveSubset:true,
    // 外部使用的数据包，如需使用地址数据请，在外部定义后直接调用this.data.addressObj即可
    addressObj:{
      province:'',
      city:'',
      area:'',
      address:'',
      community:''
    },
    // 请求函数通道
    getBol:false
  },
  /*
  *组件生命周期函数，在组件实例进入页面节点树时执行
  */
  attached:function(){
    this.getProvince();
  },
  /**
   * 组件的方法列表
   */
  methods: {
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

    //隐藏弹框
    hideRegistrationDialog() {
      this.setData({
        isRegistrationShow: !this.data.isRegistrationShow
      })
    },
    //展示弹框
    showRegistrationDialog() {
      this.setData({
        isRegistrationShow: !this.data.isRegistrationShow
      })
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _cancelEvent(){
      //触发取消回调
      this.triggerEvent("cancelEvent");
    },
    _confirmEvent(){
      // 判断地址是否选择完毕
      if (this.data.isHaveSubset) {
        return false;
      }
      //触发成功回调
      this.triggerEvent("confirmEvent");
      this.setData({
        selectNum: 0,
        provinceName: '',
        provinceCode: '',
        cityName: '',
        areaName: '',
        addressName: '',
        communityName: '',
        isHaveSubset: true,
      })
      this.getProvince()
    },

    registrationCancelEvent() {
      //触发取消回调
      this.triggerEvent("cancelEvent");
    },
    registrationConfirmEvent() {
      // 判断地址是否选择完毕
      if (this.data.isHaveSubset) {
        return false;
      }
      //触发成功回调
      this.triggerEvent("confirmEvent");
      this.setData({
        selectNum: 0,
        provinceName: '',
        provinceCode: '',
        cityName: '',
        areaName: '',
        addressName: '',
        communityName: '',
        isHaveSubset: true,
      })
      this.getProvince()
    },
    /*
     * 公有方法
     */
     // 地址三级请求函数
     // 省
     getProvince(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.provinceCode},function(res){
        // 为所有的省添加checked
        res.data.result.forEach(function(item){
          item.checked=false;
        })
        _this.data.area.province=res.data.result;
        _this.setData({
          area:_this.data.area,
          list:res.data.result
        })
      })
     },
    // 市 
     getCity(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.provinceCode},function(res){
        // 为所有的省添加checked
          res.data.result.forEach(function(item){
            item.checked=false;
          })
          _this.data.area.city=res.data.result;
          _this.setData({
            area:_this.data.area,
            list:res.data.result
          })
      })
     },
     // 区
     getArea(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.cityCode},function(res){
        // 为所有的省添加checked
          res.data.result.forEach(function(item){
            item.checked=false;
          })
        _this.data.area.area=res.data.result;
        _this.setData({
            area:_this.data.area,
            list:res.data.result
        })
      })
     },
     // 街道
     getAddress(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.areaCode},function(res){
        // 为所有的省添加checked
          res.data.result.forEach(function(item){
            item.checked=false;
          })
        _this.data.area.address=res.data.result;
        _this.setData({
            area:_this.data.area,
            list:res.data.result
        })
      })
     },
     // 小区
     getCommunity(){
      var _this=this;
      util.POST('/mobile/common/getArea','',{'parentCode':this.data.addressCode},function(res){
        // 为所有的省添加checked
          res.data.result.forEach(function(item){
            item.checked=false;
          })
        _this.data.area.community=res.data.result;
        _this.setData({
            area:_this.data.area,
            list:res.data.result
        })
      })
     },
     // 点击tab进行切换
     tabBtn(event){
      // 判断点击的级别
      if (event.currentTarget.id==1) {
        // 更新列表
        this.data.list=this.data.area.province;
        // 更新点击框
        this.data.selectNum=0;
      }else if (event.currentTarget.id==2) {
        this.data.list=this.data.area.city;
        this.data.selectNum=1;
      }else if (event.currentTarget.id==3) {
        this.data.list=this.data.area.area;
        this.data.selectNum=2;
      }else if (event.currentTarget.id==4) {
        this.data.list=this.data.area.address;
        this.data.selectNum=3;
      }else if (event.currentTarget.id==5) {
        this.data.list=this.data.area.community;
        this.data.selectNum=4;
      }
      this.setData({
        list:this.data.list,
        selectNum:this.data.selectNum,
        isHaveSubset:this.data.list[0]?true:false
      })
     },
     // 点击地址进行选择处理
     selectBtn(event){
      // 清空列表
      this.setData({
        list:[]
      })
      // 判断当前的点击区域selectNum值 0：省。1：市。2：区。3：街道。
      if (this.data.selectNum==0) {
        // 保存信息
        this.data.area.province.forEach(function(item){
          if (item.code==event.currentTarget.dataset.item.code) {
            item.checked=true;
          }else{
            item.checked=false;
          }
        })
        this.data.selectNum=1;
        this.setData({
          provinceCode:event.currentTarget.dataset.item.code,
          area:this.data.area,
          selectNum:this.data.selectNum,
          provinceName:event.currentTarget.dataset.item.name,
          isHaveSubset:event.currentTarget.dataset.item.isHaveSubset?true:false
        })
        this.getCity();
      }
      // 市
      else if (this.data.selectNum==1) {
        // 保存信息
        this.data.area.city.forEach(function(item){
          if (item.code==event.currentTarget.dataset.item.code) {
            item.checked=true;
          }else{
            item.checked=false;
          }
        })
        this.data.selectNum=2;
        this.setData({
          cityCode:event.currentTarget.dataset.item.code,
          area:this.data.area,
          selectNum:this.data.selectNum,
          cityName:event.currentTarget.dataset.item.name,
          isHaveSubset:event.currentTarget.dataset.item.isHaveSubset?true:false
        })
        this.getArea();
      }else if(this.data.selectNum==2){
        // 保存信息
        this.data.area.area.forEach(function(item){
          if (item.code==event.currentTarget.dataset.item.code) {
            item.checked=true;
          }else{
            item.checked=false;
          }
        })
        this.data.selectNum=3;
        this.setData({
          areaCode:event.currentTarget.dataset.item.code,
          area:this.data.area,
          selectNum:this.data.selectNum,
          areaName:event.currentTarget.dataset.item.name,
          isHaveSubset:event.currentTarget.dataset.item.isHaveSubset?true:false
        })
        // 判断是否还有下一级// 由于数据源不对等，有三级数据源，所以需要做数据重置处理以免造成返回数据叠加问题
        if (!this.data.isHaveSubset) {
          this.setData({
            addressCode:'',
            addressName:'',
            communityName:'',
            communityCode:''
          })
        }
        this.getAddress();

      }else if (this.data.selectNum==3) {
         // 保存信息
        this.data.area.address.forEach(function(item){
          if (item.code==event.currentTarget.dataset.item.code) {
            item.checked=true;
          }else{
            item.checked=false;
          }
        })
        this.data.selectNum=4;
        this.setData({
          addressCode:event.currentTarget.dataset.item.code,
          area:this.data.area,
          selectNum:this.data.selectNum,
          addressName:event.currentTarget.dataset.item.name,
          isHaveSubset:event.currentTarget.dataset.item.isHaveSubset?true:false
        })
        // 由于数据源不对等，有三级数据源，所以需要做数据重置处理以免造成返回数据叠加问题
        if (!this.data.isHaveSubset) {
          this.setData({
            communityName:'',
            communityCode:''
          })
        }
        this.getCommunity();
      }else if(this.data.selectNum==4){
         // 保存信息
        this.data.area.community.forEach(function(item){
          if (item.code==event.currentTarget.dataset.item.code) {
            item.checked=true;
          }else{
            item.checked=false;
          }
        })
        this.data.selectNum=4;
        this.setData({
          communityCode:event.currentTarget.dataset.item.code,
          selectNum:this.data.selectNum,
          area:this.data.area,
          communityName:event.currentTarget.dataset.item.name,
          isHaveSubset:event.currentTarget.dataset.item.isHaveSubset?true:false
        })
      }

          this.setData({
            addressObj:{
              province:{
                'provinceName':this.data.provinceName,
                'provinceCode':this.data.provinceCode
              },
              city:{
                'cityName':this.data.cityName,
                'cityCode':this.data.cityCode
              },
              area:{
                'areaName':this.data.areaName,
                'areaCode':this.data.areaCode
              },
              address:{
                'addressName':this.data.addressName,
                'addressCode':this.data.addressCode
              },
              community:{
                'communityName':this.data.communityName,
                'communityCode':this.data.communityCode
              }
            }
          })
     }
  }
})
/*
*自定义组件地址组件，使用第三方地址包，可以任意更改样式，生成符合自己喜好的样式，更加符合项目的需要

使用方式如下

首先需要在wxml中引入 （其中的事件绑定名称可以在组件js中进行修改）

<area-select id="areaSelect" bind:cancelEvent="_cancelEvent" bind:confirmEvent="_confirmEvent"></area-select>

其次需要在引入组件的js中定义该组件(onReady)

this.areaSelect=this.selectComponent("#areaSelect");

最后一点一定要在json文件中添加插件的地址

"usingComponents":{"area-select": "/components/area-select/area-select"}

做完这些后就是在js中绑定好事件

取消事件：_canceEvent 

确认事件：_cnnfirmEvent

地址组件的最重要的参数即是 this.areaSelect.data.addressObj

比较重要的一点就是显示地址选择框

this.areaSelect.showDialog();

this.areaSelect.hideDialog();

创作于20180308-by-张涛
*/