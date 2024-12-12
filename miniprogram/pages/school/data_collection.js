const db = wx.cloud.database()
Page({


  data: {

  },

  onReady() {

  },

  onShow() {
    this.getData()
  },


  getData(){
    db.collection('export')
    .where({
      type:'ask'
    })
    .get()
    .then(res=>{
      console.log(res)
      const temData=res.data
      temData.sort((a, b) => new Date(b.time) - new Date(a.time));
      this.setData({
        lssues:res.data
      })
    })
  },

  write_lssue(e){
    console.log(e.currentTarget.dataset.l)
    wx.navigateTo({
      url: '/pages/school/write_lssue?id='+e.currentTarget.dataset.l,
    })
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