const db=wx.cloud.database()
Page({

  data: {

  },

 
  onLoad(options) {

  },


  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getData()
  },

  getData(){
    db.collection('opinion_group')
    .where({
      phoneNumber:wx.getStorageSync('phpneNumber')
    })
      .get()
      .then(res=>{
        console.log(res)
        if(res.data.length>0){
          this.getData2()
        }else{
          this.setData({
            opinion_group:false
          })
        
        }
      })
  },

  creat(){
    wx.navigateTo({
      url: '/pages/roommates/creat',
    })
  },

  add(){
    wx.navigateTo({
      url: '/pages/roommates/add',
    })
  },




  onHide() {

  },

  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})