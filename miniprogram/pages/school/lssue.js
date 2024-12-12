const db = wx.cloud.database()
Page({


  data: {
    field: [{
      id: 1,
      platform: ''
    }],
  },

  onLoad(options) {

  },

  input(e) {
    const fieldId = e.currentTarget.dataset.id;
    const platform = e.detail.value;
    const fieldIndex = this.data.field.findIndex(field => field.id === fieldId);

    if (fieldIndex !== -1) {
      const newfield = [...this.data.field];
      newfield[fieldIndex].platform = platform;
      this.setData({
        field: newfield
      });
    }
  },

  title(e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value
    })
  },

  request(e) {
    console.log(e.detail.value)
    this.setData({
      request: e.detail.value
    })
  },



  onShow() {
    this.getData()
  },

  confirm() {
    if (this.data.title && this.data.request && this.data.field[0].platform) {
      db.collection('export')
        .add({
          data: {
            phoneNumber: wx.getStorageSync('phoneNumber'),
            nickName: wx.getStorageSync('nickName'),
            avater: wx.getStorageSync('avater'),
            title: this.data.title,
            request: this.data.request,
            field:this.data.field,
            write_numbers:0,
            type:'ask',
            time:Date.now()
          }
        })
        .then(res=>{
          console.log(res)
          wx.showToast({
            title: '发布成功',
            icon:'success'
          })
          setTimeout(() => {
            wx.navigateBack({
              delta:1
            })
          }, 100);
        })
    } else {
      wx.showToast({
        title: '请填写完全',
        icon: 'error'
      })
    }
  },

  delete: function (event) {
    const id = event.currentTarget.dataset.id;
    if (this.data.field.length <= 1) {
      wx.showToast({
        title: '至少保留一个字段',
        icon: 'none'
      });
      return;
    }
    const newfield = this.data.field.filter(field => field.id !== id);

    // 重新编号并保留 platform 字段
    const renumberedfield = newfield.map((field, index) => ({
      id: index + 1,
      platform: field.platform || '' // 保留 platform 字段
    }));

    this.setData({
      field: renumberedfield
    });
  },


  add: function () {
    const newfield = this.data.field.concat([{
      id: this.data.field.length + 1,
      imgurl: []
    }]);
    this.setData({
      field: newfield
    });
  },

  getData() {

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