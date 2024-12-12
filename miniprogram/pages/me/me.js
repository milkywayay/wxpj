wx.cloud.init()
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },


  onLoad(options) {
    this.upload()
  },


  avater_view(e) {
    const imageUrl = this.data.avater;
    wx.previewImage({
      urls: [imageUrl], 
      current: imageUrl
    })
  },

  avater_change(){
    wx.navigateTo({
      url: '/pages/me/info_change?type='+'avater',
    })
  },

  nickName_change(){
    wx.navigateTo({
      url: '/pages/me/info_change?type='+'nickName',
    })
  },

  phoneNumber_change(){
    wx.navigateTo({
      url: '/pages/me/info_change?type='+'avater',
    })
  },




  upload(){
    this.setData({
      avater: wx.getStorageSync('avater'),
      phoneNumber: wx.getStorageSync('phoneNumber'),
      nickName: wx.getStorageSync('nickName'),
    })
  },

  avater(){
    
  },









  //获取手机号，一键登录
  login(e) {
    wx.cloud.callFunction({
        name: 'phoneNumber',
        data: {
          weRunData: wx.cloud.CloudID(e.detail.cloudID),
        }
      })
      .then(res => {
        wx.setStorageSync('phoneNumber', res.result.moblie)
        this.classification()
      })
  },

  //辨别是否首次登录
  classification() {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(111)
        if (res.data.length > 0) {
          this.multiple_logins()
        } else {
          this.first_login()
        }
      })
  },


  //首次登录，注册
  first_login() {
    const avater = 'cloud://company-6gxdqmbcca524546.636f-company-6gxdqmbcca524546-1326967527/userlist/用户初始头像.png.jpeg'
    const nickName = wx.getStorageSync('phoneNumber').slice(0, 3) + 'xxxx' + wx.getStorageSync('phoneNumber').slice(7)
    console.log('注册')
    wx.setStorageSync('avater', avater)
    wx.setStorageSync('nickName', nickName)
    db.collection('userlist')
      .add({
        data: {
          phoneNumber: wx.getStorageSync('phoneNumber'),
          nickName: nickName,
          avater: avater
        }
      })
    wx.showToast({
      title: '已注册',
      icon: 'success',
      duration: 2000
    });
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 500);
  },

  //多次登录，同步
  multiple_logins() {
    db.collection('userlist')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        wx.setStorageSync('avater', res.data[0].avater)
        wx.setStorageSync('nickName', res.data[0].nickName)
      })
    wx.showToast({
      title: '已登录',
    })
    setTimeout(() => {
      wx.switchTab({
        url: '/pages/index/index',
      })
    }, 500)
  },





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