const db=wx.cloud.database()
Page({

  data: {
    audit:false
  },

  onLoad(options) {

  },


  onReady() {

  },


  onShow() {
this.if_auditing()
  },

  if_auditing(){
    db.collection('audit')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber'),
      type:'teacher'
    })
    .get()
    .then(res=>{
      console.log(res)
      this.setData({
        audit:true
      })
    })
  },

  confirm(){
    db.collection('audit')
    .add({
      data:{
        phoneNumber:wx.getStorageSync('phoneNumber'),
        type:'teacher',
        nickName:wx.getStorageSync('nickName'),
        audit:false
      }
    })
    this.setData({
      audit:true
    })
    wx.cloud.callFunction({
      name:'new_audit',
      data:{
        task_no:Date.now()+wx.getStorageSync('phoneNumber'),
        task_summary:'新teacher审核',
        nickName:wx.getStorageSync('nickName')
      }
    })

    wx.requestSubscribeMessage({
      tmplIds: ['b3FdHt8aLR3BKmOlRLK_dmDKNM-VzKvCFnj9_hBjd6k'],
      success(res) {
        console.log(res)
      }
    })
  },

  onHide() {

  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})