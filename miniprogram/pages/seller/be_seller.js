const db = wx.cloud.database()
Page({

  data: {
    audit:false
  },

  onLoad(){
    db.collection('audit')
    .where({
      type:"商家审核",
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .count()
    .then(res=>{
      console.log(res)
      if(res.total>0){
        this.setData({
          audit:true
        })
      }
    })
  },

  nickName(e){
    console.log(e.detail.value)
    this.setData({
      nickName:e.detail.value
    })
  },

  confirm() { //提交审核
    if(this.data.nickName){
    db.collection('audit')
      .add({
        data: {
          phoneNumber: wx.getStorageSync('phoneNumber'),
          type:"商家审核",
          audit:false,
          nickName:this.data.nickName
        }
      })
    }else{
      wx.showToast({
        title: '请填写店铺名称',
        icon:'error'
      })
    }

  }

})