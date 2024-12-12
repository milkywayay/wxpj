const db = wx.cloud.database()
Page({

  data: {
    activeTab: 0,
    waitData: [],
    haveData: []
  },


  onLoad(options) {
    this.getData()

  },


  getData() {
    const db = wx.cloud.database();
    db.collection('booking')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      // .orderBy('date','desc')
      .get()
      .then(res => {
        console.log(res);
        const waitData = [];
        const haveData = [];

        res.data.forEach(item => {
          const currentDate = new Date();
          const inputDate = new Date(item.date);
          if (inputDate > currentDate) {
            waitData.push(item);
          } else {
            haveData.push(item);
          }
        });

        this.setData({
          waitData: waitData,
          haveData: haveData
        });
      })
      .catch(err => {
        console.error('Failed to fetch data', err);
      });
  },

  onTabClick(e) {
    console.log(e.currentTarget.dataset.index)
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
    console.log(this.data.activeTab)
  },

  cancel(e) {
    wx.showModal({
      title: '确认取消',
      content: '您确定要取消预约吗？',
      success: (res) => {
        if (res.confirm) {
          console.log(e);
          wx.showToast({
            title: '取消成功',
            icon: 'success'
          });
          db.collection('booking')
            .where({
              phoneNumber: wx.getStorageSync('phoneNumber'),
              date: e.currentTarget.dataset.c.date
            })
            .remove()
            .then(res => {
              this.getData(); 
            });
        } else if (res.cancel) {
          wx.showToast({
            title: '取消操作已中止',
            icon: 'none'
          });
        }
      }
    });
  },
  

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
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