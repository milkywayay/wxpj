const db = wx.cloud.database()
Page({
  data: {

  },

  settings() {
    wx.navigateTo({
      url: '/pages/settings/settings',
    })
  },

  like() {
    wx.navigateTo({
      url: '/pages/talk/discuss/like',
    })
  },

  collect() {
    wx.navigateTo({
      url: '/pages/talk/discuss/collect',
    })
  },

  post() {
    wx.navigateTo({
      url: '/pages/talk/discuss/post',
    })
  },

  evaluation() {
    wx.navigateTo({
      url: '/pages/talk/discuss/evaluation',
    })
  },


  onShow(options) {
    this.classification()
  },

  booking() {
    wx.navigateTo({
      url: '/pages/me/my_booking',
    })
  },

  orders() {
    wx.navigateTo({
      url: '/pages/orders/orders',
    })
  },

  //判别状态是否登录
  classification() {
    if (wx.getStorageSync('phoneNumber')) {
      this.show_have_login()
    } else {
      this.show_wait_login()
    }
  },

  show_have_login() {
    db.collection('userlist')
    .where({
      phoneNumber:wx.getStorageSync('phoneNumber')
    })
    .get()
    .then(res=>{
      wx.setStorageSync('nickName', res.data[0].nickName)
      wx.setStorageSync('avater', res.data[0].avater)
    })
    this.setData({
      nickName: wx.getStorageSync('nickName'),
      avater: wx.getStorageSync('avater'),
      login:true
    })
  },

  show_wait_login(){
    this.setData({
      login:false,
      nickName:'',
      avater:''
    })
  },


  me() {
    wx.navigateTo({
      url: '/pages/me/me',
    })
  },

  judge() {
    if (wx.getStorageSync('phoneNumber')) {
      wx.navigateTo({
        url: '/pages/judge/history_judge',
      })
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'error'
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/settings/settings',
        })
      }, 500);
    }
  },

  DuoHuan_square() {
    wx.navigateToMiniProgram({
      appId: 'wx6f162465d96bcfb0',
      path: 'pages/first/first',
      envVersion: 'release'
    })
  },

  jiang(){
    wx.navigateToMiniProgram({
      appId: 'wxce38912fadde36ab',
      path: 'pages/index/index',
      envVersion: 'release'
    })
  },

  DuoYuan_shop(){
    wx.navigateToMiniProgram({
      appId: 'wxd0ef84f519b9990b',
      path: '/pages/talk/talk',
      envVersion: 'release'
    })
  },

  attention(){
    wx.navigateTo({
      url: '/pages/SC/attention',
    })
  },










})