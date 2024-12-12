const db = wx.cloud.database()
Page({


  data: {
 
  },

  onLoad(options) {
    console.log(options.type)
    if (options.type == 'shopping') {
      this.setData({
        choose_shopping_address: true
      })
    }
  },

  choose(e) {
    if (this.data.choose_shopping_address) {//买商品的地址选择
      console.log(e.currentTarget.dataset.c)
      const address=e.currentTarget.dataset.c
      wx.setStorageSync('temp_address', address)
      wx.navigateBack({
        delta:1
      })
    }
  },






  add_location() {
    wx.navigateTo({
      url: '/pages/add/add_location',
    })
  },


  onReady() {

  },


  onShow() {
    this.getData()
  },

  getData() {
    db.collection('location')
      .where({
        phoneNumber: wx.getStorageSync('phoneNumber')
      })
      .get()
      .then(res => {
        console.log(res)
        this.setData({
          allData: res.data
        })
      })
  },

  change(e) {
    e.currentTarget.dataset.l
    wx.navigateTo({
      url: '/pages/add/add_location?id=' + e.currentTarget.dataset.l,
    })
  },

})