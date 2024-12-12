const db = wx.cloud.database()
Page({

  data: {

  },

  commodity(){
    wx.navigateTo({
      url: '/pages/seller/commodity',
    })
  },



  send() {
    wx.navigateTo({
      url: '/pages/seller/send',
    })
  },





})