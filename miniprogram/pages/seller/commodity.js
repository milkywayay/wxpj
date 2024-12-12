const db=wx.cloud.database()
const App=getApp()
Page({

  data: {
    i:0,
    activeTab: 0
  },

  onTabClick(e) {
    console.log(e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
    console.log(this.data.activeTab)
  },

  add(){
    wx.navigateTo({
      url: '/pages/seller/commodity_add',
    })
  },

  onShow() {
    this.getData()
    this.getData_auditing()
    this.get_payee_data()    //商家基本信息
    this.get_shelf()
  },


  getData(){
    db.collection('commodity')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber'),
      shelf:true
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        allData:res.data
      })
    })
  },

  getData_auditing(){
    db.collection('audit')
    .where({
      audit:false,
      type:'商品',
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        allData_auditing:res.data
      })
    })
  },

  get_payee_data(){
    db.collection('commodity')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        payee:res.data[0].payee,
        phoneNumber:res.data[0].phoneNumber
      })
    })
  },

  delete(e){
    console.log(e)
    const id=e.currentTarget.dataset.id
    db.collection('commodity')
    .doc(id)
    .update({
      data:{
        shelf:false
      }
    })
    .then(res=>{
      console.log(res)
      this.getData()
      this.get_shelf()
    })
  },

  get_shelf(){
    db.collection('commodity')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber'),
      shelf:false
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        allData_shelf:res.data
      })
    })
  },

  on_shelf(e){
    const id=e.currentTarget.dataset.id
    db.collection('commodity')
    .doc(id)
    .update({
      data:{
        shelf:true
      }
    })
    .then(res=>{
      console.log(res)
      this.getData()
      this.get_shelf()
    })
  },

})