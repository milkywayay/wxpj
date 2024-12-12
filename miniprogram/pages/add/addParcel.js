const db=wx.cloud.database()
Page({

  data: {
    
  },

  onGenderChange: function(e) {
    this.setData({
      gender: e.detail.value
    });
  },

  onLoad: function (options) {
    if (wx.getStorageSync('new_location')) {
      wx.setStorageSync('address_formatted', wx.getStorageSync('new_location'))
      this.setData({
        address_formatted:wx.getStorageSync('address_formatted')
      })
    } else {
      this.getAndConvertLocation()
    }
    console.log('调用onLoad')
  },



  async getAndConvertLocation() {
    try {
      // 获取当前位置
      const location = await this.getLocation();
      console.log('Current Location:', location);
      const {
        latitude,
        longitude
      } = location;
      console.log(latitude, longitude)

      // 调用云函数进行经纬度到文字地址的转换
      const res = await wx.cloud.callFunction({
        name: 'lbs_server', // 云函数名称
        data: {
          type: 'location', // 指定操作类型为经纬度转地址
          data: {
            location: [latitude, longitude]
          }
        }
      });

      console.log('Cloud Function Result:', res);
      this.setData({
        address_formatted: res.result.formatted
      })
      wx.setStorageSync('address_formatted', res.result.formatted)
    } catch (error) {
      console.error('Error in getting location or calling cloud function:', error);
    }
  },

  location() {
    wx.navigateTo({
      url: '/pages/map/map',
    })
  },


  onShow(){
    this.onLoad()
    console.log('调用onShow')
  },

  getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'wgs84',
        success: resolve,
        fail: reject
      });
    });
  },





  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
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
  onShareAppMessage: function () {
    
  }
})